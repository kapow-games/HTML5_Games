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

// TODO : @mayank move css + assests into one folder 'static'
// TODO : @mayank this file should look like below. This will avoid script tags

// import Boot from 'states/Boot';
// import Preload from 'states/Preload';
// import GameTitle from 'states/GameTitle';
// import Main from 'states/Main';
// import GameOver from 'states/GameOver';
//
// class Game extends Phaser.Game {
//
//     constructor() {
//
//         super(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO);
//
//         this.state.add('Boot', Boot, false);
//         this.state.add('Preload', Preload, false);
//         this.state.add('GameTitle', GameTitle, false);
//         this.state.add('Main', Main, false);
//         this.state.add('GameOver', GameOver, false);
//
//         this.state.start('Boot');
//     }
//
// }
//
// new Game();