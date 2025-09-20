import { useState, useEffect, useRef } from "react";
import { Tile } from "./Tile";

interface PuzzleBoardProps {
  board: number[];
  onTileClick: (index: number) => void;
  isSolved: boolean;
}

export function PuzzleBoard({ board, onTileClick, isSolved }: PuzzleBoardProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize tile refs array
  useEffect(() => {
    tileRefs.current = tileRefs.current.slice(0, board.length);
  }, [board.length]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (focusedIndex === null) return;

    const cols = 3;
    let newIndex = focusedIndex;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        newIndex = Math.max(0, focusedIndex - cols);
        break;
      case 'ArrowDown':
        event.preventDefault();
        newIndex = Math.min(board.length - 1, focusedIndex + cols);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = Math.max(0, focusedIndex - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        newIndex = Math.min(board.length - 1, focusedIndex + 1);
        break;
      case 'Enter':
        event.preventDefault();
        onTileClick(focusedIndex);
        return;
      case 'Tab':
        // Let default tab behavior handle focus
        return;
      default:
        return;
    }

    if (newIndex !== focusedIndex) {
      setFocusedIndex(newIndex);
      tileRefs.current[newIndex]?.focus();
    }
  };

  // Handle tile click
  const handleTileClick = (index: number) => {
    setFocusedIndex(index);
    onTileClick(index);
  };

  // Handle tile focus
  const handleTileFocus = (index: number) => {
    setFocusedIndex(index);
  };

  // Handle board focus to enable keyboard navigation
  const handleBoardFocus = () => {
    if (focusedIndex === null) {
      // Focus on first non-empty tile, or first tile if all are empty
      const firstNonEmptyIndex = board.findIndex(num => num !== 0);
      const initialFocus = firstNonEmptyIndex !== -1 ? firstNonEmptyIndex : 0;
      setFocusedIndex(initialFocus);
      tileRefs.current[initialFocus]?.focus();
    }
  };

  return (
    <div 
      ref={boardRef}
      className="grid w-full grid-cols-3 gap-1 bg-gray-500 p-1"
      onKeyDown={handleKeyDown}
      onFocus={handleBoardFocus}
      tabIndex={0}
    >
      {board.map((num, index) => (
        <Tile
          key={index}
          ref={(el) => { tileRefs.current[index] = el; }}
          num={num}
          onClick={() => handleTileClick(index)}
          onFocus={() => handleTileFocus(index)}
          isSolved={isSolved}
          isFocused={focusedIndex === index}
        />
      ))}
    </div>
  );
}