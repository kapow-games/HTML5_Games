var preload = function(game) {
  this.ready = false ;
};
preload.prototype = {
  preload: function() {
    var loadingBar = this.add.sprite(160,240,"loading");
    loadingBar.anchor.setTo(0.5,0.5);
    this.load.setPreloadSprite(loadingBar);
    this.load.image('ball','/img/ball.png');
    this.load.image('brick','/img/brick.png');
  },
  update: function(){
    if(this.ready === true) {
        this.game.state.start('Game');
    }
  }
};
