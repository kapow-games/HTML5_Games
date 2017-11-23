'use strict';
import PhaserGame from './util/PhaserGame';

var phaserGame = new PhaserGame(1080, 1920, 'tic-tac-toe');

var WebFontConfig = {
    active: function () {
        phaserGame.time.events.add(Phaser.Timer.SECOND, createText, this);
    }
};