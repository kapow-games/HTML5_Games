'use strict';
var game = new Phaser.Game(360, 592, Phaser.AUTO, 'tic-tac-toe');

game.state.add('boot', boot);
game.state.add('gameover', gameover);
game.state.add('menu', menu);
game.state.add('play', play);
game.state.add('preload', preload);


game.state.start('boot');
