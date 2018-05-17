import React, { Component } from 'react';
import {setupData, statsData} from './util';

function HeatmapCharBG(props) {
  const color = props.mapper(props.data);
  const style = {
    ...props.style,
    backgroundColor: color
  };
  return (
    <span style={style} title={props.data}>{props.text}</span>
  );
}

function HeatmapCharFG(props) {
  const color = props.mapper(props.data);
  const style = {
    ...props.style,
    color: color
  };
  return (
    <span style={style} title={props.data}>{props.text}</span>
  );
}

function HeatmapCharBorder(props) {
  const color = props.mapper(props.data);
  const style = {
    ...props.style,
    paddingBottom: 0,
    borderBottom: '8px solid ' + color // TODO: use props
  };
  return (
    <span style={style} title={props.data}>{props.text}</span>
  );
}

export class Heatmap extends Component {
  static typeToComponent = {
    bg: HeatmapCharBG,
    fg: HeatmapCharFG,
    border: HeatmapCharBorder,
  }

  defaultStyle = {
    fontSize: '30px',
    padding: '6px 6px',
  }

  getByKeyString(keyString, d) {
    let current = d;
    const keys = keyString.split('.');
    for (let k of keys) {
      if (k in current) {
        current = current[k];
      } else {
        throw new Error(`dataKey "${keyString}" is not found`);
      }
    }
    return current;
  }

  render() {
    const data = statsData(setupData(this.props.data));
    const style = {
      ...this.defaultStyle,
      ...this.props.style
    };
    const CharComponent = Heatmap.typeToComponent[this.props.type];
    if (!CharComponent) {
      throw new Error(`Heatmap: unknown type "${this.props.type}" is specified`);
    }
    if (!this.props.dataKey) {
      throw new Error(`Heatmap: prop dataKey is not specified`);
    }
    const getData = this.getByKeyString.bind(this, this.props.dataKey);

    return (
      <div>
        {
          data.map(d =>
            <CharComponent key={d.key} text={d.key} style={style}
                           data={getData(d)}
                           mapper={this.props.mapper} />
          )
        }
      </div>
    );
  }
}