'use strict';

export class Boot extends Phaser.State {
    preload() {
        this.load.image("loading", "assets/images/loading.png");
    }

    create() {
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.forceOrientation(false, true);
        this.input.maxPointers = 1;
        this.state.start('Preload');
    }
}