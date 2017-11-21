import {Boot} from '../states/boot';
import {Preload} from '../states/preload';
import {Menu} from '../states/menu';
import {Waiting} from '../states/waiting';
import {Play} from '../states/play';
import {PlayLoad} from '../states/playLoad';
import {Select} from '../states/select'; // TODO @mayank : remove unused importes

// TODO : @mayank : file name and class name should be exactly same
export class PhaserGame extends Phaser.Game { // TODO : @mayank : rename it to just Game ?
    constructor(width, height, container) {

        super(width, height, Phaser.CANVAS, container); // TODO : @mayank new line ?

        this.state.add('boot', Boot); // ADD state as PascalCase
        this.state.add('menu', Menu);
        this.state.add('waiting', Waiting);
        this.state.add('play', Play);
        this.state.add('playLoad', PlayLoad);
        this.state.add('preload', Preload);
        this.state.add('select', select); // TODO : @maynak : importing as "Select" and adding as 'select' . Add State with same name as file name
    }
}