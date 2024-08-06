import BaseScene from './BaseScene';
import northImage from './assets/lower-class-room-north.png';
import eastImage from './assets/lower-class-room-east.png';
import southImage from './assets/lower-class-room-south.png';
import westImage from './assets/lower-class-room-west.png';
import coinImage from './assets/coin.png';
import jarImage from './assets/jar.png';
import lowerClassFrame1 from './assets/lower-class-frame-1.png';
import lowerClassFrame2 from './assets/lower-class-frame-2.png';

class LowerClassScene extends BaseScene {
  constructor() {
    super('LowerClass', {
      introText: "Experience the daily struggle of a low-income individual\ntrying to make ends meet.",
      showIntro: true,
    });
    this.coinsFound = 0;
    this.coinsNeeded = 20;
    this.jarMoney = 195;
    this.rentDue = 200;
    this.coinLocations = [
      { x: 50, y: 560, scale: [0.06, 0.02], direction: 'north', description: "under the worn-out sofa" },
      { x: 250, y: 450, scale: [0.06, 0.02], direction: 'north', description: "on the sofa" },
      { x: 410, y: 450, scale: [0.02, 0.06], direction: 'north', description: "between the sofa cushions" },
      { x: 350, y: 500, scale: [0.06, 0.02], direction: 'north', description: "on the coffee table" },
      { x: 220, y: 500, scale: [0.06, 0.02], direction: 'north', description: "on the coffee table" },

      { x: 800, y: 620, scale: [0.06, 0.02], direction: 'east', description: "next to the overflowing trash can" },
      { x: 850, y: 450, scale: [0.06, 0.02], direction: 'east', description: "on top of the overflowing trash can" },
      { x: 500, y: 335, scale: [0.06, 0.02], direction: 'east', description: "on the dusty windowsill" },
      { x: 500, y: 630, scale: [0.06, 0.02], direction: 'east', description: "under a pile of unpaid bills" },
      { x: 200, y: 500, scale: [0.06, 0.02], direction: 'east', description: "in the pile of laundry" },
      { x: 150, y: 480, scale: [0.06, 0.02], direction: 'east', description: "in the pile of laundry" },

      { x: 300, y: 450, scale: [0.06, 0.02], direction: 'south', description: "in the corner of the cramped kitchen" },
      { x: 400, y: 350, scale: [0.06, 0.02], direction: 'south', description: "inside an empty cereal box" },
      { x: 770, y: 440, scale: [0.06, 0.02], direction: 'south', description: "with the dirty dishes" },
      { x: 950, y: 443, scale: [0.06, 0.02], direction: 'south', description: "to the right of the dirty dishes" },

      { x: 850, y: 410, scale: [0.06, 0.02], direction: 'west', description: "on the rickety bookshelf" },
      { x: 880, y: 460, scale: [0.06, 0.02], direction: 'west', description: "on the rickety bookshelf" },
      { x: 550, y: 400, scale: [0.02, 0.06], direction: 'west', description: "in a crack in the wall" },
      { x: 300, y: 550, scale: [0.06, 0.02], direction: 'west', description: "in the pile of unpaid bills" },
      { x: 500, y: 540, scale: [0.06, 0.02], direction: 'west', description: "in the pile of unpaid bills" }
    ];
    this.hasJar = false;
    this.rentPaid = false;
  }

  preload() {
    this.load.image('lowerClassRoomNorth', northImage);
    this.load.image('lowerClassRoomEast', eastImage);
    this.load.image('lowerClassRoomSouth', southImage);
    this.load.image('lowerClassRoomWest', westImage);
    this.load.image('lowerClassFrame1', lowerClassFrame1);
    this.load.image('lowerClassFrame2', lowerClassFrame2);
    this.load.image('coin', coinImage);
    this.load.image('jar', jarImage);
  }

  create() {
    super.create();
    this.begun = false;
    this.setupRoom();
    this.setupInteractiveObjects();
    this.updateRoom();
  }

  actuallyBegin() {
    this.begun = true;
    this.showInitialMessage();
    this.setupInteractiveObjects();
    this.updateRoom();
  }

  setupRoom() {
    const { width, height } = this.scale;
    this.roomImages = {
      north: this.add.image(width / 2, height / 2, 'lowerClassRoomNorth'),
      east: this.add.image(width / 2, height / 2, 'lowerClassRoomEast'),
      south: this.add.image(width / 2, height / 2, 'lowerClassRoomSouth'),
      west: this.add.image(width / 2, height / 2, 'lowerClassRoomWest')
    };

    Object.values(this.roomImages).forEach(image => {
      image.setDisplaySize(width, height);
      image.setDepth(-1);
    });
  }

  updateRoom() {
    Object.keys(this.roomImages).forEach(direction => {
      this.roomImages[direction].setVisible(direction === this.currentDirection);
    });
    this.updateInteractiveObjects();
  }

  setupInteractiveObjects() {
    if (!this.begun) return;
    this.jar = this.add.image(700, 500, 'jar').setScale(0.5);
    this.makeInteractive(this.jar, this.pickUpJar);

    this.rentNotice = this.add.rectangle(330, 180, 260, 180, 0, 0);
    this.makeInteractive(this.rentNotice, this.checkRentNotice);

    this.door = this.add.rectangle(852, 300, 260, 500, 0, 0);
    this.makeInteractive(this.door, this.tryToLeaveDoor);

    this.frame1 = this.add.image(500, 180, 'lowerClassFrame1').setScale(1.2);
    this.frame2 = this.add.image(330, 180, 'lowerClassFrame2').setScale(0.5);

    this.coins = this.coinLocations.map(location => {
      const coin = this.add.image(location.x, location.y, 'coin').setScale(location.scale[0], location.scale[1]);
      this.makeInteractive(coin, () => this.pickUpCoin(coin, location.description));
      return coin;
    });

    this.updateInteractiveObjects();
  }

  updateInteractiveObjects() {
    if (!this.begun) return;
    this.jar.setVisible(this.currentDirection === 'east' && !this.hasJar);
    this.rentNotice.setVisible(this.currentDirection === 'west');
    this.door.setVisible(this.currentDirection === 'north');
    this.frame1.setVisible(this.currentDirection === 'south');
    this.frame2.setVisible(this.currentDirection === 'north');
    this.coins.forEach((coin, index) => {
      coin.setVisible(this.coinLocations[index].direction === this.currentDirection && !coin.pickedUp);
    });
  }

  showInitialMessage() {
    this.showCenteredText(
      "You're $5 short on rent this month.\nSearch the apartment for spare change.\nEvery quarter counts!",
      24,
      5000
    );
  }

  pickUpCoin(coin, description) {
    if (coin.pickedUp) return;
    
    coin.pickedUp = true;
    this.coinsFound++;
    coin.setVisible(false);
    
    this.showCenteredText(`You found a quarter ${description}!\nCoins found: $${(this.coinsFound * 0.25).toFixed(2)}`, 24, 2000);
    
    if (this.coinsFound === this.coinsNeeded) {
      this.time.delayedCall(2500, () => {
        this.showCenteredText("You've found enough coins!\nGrab the jar and pay the rent.", 24, 3000);
      });
    }
  }

  pickUpJar() {
    if (this.coinsFound < this.coinsNeeded) {
      this.showCenteredText("I need to find more coins before taking the jar.", 24, 2000);
      return;
    }
    
    this.hasJar = true;
    this.jar.setVisible(false);
    this.addToInventory('Jar with rent money');
    this.showCenteredText("You picked up the jar.\nTime to pay the rent!", 24, 2000);
  }

  checkRentNotice() {
    const remainingRent = this.rentDue - this.jarMoney - (this.coinsFound * 0.25);
    if (remainingRent > 0) {
      this.showCenteredText(`Rent due: $${this.rentDue}\nCurrent savings: $${this.jarMoney.toFixed(2)}\nCoins found: $${(this.coinsFound * 0.25).toFixed(2)}\nStill needed: $${remainingRent.toFixed(2)}`, 24, 4000);
    } else {
      this.showCenteredText("I finally have enough to pay the rent.\nLet's not think about next month for now...", 24, 3000);
    }
  }

  tryToLeaveDoor() {
    if (!this.hasJar) {
      this.showCenteredText("I can't leave without the rent money.", 24, 2000);
      return;
    }
    
    if (this.coinsFound < this.coinsNeeded) {
      this.showCenteredText("I don't have enough money yet.\nI need to keep searching for coins.", 24, 2500);
      return;
    }
    

    this.rentPaid = true;
    this.showCenteredText("You've paid the rent just in time!\nBut next month is just around the corner...", 24, 4000);
    this.time.delayedCall(4500, () => {
      const { width, height } = this.sys.game.config;
      const blackBg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000);
      blackBg.setDepth(1000);
      blackBg.setAlpha(0);
  
      const text = this.add.text(width / 2, height / 2, 
        "You've now experienced a small taste of the different financial challenges\nfaced by various income classes.\n\nThank you for participating.\n\nBy Stephanie Leung", 
        { 
          fontFamily: 'Arial', 
          fontSize: '24px', 
          color: '#FFFFFF',
          align: 'center',
          wordWrap: { width: width - 100 }
        }
      );
      text.setOrigin(0.5);
      text.setDepth(1001);
      text.setAlpha(0);
  
      this.tweens.add({
        targets: [blackBg, text],
        alpha: 1,
        duration: 2000,
        ease: 'Power2'
      });
    });
  }
}

export default LowerClassScene;