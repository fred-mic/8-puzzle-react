import { Tile } from "./Tile";

interface PuzzleBoardProps {
  board: number[];
  onTileClick: (index: number) => void;
  isSolved: boolean;
}

export function PuzzleBoard({ board, onTileClick, isSolved }: PuzzleBoardProps) {
  return (
    <div className="grid w-full grid-cols-3 gap-1 bg-gray-500 p-1">
      {board.map((num, index) => (
        <Tile
          key={index}
          num={num}
          onClick={() => onTileClick(index)}
          isSolved={isSolved}
        />
      ))}
    </div>
  );
}