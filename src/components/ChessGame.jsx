import { useState, useEffect } from 'react';

import BoardManager from '../utils/BoardManager';
import ChessBoard from './ChessBoard';

// init board manager
const boardManager = new BoardManager();
if (localStorage.getItem('boardManager')) {
  const savedBoard = JSON.parse(localStorage.getItem('boardManager'));
  console.log(savedBoard);
  boardManager.board = savedBoard.board;
  boardManager.totalScore = savedBoard.totalScore;
  boardManager.pieceArr = savedBoard.pieceArr;
} else {
  boardManager.initGameBoard();
  boardManager.setScores();
}

function saveBoard() {
  localStorage.setItem('boardManager', JSON.stringify(boardManager));
}

// flatten array so it can be mapped in JSX
const boardData = boardManager.board.flat();

export default function ChessGame() {
  const [board, setBoard] = useState(boardData);
  const [showOverlay, setShowOverlay] = useState(false);
  const [boardReversed, setBoardReversed] = useState(false);
  const [selectedNewPiece, setSelectedNewPiece] = useState(null);
  const [selectedBoardPiece, setSelectedBoardPiece] = useState(null);

  // key events to remove selection or remove piece on board
  useEffect(() => {
    const keyEvent = (e) => {
      if (e.key === 'Escape') {
        setSelectedNewPiece(null);
        setSelectedBoardPiece(null);
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedBoardPiece) {
          boardManager.removePiece(selectedBoardPiece.position);
          boardManager.setScores();

          setBoard([...boardManager.board.flat()]);
          setSelectedBoardPiece(null);
          saveBoard();
        }
      }
    };

    document.addEventListener('keydown', keyEvent);

    return () => {
      document.removeEventListener('keydown', keyEvent);
    };
  }, [board, showOverlay, boardReversed, selectedNewPiece, selectedBoardPiece]);

  // check if board is reversed
  const currentBoard = boardReversed ? board.toReversed() : board;

  // BOARD OPTIONS
  function handleSelectBoardPiece(piece) {
    setSelectedBoardPiece({
      type: piece.type,
      color: piece.color,
      position: piece.position,
    });
    setSelectedNewPiece(null);
  }

  function handlePlaceBoardPiece(positionArr) {
    if (
      selectedBoardPiece.position[0] === positionArr[0] &&
      selectedBoardPiece.position[1] === positionArr[1]
    ) {
      // piece placed in same position
      setSelectedBoardPiece(null);
      return;
    }

    // use board manager to reset scores
    boardManager.removePiece(selectedBoardPiece.position);
    boardManager.removePiece(positionArr);
    boardManager.addPiece(
      selectedBoardPiece.type,
      selectedBoardPiece.color,
      positionArr,
    );
    boardManager.setScores();

    setBoard([...boardManager.board.flat()]);
    setSelectedBoardPiece(null);

    saveBoard();
  }

  function handleSelectNewPiece({ type, color }) {
    if (
      selectedNewPiece &&
      selectedNewPiece.type === type &&
      selectedNewPiece.color === color
    ) {
      setSelectedNewPiece(null);
      return;
    }

    setSelectedNewPiece({
      type,
      color,
    });
    setSelectedBoardPiece(null);
  }

  function handlePlaceNewPiece(positionArr) {
    boardManager.removePiece(positionArr);
    boardManager.addPiece(
      selectedNewPiece.type,
      selectedNewPiece.color,
      positionArr,
    );
    boardManager.setScores();

    setBoard([...boardManager.board.flat()]);
    setSelectedNewPiece(null);

    saveBoard();
  }

  // GAME OPTIONS
  function initializeBoard() {
    boardManager.initGameBoard();
    boardManager.setScores();

    setBoard([...boardManager.board.flat()]);

    setBoardReversed(false);
    setSelectedBoardPiece(null);
    setSelectedNewPiece(null);

    saveBoard();
  }

  function resetBoard() {
    boardManager.board = boardManager.resetBoard();
    setBoard([...boardManager.board.flat()]);

    setBoardReversed(false);
    setSelectedBoardPiece(null);
    setSelectedNewPiece(null);

    saveBoard();
  }

  function rotateBoard() {
    setBoardReversed(!boardReversed);

    setSelectedBoardPiece(null);
    setSelectedNewPiece(null);
  }

  function toggleOverlay() {
    setShowOverlay(!showOverlay);
  }

  // check scoreboard
  let scoreboardText = '';
  if (boardManager.totalScore > 0) {
    scoreboardText = `White is leading by ${boardManager.totalScore} points`;
  } else if (boardManager.totalScore < 0) {
    scoreboardText = `Black is leading by ${boardManager.totalScore * -1} points`;
  } else {
    scoreboardText = `Position is tied`;
  }

  // JSX
  return (
    <div className="flex-1 w-full md:w-[768px] md:p-4 bg-slate-600 flex flex-col gap-4">
      {/* game options */}
      <div className="flex-none grid grid-cols-4 place-content-center">
        <button
          className="rounded m-1 grid place-content-center bg-gray-400 py-1 hover:bg-gray-300 font-bold"
          onClick={initializeBoard}
        >
          Initialize
        </button>
        <button
          className="rounded m-1 grid place-content-center bg-gray-400 py-1 hover:bg-gray-300 font-bold"
          onClick={resetBoard}
        >
          Clear
        </button>
        <button
          className="rounded m-1 grid place-content-center bg-gray-400 py-1 hover:bg-gray-300 font-bold"
          onClick={rotateBoard}
        >
          Rotate
        </button>
        <button
          className="rounded m-1 grid place-content-center bg-gray-400 py-1 hover:bg-gray-300 font-bold"
          onClick={toggleOverlay}
        >
          Toggle Overlay
        </button>
      </div>

      {/* scoreboard */}
      <p className="text-white text-lg font-bold text-center">
        {scoreboardText}
      </p>

      {/* actual chess board */}
      <ChessBoard
        board={currentBoard}
        showOverlay={showOverlay}
        boardReversed={boardReversed}
        selectedNewPiece={selectedNewPiece}
        selectedBoardPiece={selectedBoardPiece}
        handleSelectBoardPiece={handleSelectBoardPiece}
        handlePlaceBoardPiece={handlePlaceBoardPiece}
        handlePlaceNewPiece={handlePlaceNewPiece}
      />

      {/* white new pieces */}
      <div className="flex-none grid grid-cols-8 place-content-center">
        {['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'].map(
          (pieceName) => {
            let squareColor = 'bg-gray-400';
            if (selectedNewPiece && selectedNewPiece.color === 'white') {
              if (pieceName === selectedNewPiece.type) {
                squareColor = 'bg-amber-200';
              }
            }

            return (
              <button
                key={pieceName}
                className={`aspect-square rounded m-1 grid place-content-center ${squareColor}`}
                onClick={() =>
                  handleSelectNewPiece({ type: pieceName, color: 'white' })
                }
              >
                <img
                  src={`/${pieceName}-white.svg`}
                  className="object-center"
                ></img>
              </button>
            );
          },
        )}
      </div>

      {/* black new pieces */}
      <div className="flex-none grid grid-cols-8 place-content-center">
        {['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'].map(
          (pieceName) => {
            let squareColor = 'bg-gray-400';
            if (selectedNewPiece && selectedNewPiece.color === 'black') {
              if (pieceName === selectedNewPiece.type) {
                squareColor = 'bg-amber-200';
              }
            }

            return (
              <button
                key={pieceName}
                className={`aspect-square rounded m-1 grid place-content-center ${squareColor}`}
                onClick={() =>
                  handleSelectNewPiece({ type: pieceName, color: 'black' })
                }
              >
                <img
                  src={`/${pieceName}-black.svg`}
                  className="object-center"
                ></img>
              </button>
            );
          },
        )}
      </div>
    </div>
  );
}
