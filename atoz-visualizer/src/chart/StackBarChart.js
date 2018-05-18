import React, { Component } from 'react';
import {BarChart, YAxis, XAxis, CartesianGrid, Bar, LabelList} from 'recharts';
import {setupData} from './util';

export class StackBarChart extends Component {
  render() {
    const data = this.props.data;

    return (
      <BarChart data={setupData(data)} layout="horizontal" width={1000} height={400} barCategoryGap="4">
        <YAxis type="number" allowDecimals={false} tickCount={10} />
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
}
