import BoardManager from '../../utils/BoardManager';

// init board manager tests
const boardManager = new BoardManager();
boardManager.addPiece('bishop', 'black', [4, 4]);
boardManager.setScores();

console.log(boardManager);

export default function App() {
  return (
    <div>
      <header>
        <h1>Chess Position Analyzer</h1>
      </header>
      <main>
        <h2>Main Content</h2>
      </main>
      <footer>
        <h2>2024 Copyright Maximilian Aoki</h2>
      </footer>
    </div>
  );
}
