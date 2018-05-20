import React, { PureComponent } from 'react';
import {setupData, statsData, mapColor} from './util';

class HeatmapCharBG extends PureComponent {
  render() {
    const {
      data,
      style,
      text,
      mapper
    } = this.props;

    const backgroundColor = mapper(data);
    const composedStyle = {
      ...style,
      backgroundColor
    };
    return (
      <span style={composedStyle} title={data}>{text}</span>
    );
  }
}

class HeatmapCharFG extends PureComponent {
  render() {
    const {
      data,
      style,
      text,
      mapper
    } = this.props;

    const color = mapper(data);
    const composedStyle = {
      ...style,
      color
    };
    return (
      <span style={composedStyle} title={data}>{text}</span>
    );
  }
}

class HeatmapCharBorder extends PureComponent {
  render() {
    const {
      data,
      style,
      text,
      mapper
    } = this.props;

    const borderColor = mapper(data);
    const composedStyle = {
      ...style,
      paddingBottom: 0,
      borderBottom: '8px solid ' + borderColor // TODO: use props
    };
    return (
      <span style={composedStyle} title={data}>{text}</span>
    );
  }
}

export class Heatmap extends PureComponent {
  static typeToComponent = {
    bg: HeatmapCharBG,
    fg: HeatmapCharFG,
    border: HeatmapCharBorder,
  }

  defaultMapParams = {
    min: 0,
    max: 100,
    colors: ['white', 'gray']
  }

  defaultStyle = {
    fontSize: '30px',
    padding: '6px 6px',
  }

  defaultOuterStyle = {
    margin: '20px'
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
    const filteredData = setupData(this.props.data)
                         .filter(d => d.up > 0);
    const stat = statsData(filteredData, !!this.props.reverse);
    const style = {
      ...this.defaultStyle,
      ...this.props.style
    };
    const outerStyle = {
      ...this.defaultOuterStyle,
      ...this.props.outerStyle
    };
    const outerClass = this.props.outerClass;
    const CharComponent = Heatmap.typeToComponent[this.props.type];
    if (!CharComponent) {
      throw new Error(`Heatmap: unknown type "${this.props.type}" is specified`);
    }
    if (!this.props.dataKey) {
      throw new Error(`Heatmap: prop dataKey is not specified`);
    }
    const getData = this.getByKeyString.bind(this, this.props.dataKey);

    const mapParams = {...this.defaultMapParams, ...this.props};
    const mapper = this.props.mapper ?
                   this.props.mapper :
                   mapColor.bind(null, mapParams);

    return (
      <div style={outerStyle} className={outerClass}>
        {
          stat.map(d =>
            d.up === 0 ? null: <CharComponent key={d.key} text={d.key} style={style}
                                              data={getData(d)}
                                              mapper={mapper} />
          )
        }
      </div>
    );
  }
}
