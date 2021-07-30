import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './styles/output.css';

const totalRows = 3
const squaresPerRow = 3
var win_style = " transition duration-1000 ease-in-out transform -translate-y-1 scale-110"
const reset_style = "bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
var square_style = ["text-red-600", "bg-gray-100 text-gray-800 font-semibold border border-gray-400 h-32 w-32 sm:h-48 sm:w-48 shadow text-center -mt-px -mr-px text-6xl"]


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
      style: Array(9).fill(square_style.join(' ')),
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
    square_style[0] = this.state.xIsNext ? 'text-red-600' : 'text-blue-600'
    winner = calculateWinner(squares);
    const style = this.state.style.slice()
    if (winner) {
      for (let i of winner) {
        if (this.state.xIsNext)
          style[i] = square_style + win_style + " bg-red-300"
        else
          style[i] = square_style + win_style + " bg-blue-300"
      }
      this.setState({
        history: history.concat([
          {
            squares: squares
          }
        ]),
        stepNumber: history.length,
        xIsNext:!this.state.xIsNext,
        style: style,
      });
      return;
    }
    console.log(square_style.join(' '))
    style[i] = square_style.join(' ')
    this.setState({
      history: history.concat([
        {
        squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext:!this.state.xIsNext,
      style: style,
    });
  }

  jumpTo(step) {
    square_style[0] = this.state.xIsNext ? 'text-red-600' : 'text-blue-600'
    // this.setState({
    //   stepNumber: step,
    //   xIsNext: (step % 2) === 0,
    // })
    this.setState({
      history: [
        {
        squares: Array(9).fill(null),
        }
      ],
      style: Array(9).fill(square_style.join(' ')),
      stepNumber: 0,
      xIsNext: true,
    })
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
        status = this.state.xIsNext ? <span style={{'color': 'red', 'font-size':'200%'}}>X</span> : <span style={{'color': 'blue', 'font-size':'200%'}}>O</span>;
      }
    }
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-xl">{status}</div>
        <div className="border-4 border-white border-opacity-100 border-solid">
          <Board
            renderRow={row => this.renderRow(row)}
            />
        </div>
        <button onClick={() => this.jumpTo(0)} className={reset_style}>Reset</button>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
