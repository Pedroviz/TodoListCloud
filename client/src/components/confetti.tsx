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
        width: "8px",
        height: "8px",
        backgroundColor: color,
        borderRadius: "2px",
      }}
      initial={{ x, y: y - 20, opacity: 1, scale: 1 }}
      animate={{
        x: x + (Math.random() * 200 - 100),
        y: y + 100,
        opacity: 0,
        scale: 0,
        rotate: Math.random() * 360,
      }}
      transition={{ duration: 1, ease: "easeOut" }}
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
  ];

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 50 }}>
      {Array.from({ length: 30 }).map((_, i) => (
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
