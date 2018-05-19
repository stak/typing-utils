import React, { PureComponent } from 'react';
import './ResultList.css';

class Result extends PureComponent {
  render() {
    const { data, onClick } = this.props;
    const totalTime = data[data.length - 1].down;

    return (
      <li>
        <button className="ResultItem" onClick={onClick}>{totalTime}</button>
      </li>
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
      r.key = r.reduce((prev, current) => prev + current.down + ',', '');
    });

    return (
      <div className="ResultList">
        <ol>{
          sorted.map(r => <Result key={r.key} data={r} onClick={this.onClick.bind(this, r)} />)
        }</ol>
      </div>
    );
  }
}
