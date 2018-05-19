import React, { PureComponent } from 'react';
import {BarChart, YAxis, XAxis, CartesianGrid, Bar, LabelList} from 'recharts';
import {setupData} from './util';

export class TimelineTopLabel extends PureComponent {
  render() {
    const defaultStyle = {
      fontSize: '16',
      fill: 'darkslategray'
    };
    const propStyle = this.props.style || {};
    const style = {...defaultStyle, ...propStyle};
    const x = this.props.x;
    const y = this.props.y;
    const width = this.props.width;
    const height = this.props.height;
    const name = this.props.name;

    return (
      <text x={x} y={y - 2} width={width} height={height} fill={style.fill} fontSize={style.fontSize} className="recharts-text recharts-label" textAnchor="middle">
        <tspan x={x} dx={width} dy="0">{name}</tspan>
      </text>
    );
  }
}

export class TimelineChart extends PureComponent {
  render() {
    /* note:
        Bar component extends data keys such as 'x', 'y', 'value',
        which is used in recharts internally.
        So we shuold avoid conflicting to guard our original data.
        In this case, I choose to add prefix '_'.
    */
    const addPrefix = k => '_' + k;
    const accessor = (k, d) => d[addPrefix(k)] ? d[addPrefix(k)] : '';

    const extData = setupData(this.props.data);
    const flatData = extData.reduce((prev, current) => {
      prev[addPrefix(current.key)] = current.delta;
      return prev;
    }, {});


    return (
      <BarChart data={[flatData]} layout="vertical" width={1000} height={100} barCategoryGap="4" margin={{top: 15, right: 5, bottom: 5, left: 64}}>
        <YAxis type="category" hide={true} />
        <XAxis type="number" allowDecimals={false} tickCount={10} />
        <CartesianGrid horizontal={false} stroke="#ccc" strokeDasharray="5 5" />
        {
          // TODO: 色
          extData.map((d, i) => (
            i === 0 || d.down ? <Bar key={d.key} dataKey={addPrefix(d.key)} stackId="a"
                fill="transparent" stroke="darkslategray" isAnimationActive={false}>
              <LabelList valueAccessor={accessor.bind(null, d.key)} position="center" fill="gray" fontSize="9" />
              <LabelList content={<TimelineTopLabel />} name={d.key} />
            </Bar> : null
          ))
        }
      </BarChart>
    );
  }
}
