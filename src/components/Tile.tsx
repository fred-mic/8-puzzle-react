import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // shadcn's utility for merging class names

interface TileProps {
  num: number;
  onClick: () => void;
  isSolved: boolean;
}

export function Tile({ num, onClick, isSolved }: TileProps) {
  const isEmpty = num === 0;

  return (
    <motion.div
      layout // This is the magic prop for automatic animation!
      onClick={onClick}
      // Animate between these styles based on the 'isSolved' state
      animate={isSolved ? "solved" : "default"}
      className={cn(
        "flex aspect-square select-none items-center justify-center border-2 bg-gray-200 text-4xl font-bold text-red-500 shadow-md transition-opacity duration-300 md:text-5xl",
        isEmpty
          ? "cursor-default opacity-0" // The empty tile is invisible
          : "cursor-pointer hover:bg-gray-300 active:scale-95",
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