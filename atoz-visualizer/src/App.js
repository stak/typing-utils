import React, { Component } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
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

    for (let k of statKeys) {
      ext.score[k] = standardScore(d[k], stats[k].average, stats[k].sd);
      ext.rank[k] = cache[k].findIndex(e => e === d[k]);
      ext.percentile[k] = data.length > 1 ?
                        100 * ext.rank[k] / (data.length - 1):
                        0;
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

class TimelineLabel extends Component {
  render() {
    const x = this.props.x;
    const y = this.props.y;
    const width = this.props.width;
    const height = this.props.height;
    const text = this.props.content.props.text ? this.props.content.props.text : '';
    const name = this.props.content.props.name;

    return (
      <text x={x} y={y - 2} width={width} height={height} fill="darkslategray" fontSize="16" className="recharts-text recharts-label" textAnchor="middle">
        <tspan x={x} dx={width} dy="0">{name}</tspan>
        <tspan x={x} dx={width / 2} dy={height / 2 + 5} fontSize="10">{text}</tspan>
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

  return (
    <BarChart data={[flatData]} layout="vertical" width={1000} height={100} barCategoryGap="4" margin={{top: 15, right: 5, bottom: 5, left: 64}}>
      <YAxis type="category" hide={true} />
      <XAxis type="number" allowDecimals={false} tickCount={10} />
      <CartesianGrid horizontal={false} stroke="#ccc" strokeDasharray="5 5" />
      {
        // TODO: 色
        data.map(d => <Bar key={d.key} dataKey={d.key} stackId="a"
                           label={<TimelineLabel name={d.key} text={flatData[d.key]} />}
                           fill="transparent" stroke="darkslategray" isAnimationActive={false} />)
      }
    </BarChart>
  );
}

class Heatmap extends Component {
  render() {
    const data = statsData(setupData(this.props.data));
    console.dir(data);
    return (
      <div>
        {
          data.map(d => 
            <span key={d.key} style={{fontSize: d.percentile.kpm}}>{d.key}</span>
          )
        }
      </div>
    );
  }
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
        <h2 className="Chart-title">Heatmap</h2>
        <Heatmap data={testData} />
      </div>
    );
  }
}

export default App;
