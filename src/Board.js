import React, { Component, Fragment } from 'react';
import Cell from './Cell';
import './Board.css';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  //set props
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    changeLightStartsOn: 0.25,
  };
  constructor(props) {
    super(props);

    // TODO: set initial state
    this.state = {
      hasWon: false,
      board: this.createBoard(),
      visible: false,
    };
  }

  /* create modal functionality */
  show() {
    this.setState({ visible: true });
  }

  hide() {
    this.setState({ visible: false });
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoard() {
    let board = [];
    // TODO: create array-of-arrays of true/false values
    for (let y = 0; y < this.props.nrows; y++) {
      let row = [];
      for (let x = 0; x < this.props.ncols; x++) {
        row.push(Math.random() < this.props.changeLightStartsOn);
      }
      board.push(row);
    }
    return board;
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let { ncols, nrows } = this.props;
    let board = this.state.board;
    let [y, x] = coord.split('-').map(Number);

    function flipCell(y, x) {
      // if this coord is actually on board, flip it

      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    // TODO: flip this cell and the cells around it
    flipCell(y, x); //Flip initial cell
    flipCell(y, x - 1); //flip left
    flipCell(y, x + 1); //flip right
    flipCell(y - 1, x); //flip below
    flipCell(y + 1, x); //flip above
    // win when every cell is turned off
    // TODO: determine is the game has been won

    let hasWon = board.every((row) => row.every((cell) => !cell));

    this.setState({ board: board, hasWon: hasWon });
  }

  /** Render game board or winning message. */
  makeTable() {
    let tblBoard = [];
    for (let y = 0; y < this.props.nrows; y++) {
      let row = [];
      for (let x = 0; x < this.props.ncols; x++) {
        let coord = `${y}-${x}`;
        row.push(
          <Cell key={coord} isLit={this.state.board[y][x]} flipCellsAroundMe={() => this.flipCellsAround(coord)} />
        );
      }
      tblBoard.push(<tr key={y}>{row}</tr>);
    }
    return (
      <Fragment>
        <button class='glow-on-hover neon-orange-modal' onClick={this.show.bind(this)}>
          <span class='neon-blue-modal'>How</span> To <span class='neon-blue-modal'>Play</span>
        </button>

        <Rodal
          className='modal-text'
          visible={this.state.visible}
          onClose={this.hide.bind(this)}
          height='460'
          width='620'
          enterAnimation='door'
          leaveAnimation='door'
        >
          <h1>The Ins and Outs:</h1>
          <p className='modal-text'>
            The game consists of a 5 by 5 grid of lights. When the game starts, a random number or a stored pattern of
            these lights is switched on. Pressing any of the lights will toggle it and the four adjacent lights. The
            goal of the puzzle is to switch all the lights off, preferably in as few button presses as possible.
          </p>
          <br />
          <img src='lights-out.png'></img>
        </Rodal>
        <table className='Board'>
          <tbody>{tblBoard}</tbody>
        </table>
      </Fragment>
    );
  }
  render() {
    return (
      <div>
        {this.state.hasWon ? (
          <div className='winner'>
            <span className='neon-orange'>YOU</span>
            <span className='neon-blue'>WIN!</span>
          </div>
        ) : (
          <div>
            <div className='Board-title'>
              <div className='neon-orange'>Lights</div>
              <div className='neon-blue'>Out</div>
            </div>
            {this.makeTable()}
          </div>
        )}
      </div>
    );
  }
}

export default Board;
