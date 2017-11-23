'use strict';
var phaserManager = {
    createText: function (phaserGameObj, obj) { // TODO : @mayank the argument name should be better,  avoid using phaser keyword
        let _positionX = obj.positionX; // TODO @mayank : why creating so many variables ? use inline vars ,
        let _positionY = obj.positionY;
        let _displayMessage = obj.messageToDisplay;// TODO : rename to displayMessage
        let textStyle = {
            font: obj.font,
            fontSize: obj.fontSize,
            align: obj.align,
            fill: obj.fill,
            fontWeight: obj.fontWeight,
            wordWrapWidth: obj.wordWrapWidth,
            backgroundColor: obj.backgroundColor
        };
        let _anchorX;
        let _anchorY;
        _anchorX = (obj.anchorX === undefined ) ? 0 : obj.anchorX;
        _anchorY = (obj.anchorY === undefined ) ? 0 : obj.anchorY;

        var text = phaserGameObj.add.text(_positionX, _positionY, _displayMessage, textStyle);
        text.anchor.setTo(_anchorX, _anchorY);
        return text;
    },
    addSprite: function (obj, posX, posY, key, anchorX, anchorY) { // TODO : is this function being used anywhere ?
        let phaserItem = obj.add.sprite(posX, posY, key);
        phaserItem.anchor.setTo(anchorX, anchorY);
    },
    destroySprite: function (obj) {
        obj.destroy();
    },
    addImage: function (phaserGameObj, obj) {
        let _posX = obj.posX; // TODO : avoid creating redundant vars
        let _posY = obj.posY;
        let _label = obj.label;
        let _anchorX = obj.anchorX;
        let _anchorY = obj.anchorY;
        var image = phaserGameObj.add.image(_posX, _posY, _label);
        image.anchor.setTo(_anchorX, _anchorY);
        return image;
    }
};

export default phaserManager;