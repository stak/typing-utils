import React, { PureComponent } from 'react';
import { Howl } from 'howler';
import './Game.css';
import piOgg from './media/pi.ogg';
import piMp3 from './media/pi.mp3';
import missOgg from './media/miss.ogg';
import missMp3 from './media/miss.mp3';

const typeSound = new Howl({
  src: [piOgg, piMp3]
});
const missSound = new Howl({
  src: [missOgg, missMp3]
});

class GameView extends PureComponent {
  render() {
    const { word, pos, isPlaying } = this.props;
    const past = word.slice(0, pos).toUpperCase();
    const rest = word.slice(pos).toUpperCase();
    const pastTag = <span className="past">{past}</span>;
    const restTag = <span className="rest">{rest}</span>;

    if (!isPlaying) {
      return <div className="GameView"><span className="note">CLICK HERE TO PLAY</span></div>;
    }

    return (
      <div className="GameView">{pastTag}{restTag}</div>
    );
  }
}

export class Game extends PureComponent {
  constructor(props) {
    super(props);

    this.pressingKeysToPos = {};
    this.state = {
      isPlaying: false,
      pos: 0,
      data: this.initialData(),
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

  updateKeyDown = (pos) => {
    const t = Date.now();
    if (pos === 0) {
      this.startTime = t;
    }

    const makeNewState = (prev, props) => ({
      pos: prev.pos + 1,
      data: prev.data.map((d, i) =>
        i !== pos ? d : {
          ...d,
          down: t - this.startTime,
          up: t - this.startTime
        }
      )
    });

    this.setState(makeNewState);
    return makeNewState(this.state, this.props);
  }

  updateKeyUp = (pos) => {
    const t = Date.now();
    const makeNewState = (prev, props) => ({
      data: prev.data.map((d, i) =>
        i !== pos ? d : {
          ...d,
          up: t - this.startTime
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
    this.setState({isPlaying: true});
  }

  onBlur = (e) => {
    this.setState({isPlaying: false});
  }

  onKeyDown = (e) => {
    const { word } = this.props;
    const { pos } = this.state;
    const key = e.key;

    e.preventDefault();
    if (e.repeat) return; // ignore auto repeat
    if (this.handleSpecialKeys(key)) return;

    if (key === word[pos]) {
      const { data } = this.updateKeyDown(pos);
      this.props.onDataChanged(data, false);

      // cache pos for handling keyUp
      this.pressingKeysToPos[key] = pos;

      typeSound.play();
    } else {
      // typo
      missSound.play();
    }
  }

  onKeyUp = (e) => {
    if (e.key in this.pressingKeysToPos) {
      const pos = this.pressingKeysToPos[e.key];
      const { data } = this.updateKeyUp(pos);

      this.props.onDataChanged(data, pos === data.length - 1);
      delete this.pressingKeysToPos[e.key];
    }
    e.preventDefault();
  }

  render() {
    const { word } = this.props;

    return (
      <div className="Game" onClick={this.onClick}>
        <button className="eventElement" ref={e => this.eventElement = e}
                onFocus={this.onFocus} onBlur={this.onBlur}
                onKeyDown={this.onKeyDown} onKeyUp={this.onKeyUp} />
        <GameView
          isPlaying={this.state.isPlaying}
          word={word}
          pos={this.state.pos}
        />
      </div>
    );
  }
}
