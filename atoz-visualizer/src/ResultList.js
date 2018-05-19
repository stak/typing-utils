import React, { PureComponent } from 'react';
import './ResultList.css';

class ResultRemoveButton extends PureComponent {
  onClick = (e) => {
    if (e.shiftKey || window.confirm('Are you sure you want to delete this record?\n(Hold shift key to suppress this dialog)')) {
      this.props.onResultRemove();
    }
  }
  render() {
    return (
      <button className="removeButton" onClick={this.onClick}>×</button>
    )
  }
}

class ResultItem extends PureComponent {
  render() {
    const { data, onClick, onResultRemove } = this.props;
    const totalTime = data[data.length - 1].down;

    return (
      <li>
        <button className="ResultItem" onClick={onClick}>{totalTime}</button>
        <ResultRemoveButton onResultRemove={onResultRemove} />
      </li>
    );
  }
}

export class ResultList extends PureComponent {
  onClick = (r, e) => {
    this.props.onResultChanged(r);
  }

  render() {
    const { results, onResultRemove } = this.props;
    const sorted = results.sort((a, b) => a[a.length - 1].down - b[b.length - 1].down);
    const sortedKey = sorted.map(r =>
      r.reduce((prev, current) => prev + current.down + ',', ''));

    return (
      <div className="ResultList">
        <ol>{
          sorted.map((r, i) => (
            <ResultItem
                key={sortedKey[i]}
                data={r}
                onClick={this.onClick.bind(this, r)}
                onResultRemove={onResultRemove.bind(null, r)}
            />))
        }</ol>
      </div>
    );
  }
}
