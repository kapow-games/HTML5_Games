'use strict';
// var WebFontConfig = {
//   google: {
//     families: ['Rajdhani']
//   }
// };

var phaserGame = new Phaser.Game(360, 592, Phaser.AUTO, 'tic-tac-toe');
phaserGame.state.add('boot', boot);
phaserGame.state.add('gameover', gameover);
phaserGame.state.add('menu', menu);
phaserGame.state.add('play', play);
phaserGame.state.add('preload', preload);
phaserGame.state.add('select', select);
phaserGame.state.start('boot');
