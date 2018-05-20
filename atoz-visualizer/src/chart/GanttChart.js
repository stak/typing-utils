import React, { PureComponent } from 'react';
import {BarChart, YAxis, XAxis, CartesianGrid, Bar, LabelList, Tooltip} from 'recharts';
import {setupData} from './util';

export class GanttChart extends PureComponent {
  render() {
    const {
      data,
      width,
      height,
      domain,
      margin,
      tickCount,
      barGap,
      barCategoryGap,
    } = this.props;
    const nulledData = setupData(data).map(d => d.up ? d : {...d, prevDown: null, delta: null, press: null});

    return (
      <BarChart data={nulledData} layout="vertical" width={width} height={height} barCategoryGap={barCategoryGap} barGap={barGap} margin={margin}>
        <YAxis type="category" dataKey="key" axisLine={false} tickLine={false} minTickGap={0} interval={0} />
        <XAxis type="number" domain={domain} allowDataOverflow={false} allowDecimals={false} tickCount={tickCount + 1} />
        <CartesianGrid horizontal={false} stroke="#ccc" strokeDasharray="5 5" />
        <Bar dataKey="prevDown" stackId="a" fill="transparent" isAnimationActive={false} />
        <Bar dataKey="delta" stackId="a" fill="darkslategray" stroke="darkslategray" isAnimationActive={false}>
          <LabelList dataKey="delta" fill="white" fontSize="9" />
        </Bar>
        <Bar dataKey="press" stackId="a" fill="white" stroke="darkslategray" isAnimationActive={false}>
          <LabelList dataKey="press" fill="gray" fontSize="9" />
        </Bar>
      </BarChart>
    );
  }
}
