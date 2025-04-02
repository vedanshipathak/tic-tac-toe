import React, { useState, useCallback, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

type Player = 'X' | 'O';
type BoardState = (Player | null)[];

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningCombination, setWinningCombination] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  const checkWinner = useCallback((boardState: BoardState): void => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[a] === boardState[c]
      ) {
        setWinner(boardState[a] as Player);
        setWinningCombination(combination);
        return;
      }
    }
    
    if (boardState.every(cell => cell !== null)) {
      setWinner('draw' as Player);
    }
  }, []);

  const handleCellClick = (index: number) => {
    if (!gameStarted || board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    checkWinner(newBoard);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningCombination([]);
    setGameStarted(false);
  };

  const startGame = () => {
    resetGame();
    setGameStarted(true);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="flex justify-between w-full max-w-md mb-8">
          <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Tic-Tac-Toe
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${
              darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        <div className={`mb-6 p-4 rounded-lg ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        } shadow-lg`}>
          {!gameStarted ? (
            <p className="text-xl text-center">Press Play to start the game!</p>
          ) : winner === 'draw' ? (
            <p className="text-xl text-center">It's a draw!</p>
          ) : winner ? (
            <p className="text-xl text-center">Player {winner} wins!</p>
          ) : (
            <p className="text-xl text-center">Player {currentPlayer}'s turn</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={!gameStarted || !!winner}
              className={`w-24 h-24 text-4xl font-bold rounded-lg transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-800 text-white hover:bg-gray-700' 
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              } ${
                winningCombination.includes(index) 
                  ? 'ring-4 ring-green-500' 
                  : 'ring-1 ring-gray-300'
              } ${!gameStarted && 'opacity-50'}`}
            >
              {cell}
            </button>
          ))}
        </div>

        <div className="space-x-4">
          {!gameStarted ? (
            <button
              onClick={startGame}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Play
            </button>
          ) : (
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Restart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;