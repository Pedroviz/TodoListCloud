import { motion } from "framer-motion";

interface ConfettiPieceProps {
  x: number;
  y: number;
  color: string;
}

function ConfettiPiece({ x, y, color }: ConfettiPieceProps) {
  return (
    <motion.div
      style={{
        position: "absolute",
        width: "20px", // Increased from 12px
        height: "20px", // Increased from 12px
        backgroundColor: color,
        borderRadius: "6px", // Increased from 4px
      }}
      initial={{ x, y: y - 40, opacity: 1, scale: 1 }} // Start higher
      animate={{
        x: x + (Math.random() * 600 - 300), // Much wider spread
        y: y + 400, // Fall much further
        opacity: 0,
        scale: 0,
        rotate: Math.random() * 1080, // Even more rotation
      }}
      transition={{ duration: 2, ease: "easeOut" }} // Longer duration
    />
  );
}

interface ConfettiProps {
  x: number;
  y: number;
}

export default function Confetti({ x, y }: ConfettiProps) {
  const colors = [
    "#FF6B6B", // red
    "#4ECDC4", // teal
    "#FFD93D", // yellow
    "#6C5CE7", // purple
    "#A8E6CF", // mint
    "#FF9F43", // orange
    "#FF78C4", // pink
    "#45B7D1", // sky blue
    "#96F7D2", // aqua
  ];

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 50 }}>
      {Array.from({ length: 75 }).map((_, i) => ( // Even more pieces
        <ConfettiPiece
          key={i}
          x={x}
          y={y}
          color={colors[Math.floor(Math.random() * colors.length)]}
        />
      ))}
    </div>
  );
}