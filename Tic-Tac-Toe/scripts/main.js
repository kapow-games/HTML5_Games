// TODO : @mayank : use .gitignore to avoid commiting your .idea and .iml local files
'use strict';
var phaserGame = new Phaser.Game(1080, 1920, Phaser.CANVAS, 'tic-tac-toe');

phaserGame.state.add('boot', boot);
phaserGame.state.add('menu', menu);
phaserGame.state.add('waiting', waiting);
phaserGame.state.add('play', play);
phaserGame.state.add('playLoad', playLoad);
phaserGame.state.add('preload', preload);
phaserGame.state.add('select', select);
