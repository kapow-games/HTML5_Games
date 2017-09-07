var gameover = function() {};

gameover.prototype = {
  preload: function () {
    screenState=0;
  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    // var style = { font: '65px Arial', align: center, fill: linear-gradient(181deg, #3e81ff, #7b34e6)};
    this.titleText = this.add.text(this.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);
    if(win !== 0) {
      this.congratsText = this.add.text(this.world.centerX, 200, 'Payer'+win+' Won!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
      this.congratsText.anchor.setTo(0.5, 0.5);
    }
    else {
      this.congratsText = this.add.text(this.world.centerX, 200, 'Game Draw', { font: '32px Arial', fill: '#ffffff', align: 'center'});
      this.congratsText.anchor.setTo(0.5, 0.5);
    }

    this.instructionText = this.add.text(this.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
    win = 0 ;
    phaserGame.input.onDown.add(function() {
      phaserGame.state.start('menu');
    });
  },
  update: function () {
  }
};
