import React, { PureComponent } from 'react';
import {BarChart, YAxis, XAxis, CartesianGrid, Bar, LabelList} from 'recharts';
import {setupData} from './util';

export class StackBarChart extends PureComponent {
  render() {
    const {
      data,
      width,
      height,
      margin,
      domain,
      barCategoryGap,
      barGap,
      tickCount,
    } = this.props;
    const nulledData = setupData(data).map(d => d.up ? d : {...d, prevDown: null, delta: null, press: null});

    return (
      <BarChart data={nulledData} layout="horizontal" width={width} height={height} barCategoryGap={barCategoryGap} barGap={barGap} margin={margin}>
        <YAxis type="number" allowDataOverflow={true} domain={domain} allowDecimals={false} tickCount={tickCount} />
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
