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
    downDiff: 0,
    upDiff: 0
  };
  return data.map((d, i) => {
    const ext = Object.assign({}, d, defaultExt);
    ext.press = d.up - d.down;
    if (i > 0) {
      ext.prevDown = data[i - 1].down;
      ext.prevUp = data[i - 1].up;
      ext.downDiff = d.down - ext.prevDown;
      ext.upDiff = d.up - ext.prevUp;
    }
    return ext;
  });
}

function TimelineChart({data}) {
  return (
    <BarChart data={setupData(data)} layout="vertical" width={1000} height={400} barCategoryGap="4">
      <YAxis type="category" dataKey="key" axisLine={false} tickLine={false} />
      <XAxis type="number" allowDecimals={false} tickCount="20" />
      <CartesianGrid horizontal={false} stroke="#ccc" strokeDasharray="5 5" />
      <Bar dataKey="prevDown" stackId="a" fill="transparent" isAnimationActive={false} />
      <Bar dataKey="downDiff" stackId="a" label={{ fill: 'white', fontSize: 9}} fill="darkslategray" stroke="darkslategray" isAnimationActive={false} />
      <Bar dataKey="press" stackId="a" label={{ fill: 'gray', fontSize: 9}} fill="transparent" stroke="darkslategray" isAnimationActive={false} />
    </BarChart>
  );
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header title={APP_NAME} />
        <h2 className="Chart-title">Timeline</h2>
        <TimelineChart data={testData} />
      </div>
    );
  }
}

export default App;
