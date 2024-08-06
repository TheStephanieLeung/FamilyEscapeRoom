import Phaser from 'phaser';
import northImage from '../assets/upper-class-room-north.png';
import eastImage from '../assets/upper-class-room-east.png';
import southImage from '../assets/upper-class-room-south.png';
import westImage from '../assets/upper-class-room-west.png';
import walletSVG from './assets/wallet.svg';
import creditCardSVG from './assets/credit-card.svg';
import computerSVG from './assets/computer.svg';

class UpperClassScene extends Phaser.Scene {
  constructor() {
    super('UpperClass');
    this.currentDirection = 'north';
    this.billsPaid = false;
    this.hasWallet = false;
    this.hasCreditCard = false;
  }

  preload() {
    this.load.image('roomNorth', northImage);
    this.load.image('roomEast', eastImage);
    this.load.image('roomSouth', southImage);
    this.load.image('roomWest', westImage);
    this.load.svg('wallet', walletSVG);
    this.load.svg('creditCard', creditCardSVG);
    this.load.svg('computer', computerSVG);
  }

  create() {
    this.setupRoom();
    this.setupInteractiveObjects();
    this.setupControls();
  }

  setupRoom() {
    this.backgroundImage = this.add.image(0, 0, 'roomNorth').setOrigin(0, 0);
    this.scaleBackgroundToFit();
  }

  scaleBackgroundToFit() {
    const scaleX = this.cameras.main.width / this.backgroundImage.width;
    const scaleY = this.cameras.main.height / this.backgroundImage.height;
    const scale = Math.max(scaleX, scaleY);
    this.backgroundImage.setScale(scale);
  }

  setupInteractiveObjects() {
    // Wallet on the bookshelf (only visible when facing west)
    this.wallet = this.add.image(600, 300, 'wallet').setInteractive().setVisible(false).setScale(0.3);
    this.wallet.on('pointerdown', this.pickUpWallet, this);

    // Computer to pay bills (only visible when facing north)
    this.computer = this.add.image(400, 350, 'computer').setInteractive().setVisible(false).setScale(0.5);
    this.computer.on('pointerdown', this.useComputer, this);

    // Door (only visible when facing south)
    this.door = this.add.rectangle(400, 300, 100, 200, 0x000000, 0).setInteractive().setVisible(false);
    this.door.on('pointerdown', this.tryToLeaveDoor, this);
  }

  setupControls() {
    this.input.keyboard.on('keydown-LEFT', this.turnLeft, this);
    this.input.keyboard.on('keydown-RIGHT', this.turnRight, this);
  }

  turnLeft() {
    const directions = ['north', 'west', 'south', 'east'];
    const currentIndex = directions.indexOf(this.currentDirection);
    this.currentDirection = directions[(currentIndex + 1) % 4];
    this.updateRoom();
  }

  turnRight() {
    const directions = ['north', 'east', 'south', 'west'];
    const currentIndex = directions.indexOf(this.currentDirection);
    this.currentDirection = directions[(currentIndex + 1) % 4];
    this.updateRoom();
  }

  updateRoom() {
    this.backgroundImage.setTexture(`room${this.currentDirection.charAt(0).toUpperCase() + this.currentDirection.slice(1)}`);
    this.scaleBackgroundToFit();
    this.updateVisibleObjects();
  }

  updateVisibleObjects() {
    this.wallet.setVisible(this.currentDirection === 'west' && !this.hasWallet);
    this.computer.setVisible(this.currentDirection === 'north');
    this.door.setVisible(this.currentDirection === 'south');
  }

  pickUpWallet() {
    this.hasWallet = true;
    this.wallet.setVisible(false);
    this.hasCreditCard = true;
    this.add.text(300, 100, 'You found the wallet and credit card!', { fontSize: '18px', fill: '#fff' });
  }

  useComputer() {
    if (this.hasCreditCard && !this.billsPaid) {
      this.billsPaid = true;
      this.add.text(300, 150, 'Bills paid! Easy!', { fontSize: '24px', fill: '#fff' });
    } else if (!this.hasCreditCard) {
      this.add.text(300, 150, 'I need to find my credit card first.', { fontSize: '18px', fill: '#fff' });
    }
  }

  tryToLeaveDoor() {
    if (this.billsPaid) {
      this.add.text(300, 150, 'Congratulations! You can leave now.', { fontSize: '24px', fill: '#fff' });
      // Add code here to transition to the next scene or end the game
    } else {
      this.add.text(300, 150, "Ah, I've got to pay the bills. Let me find my credit card.", { fontSize: '18px', fill: '#fff' });
    }
  }
}

export default UpperClassScene;