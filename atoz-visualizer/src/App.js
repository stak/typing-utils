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
                  mapper={Chart.mapColor.bind(null, ['darkslategray', 'white'], 30, 70)}/>
          <h4>(Monochrome, delta)</h4>
          <Chart.Heatmap data={data} type="bg" dataKey="delta"
                  mapper={Chart.mapColor.bind(null, ['white', 'darkslategray'], 0, 100)}/>
          <h4>(Excel-style, score.kpm)</h4>
          <Chart.Heatmap data={data} type="bg" dataKey="score.kpm"
                  mapper={Chart.mapColor.bind(null, ['lightpink', 'white', 'lightblue'], 30, 70)}/>
          <h4>(Excel-style, delta)</h4>
          <Chart.Heatmap data={data} type="bg" dataKey="delta"
                  mapper={Chart.mapColor.bind(null, ['lightblue', 'white', 'lightpink'], 0, 100)}/>
        </div>
        <div>
          <h3>fg</h3>
          <h4>(Monochrome, score.kpm)</h4>
          <Chart.Heatmap data={data} type="fg" dataKey="score.kpm"
                  mapper={Chart.mapColor.bind(null, ['darkslategray', 'darkgray'], 30, 70)}/>
          <h4>(Monochrome, delta)</h4>
          <Chart.Heatmap data={data} type="fg" dataKey="delta"
                  mapper={Chart.mapColor.bind(null, ['darkgray', 'darkslategray'], 0, 100)}/>
          <h4>(Excel-style, score.kpm)</h4>
          <Chart.Heatmap data={data} type="fg" dataKey="score.kpm"
                  mapper={Chart.mapColor.bind(null, ['lightpink', 'darkgray', 'lightblue'], 30, 70)}/>
          <h4>(Excel-style, delta)</h4>
          <Chart.Heatmap data={data} type="fg" dataKey="delta"
                  mapper={Chart.mapColor.bind(null, ['lightblue', 'darkgray', 'lightpink'], 0, 100)}/>
        </div>
        <div>
          <h3>border</h3>
          <h4>(Monochrome, score.kpm)</h4>
          <Chart.Heatmap data={data} type="border" dataKey="score.kpm"
                  mapper={Chart.mapColor.bind(null, ['darkslategray', 'darkgray'], 30, 70)}/>
          <h4>(Monochrome, delta)</h4>
          <Chart.Heatmap data={data} type="border" dataKey="delta"
                  mapper={Chart.mapColor.bind(null, ['darkgray', 'darkslategray'], 0, 100)}/>
          <h4>(Excel-style, score.kpm)</h4>
          <Chart.Heatmap data={data} type="border" dataKey="score.kpm"
                  mapper={Chart.mapColor.bind(null, ['lightpink', 'darkgray', 'lightblue'], 30, 70)}/>
          <h4>(Excel-style, delta)</h4>
          <Chart.Heatmap data={data} type="border" dataKey="delta"
                  mapper={Chart.mapColor.bind(null, ['lightblue', 'darkgray', 'lightpink'], 0, 100)}/>
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
