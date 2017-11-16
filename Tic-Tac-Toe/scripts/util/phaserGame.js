import {Boot} from '../states/boot';
import {Preload} from '../states/preload';
import {Menu} from '../states/menu';
import {Waiting} from '../states/waiting';
import {Play} from '../states/play';
import {PlayLoad} from '../states/playLoad';
import {Select} from '../states/select';


export class PhaserGame extends Phaser.Game {
    constructor(width, height, container) {

        super(width, height, Phaser.CANVAS, container);

        this.state.add('boot', Boot);
        this.state.add('menu', Menu);
        this.state.add('waiting', Waiting);
        this.state.add('play', Play);
        this.state.add('playLoad', PlayLoad);
        this.state.add('preload', Preload);
        this.state.add('select', select);
    }
}