import Phaser from 'phaser';

class LowerIncomeScene extends Phaser.Scene {
  constructor() {
    super('LowerIncome');
  }

  preload() {
    this.load.image('lowerIncomeRoom', 'assets/lower-income-room.png');
    this.load.image('couch', 'assets/couch.png');
    this.load.image('coin', 'assets/coin.png');
  }

  create() {
    this.add.image(400, 300, 'lowerIncomeRoom');
    
    const couch = this.add.image(600, 450, 'couch').setInteractive();
    couch.setScale(0.7);

    let totalCoins = 0;
    let billsPaid = false;

    couch.on('pointerdown', () => {
      if (Math.random() > 0.5) {
        const coin = this.add.image(Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500), 'coin');
        coin.setScale(0.3);
        totalCoins += 1;
        this.add.text(300, 100, `Found a coin! Total: $${totalCoins}`, { fontSize: '18px', fill: '#fff' });
      } else {
        this.add.text(300, 100, 'No coins found here...', { fontSize: '18px', fill: '#fff' });
      }
    });

    this.input.keyboard.on('keydown-L', () => {
      if (!billsPaid) {
        this.add.text(300, 150, 'Took out a loan to pay bills.', { fontSize: '24px', fill: '#ff0000' });
        billsPaid = true;
      }
    });
  }
}

export default LowerIncomeScene;
