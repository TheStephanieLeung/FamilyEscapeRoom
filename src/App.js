import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import config from './config/phaserConfig';

function App() {
  const gameRef = useRef(null);

  useEffect(() => {
    if (gameRef.current) return;
    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div className="App">
      <h1 className="text-3xl font-bold text-center my-4">Social Class Escape Room</h1>
      <div id="game-container" className="mx-auto"></div>
    </div>
  );
}

export default App;