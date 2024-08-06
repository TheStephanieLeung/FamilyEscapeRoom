import Phaser from 'phaser';

class MiddleClassScene extends Phaser.Scene {
  constructor() {
    super('MiddleClass');
  }

  preload() {
    this.load.image('middleClassRoom', 'assets/middle-class-room.png');
    this.load.image('checkbook', 'assets/checkbook.png');
  }

  create() {
    this.add.image(400, 300, 'middleClassRoom');
    
    const checkbook = this.add.image(600, 400, 'checkbook').setInteractive();
    checkbook.setScale(0.5);

    let balance = 1000;
    let billsPaid = false;

    checkbook.on('pointerdown', () => {
      this.add.text(300, 100, `Current balance: $${balance}`, { fontSize: '18px', fill: '#fff' });
    });

    this.input.keyboard.on('keydown-SPACE', () => {
      if (balance >= 500 && !billsPaid) {
        balance -= 500;
        billsPaid = true;
        this.add.text(300, 150, 'Bills paid! Balance updated.', { fontSize: '24px', fill: '#fff' });
      } else if (!billsPaid) {
        this.add.text(300, 150, 'Not enough funds!', { fontSize: '24px', fill: '#ff0000' });
      }
    });
  }
}

export default MiddleClassScene;
