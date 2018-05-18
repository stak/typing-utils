import React, { Component } from 'react';
import {ComposedChart, YAxis, XAxis, CartesianGrid, Bar, Line, LabelList, ReferenceLine, Legend} from 'recharts';
import {setupData, diffData} from './util';

export class DiffChart extends Component {
  makeReferenceWithKpm = (srcData, kpm) => {
    const baseTime = 60 * 1000 / kpm;

    return srcData.map((d, i) => {
      const down = Math.round(baseTime * i);
      return {...d, down}
    });
  }
  refData = () => {
    if (this.props.refData) {
      return this.props.refData;
    } else if (this.props.refKpm) {
      return this.makeReferenceWithKpm(this.props.data, this.props.refKpm)
    } else {
      throw new Error('DiffBarChart: reference data is not specified');
    }
  }
  render() {
    const data = setupData(this.props.data);
    const refData = setupData(this.refData());
    const diff = diffData(data, refData);

    return (
      <ComposedChart data={diff} layout="horizontal" width={1000} height={400} barSize={30}>
        <YAxis type="number" allowDecimals={false} tickCount={10} />
        <XAxis type="category" dataKey="key" tickLine={false} />
        <CartesianGrid vertical={false} stroke="#ccc" strokeDasharray="5 5" />
        <ReferenceLine y="0" stroke='darkslategray' />
        <Legend verticalAlign="top" />
        <Bar dataKey="diffDelta" name="delta" fill="slategray" stroke="slategray" isAnimationActive={false}>
          <LabelList dataKey="diffDelta" position="center" fill="white" fontSize="9" />
        </Bar>
        <Line dataKey="diffDown" name="sum" fill="darkslategray" stroke="darkslategray" isAnimationActive={false}>
        </Line>
      </ComposedChart>
    );
  }
}
