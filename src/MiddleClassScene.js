import BaseScene from './BaseScene';
import northImage from './assets/middle-class-room-north.png';
import eastImage from './assets/middle-class-room-east.png';
import southImage from './assets/middle-class-room-south.png';
import westImage from './assets/middle-class-room-west.png';
import checkbookImage from './assets/checkbook.png';
import penImage from './assets/pen.png';
import billsImage from './assets/bills.png';
import middleClassFrame1 from './assets/middle-class-frame-1.png';
import middleClassFrame2 from './assets/middle-class-frame-2.png';

class MiddleClassScene extends BaseScene {
  constructor() {
    super('MiddleClass', {
      introText: "Experience a day in the life of a middle-income family\n managing their finances.",
      showIntro: true,
    });
    this.billList = [
      { amount: 350, paid: false, company: "Electric Co.", memo: "Monthly electricity" },
      { amount: 200, paid: false, company: "Water Works", memo: "Quarterly water bill" },
      { amount: 450, paid: false, company: "Mortgage Inc.", memo: "Monthly mortgage payment" },
      { amount: 300, paid: false, company: "Car Loan Ltd.", memo: "Auto loan installment" },
      { amount: 150, paid: false, company: "Internet Provider", memo: "High-speed internet" },
      { amount: 250, paid: false, company: "Insurance Group", memo: "Home insurance premium" },
      { amount: 100, paid: false, company: "Phone Services", memo: "Family phone plan" },
      { amount: 200, paid: false, company: "Credit Card Bank", memo: "Credit card balance" }
    ];
    this.currentBillIndex = 0;
    this.hasCheckbook = false;
    this.hasPen = false;
  }

  preload() {
    this.load.image('middleClassRoomNorth', northImage);
    this.load.image('middleClassRoomEast', eastImage);
    this.load.image('middleClassRoomSouth', southImage);
    this.load.image('middleClassRoomWest', westImage);
    this.load.image('middleClassFrame1', middleClassFrame1);
    this.load.image('middleClassFrame2', middleClassFrame2);
    this.load.image('checkbook', checkbookImage);
    this.load.image('pen', penImage);
    this.load.image('bills', billsImage);
  }

  create() {
    super.create();
    this.setupRoom();
    this.setupInteractiveObjects();
    this.updateRoom();
  }

  setupRoom() {
    const { width, height } = this.scale;
    this.roomImages = {
      north: this.add.image(width / 2, height / 2, 'middleClassRoomNorth'),
      east: this.add.image(width / 2, height / 2, 'middleClassRoomEast'),
      south: this.add.image(width / 2, height / 2, 'middleClassRoomSouth'),
      west: this.add.image(width / 2, height / 2, 'middleClassRoomWest')
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
    this.checkbook = this.add.image(800, 535, 'checkbook').setScale(0.3);
    this.makeInteractive(this.checkbook, this.pickUpCheckbook);

    this.pen = this.add.image(400, 405, 'pen').setScale(0.5);
    this.makeInteractive(this.pen, this.pickUpPen);

    this.bills = this.add.image(400, 380, 'bills').setScale(0.8);
    this.makeInteractive(this.bills, this.useDesk);

    this.door = this.add.rectangle(812, 370, 280, 550, 0, 0);
    this.makeInteractive(this.door, this.tryToLeaveDoor);

    this.frame1 = this.add.image(560, 250, 'middleClassFrame1').setScale(0.25);
    this.frame2 = this.add.image(530, 190, 'middleClassFrame2').setScale(0.23);

    this.updateInteractiveObjects();
  }

  updateInteractiveObjects() {
    this.checkbook.setVisible(this.currentDirection === 'east' && !this.hasCheckbook);
    this.pen.setVisible(this.currentDirection === 'west' && !this.hasPen);
    this.bills.setVisible(this.currentDirection === 'south');
    this.door.setVisible(this.currentDirection === 'north');
    this.frame1.setVisible(this.currentDirection === 'east');
    this.frame2.setVisible(this.currentDirection === 'south');
  }

  pickUpCheckbook() {
    this.addToInventory('Checkbook');
    this.showCenteredText("You got: Your checkbook!", 24, 1500);
    this.toggleArrows();
    this.time.delayedCall(1500, () => {
      this.toggleArrows();
    });
    this.checkbook.setVisible(false);
    this.hasCheckbook = true;
    this.zoomInAddInventory(this.checkbook);
  }

  pickUpPen() {
    this.addToInventory('Pen');
    this.showCenteredText("You got: A pen!", 24, 1500);
    this.toggleArrows();
    this.time.delayedCall(1500, () => {
      this.toggleArrows();
    });
    this.pen.setVisible(false);
    this.hasPen = true;
    this.zoomInAddInventory(this.pen);
  }

  useDesk() {
    if (!this.hasCheckbook || !this.hasPen) {
      this.showCenteredText("I have 8 bills totaling $2000.\nI need my checkbook and a pen to pay the bills.", 24, 2000);
      return;
    }

    if (this.currentBillIndex >= this.billList.length) {
      this.showCenteredText("All bills are paid.", 24, 1500);
      return;
    }

    this.showCheckbookScreen();
  }

  showCheckbookScreen() {
    const { width, height } = this.scale;
  
    const checkbookBg = this.add.rectangle(width / 2, height / 2, width * 0.8, height * 0.8, 0xF5F5DC);
    checkbookBg.setStrokeStyle(4, 0x000000);
  
    const labelStyle = { fontSize: '18px', fill: '#000000' };
    const buttonStyle = { fontSize: '18px', fill: '#FFFFFF', backgroundColor: '#4CAF50', padding: { x: 10, y: 5 } };
  
    const dateLabel = this.add.text(width * 0.25, height * 0.3, 'Date: ', labelStyle);
    const dateButton = this.add.text(width * 0.4, height * 0.3, 'Set Date', buttonStyle).setInteractive({ useHandCursor: true });
  
    const payToLabel = this.add.text(width * 0.25, height * 0.4, 'Pay to the order of: ', labelStyle);
    const payToButton = this.add.text(width * 0.5, height * 0.4, 'Enter Payee', buttonStyle).setInteractive({ useHandCursor: true });
  
    const amountLabel = this.add.text(width * 0.25, height * 0.5, 'Amount: $', labelStyle);
    const amountButton = this.add.text(width * 0.4, height * 0.5, 'Enter Amount', buttonStyle).setInteractive({ useHandCursor: true });
  
    const memoLabel = this.add.text(width * 0.25, height * 0.6, 'Memo: ', labelStyle);
    const memoButton = this.add.text(width * 0.4, height * 0.6, 'Add Memo', buttonStyle).setInteractive({ useHandCursor: true });
  
    const signatureLabel = this.add.text(width * 0.25, height * 0.7, 'Signature: ', labelStyle);
    const signatureButton = this.add.text(width * 0.4, height * 0.7, 'Sign Check', buttonStyle).setInteractive({ useHandCursor: true });
  
    const submitButton = this.add.text(width * 0.5, height * 0.85, 'Submit Payment', {
      fontSize: '24px',
      fill: '#FFFFFF',
      backgroundColor: '#4CAF50',
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  
    const checkbookGroup = this.add.group([
      checkbookBg, dateLabel, dateButton, payToLabel, payToButton,
      amountLabel, amountButton, memoLabel, memoButton,
      signatureLabel, signatureButton, submitButton,
    ]);
  
    const checkData = {
      date: '',
      payTo: '',
      amount: '',
      memo: '',
      signature: ''
    };
  
    const currentBill = this.billList[this.currentBillIndex];
    const billCountText = this.add.text(width * 0.5, height * 0.2, `Bill ${this.currentBillIndex + 1}/${this.billList.length}`, { fontSize: '24px', fill: '#000000' }).setOrigin(0.5);
  
    dateButton.on('pointerdown', () => {
      checkData.date = new Date().toLocaleDateString();
      dateButton.setText(checkData.date);
    });
  
    payToButton.on('pointerdown', () => {
      checkData.payTo = currentBill.company;
      payToButton.setText(checkData.payTo);
    });
    
    amountButton.on('pointerdown', () => {
      checkData.amount = currentBill.amount.toFixed(2);
      amountButton.setText('$' + checkData.amount);
    });
  
    memoButton.on('pointerdown', () => {
      checkData.memo = currentBill.memo;
      memoButton.setText(checkData.memo);
    });
    
    signatureButton.on('pointerdown', () => {
      checkData.signature = 'Signed';
      signatureButton.setText(checkData.signature);
    });

    this.billPaid = false;
  
    submitButton.on('pointerdown', () => {
      if (!checkData.date || !checkData.payTo || !checkData.amount || !checkData.signature) {
        this.showCenteredText("I need to finish filling in the bill first.", 24, 1500);
        return;
      }
      if (this.billPaid) {
        return;
      }
      this.billPaid = true;

  
      currentBill.paid = true;
      this.currentBillIndex++;

      if (this.currentBillIndex < this.billList.length) {
        this.showCenteredText("Great! On to the next bill.", 24, 1500);
        this.time.delayedCall(1500, () => {
          checkbookGroup.destroy(true);
          billCountText.destroy();
          this.showCheckbookScreen();
          this.toggleArrows();
        }, [], this);
      } else {
        this.showCenteredText("All bills paid! Phew. It's done.", 24, 3000);
        this.time.delayedCall(3000, () => {
          checkbookGroup.destroy(true);
          billCountText.destroy();
          this.toggleArrows();
          this.updateRoom();
        }, [], this);
      }
    });
  
    Object.values(this.roomImages).forEach(image => image.setVisible(false));
    this.frame1.setVisible(false);
    this.frame2.setVisible(false);
    this.toggleArrows();
  }

  tryToLeaveDoor() {
    if (this.currentBillIndex >= this.billList.length) {
      this.showCenteredText("Bills paid. Time to head out.", 24, 1500);
      this.time.delayedCall(1500, () => {
        this.scene.start('LowerClass');
      });
    } else {
      this.showCenteredText("I need to pay all the bills before leaving.", 24, 1500);
    }
  }
}

export default MiddleClassScene;