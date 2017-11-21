'use strict';

// TODO : @mayank avoid extra lines use CMD+ALT+L to do default formatting

export class Boot extends Phaser.State {
    preload() {
        this.load.image("loading","assets/images/loading.png");
    }
    create() {
        // this.stage.disableVisibilityChange = true;

        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        // this.scale.isPortrait = false;
        this.scale.forceOrientation(false, true);
        // this.scale.setScreenSize();
        this.input.maxPointers = 1;
        this.state.start('preload');
    }
}