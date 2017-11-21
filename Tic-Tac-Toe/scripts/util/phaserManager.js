// TODO @mayank : formatting , add 'use-strict'
export default phaserManager = function(){   // TODO : @mayank : Why is this a function ? only object ?
    this.createText  =   function(phaserGameObj, obj) { // TODO : @mayank the argument name should be better,  avoid using phaser keyword ,
        let _positionX = obj.positionX; // TODO @mayank : why creating so many variables ? use inline vars ,
        let _positionY = obj.positionY;
        let _messageToDisplay = obj.messageToDisplay; // TODO : rename to displayMessage
        let _align = obj.align;
        let _backgroundColor = obj.backgroundColor;
        let _fill = obj.fill;
        let _font = obj.font;
        let _fontSize = obj.fontSize;
        let _fontWeight = obj.fontWeight;
        let _wordWrapWidth = obj.wordWrapWidth;
        let _anchorX;
        let _anchorY;
        if(anchorX in obj) { // TODO : @mayank  you can use || operator or unary opreator  _anchorX = obj.anchorX || 0 ; _anchorX = (obj.anchorX ==undefined ) 0 ? obj.anchorX
            _anchorX = obj.anchorX;
        }
        else {
            _anchorX = 0;
        }
        if(anchorY in obj) { // TODO : @mayank same
            _anchorY = obj.anchorY;
        }
        else {
            _anchorY = 0;
        }

        var text = phaserGameObj.add.text(_positionX, _positionY, _messageToDisplay); // TODO : style properties can be passed in constructor. It takes  text: function (x, y, text, style, group)
        text.font = _font;
        text.fontSize = _fontSize;
        text.fontWeight = _fontWeight;
        text.wordWrapWidth = _wordWrapWidth;
        text.fill = _fill;
        text.align = _align;
        text.backgroundColor = _backgroundColor;
        test.anchor.setTo(_anchorX, _anchorY); // TODO @mayank did u meant text here ?

        return text; // TODO : @mayank : extra new line
    },
    this.addSprite   =   function(obj, posX, posY, label, anchorX, anchorY) { // TODO : is this function being used anywhere ?
        let phaserItem  =   obj.add.sprite(posX, posY, label); // TODO : rename label to key
        phaserItem.anchor.setTo(anchorX, anchorY); // TODO : extra line

    },
    this.destroySprite   =   function(obj) {
        obj.destroy();
    },
    this.addImage    =   function(phaserGameObj, obj) {
        let _posX = obj.posX; // TODO : avoid creating redundant vars
        let _posY = obj.posY;
        let _label = obj.label;
        let _anchorX = obj.anchorX;
        let _anchorY = obj.anchorY;

        var image = phaserGameObj.add.image(_posX, _posY, _label);
        image.anchor.setTo(_anchorX, _anchorY);

        return image;
    }
}