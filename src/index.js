import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const totalRows = 3
const squaresPerRow = 3

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
      return [a, b, c];
    }
  }
  return null;
}

function Square(props) {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  )
}


class Board extends React.Component {
  
  render() {
    const rows = [];
    for (let r = 0; r < totalRows; r++) {
      rows.push(
        this.props.renderRow(r)
      );
    }
    return (
    <div className='board' >{rows}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
        squares: Array(9).fill(null),
        }
      ],
      style: Array(9).fill('square'),
      stepNumber: 0,
      xIsNext: true,
    };
  }

  renderSquare(i) {
    const current = this.state.history[this.state.stepNumber]
    return (<Square
      value={current.squares[i]}
      onClick={() => this.handleClick(i)}
      className={this.state.style[i]}
    />
    );
  }
  renderRow(row) {
    const squares = [];
    const offset = row * squaresPerRow
    for (let i = 0; i < squaresPerRow; i++) {
      squares.push(
        this.renderSquare(offset + i)
      );
    }
    return (
      <div className="board-row">
        {squares}
      </div>
    )
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let winner = calculateWinner(squares);
    if (squares[i] || winner) {
      return
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    winner = calculateWinner(squares);
    const style = this.state.style.slice()
    if (winner) {
      for (let i of winner) {
        style[i] = "square highlight"
      }
      this.setState({
        history: history.concat([
          {
            squares: squares
          }
        ]),
        stepNumber: history.length,
        xIsNext:!this.state.xIsNext,
        style:style
      });
      return;
    }
    
    this.setState({
      history: history.concat([
        {
        squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext:!this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // const moves = history.map((step, move) => {
    //   const desc = move ?
    //   'Go to move #' + move :
    //   'Go to game start';
    //   return (
    //     <li key={move} >
    //       <button onClick={() => this.jumpTo(move)}>
    //         {desc}
    //       </button>
    //     </li>
    //   );
    // });

    let status;
    if (winner) {
      status = 'Winner: ' + current.squares[winner[0]];
    } else {
      if (!current.squares.includes(null)){
        status = "Draw!";
      }
      else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            renderRow={row => this.renderRow(row)}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          {/* <ol>{moves}</ol> */}
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
