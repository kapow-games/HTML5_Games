var game = function(game) {};
game.prototype = {
  create: function(){
    var gameTitle = this.game.add.sprite(160,160,"ball");
    gameTitle.anchor.setTo(0.5,0.5);
    console.log("Done");
  }
};
