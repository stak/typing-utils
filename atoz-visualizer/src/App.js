import React, { Component } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import parseColor from 'parse-color';
import './App.css';

const APP_NAME = 'AtoZ VISUALIZER';

function Header({title}) {
  return (
    <header className="App-header">
      <h1 className="App-title">{title}</h1>
    </header>
  );
}

const testData = [
  {key: 'A', down: 0, up: 50},
  {key: 'B', down: 100, up: 120},
  {key: 'C', down: 132, up: 145},
  {key: 'D', down: 160, up: 180},
  {key: 'E', down: 170, up: 200},
  {key: 'F', down: 350, up: 420},
  {key: 'G', down: 390, up: 420},
  {key: 'H', down: 410, up: 420},
];

function setupData(data) {
  const defaultExt = {
    press: 0,
    prevDown: 0,
    prevUp: 0,
    delta: 0,
    kpm: 0,
  };
  return data.map((d, i) => {
    const ext = {};
    ext.press = d.up - d.down;
    if (i > 0) {
      ext.prevDown = data[i - 1].down;
      ext.prevUp = data[i - 1].up;
      ext.delta = d.down - ext.prevDown;
      ext.kpm = 60 * 1000 / ext.delta;
    }
    return {...d, ...defaultExt, ...ext};
  });
}

function average(array) {
  const sum = array.reduce((p, n) => p + n);
  return sum / array.length;
}

function standardScore(n, avg, sd) {
  return 50 + 10 * (n - avg) / sd;
}

function statsData(data) {
  if (!data || !data.length) return [];
  const keys = Object.keys(data[0]);
  const statKeys = keys.filter(k => typeof data[0][k] === 'number');
  const stats = {};
  const cache = {};

  for (let k of statKeys) {
      // TODO: A の無意味なデータを除外したい
      cache[k] = data.map(d => d[k])
                     .sort(((a, b) => Number(a) - Number(b)));
      const avg = average(cache[k]);
      const medianPos = (cache[k].length - 1) / 2;

      stats[k] = {
        average: avg,
        median: average(cache[k].slice(Math.floor(medianPos), Math.ceil(medianPos) + 1)),
        variance: average(cache[k].map(n => n * n)) - avg * avg,
      };
      stats[k].sd = Math.sqrt(stats[k].variance);
  }

  return data.map(d => {
    const ext = {
      score: {},
      rank: {},
      percentile: {}
    };
    const fix = (n) => Number(n.toFixed(3));

    for (let k of statKeys) {
      ext.score[k] = fix(standardScore(d[k], stats[k].average, stats[k].sd));
      ext.rank[k] = cache[k].findIndex(e => e === d[k]);
      ext.percentile[k] = fix(data.length > 1 ?
                              100 * ext.rank[k] / (data.length - 1):
                              0);
    }

    return {...d, ...ext};
  });
}

function GanttChart({data}) {
  // FIXME: label number is wrong
  return (
    <BarChart data={setupData(data)} layout="vertical" width={1000} height={400} barCategoryGap="4">
      <YAxis type="category" dataKey="key" axisLine={false} tickLine={false} />
      <XAxis type="number" allowDecimals={false} tickCount={10} />
      <CartesianGrid horizontal={false} stroke="#ccc" strokeDasharray="5 5" />
      <Bar dataKey="prevDown" stackId="a" fill="transparent" isAnimationActive={false} />
      <Bar dataKey="delta" stackId="a" label={{ fill: 'white', fontSize: 9}} fill="darkslategray" stroke="darkslategray" isAnimationActive={false} />
      <Bar dataKey="press" stackId="a" label={{ fill: 'gray', fontSize: 9}} fill="transparent" stroke="darkslategray" isAnimationActive={false} />
    </BarChart>
  );
}

class TimelineTopLabel extends Component {
  render() {
    const defaultStyle = {
      fontSize: '16',
      fill: 'darkslategray'
    };
    const propStyle = this.props.style || {};
    const style = {...defaultStyle, ...propStyle};
    const x = this.props.x;
    const y = this.props.y;
    const width = this.props.width;
    const height = this.props.height;
    const name = this.props.name;

    return (
      <text x={x} y={y - 2} width={width} height={height} fill={style.fill} fontSize={style.fontSize} className="recharts-text recharts-label" textAnchor="middle">
        <tspan x={x} dx={width} dy="0">{name}</tspan>
      </text>
    );
  }
}

function TimelineChart({data}) {
  const extData = setupData(data);
  const flatData = extData.reduce((prev, current) => {
    prev[current.key] = current.delta;
    return prev;
  }, {});
  const accessor = (k, d) => d[k] ? d[k] : '';

  return (
    <BarChart data={[flatData]} layout="vertical" width={1000} height={100} barCategoryGap="4" margin={{top: 15, right: 5, bottom: 5, left: 64}}>
      <YAxis type="category" hide={true} />
      <XAxis type="number" allowDecimals={false} tickCount={10} />
      <CartesianGrid horizontal={false} stroke="#ccc" strokeDasharray="5 5" />
      {
        // TODO: 色
        data.map(d => (
          <Bar key={d.key} dataKey={d.key} stackId="a"
               fill="transparent" stroke="darkslategray" isAnimationActive={false}>
            <LabelList valueAccessor={accessor.bind(null, d.key)} position="center" fill="darkslategray" fontSize="9" />
            <LabelList content={<TimelineTopLabel />} name={d.key} />
          </Bar>
        ))
      }
    </BarChart>
  );
}

function mapColor(colors, min, max, value) {
  const rgbaColors = colors.map(c => parseColor(c).rgba);

  let p;
  if (min < value && value < max) {
    p = (value - min) / (max - min);
  } else if (value <= min) {
    p = 0;
  } else if (value >= max) {
    p = 0.999;
  }

  // p = 0, range = 0.5 => [0, 1], 0
  // p = 0.2, range = 0.5 => [0, 1], 0.4
  // p = 0.5 range = 0.5 => [1, 2], 0
  // p = 0.9 range = 0.5 => [1, 2], 0.8
  // p = 1.0 range = 0.5 => [2, 3], 0
  const colorRange = 1 / (rgbaColors.length - 1);
  const colorIndex = Math.floor(p / colorRange);
  const colorFrom = rgbaColors[colorIndex];
  const colorTo = rgbaColors[colorIndex + 1];
  const colorP = (p - colorIndex * colorRange) * (rgbaColors.length - 1);
  const color = colorFrom.map((c, i) => c * (1 - colorP) + colorTo[i] * colorP);

  return `rgba(${color.join(',')})`;
}

function HeatmapCharBG(props) {
  const color = props.mapper(props.data);
  const style = {
    ...props.style,
    backgroundColor: color
  };
  return (
    <span style={style} title={props.data}>{props.text}</span>
  );
}

function HeatmapCharFG(props) {
  const color = props.mapper(props.data);
  const style = {
    ...props.style,
    color: color
  };
  return (
    <span style={style} title={props.data}>{props.text}</span>
  );
}

function HeatmapCharBorder(props) {
  const color = props.mapper(props.data);
  const style = {
    ...props.style,
    paddingBottom: 0,
    borderBottom: '8px solid ' + color // TODO: use props
  };
  return (
    <span style={style} title={props.data}>{props.text}</span>
  );
}

class Heatmap extends Component {
  static typeToComponent = {
    bg: HeatmapCharBG,
    fg: HeatmapCharFG,
    border: HeatmapCharBorder,
  }

  defaultStyle = {
    fontSize: '30px',
    padding: '6px 6px',
  }

  getByKeyString(keyString, d) {
    let current = d;
    const keys = keyString.split('.');
    for (let k of keys) {
      if (k in current) {
        current = current[k];
      } else {
        throw new Error(`dataKey "${keyString}" is not found`);
      }
    }
    return current;
  }

  render() {
    const data = statsData(setupData(this.props.data));
    const style = {
      ...this.defaultStyle,
      ...this.props.style
    };
    const CharComponent = Heatmap.typeToComponent[this.props.type];
    if (!CharComponent) {
      throw new Error(`Heatmap: unknown type "${this.props.type}" is specified`);
    }
    if (!this.props.dataKey) {
      throw new Error(`Heatmap: prop dataKey is not specified`);
    }
    const getData = this.getByKeyString.bind(this, this.props.dataKey);

    return (
      <div>
        {
          data.map(d => 
            <CharComponent key={d.key} text={d.key} style={style}
                           data={getData(d)}
                           mapper={this.props.mapper} />
          )
        }
      </div>
    );
  }
}

function StackBarChart(props) {
  const data = props.data;
  return (
    <BarChart data={setupData(data)} layout="horizontal" width={1000} height={400} barCategoryGap="4">
      <YAxis type="number" axisLine={false} allowDecimals={false} tickCount={10} />
      <XAxis type="category" dataKey="key" tickLine={false} />
      <CartesianGrid vertical={false} stroke="#ccc" strokeDasharray="5 5" />
      <Bar dataKey="delta" stackId="a" fill="darkslategray" stroke="darkslategray" isAnimationActive={false}>
        <LabelList dataKey="delta" position="center" fill="white" fontSize="9" />
      </Bar>
      <Bar dataKey="press" stackId="a" fill="transparent" stroke="darkslategray" isAnimationActive={false}>
        <LabelList dataKey="press" position="center" fill="darkslategray" fontSize="9" />
      </Bar>
    </BarChart>
  );
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header title={APP_NAME} />
        <h2 className="Chart-title">Gantt</h2>
        <GanttChart data={testData} />
        <h2 className="Chart-title">Timeline</h2>
        <TimelineChart data={testData} />
        <h2 className="Chart-title">StackBar</h2>
        <StackBarChart data={testData} />
        <h2 className="Chart-title">Heatmap</h2>
        <div className="Heatmap-container">
          <div>
            <h3>bg</h3>
            <h4>(Monochrome, score.kpm)</h4>
            <Heatmap data={testData} type="bg" dataKey="score.kpm"
                    mapper={mapColor.bind(null, ['darkslategray', 'white'], 30, 70)}/>
            <h4>(Monochrome, delta)</h4>
            <Heatmap data={testData} type="bg" dataKey="delta"
                    mapper={mapColor.bind(null, ['white', 'darkslategray'], 0, 100)}/>
            <h4>(Excel-style, score.kpm)</h4>
            <Heatmap data={testData} type="bg" dataKey="score.kpm"
                    mapper={mapColor.bind(null, ['lightpink', 'white', 'lightblue'], 30, 70)}/>
            <h4>(Excel-style, delta)</h4>
            <Heatmap data={testData} type="bg" dataKey="delta"
                    mapper={mapColor.bind(null, ['lightblue', 'white', 'lightpink'], 0, 100)}/>
          </div>
          <div>
            <h3>fg</h3>
            <h4>(Monochrome, score.kpm)</h4>
            <Heatmap data={testData} type="fg" dataKey="score.kpm"
                    mapper={mapColor.bind(null, ['darkslategray', 'darkgray'], 30, 70)}/>
            <h4>(Monochrome, delta)</h4>
            <Heatmap data={testData} type="fg" dataKey="delta"
                    mapper={mapColor.bind(null, ['darkgray', 'darkslategray'], 0, 100)}/>
            <h4>(Excel-style, score.kpm)</h4>
            <Heatmap data={testData} type="fg" dataKey="score.kpm"
                    mapper={mapColor.bind(null, ['lightpink', 'darkgray', 'lightblue'], 30, 70)}/>
            <h4>(Excel-style, delta)</h4>
            <Heatmap data={testData} type="fg" dataKey="delta"
                    mapper={mapColor.bind(null, ['lightblue', 'darkgray', 'lightpink'], 0, 100)}/>
          </div>
          <div>
            <h3>border</h3>
            <h4>(Monochrome, score.kpm)</h4>
            <Heatmap data={testData} type="border" dataKey="score.kpm"
                    mapper={mapColor.bind(null, ['darkslategray', 'darkgray'], 30, 70)}/>
            <h4>(Monochrome, delta)</h4>
            <Heatmap data={testData} type="border" dataKey="delta"
                    mapper={mapColor.bind(null, ['darkgray', 'darkslategray'], 0, 100)}/>
            <h4>(Excel-style, score.kpm)</h4>
            <Heatmap data={testData} type="border" dataKey="score.kpm"
                    mapper={mapColor.bind(null, ['lightpink', 'darkgray', 'lightblue'], 30, 70)}/>
            <h4>(Excel-style, delta)</h4>
            <Heatmap data={testData} type="border" dataKey="delta"
                    mapper={mapColor.bind(null, ['lightblue', 'darkgray', 'lightpink'], 0, 100)}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
