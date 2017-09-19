'use strict';
var waiting = function() {};
waiting.prototype = {
  create: function() {
    screenState = 0 ;
    this.bg = this.add.image(0, 0, 'arena');
    this.logo = this.add.image(165, 285, 'logo');
    this.logo.anchor.setTo(0, 0);
    this.add.text(165, 385,'Waiting for opponent');
  },
  update: function() {
    
  },
};
