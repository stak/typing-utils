import React, { PureComponent } from 'react';
import { Howl } from 'howler';
import * as soundSrc from './sound';
import './Game.css';

const howl = Object.assign( // Object.map
  ...Object.entries(soundSrc)
           .map(([name, src]) => ({[name]: new Howl({src})}))
);

class GameResult extends PureComponent {
  render() {
    const { data, rank } = this.props;

    const totalTime = data[data.length - 1].down;
    const totalMiss = data.reduce((prev, current) =>
      prev + (current.miss ? current.miss.length : 0)
    , 0);
    const rankStr = `${rank}${['', 'st', 'nd', 'rd'][rank] || 'th'}`;
    const resultText = `${totalTime}-${totalMiss} (${rankStr})`

    return (
      <span className="GameResult">{resultText}</span>
    );
  }
}

class GameView extends PureComponent {
  render() {
    const { word, pos, focus, children } = this.props;
    const past = word.slice(0, pos).toUpperCase();
    const rest = word.slice(pos).toUpperCase();
    const pastTag = <span className="past">{past}</span>;
    const restTag = <span className="rest">{rest}</span>;

    return (
      <div className={focus ? 'GameView' : 'GameViewInactive'}>
        {children ? children : [pastTag, restTag]}
      </div>
    );
  }
}

export class Game extends PureComponent {
  pressingKeysToPos = {}
  finishedRank = 0

  constructor(props) {
    super(props);

    this.state = {
      focus: false,
      pos: 0,
      data: this.initialData(),
      finished: false,
    };
  }

  initialData = () => {
    return this.props.word.split('').map(k => ({
      key: k,
      down: 0,
      up: 0
    }));
  }

  reset = () => {
    this.pressingKeysToPos = {};
    this.startTime = 0;
    this.setState({
      pos: 0,
      data: this.initialData(),
      finished: false,
    });
  }

  handleSpecialKeys = (key) => {
    switch (key) {
      case 'Escape':
      case 'Enter':
        this.reset();
        return true;
      default:
        break;
    }
    return false;
  }

  handleInitialKey = (key) => {
    const { word } = this.props;

    if (key === word[0] && key !== word[this.state.pos]) {
      this.reset();
      return true;
    }
    return false;
  }

  updateKeyDown = (pos) => {
    const t = Date.now();
    if (pos === 0) {
      this.startTime = t;
    }
    const ellapsed = t - this.startTime;

    const makeNewState = (prev, props) => ({
      pos: prev.pos + 1,
      data: prev.data.map((d, i) =>
        i !== pos ? d : {
          ...d,
          down: ellapsed,
          up: ellapsed
        }
      )
    });

    this.setState(makeNewState);
    return makeNewState(this.state, this.props);
  }

  updateKeyUp = (pos) => {
    const ellapsed = Date.now() - this.startTime;

    const makeNewState = (prev, props) => ({
      data: prev.data.map((d, i) =>
        i !== pos ? d : {
          ...d,
          up: ellapsed
        }
      )
    });

    this.setState(makeNewState);
    return makeNewState(this.state, this.props);
  }

  updateMiss = (pos) => {
    const ellapsed = Date.now() - this.startTime;
    const makeNewState = (prev, props) => ({
      data: prev.data.map((d, i) =>
        i !== pos ? d : {
          ...d,
          miss: d.miss ?
                d.miss.concat(ellapsed):
                [ellapsed]
        }
      )
    });

    this.setState(makeNewState);
    return makeNewState(this.state, this.props);
  }

  onClick = (e) => {
    this.eventElement.focus();
  }

  onFocus = (e) => {
    if (this.state.finished) {
      this.reset();
    }
    this.setState({focus: true});
  }

  onBlur = (e) => {
    this.setState({focus: false});
  }

  onKeyDown = (e) => {
    const { word } = this.props;
    let { pos } = this.state;
    const key = e.key;

    e.preventDefault();
    if (e.repeat) return; // ignore auto repeat
    if (this.handleSpecialKeys(key)) return;
    if (this.handleInitialKey(key)) pos = 0;
    else if (this.state.finished) return;

    if (key === word[pos]) {
      const { data } = this.updateKeyDown(pos);
      this.props.onDataChanged(data, false); // live update

      // cache pos for handling keyUp
      this.pressingKeysToPos[key] = pos;

      if (pos === data.length - 1) {
        howl.finish.play();
      } else {
        howl.pi.play();
      }
    } else {
      // typo
      this.updateMiss(pos);
      howl.miss.play();
    }
  }

  onKeyUp = (e) => {
    if (this.state.finished) return;

    if (e.key in this.pressingKeysToPos) {
      const pos = this.pressingKeysToPos[e.key];
      const { data } = this.updateKeyUp(pos);

      if (pos === data.length - 1) {
        this.finishedRank = 1 + this.props.onDataChanged(data, true);
        this.setState({
          finished: true
        });
      } else {
        // don't report for live update performance
      }
      delete this.pressingKeysToPos[e.key];
    }
    e.preventDefault();
  }

  componentDidMount = () => {
    this.eventElement.focus();
  }

  render() {
    const { word } = this.props;

    return (
      <div className="Game" onClick={this.onClick}>
        <button className="eventElement" ref={e => this.eventElement = e}
                onFocus={this.onFocus} onBlur={this.onBlur}
                onKeyDown={this.onKeyDown} onKeyUp={this.onKeyUp} />
        <GameView
          focus={this.state.focus}
          word={word}
          pos={this.state.pos}>
          {this.state.finished ? <GameResult data={this.state.data} rank={this.finishedRank} /> : null}
        </GameView>
      </div>
    );
  }
}
