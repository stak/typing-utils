import React, { Component } from 'react';
import {LineChart, YAxis, XAxis, CartesianGrid, Line, ReferenceLine, Tooltip} from 'recharts';
import {setupData, kpmData, calcTWRank, KPM_RANGE_MIN, KPM_RANGE_MAX} from './util';

class TWChartAverageLabel extends Component {
  render() {
    const defaultStyle = {
      fontSize: '16',
      fill: 'gray',
      backgroundColor: 'whitesmoke'
    };
    const propStyle = this.props.style || {};
    const style = {...defaultStyle, ...propStyle};
    const x = this.props.viewBox.x;
    const y = this.props.viewBox.y;
    const width = this.props.viewBox.width;
    const height = this.props.viewBox.height;
    const labelText = this.props.text;
    return (
      <g>
        <rect x={x + 2} y={y - style.fontSize / 2} width={labelText.length * 10} height={style.fontSize} fill={style.backgroundColor} />
        <text x={x} y={y} width={width} height={height} fill={style.fill} fontSize={style.fontSize} className="recharts-text recharts-label" textAnchor="start">
          <tspan dx="4" dy={style.fontSize / 2 - 2}>{labelText}</tspan>
        </text>
      </g>
    );
  }
}

export class TWChart extends Component {
  formatTick = (kpm) => {
    if (this.props.useRank) {
      return calcTWRank(Number(kpm));
    } else {
      return kpm;
    }
  }

  formatTooltip = (value, name, props) => {
    const padValue = ('    ' + value).slice(-5);

    if (this.props.useRank) {
      return padValue + ' ' + calcTWRank(Number(value));
    } else {
      return padValue;
    }
  }

  rangeKpmKey = () => {
    const kpmRange = Number(this.props.kpmRange);
    if (kpmRange && KPM_RANGE_MIN <= kpmRange && kpmRange <= KPM_RANGE_MAX) {
      return 'kpm' + this.props.kpmRange;
    } else {
      return 'kpm' + KPM_RANGE_MIN;
    }
  }

  tickCount = () => {
    const tickCount = Number(this.props.tickCount);
    if (tickCount) {
      return tickCount;
    } else {
      return 10;
    }
  }

  domain = () => {
    const { domain } = this.props;
    return domain ? domain : ['dataMin', 'dataMax'];
  }

  render() {
    const data = setupData(this.props.data);
    const dataWithKpm = kpmData(data);
    const totalKpm = dataWithKpm.length ?
                     dataWithKpm[dataWithKpm.length - 1].kpm:
                     0;

    const itemStyle = {
      margin: 0,
      padding: 0,
      fontSize: 'smaller',
      fontFamily: '"Courier New", Consolas, monospace',
      whiteSpace: 'pre'
    };

    return (
      <LineChart data={dataWithKpm} layout="horizontal" width={1000} height={400} barCategoryGap="4">
        <XAxis type="category" dataKey="key" tickLine={false} />
        <YAxis type="number" domain={this.domain()} tickFormatter={this.formatTick} allowDecimals={false} tickCount={this.tickCount()} />
        <CartesianGrid vertical={false} stroke="#ddd" strokeDasharray="5 5" />
        <Line type="linear" dot={false} dataKey={this.rangeKpmKey()} name="kpm" stroke="darkred" strokeDasharray="2 2" isAnimationActive={false}>
        </Line>
        <Line type="linear" dot={false} dataKey="kpm" name="avg" stroke="darkblue" strokeDasharray="2 2" isAnimationActive={false}>
        </Line>
        <ReferenceLine y={totalKpm} label={<TWChartAverageLabel text={this.formatTooltip(totalKpm)} />} stroke="lightgray"/>
        <Tooltip isAnimationActive={false} separator=":" formatter={this.formatTooltip} itemStyle={itemStyle} />
      </LineChart>
    );
  }
}
