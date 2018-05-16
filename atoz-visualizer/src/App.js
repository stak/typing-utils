import React, { Component } from 'react';
import { LineChart, Line } from 'recharts';
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

function TestChart({data}) {
  return (
    <LineChart width={400} height={400} data={data}>
      <Line type="monotone" dataKey="down" stroke="#8884d8" />
    </LineChart>
  );
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header title={APP_NAME} />
        <TestChart data={testData} />
      </div>
    );
  }
}

export default App;
