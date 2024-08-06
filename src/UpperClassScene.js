import BaseScene from './BaseScene';
import northImage from './assets/upper-class-room-north.png';
import eastImage from './assets/upper-class-room-east.png';
import southImage from './assets/upper-class-room-south.png';
import westImage from './assets/upper-class-room-west.png';
import walletImage from './assets/wallet.png';
import bunchOfImages from './assets/bunch-of-images.png';

class UpperClassScene extends BaseScene {
  constructor() {
    super('UpperClass');
    this.billsPaid = false;
    this.hasWallet = false;
    this.hasCreditCard = false;
  }

  preload() {
    this.load.image('upperClassRoomNorth', northImage);
    this.load.image('upperClassRoomEast', eastImage);
    this.load.image('upperClassRoomSouth', southImage);
    this.load.image('upperClassRoomWest', westImage);
    this.load.image('bunchOfImages', bunchOfImages);
    this.load.image('wallet', walletImage);
  }

  create() {
    super.create();
    this.setupRoom();
    this.setupInteractiveObjects();
    this.setupComputerScreen();
    this.updateRoom();
  }

  setupRoom() {
    const { width, height } = this.scale;
    this.roomImages = {
      north: this.add.image(width / 2, height / 2, 'upperClassRoomNorth'),
      east: this.add.image(width / 2, height / 2, 'upperClassRoomEast'),
      south: this.add.image(width / 2, height / 2, 'upperClassRoomSouth'),
      west: this.add.image(width / 2, height / 2, 'upperClassRoomWest')
    };

    Object.values(this.roomImages).forEach(image => {
      image.setDisplaySize(width, height);
      image.setDepth(-1);
    });
  }

  updateRoom() {
    if (this.text) {
      this.text.destroy();
    }
    Object.keys(this.roomImages).forEach(direction => {
      this.roomImages[direction].setVisible(direction === this.currentDirection);
    });
    this.updateInteractiveObjects();
  }

  setupInteractiveObjects() {
    this.wallet = this.add.image(500, 565, 'wallet').setScale(0.3);
    this.makeInteractive(this.wallet, this.pickUpWallet);

    this.computer = this.add.rectangle(512, 384, 630, 200, 0, 0);
    this.makeInteractive(this.computer, () => {
      this.useComputer();
    });

    this.door = this.add.rectangle(512, 400, 400, 550, 0, 0);
    this.makeInteractive(this.door, this.tryToLeaveDoor);

    this.bunchOfImages = this.add.image(512, 384, 'bunchOfImages').setScale(0.35);
    this.makeInteractive(this.bunchOfImages, () => {
      this.showCenteredText("A collection of fancy art pieces.", 24, 1500);
    });

    this.updateInteractiveObjects();
  }

  updateInteractiveObjects() {
    this.wallet.setVisible(this.currentDirection === 'east' && !this.hasWallet);
    this.computer.setVisible(this.currentDirection === 'south');
    this.door.setVisible(this.currentDirection === 'north');
    this.bunchOfImages.setVisible(this.currentDirection === 'west');
  }

  pickUpWallet() {
    this.addToInventory('Wallet');
    this.text = this.showCenteredText("You got: Your wallet!", 24, 1500);
    this.wallet.setVisible(false);
    this.hasWallet = true;
    this.zoomInAddInventory(this.wallet);
    this.toggleArrows();
    this.time.delayedCall(1500, () => {
      this.addToInventory('Credit Card');
      this.showCenteredText("You got: Your credit card!", 24, 1500);
      this.hasCreditCard = true;
      this.toggleArrows();
    });
  }

  useComputer() {
    if (!this.hasCreditCard) {
      this.showCenteredText("I need to find my credit card first.", 24, 1500);
      return;
    }

    if (this.billsPaid) {
      this.showCenteredText("Bills are already paid.", 24, 1500);
      return;
    }

    this.computerScreenGroup.setVisible(true);
    this.computerScreenGroup.getChildren().forEach(child => child.setVisible(true));
    Object.values(this.roomImages).forEach(image => image.setVisible(false));
    this.toggleArrows();
  }

  tryToLeaveDoor() {
    if (this.billsPaid) {
      this.showCenteredText("Great, bills all paid. Let's go.", 24, 1500);
      this.time.delayedCall(1500, () => {
        this.scene.start('MiddleClass');
      });
    } else if (!this.text || !this.text.visible) {
      this.text = this.showCenteredText("Nope. I've got to pay the bills first.", 24, 1500);
    }
  }

  setupComputerScreen() {
    const { width, height } = this.scale;

    const screenWidth = width * 0.8;
    const screenHeight = height * 0.8;
    const screenX = width / 2;
    const screenY = height / 2;

    this.computerScreen = this.add.rectangle(screenX, screenY, screenWidth, screenHeight, 0xF0F0F0).setVisible(false);

    const topBar = this.add.rectangle(screenX, screenY - screenHeight / 2 + 30, screenWidth, 60, 0xE0E0E0).setVisible(false);
    const urlBar = this.add.rectangle(screenX, screenY - screenHeight / 2 + 30, screenWidth - 100, 40, 0xFFFFFF).setVisible(false);
    const urlText = this.add.text(screenX - screenWidth / 2 + 80, screenY - screenHeight / 2 + 20, 'https://www.billpay.com', { fontSize: '16px', fill: '#000000' }).setVisible(false);

    const contentBg = this.add.rectangle(screenX, screenY + 30, screenWidth - 100, screenHeight - 100, 0xFFFFFF).setVisible(false);

    const billTitle = this.add.text(screenX, screenY - screenHeight / 2 + 120, 'Monthly Bill Payment', { fontSize: '28px', fill: '#333333', fontStyle: 'bold' }).setOrigin(0.5).setVisible(false);
    this.billText = this.add.text(screenX, screenY - screenHeight / 2 + 170, 'Amount Due: $5,000.00', { fontSize: '24px', fill: '#FF4500' }).setOrigin(0.5).setVisible(false);

    const formTitle = this.add.text(screenX, screenY - screenHeight / 2 + 230, 'Enter Credit Card Details', { fontSize: '20px', fill: '#333333' }).setOrigin(0.5).setVisible(false);

    this.paymentButton = this.add.text(screenX, screenY + 50, 'Enter Credit Card Details & Pay', {
      fontSize: '20px',
      fill: '#FFFFFF',
      backgroundColor: '#4CAF50',
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setVisible(false);

    this.paymentButton.on('pointerdown', this.handlePayment, this);

    this.computerScreenGroup = this.add.group([
      this.computerScreen, topBar, urlBar, urlText,
      contentBg, billTitle, this.billText, formTitle,
      this.paymentButton
    ]);
  }

  handlePayment() {
    if (this.hasCreditCard) {
      this.billsPaid = true;
      this.showCenteredText("Payment successful! Bills paid!", 24, 1500);
      this.time.delayedCall(1500, this.exitComputerScreen, [], this);
    } else {
      this.showCenteredText("You need to find your credit card first!", 24, 1500);
    }
  }

  exitComputerScreen() {
    this.computerScreenGroup.setVisible(false);
    this.paymentButton.setVisible(false).setActive(false);
    this.updateRoom();
    this.toggleArrows();
  }
}

export default UpperClassScene;