import Phaser from 'phaser';

const inventoryEmptyMessage = 'Your inventory: Nothing!';
class BaseScene extends Phaser.Scene {
  constructor(key, config = {}) {
    super(key);
    this.inventory = [];
    this.currentDirection = 'north';
    this.fadeInDuration = config.fadeInDuration || 7500;
    this.introText = config.introText || "Experience a day in the life of an upper-income family\n managing their finances.";
    this.showIntro = config.showIntro !== undefined ? config.showIntro : true;
  }

  create() {
    this.cameras.main.alpha = 0;
    
    if (this.showIntro) {
      const introTextObject = this.showCenteredText(this.introText, 24, this.fadeInDuration);
      introTextObject.setAlpha(1);
      
      this.tweens.add({
        targets: this.cameras.main,
        alpha: 1,
        duration: this.fadeInDuration,
        ease: 'Power1',
        yoyo: false,
        onComplete: () => {
          this.setupScene();
          introTextObject.destroy();
        }
      });
    } else {
      this.cameras.main.fadeIn(this.fadeInDuration, 0, 0, 0);
      this.setupScene();
    }

    this.gameWidth = this.sys.game.config.width;
    this.gameHeight = this.sys.game.config.height;
  }

  setupScene() {
    this.actuallyBegin();
    this.setupInventory();
    this.setupNavigationArrows();
    this.setupZoomableObjects();
  }

  actuallyBegin() {
  }

  setupInventory() {
    const inventoryHeight = this.gameHeight * 0.15;
    const inventoryY = this.gameHeight - inventoryHeight / 2;

    const inventoryBg = this.add.rectangle(this.gameWidth / 2, inventoryY, this.gameWidth * 0.9, inventoryHeight, 0x000000, 0.7);
    inventoryBg.setOrigin(0.5, 0.5);

    this.inventoryItemsText = this.add.text(this.gameWidth / 2, inventoryY, inventoryEmptyMessage, { 
      fontSize: `${this.gameHeight * 0.03}px`, 
      fill: '#fff',
      align: 'center'
    });
    this.inventoryItemsText.setOrigin(0.5, 0.5);
  }

  updateInventoryDisplay() {
    if (this.inventory.length === 0) {
      this.inventoryItemsText.setText(inventoryEmptyMessage);
    } else {
      this.inventoryItemsText.setText('Your inventory: ' + this.inventory.join(', '));
    }
  }

  addToInventory(item) {
    this.inventory.push(item);
    this.updateInventoryDisplay();
  }

  setupNavigationArrows() {
    const arrowSize = this.gameHeight * 0.1;
    const arrowPadding = this.gameWidth * 0.05;

    this.leftArrow = this.add.triangle(arrowPadding + arrowSize / 2, this.gameHeight / 2, 0, arrowSize / 2, arrowSize * 0.866, 0, arrowSize * 0.866, arrowSize, 0xffffff);
    this.rightArrow = this.add.triangle(this.gameWidth - arrowPadding - arrowSize / 2, this.gameHeight / 2, 0, 0, arrowSize * 0.866, arrowSize / 2, 0, arrowSize, 0xffffff);

    this.makeInteractive(this.leftArrow, () => this.turnLeft());
    this.makeInteractive(this.rightArrow, () => this.turnRight());
  }

  makeInteractive(object, clickHandler) {
    object.setInteractive({ useHandCursor: true });
    object.on('pointerdown', clickHandler.bind(this));
    object.on('pointerover', () => {
      this.input.setDefaultCursor('pointer');
    });
    object.on('pointerout', () => {
      this.input.setDefaultCursor('default');
    });
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
  }

  setupZoomableObjects() {
  }

  zoomInAddInventory(object) {
    const { width, height } = this.scale;
    
    const zoomedObject = this.add.image(width / 2, (height / 2)+100, object.texture.key);
    zoomedObject.setScale(2);
    zoomedObject.setDepth(1000);
  
    this.time.delayedCall(1500, () => {
      zoomedObject.destroy();
    });
  }

  showCenteredText(message, fontSize, time=5000) {
    if (this.currentText && this.currentText.visible) {
      this.currentText.destroy();
    }
    const { width, height } = this.scale;
    this.currentText = this.add.text(width / 2, height / 2, message, {
      fontSize: `${fontSize}px`,
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(0.5);
  
    const text = this.currentText;
    this.time.delayedCall(time, () => {
      if (text !== this.currentText) return;
      this.currentText.destroy();
    });

    return this.currentText;
  }

  toggleArrows() {
    if (this.leftArrow) {
      this.leftArrow.setVisible(!this.leftArrow.visible);
    }
    if (this.rightArrow) {
      this.rightArrow.setVisible(!this.rightArrow.visible);
    }
  }
}

export default BaseScene;