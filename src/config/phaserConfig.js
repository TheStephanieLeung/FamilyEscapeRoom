import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  scene: {
    preload: function() {
      // Preload assets here
    },
    create: function() {
      // Create game objects here
    },
    update: function() {
      // Update game state here
    }
  }
};

export default config;
