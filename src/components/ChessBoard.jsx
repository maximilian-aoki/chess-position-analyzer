// helper functions
function getPositionArr(index) {
  if (index < 8) return [0, index];
  return [Math.floor(index / 8), index - 8 * Math.floor(index / 8)];
}

// Chess Board Component
export default function ChessBoard({
  board,
  showOverlay,
  boardReversed,
  selectedNewPiece,
  selectedBoardPiece,
  handleSelectBoardPiece,
  handlePlaceBoardPiece,
  handlePlaceNewPiece,
}) {
  function handleBoardClick(index) {
    const positionArr = getPositionArr(index);

    if (!selectedNewPiece && !selectedBoardPiece) {
      // first click on board
      const currentIndex = boardReversed ? 63 - index : index;
      if (board[currentIndex].piece) {
        // selecting board piece
        handleSelectBoardPiece(board[currentIndex].piece);
      }
    }

    if (selectedBoardPiece) {
      // place the already selected piece in new position
      handlePlaceBoardPiece(positionArr);
    }

    if (selectedNewPiece) {
      // place the new piece in new position
      handlePlaceNewPiece(positionArr);
    }
  }

  // change UI on board reverse
  let boardReversedUI = 'border-t-black';
  if (!boardReversed) {
    boardReversedUI = 'border-t-white';
  }

  return (
    <div
      className={`aspect-square bg-slate-400 rounded-lg grid grid-cols-8 overflow-hidden border-t-8 ${boardReversedUI}`}
    >
      {board.map((square, index) => {
        const currentIndex = boardReversed ? 63 - index : index;

        // initial square color
        let squareColor = square.squareIsWhite
          ? 'bg-slate-400'
          : 'bg-slate-500';

        // overlay
        let squareBorder = '';
        if (showOverlay) {
          if (square.score >= 5) {
            squareColor = 'bg-blue-700';
          } else if (square.score === 4) {
            squareColor = 'bg-blue-600';
          } else if (square.score === 3) {
            squareColor = 'bg-blue-500';
          } else if (square.score === 2) {
            squareColor = 'bg-blue-400';
          } else if (square.score === 1) {
            squareColor = 'bg-blue-300';
          } else if (square.score === -1) {
            squareColor = 'bg-red-300';
          } else if (square.score === -2) {
            squareColor = 'bg-red-400';
          } else if (square.score === -3) {
            squareColor = 'bg-red-500';
          } else if (square.score === -4) {
            squareColor = 'bg-red-600';
          } else if (square.score <= -5) {
            squareColor = 'bg-red-700';
          } else if (square.score === 0) {
            squareColor = 'bg-slate-400';
          }

          squareBorder = 'border border-slate-300';
        }

        // selected square color
        if (square.piece && selectedBoardPiece) {
          squareColor =
            square.piece.position[0] === selectedBoardPiece.position[0] &&
            square.piece.position[1] === selectedBoardPiece.position[1]
              ? 'bg-amber-200'
              : squareColor;
        }

        return (
          <button
            key={currentIndex}
            className={`aspect-square grid place-content-center relative ${squareColor} ${squareBorder}`}
            onClick={() => handleBoardClick(currentIndex)}
          >
            <p className="absolute top-0 right-1">{square.score}</p>
            {square.piece && (
              <img src={square.piece.imageUrl} className="object-center"></img>
            )}
          </button>
        );
      })}
    </div>
  );
}
