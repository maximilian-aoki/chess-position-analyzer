import BoardManager from '../../utils/BoardManager';

// init board manager tests
const boardManager = new BoardManager();
boardManager.addPiece('bishop', 'black', [4, 4]);
boardManager.setScores();

console.log(boardManager);

export default function App() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="flex-initial h-20 md:h-28 bg-slate-200 p-4 grid content-center">
        <h1 className="font-bold text-xl md:text-3xl md:px-12">
          CHESS POSITION ANALYSER
        </h1>
      </header>
      <main className="flex-1 bg-slate-300 flex flex-col items-center">
        <div className="flex-1 w-full md:w-[768px] bg-slate-600">
          <h2>Main Content</h2>
        </div>
      </main>
      <footer className="flex-initial h-20 bg-slate-400 grid place-content-center">
        <h2 className="font-bold italic text-lg text-white">
          created by Maximilian Aoki
        </h2>
      </footer>
    </div>
  );
}
