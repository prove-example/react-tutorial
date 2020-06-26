import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, row, col) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i, row, col)}
      />);
  }

  renderRow(rownum) {
    let squareoffset = 3*(3-rownum);
    let squares = [];

    for (let colnum = 1; colnum < 4; colnum++) {
      squares.push(this.renderSquare(squareoffset+colnum-1,rownum,colnum));
    }
    return (
      <div className="board-row">
        {squares}
      </div>
    );
  }

  render() {
    let rows = [];

    for (let rownum = 3; rownum > 0; rownum--) {
      rows.push(this.renderRow(rownum));
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        row: 0,
        col: 0,
      }],
      stepNumber: 0,
      selectedButton: null,
      sortDescending: false,
      xIsNext: true,
    }
  }

  handleClick(i, row, col) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        row: row,
        col: col,
      }]),
      stepNumber: history.length,
      selectedButton: null,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      selectedButton: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.sortDescending? this.state.history.slice().reverse() : this.state.history;
    const current = this.state.history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, pos) => {
      const move = this.state.sortDescending? history.length - pos - 1 : pos;
      const desc = move ?
        'Go to move #' + move + ", (" + step.col + "," + step.row + ")":
        'Go to game start';
      return (
        <li key = {move} value = {move} > {
          move === this.state.selectedButton?
            <button onClick = {() => this.jumpTo(move)}><b>{desc}</b></button> :
            <button onClick = {() => this.jumpTo(move)}>{desc}</button>
        }</li>
      )
    });

    let status;
    if (winner) {
      status = 'Winner ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares}
            onClick = {(i,row,col) => this.handleClick(i,row,col)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div style = {{marginTop: 20}} >{
            this.state.sortDescending?
              <button onClick = {() => this.setState({sortDescending: false})}>v</button> :
              <button onClick = {() => this.setState({sortDescending: true})}>^</button>
          }
          <ol>{moves}</ol></div>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
