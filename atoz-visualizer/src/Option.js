import React, { PureComponent } from 'react';
import './Option.css';

export class Option extends PureComponent {
  render() {
    const { options } = this.props;

    const chart = {};
    ['None', 'Bar', 'Timeline', 'Gantt', 'Heatmap', 'Diff', 'Speed'].forEach(e => {
      chart[e] = options.realtimeChart === e;
    });

    const handler = e => this.props.onChange(e);

    return (
      <form class="Option">
        <input type="checkbox" id="stopOnMiss" name="stopOnMiss" checked={options.stopOnMiss} /><label htmlFor="stopOnMiss" className="checkbox" onClick={handler}>typo to death</label>
        <input type="checkbox" id="quickRetry" name="quickRetry" checked={options.quickRetry} /><label htmlFor="quickRetry" className="checkbox" onClick={handler}>quick retry</label>
        <input type="checkbox" id="seCorrect" name="seCorrect" checked={options.seCorrect}/><label htmlFor="seCorrect" className="checkbox" onClick={handler}>correct sound</label>
        <input type="checkbox" id="seMiss" name="seMiss" checked={options.seMiss}/><label htmlFor="seMiss" className="checkbox" onClick={handler}>typo sound</label>
        <input type="checkbox" id="seFinish" name="seFinish" checked={options.seFinish}/><label htmlFor="seFinish" className="checkbox" onClick={handler}>finish sound</label>
        <div>
          <h4>chart:</h4>
          <input type="radio" name="realtimeChart" id="chartNone" value="None" checked={chart.None} /><label htmlFor="chartNone" className="radio" onClick={handler}>None</label>
          <input type="radio" name="realtimeChart" id="chartBar" value="Bar" checked={chart.Bar} /><label htmlFor="chartBar" className="radio" onClick={handler}>Bar</label>
          <input type="radio" name="realtimeChart" id="chartTimeline" value="Timeline" checked={chart.Timeline} /><label htmlFor="chartTimeline" className="radio" onClick={handler}>Timeline</label>
          <input type="radio" name="realtimeChart" id="chartGantt" value="Gantt" checked={chart.Gantt} /><label htmlFor="chartGantt" className="radio" onClick={handler}>Gantt</label>
          <input type="radio" name="realtimeChart" id="chartHeatmap" value="Heatmap" checked={chart.Heatmap} /><label htmlFor="chartHeatmap" className="radio" onClick={handler}>Heatmap</label>
          <input type="radio" name="realtimeChart" id="chartDiff" value="Diff" checked={chart.Diff} /><label htmlFor="chartDiff" className="radio" onClick={handler}>Diff</label>
          <input type="radio" name="realtimeChart" id="chartSpeed" value="Speed" checked={chart.Speed} /><label htmlFor="chartSpeed" className="radio" onClick={handler}>Speed</label>
        </div>
      </form>
    );
  }
}
