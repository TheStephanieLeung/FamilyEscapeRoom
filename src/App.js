import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import UpperClassScene from './UpperClassScene';
import MiddleClassScene from './MiddleClassScene';
import LowerClassScene from './LowerClassScene';

function App() {
  const gameRef = useRef(null);

  useEffect(() => {
    if (gameRef.current) return;

    const config = {
      type: Phaser.AUTO,
      width: 1024,
      height: 768,
      parent: 'game-container',
      scene: [UpperClassScene, MiddleClassScene, LowerClassScene],
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div className="App">
      <div id="game-container" className="mx-auto"></div>
    </div>
  );
}

export default App;
