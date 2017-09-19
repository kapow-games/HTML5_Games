'use strict';
// var WebFontConfig = {
//   google: {
//     families: ['Rajdhani']
//   }
// };

var phaserGame = new Phaser.Game(1080, 1920, Phaser.CANVAS, 'tic-tac-toe');

phaserGame.state.add('boot', boot);
phaserGame.state.add('menu', menu);
phaserGame.state.add('waiting', waiting);
phaserGame.state.add('play', play);
phaserGame.state.add('preload', preload);
phaserGame.state.add('select', select);

// phaserGame.state.start('boot');
