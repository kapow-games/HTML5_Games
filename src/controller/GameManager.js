"use strict";

import PhaserGame from '../PhaserGame';
import handleGameEnd from '../util/gameEnd';

let GameManager = {
    createGame() {
        this.game = new PhaserGame(1080, 1920, 'tic-tac-toe');
    },
    startGame() {
        this.game.state.start('Boot');
    },
    endGame(value) {
        handleGameEnd(this.game, value);
    },
    startState(state) {
        this.game.state.start(state);
    }
};

export default GameManager;
