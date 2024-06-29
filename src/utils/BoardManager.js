import Piece from './Piece';

export default class BoardManager {
  constructor() {
    this.board = this.resetBoard();
    this.totalScore = 0;
    this.pieceArr = [];
  }

  // init function
  resetBoard() {
    this.totalScore = 0;
    this.pieceArr = [];

    const newBoard = [];
    for (let i = 0; i <= 7; i++) {
      const newRow = [];

      let squareIsWhite = i % 2 === 0;
      for (let j = 0; j <= 7; j++) {
        newRow.push({
          piece: null,
          score: 0,
          squareIsWhite,
        });
        squareIsWhite = !squareIsWhite;
      }

      newBoard.push(newRow);
    }
    return newBoard;
  }

  initGameBoard() {
    this.board = this.resetBoard();

    // set white pawns
    this.board[6].forEach((square, index) => {
      const newPiece = new Piece('pawn', 'white', [6, index]);
      square.piece = newPiece;
      this.pieceArr.push(newPiece);
    });

    // set white back-row
    [
      'rook',
      'knight',
      'bishop',
      'queen',
      'king',
      'bishop',
      'knight',
      'rook',
    ].forEach((pieceName, index) => {
      this.addPiece(pieceName, 'white', [7, index]);
    });

    // set black pawns
    this.board[1].forEach((square, index) => {
      const newPiece = new Piece('pawn', 'black', [1, index]);
      square.piece = newPiece;
      this.pieceArr.push(newPiece);
    });

    // set black back-row
    [
      'rook',
      'knight',
      'bishop',
      'queen',
      'king',
      'bishop',
      'knight',
      'rook',
    ].forEach((pieceName, index) => {
      this.addPiece(pieceName, 'black', [0, index]);
    });
  }

  setScores() {
    this.#removeAllScores();

    this.pieceArr.forEach((piece) => {
      const scoreAdder = piece.color === 'white' ? 1 : -1;
      const piecePositionArr = piece.position;

      piece.moveArr.forEach((pieceMoveArr) => {
        let currentPositionArr = piecePositionArr;

        if (piece.canExtendMove === false) {
          // piece is either a pawn, knight, or king

          currentPositionArr = [
            currentPositionArr[0] + pieceMoveArr[0],
            currentPositionArr[1] + pieceMoveArr[1],
          ];

          // check if new position is on board
          if (this.#isLegal(currentPositionArr)) {
            // change the score of the specific square
            this.board[currentPositionArr[0]][currentPositionArr[1]].score +=
              scoreAdder;
          }
        } else {
          // piece is either a bishop, rook, or queen

          let pieceCanContinue = true;
          while (pieceCanContinue) {
            currentPositionArr = [
              currentPositionArr[0] + pieceMoveArr[0],
              currentPositionArr[1] + pieceMoveArr[1],
            ];

            // check if new position is on board
            if (this.#isLegal(currentPositionArr)) {
              // change the score of the specific square
              this.board[currentPositionArr[0]][currentPositionArr[1]].score +=
                scoreAdder;
            } else {
              break;
            }

            // check if piece needs to stop here
            if (
              this.board[currentPositionArr[0]][currentPositionArr[1]].piece
            ) {
              pieceCanContinue = false;
            }
          }
        }
      });
    });

    this.#sumTotalScore();
  }

  // init all scores to zero
  #removeAllScores() {
    this.board.forEach((row) => {
      row.forEach((square) => {
        square.score = 0;
      });
    });
  }

  // sum all scores
  #sumTotalScore() {
    let sum = 0;
    this.board.forEach((row) => {
      row.forEach((square) => {
        sum += square.score;
      });
    });

    this.totalScore = sum;
  }

  // private function to check if current position is on board
  #isLegal(arr) {
    return arr[0] >= 0 && arr[0] <= 7 && arr[1] >= 0 && arr[1] <= 7;
  }

  addPiece(type, color, position) {
    const newPiece = new Piece(type, color, position);
    this.board[position[0]][position[1]].piece = newPiece;
    this.pieceArr.push(newPiece);
  }

  removePiece(position) {
    this.board[position[0]][position[1]].piece = null;
    this.pieceArr.forEach((piece, index) => {
      if (
        piece.position[0] === position[0] &&
        piece.position[1] === position[1]
      ) {
        this.pieceArr.splice(index, 1);
      }
    });
  }
}
