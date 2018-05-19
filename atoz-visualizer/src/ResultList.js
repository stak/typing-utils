import React, { PureComponent } from 'react';
import './ResultList.css';

class Result extends PureComponent {
  render() {
    const { data, onClick } = this.props;
    const totalTime = data[data.length - 1].down;

    return (
      <a className="ResultItem" href="#" onClick={onClick}>{totalTime}</a>
    );
  }
}

export class ResultList extends PureComponent {
  onClick = (r, e) => {
    this.props.onResultChanged(r);
  }

  render() {
    const { results } = this.props;
    const sorted = results.sort((a, b) => a[a.length - 1].down - b[b.length - 1].down);
    sorted.forEach(r => {
      r.key = r.reduce((prev, current) => prev.down + ',' + current.down, '');
    });

    return (
      <div className="ResultList">
      {
        sorted.map(r => <Result key={r.key} data={r} onClick={this.onClick.bind(this, r)} />)
      }
      </div>
    );
  }
}
