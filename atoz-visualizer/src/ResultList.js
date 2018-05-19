import React, { Component } from 'react';
import './ResultList.css';

class Result extends Component {
  render() {
    const { data, onClick } = this.props;
    const totalTime = data[data.length - 1].down;

    return (
      <a className="ResultItem" href="#" onClick={onClick}>{totalTime}</a>
    );
  }
}

export class ResultList extends Component {
  onClick = (r, e) => {
    this.props.onResultChanged(r);
  }

  render() {
    const { results } = this.props;
    const sortedResults = results.sort((a, b) => a[a.length - 1].down - b[b.length - 1].down);

    return (
      <div className="ResultList">
      {
        sortedResults.map(r => <Result data={r} onClick={this.onClick.bind(this, r)} />)
      }
      </div>
    );
  }
}
