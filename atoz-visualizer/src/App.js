import React, { Component } from 'react';
import Chart from './chart';
import './App.css';

import testData from './testData.json';

const APP_NAME = 'AtoZ VISUALIZER';

function Header({title}) {
  return (
    <header className="App-header">
      <h1 className="App-title">{title}</h1>
    </header>
  );
}

function ChartExample({data}) {
  return (
    <div>
      <h2 className="Chart-title">Gantt</h2>
      <Chart.GanttChart data={data} />
      <h2 className="Chart-title">Timeline</h2>
      <Chart.TimelineChart data={data} />
      <h2 className="Chart-title">StackBar</h2>
      <Chart.StackBarChart data={data} />
      <h2 className="Chart-title">Heatmap</h2>
      <div className="Heatmap-container">
        <div>
          <h3>bg</h3>
          <h4>(Monochrome, score.kpm)</h4>
          <Chart.Heatmap data={data} type="bg" dataKey="score.kpm"
                         colors={['darkslategray', 'white']} min="30" max="70" />
          <h4>(Monochrome, delta)</h4>
          <Chart.Heatmap data={data} type="bg" dataKey="delta"
                         colors={['white', 'darkslategray']} min="0" max="100" />
          <h4>(Excel-style, score.kpm)</h4>
          <Chart.Heatmap data={data} type="bg" dataKey="score.kpm"
                         colors={['lightpink', 'white', 'lightblue']} min="30" max="70" />
          <h4>(Excel-style, delta)</h4>
          <Chart.Heatmap data={data} type="bg" dataKey="delta"
                         colors={['lightblue', 'white', 'lightpink']} min="0" max="100" />
        </div>
        <div>
          <h3>fg</h3>
          <h4>(Monochrome, score.kpm)</h4>
          <Chart.Heatmap data={data} type="fg" dataKey="score.kpm"
                         colors={['darkslategray', 'darkgray']} min="30" max="70" />
          <h4>(Monochrome, delta)</h4>
          <Chart.Heatmap data={data} type="fg" dataKey="delta"
                         colors={['darkgray', 'darkslategray']} min="0" max="100" />
          <h4>(Excel-style, score.kpm)</h4>
          <Chart.Heatmap data={data} type="fg" dataKey="score.kpm"
                         colors={['lightpink', 'darkgray', 'lightblue']} min="30" max="70" />
          <h4>(Excel-style, delta)</h4>
          <Chart.Heatmap data={data} type="fg" dataKey="delta"
                         colors={['lightblue', 'darkgray', 'lightpink']} min="0" max="100" />
        </div>
        <div>
          <h3>border</h3>
          <h4>(Monochrome, score.kpm)</h4>
          <Chart.Heatmap data={data} type="border" dataKey="score.kpm"
                         colors={['darkslategray', 'darkgray']} min="30" max="70" />
          <h4>(Monochrome, delta)</h4>
          <Chart.Heatmap data={data} type="border" dataKey="delta"
                         colors={['darkgray', 'darkslategray']} min="0" max="100" />
          <h4>(Excel-style, score.kpm)</h4>
          <Chart.Heatmap data={data} type="border" dataKey="score.kpm"
                         colors={['lightpink', 'darkgray', 'lightblue']} min="30" max="70" />
          <h4>(Excel-style, delta)</h4>
          <Chart.Heatmap data={data} type="border" dataKey="delta"
                         colors={['lightblue', 'darkgray', 'lightpink']} min="0" max="100" />
        </div>
      </div>
    </div>
  );
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header title={APP_NAME} />
        <ChartExample data={testData} />
      </div>
    );
  }
}

export default App;
