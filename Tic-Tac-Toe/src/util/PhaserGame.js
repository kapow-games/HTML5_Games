import {Boot} from '../states/Boot';
import {Preload} from '../states/Preload';
import {Menu} from '../states/Menu';
import {Waiting} from '../states/Waiting';
import {Play} from '../states/Play';
import {PlayLoad} from '../states/PlayLoad';
import {Select} from '../states/Select';

export default class PhaserGame extends Phaser.Game { // TODO : @mayank : rename it to just Game ?
    constructor(width, height, container) {
        super(width, height, Phaser.CANVAS, container); // TODO : @mayank new line ?
        this.state.add('Boot', Boot); // ADD state as PascalCase
        this.state.add('Menu', Menu);
        this.state.add('Waiting', Waiting);
        this.state.add('Play', Play);
        this.state.add('PlayLoad', PlayLoad);
        this.state.add('Preload', Preload);
        this.state.add('Select', Select);
    }
}