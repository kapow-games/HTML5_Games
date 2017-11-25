'use strict';
var phaserManager = {
    createText: function (game, obj) { // TODO : @mayank the argument name should be better,  avoid using phaser keyword
        // TODO @mayank : why creating so many variables ? use inline vars ,
        // TODO : rename to displayMessage
        let textStyle = {
            font: obj.font,
            fontSize: obj.fontSize,
            align: obj.align,
            fill: obj.fill,
            fontWeight: obj.fontWeight,
            wordWrapWidth: obj.wordWrapWidth,
            backgroundColor: obj.backgroundColor
        };

        let _anchorX = (obj.anchorX === undefined ) ? 0 : obj.anchorX;
        let _anchorY = (obj.anchorY === undefined ) ? 0 : obj.anchorY;

        let text = game.add.text(obj.positionX, obj.positionY, obj.messageToDisplay, textStyle);
        text.anchor.setTo(_anchorX, _anchorY);

        return text;
    },
    // TODO : is this function being used anywhere ?
};

export default phaserManager;