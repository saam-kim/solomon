import { useState } from "react";
import { GameScreen } from "./components/GameScreen";
import { StartScreen } from "./components/StartScreen";

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStartGame = () => {
    // New game: clear saved state to start fresh
    localStorage.removeItem("convenience-solomon-save");
    setIsPlaying(true);
  };

  const handleContinueGame = () => {
    // Continue game: loads save directly from localStorage inside GameScreen
    setIsPlaying(true);
  };

  const handleBackToTitle = () => {
    setIsPlaying(false);
  };

  if (isPlaying) {
    return <GameScreen onBackToTitle={handleBackToTitle} />;
  }

  return <StartScreen onStart={handleStartGame} onContinue={handleContinueGame} />;
}
