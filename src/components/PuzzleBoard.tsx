import { Tile } from "./Tile";

interface PuzzleBoardProps {
  board: number[];
  onTileClick: (index: number) => void;
  isSolved: boolean;
}

export function PuzzleBoard({ board, onTileClick, isSolved }: PuzzleBoardProps) {
  return (
    <div className="grid w-full grid-cols-3 gap-2 rounded-xl bg-black p-2 md:gap-3 md:p-3">
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