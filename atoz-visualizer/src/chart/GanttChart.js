import React, {Component} from 'react';
import {BarChart, YAxis, XAxis, CartesianGrid, Bar, LabelList} from 'recharts';
import {setupData} from './util';

export class GanttChart extends Component {
  render() {
    const data = this.props.data;

    return (
      <BarChart data={setupData(data)} layout="vertical" width={1000} height={400} barCategoryGap="4">
        <YAxis type="category" dataKey="key" axisLine={false} tickLine={false} />
        <XAxis type="number" allowDecimals={false} tickCount={10} />
        <CartesianGrid horizontal={false} stroke="#ccc" strokeDasharray="5 5" />
        <Bar dataKey="prevDown" stackId="a" fill="transparent" isAnimationActive={false} />
        <Bar dataKey="delta" stackId="a" fill="darkslategray" stroke="darkslategray" isAnimationActive={false}>
          <LabelList dataKey="delta" fill="white" fontSize="9" />
        </Bar>
        <Bar dataKey="press" stackId="a" fill="transparent" stroke="darkslategray" isAnimationActive={false}>
          <LabelList dataKey="press" fill="gray" fontSize="9" />
        </Bar>
      </BarChart>
    );
  }
}
