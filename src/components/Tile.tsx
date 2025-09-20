import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // shadcn's utility for merging class names

interface TileProps {
  num: number;
  onClick: () => void;
  onFocus?: () => void;
  isSolved: boolean;
  isFocused?: boolean;
}

export const Tile = forwardRef<HTMLDivElement, TileProps>(
  ({ num, onClick, onFocus, isSolved, isFocused = false }, ref) => {
    const isEmpty = num === 0;

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        onClick();
      }
    };

    return (
      <motion.div
        ref={ref}
        layout // This is the magic prop for automatic animation!
        onClick={onClick}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        // Animate between these styles based on the 'isSolved' state
        animate={isSolved ? "solved" : "default"}
        className={cn(
          "flex aspect-square select-none items-center justify-center border-2 bg-gray-200 text-4xl font-bold text-red-500 shadow-md transition-opacity duration-300 md:text-5xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          isEmpty
            ? "cursor-default opacity-0" // The empty tile is invisible
            : "cursor-pointer hover:bg-gray-300 active:scale-95",
          isFocused && !isEmpty && "ring-2 ring-blue-500 ring-offset-2"
        )}
        // Define animation variants
        variants={{
          default: { }, 
          solved: { scale: 1.05, backgroundColor: "#4ADE80" }, // green
        }}
        transition={{ 
          duration: 1,
          ease: "easeInOut" }}
      >
        {!isEmpty && num}
      </motion.div>
    );
  }
);

Tile.displayName = "Tile";