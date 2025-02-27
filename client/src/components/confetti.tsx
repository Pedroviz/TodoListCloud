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
        width: "12px",
        height: "12px",
        backgroundColor: color,
        borderRadius: "4px",
      }}
      initial={{ x, y: y - 20, opacity: 1, scale: 1 }}
      animate={{
        x: x + (Math.random() * 400 - 200), // Wider spread
        y: y + 200, // Fall further
        opacity: 0,
        scale: 0,
        rotate: Math.random() * 720, // More rotation
      }}
      transition={{ duration: 1.5, ease: "easeOut" }} // Longer duration
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
  ];

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 50 }}>
      {Array.from({ length: 50 }).map((_, i) => ( // More pieces
        <ConfettiPiece
          key={i}
          x={x - 100} // Center horizontally
          y={y}
          color={colors[Math.floor(Math.random() * colors.length)]}
        />
      ))}
    </div>
  );
}