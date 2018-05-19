import React, { PureComponent } from 'react';
import store from 'store2';
import deepEqual from 'deep-equal';
import Chart from './chart';
import { Game } from './Game';
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
        <Chart.TWChart data={data} useRank={true} kpmRange="5" tickCount={3} />
        <h3 className="Chart-subtitle">Numeric style</h3>
        <Chart.TWChart data={data} useRank={false} kpmRange="5" domain={[0, 'auto']} />

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

class App extends PureComponent {
  constructor(props) {
    super(props);

    if (!store.get('results')) {
      store.set('results', []);
    }

    this.state = {
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
    this.setState({
      currentData: data
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
  render() {
    // <ChartExample data={testData} />
    return (
      <div className="App">
        <Header title={APP_NAME} />

        <Game word={words.atoz} onDataChanged={this.onDataChanged} />
        <Chart.TWChart data={this.state.currentData} />
        <ResultList results={this.state.results}
                    onResultChanged={this.onResultChanged}
                    onResultRemove={this.onResultRemove} />

        <ChartExample data={testData} />
      </div>
    );
  }
}

export default App;
