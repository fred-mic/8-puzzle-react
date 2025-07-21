import { useState, useEffect, useCallback } from "react";
import { PuzzleBoard } from "./components/PuzzleBoard";
import { Button } from "@/components/ui/button";

// Define TypeScript types for clarity
type GameState = "idle" | "shuffling" | "solving" | "animating" | "solved";
type SolutionPath = number[][];

const GRID_SIZE = 3;
const GOAL_STATE = [...Array(8).keys()].map((i) => i + 1).concat(0);
const API_URL = "http://127.0.0.1:8000/solve";

function App() {
  const [board, setBoard] = useState<number[]>(GOAL_STATE);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [solutionPath, setSolutionPath] = useState<SolutionPath | null>(null);
  const [animationStep, setAnimationStep] = useState(0);

  const isSolved = board.every((val, index) => val === GOAL_STATE[index]);

  // --- Game Logic ---

  const shuffleBoard = useCallback(() => {
    setGameState("shuffling");
    setSolutionPath(null);
    let shuffledBoard = [...GOAL_STATE];
    
    // Make 100 random, valid moves from the solved state to guarantee solvability
    for (let i = 0; i < 100; i++) {
      const emptyIndex = shuffledBoard.indexOf(0);
      const possibleMoves = [];
      const [r, c] = [Math.floor(emptyIndex / GRID_SIZE), emptyIndex % GRID_SIZE];

      if (r > 0) possibleMoves.push(emptyIndex - GRID_SIZE); // Up
      if (r < GRID_SIZE - 1) possibleMoves.push(emptyIndex + GRID_SIZE); // Down
      if (c > 0) possibleMoves.push(emptyIndex - 1); // Left
      if (c < GRID_SIZE - 1) possibleMoves.push(emptyIndex + 1); // Right
      
      const moveIndex = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      [shuffledBoard[emptyIndex], shuffledBoard[moveIndex]] = [shuffledBoard[moveIndex], shuffledBoard[emptyIndex]];
    }
    setBoard(shuffledBoard);
    setGameState("idle");
  }, []);

  // Initialize board on first load
  useEffect(() => {
    shuffleBoard();
  }, [shuffleBoard]);

  const handleTileClick = (index: number) => {
    if (gameState !== "idle") return; // Don't allow moves while animating/solving

    const emptyIndex = board.indexOf(0);
    const [r, c] = [Math.floor(index / GRID_SIZE), index % GRID_SIZE];
    const [er, ec] = [Math.floor(emptyIndex / GRID_SIZE), emptyIndex % GRID_SIZE];
    
    // Check for adjacency
    if (Math.abs(r - er) + Math.abs(c - ec) === 1) {
      const newBoard = [...board];
      [newBoard[index], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[index]];
      setBoard(newBoard);
      const isNowSolved = newBoard.every((val, i) => val === GOAL_STATE[i]);
      if (isNowSolved) {
        setGameState("solved");
      }
    }
  };

  // --- API and Animation Logic ---

  const handleSolve = async () => {
    if (isSolved) return;
    setGameState("solving");
    setSolutionPath(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: board }),
      });
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      const data = await response.json();
      
      setSolutionPath(data.solution);
      setAnimationStep(0);
      setGameState("animating");

    } catch (error) {
      console.error("Failed to fetch solution:", error);
      alert("Could not connect to the solver API. Please ensure it is running at http://127.0.0.1:8000.");
      setGameState("idle");
    }
  };
  
  // This effect runs the animation sequence
  useEffect(() => {
    if (gameState === "animating" && solutionPath && animationStep < solutionPath.length) {
      const timer = setTimeout(() => {
        setBoard(solutionPath[animationStep]);
        setAnimationStep(prev => prev + 1);
      }, 500); // Animation speed from Python's ANIMATION_DURATION_MS
      return () => clearTimeout(timer);
    } else if (gameState === "animating" && solutionPath && animationStep >= solutionPath.length) {
      setGameState("solved");
    }
  }, [gameState, solutionPath, animationStep]);


  return (
    <main className="flex w-full max-w-sm flex-col gap-6">
 <p className="text-center text-sm text-gray-400">
          {gameState === 'solved' ? "Congratulations!" : "Click a tile to move it."}
        </p>
        {/* The Puzzle Board */}
        <div className="relative w-full">
          <PuzzleBoard 
            board={board} 
            onTileClick={handleTileClick}
            isSolved={gameState === 'solved'}
          />
        </div>

        <div className="relative w-full p-3">
          <div className="flex items-center justify-center p-2 gap-4">
            <Button
              onClick={handleSolve}
              disabled={gameState !== "idle" && gameState !== "solved"}
              className="w-32 bg-red-600 text-lg hover:bg-red-700"
            >
              {/* Dynamic Button Text */}
              {gameState === "solving" && "Solving..."}
              {gameState === "animating" && "Solving..."}
              {gameState === "idle" && "Solve it"}
              {gameState === "shuffling" && "Solve it"}
              {gameState === "solved" && "Solved!"}
            </Button>
            <Button
              onClick={shuffleBoard}
              disabled={gameState === "animating" || gameState === "solving"}
              variant="secondary"
              className="w-32 text-lg"
            >
              New Game
            </Button>
          </div>
        </div>
    </main>
  );
}

export default App;