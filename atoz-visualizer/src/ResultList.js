import React, { Component } from 'react';
import './ResultList.css';

class Result extends Component {
  render() {
    const { data } = this.props;
    const totalTime = data[data.length - 1].down;

    return (
      <span className="ResultItem">{totalTime}</span>
    );
  }
}

export class ResultList extends Component {
  render() {
    const { results } = this.props;
    const sortedResults = results.sort((a, b) => a[a.length - 1].down - b[b.length - 1].down);

    return (
      <div className="ResultList">
      {
        sortedResults.map(r => <Result data={r} />)
      }
      </div>
    );
  }
}
