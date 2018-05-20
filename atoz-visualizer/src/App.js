import React, { PureComponent } from 'react';
import store from 'store2';
import deepEqual from 'deep-equal';
import Chart from './chart';
import { Game } from './Game';
import { Option } from './Option';
import { ResultList } from './ResultList';
import './App.css';

import testData from './testData.json';

const APP_NAME = 'AtoZ VISUALIZER';
const words = {
  atoz: 'abcdefghijklmnopqrstuvwxyz'
};

class Header extends PureComponent {
  render() {
    const { title } = this.props;

    return (
      <header className="App-header">
        <h1 className="App-title">{title}</h1>
      </header>
    );
  }
}

class ChartExample extends PureComponent {
  render() {
    const { data } = this.props;

    return (
      <div>
        <h2 className="Chart-title">TW</h2>
        <h3 className="Chart-subtitle">Clone style</h3>
        <Chart.SpeedChart data={data} useRank={true} kpmRange="5" tickCount={3} />
        <h3 className="Chart-subtitle">Numeric style</h3>
        <Chart.SpeedChart data={data} useRank={false} kpmRange="5" domain={[0, 'auto']} />

        <h2 className="Chart-title">Gantt</h2>
        <Chart.GanttChart data={data} />

        <h2 className="Chart-title">Timeline</h2>
        <Chart.TimelineChart data={data} />

        <h2 className="Chart-title">Diff</h2>
        <Chart.DiffChart data={data} refKpm="1000" />

        <h2 className="Chart-title">Bar</h2>
        <Chart.StackBarChart data={data} />

        <h2 className="Chart-title">Heatmap</h2>
        <div className="Heatmap-container">
          <div>
            <h3 className="Chart-subtitle">bg</h3>
            <h4>(Monochrome, score.speed)</h4>
            <Chart.Heatmap data={data} type="bg" dataKey="score.speed"
                          colors={['darkslategray', 'white']} min="30" max="70" />
            <h4>(Monochrome, delta)</h4>
            <Chart.Heatmap data={data} type="bg" dataKey="delta"
                          colors={['white', 'darkslategray']} min="0" max="100" />
            <h4>(Excel-style, score.speed)</h4>
            <Chart.Heatmap data={data} type="bg" dataKey="score.speed"
                          colors={['lightpink', 'white', 'lightblue']} min="30" max="70" />
            <h4>(Excel-style, delta)</h4>
            <Chart.Heatmap data={data} type="bg" dataKey="delta"
                          colors={['lightblue', 'white', 'lightpink']} min="0" max="100" />
          </div>
          <div>
            <h3 className="Chart-subtitle">fg</h3>
            <h4>(Monochrome, score.speed)</h4>
            <Chart.Heatmap data={data} type="fg" dataKey="score.speed"
                          colors={['darkslategray', 'darkgray']} min="30" max="70" />
            <h4>(Monochrome, delta)</h4>
            <Chart.Heatmap data={data} type="fg" dataKey="delta"
                          colors={['darkgray', 'darkslategray']} min="0" max="100" />
            <h4>(Excel-style, score.speed)</h4>
            <Chart.Heatmap data={data} type="fg" dataKey="score.speed"
                          colors={['lightpink', 'darkgray', 'lightblue']} min="30" max="70" />
            <h4>(Excel-style, delta)</h4>
            <Chart.Heatmap data={data} type="fg" dataKey="delta"
                          colors={['lightblue', 'darkgray', 'lightpink']} min="0" max="100" />
          </div>
          <div>
            <h3 className="Chart-subtitle">border</h3>
            <h4>(Monochrome, score.speed)</h4>
            <Chart.Heatmap data={data} type="border" dataKey="score.speed"
                          colors={['darkslategray', 'darkgray']} min="30" max="70" />
            <h4>(Monochrome, delta)</h4>
            <Chart.Heatmap data={data} type="border" dataKey="delta"
                          colors={['darkgray', 'darkslategray']} min="0" max="100" />
            <h4>(Excel-style, score.speed)</h4>
            <Chart.Heatmap data={data} type="border" dataKey="score.speed"
                          colors={['lightpink', 'darkgray', 'lightblue']} min="30" max="70" />
            <h4>(Excel-style, delta)</h4>
            <Chart.Heatmap data={data} type="border" dataKey="delta"
                          colors={['lightblue', 'darkgray', 'lightpink']} min="0" max="100" />
          </div>
        </div>
      </div>
    );
  }
}

class RealtimeChart extends PureComponent {
  render() {
    const { data, type, width, height } = this.props;
    const w = Number(width) || 1000;
    const h = Number(height) || 300;
    const option = this.props.option || {};

    let chart;
    switch (type) {
      case 'None':
        chart = null;
        break;
      case 'Speed':
        chart = <Chart.SpeedChart
          data={data} width={w} height={h} margin={{left: -8, right: 30}}
          kpmRange={4}
          useRank={true}
        />;
        break;
      case 'Timeline':
        chart = (
          <div className="scrollX" style={{height: h / 2 + 'px'}}>
            <Chart.TimelineChart
              data={data} width={w * 2} height={h / 2} margin={{left: 45, right: 105, bottom: 10}}
              domain={option.target ?
                [0, option.target * 2]:
                [0, 'auto']
              }
              tickCount={option.tickCount || 20}
            />;
          </div>
        );
        break;
      case 'Gantt':
        chart = (
          <div className="scrollX" style={{height: h * 2 + 'px'}}>
            <Chart.GanttChart
              data={data} width={w * 2} height={h * 2} margin={{left: -12, right: 110, bottom: 10}}
              domain={option.target ?
                [0, option.target * 2]:
                [0, 'auto']
              }
              tickCount={option.tickCount || 20}
            />;
          </div>
        );
        break;
      case 'Diff':
        chart = <Chart.DiffChart
          data={data} width={w} height={h} margin={{left: -6, right: 0}}
          refTime={option.target}
          refKpm={option.refKpm}
          refData={option.refData}
        />;
        break;
      case 'Bar':
        chart = <Chart.StackBarChart
          data={data} width={w} height={h} margin={{left: -6, right: 0}}
          domain={option.target ?
            [0, 10 * option.target / (data.length - 1)]:
            [0, 'auto']
          }
        />;
        break;
      case 'Heatmap':
        chart = <Chart.Heatmap type="bg"
          data={data} width={w} height={h}
          dataKey={option.dataKey || 'score.delta'}
          reverse={true}
          colors={option.colors || ['darkslategray', 'white']}
          min={option.min || 30}
          max={option.max || 70}
          outerStyle={{
            marginLeft: '52px',
            fontFamily: 'Monaco, "Lucida Console", monospace',
            letterSpacing: '2px',
            whiteSpace: 'nowrap'
          }}
          style={{
            color: 'rgba(255, 255, 255, 30%)',
            fontSize: '32pt',
            padding: 0
          }}
        />;
        break;
      default:
        throw new Error('RealtimeChart: unknown type "' + type + '"');
    }

    return chart;
  }
}

class App extends PureComponent {
  constructor(props) {
    super(props);

    if (!store.get('results')) {
      store.set('results', []);
    }
    if (!store.get('options')) {
      store.set('options', {
        realtimeChart: 'Bar',
        quickRetry: true,
        stopOnMiss: false,
        seCorrect: 'pi',
        seMiss: 'miss',
        seFinish: 'finish',
      })
    }

    this.state = {
      options: store.get('options'),
      currentData: [],
      results: store.get('results')
    };
  }

  setResults = (results) => {
    store.set('results', results);
    this.setState({
      results: results
    });
  }

  onDataChanged = (data, completed) => {
    this.setState({
      currentData: data
    });

    if (completed) {
      const addedResults = store.get('results').concat([data]);
      this.setResults(addedResults);

      const sorted = addedResults.sort((a, b) => a[a.length - 1].down - b[b.length - 1].down);
      return sorted.findIndex(e => e === data);
    }
  }
  onResultChanged = (data) => {
    // TODO: 記録一覧からの再生
    this.setState({
      currentData: this.capitalize(data)
    });
  }
  onResultRemove = (data) => {
    const results = store.get('results');
    const i = results.findIndex(e => deepEqual(e, data));

    if (i >= 0) {
      results.splice(i, 1);
      this.setResults(results);
    } else {
      throw new Error('onResultRemove: cannot find specified data.');
    }
  }
  onOptionChange = (e) => {
    const {name, value} = e.target.previousElementSibling;
    let newOptions;

    if (value === 'on') { // checkbox
      newOptions = {...this.state.options, [name]: !this.state.options[name]};
    } else { // radio
      newOptions = {...this.state.options, [name]: value};
    }

    store.set('options', newOptions);
    this.setState({
      options: newOptions
    });
  }
  capitalize = (data) => {
    return data.map(d => ({...d, key: d.key.toUpperCase()}));
  }

  render() {
    const {
      onDataChanged,
      onResultChanged,
      onResultRemove,
      onOptionChange,
      capitalize,
      state
    } = this;

    return (
      <div className="App">
        <Header title={APP_NAME} />
        <Option options={state.options} onChange={onOptionChange} />
        <Game options={state.options} word={words.atoz} onDataChanged={onDataChanged} />
        <RealtimeChart
          data={capitalize(state.currentData)}
          type={state.options.realtimeChart}
          width={770}
          option={{
            target: 1000
          }}
        />
        <ResultList results={state.results}
                    onResultChanged={onResultChanged}
                    onResultRemove={onResultRemove} />
      </div>
    );
  }
}

export default App;
