export default phaserManager = function(){
    this.createText  =   function(phaserGameObj, obj) {
        let _positionX = obj.positionX;
        let _positionY = obj.positionY;
        let _messageToDisplay = obj.messageToDisplay;
        let _align = obj.align;
        let _backgroundColor = obj.backgroundColor;
        let _fill = obj.fill;
        let _font = obj.font;
        let _fontSize = obj.fontSize;
        let _fontWeight = obj.fontWeight;
        let _wordWrapWidth = obj.wordWrapWidth;
        let _anchorX;
        let _anchorY;
        if(anchorX in obj) {
            _anchorX = obj.anchorX;
        }
        else {
            _anchorX = 0;
        }
        if(anchorY in obj) {
            _anchorY = obj.anchorY;
        }
        else {
            _anchorY = 0;
        }

        var text = phaserGameObj.add.text(_positionX, _positionY, _messageToDisplay);
        text.font = _font;
        text.fontSize = _fontSize;
        text.fontWeight = _fontWeight;
        text.wordWrapWidth = _wordWrapWidth;
        text.fill = _fill;
        text.align = _align;
        text.backgroundColor = _backgroundColor;
        test.anchor.setTo(_anchorX, _anchorY);

        return text;
    },
    this.addSprite   =   function(obj, posX, posY, label, anchorX, anchorY) {
        let phaserItem  =   obj.add.sprite(posX, posY, label);
        phaserItem.anchor.setTo(anchorX, anchorY);

    },
    this.destroySprite   =   function(obj) {
        obj.destroy();
    },
    this.addImage    =   function(phaserGameObj, obj) {
        let _posX = obj.posX;
        let _posY = obj.posY;
        let _label = obj.label;
        let _anchorX = obj.anchorX;
        let _anchorY = obj.anchorY;

        var image = phaserGameObj.add.image(_posX, _posY, _label);
        image.anchor.setTo(_anchorX, _anchorY);

        return image;
    }
}