'use strict';
import PhaserGame from './util/PhaserGame';
// import {game} from "./external/game.js"

var phaserGame = new PhaserGame(1080, 1920, 'tic-tac-toe');

phaserGame.state.start("boot");

export default phaserGame;