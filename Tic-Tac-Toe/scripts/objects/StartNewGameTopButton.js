export default class StartNewGameTopButton extends Phaser.Button {
    constructor(obj) {
        let _phaserGameObj = obj.phaserGameObj;
        let _posX = obj.posX;
        let _posY = obj.posY;
        let _label = obj.label;
        let _anchorX = obj.anchorX;
        let _anchorY = obj.anchorY;
        let _overFrame = obj.overFrame;
        let _outFrame = obj.outFrame;
        let _downFrame = obj.downFrame;
        let _upFrame = obj.upFrame;
        let _arrowObj = obj.arrowObj;
        let _leaderboard = obj.leaderboard;
        let _stats = obj.stats;
        let _startNewGameBottom = obj.startNewGameBottom;
        let _gameModeFriend = obj.gameModeFriend;
        let _gameModeRandom = obj.gameModeRandom;
        let _gameModeSolo = obj.gameModeSolo;

        super(_phaserGameObj, _posX, _posY, _label, () => this.buttonHandler, () => this, _overFrame, _outFrame, _downFrame, _upFrame);

        this.slideDirection = 0;
        this.startNewGameBottomSlider = obj.startNewGameBottom;
        this.anchor.setTo(_anchorX, _anchorY);
        this.onInputDown.add(this.startNewGameTopInputDown, this);
        this.onInputUp.add(this.startNewGameTopInputUp, this);
        this.onInputOut.add(this.startNewGameTopInputUp, this);

        //Animation
        this.arrowRotateRightToDown = _phaserGameObj.add.tween(_arrowObj).to({angle: 90}, 200, Phaser.Easing.Linear.None);
        this.arrowRotateDownToRight = _phaserGameObj.add.tween(_arrowObj).to({angle: 0}, 200, Phaser.Easing.Linear.None);

        this.slideStatsDown = this.add.tween(_stats).to({y: 1314}, 300, "Quart.easeOut");
        this.slideLeaderboardDown = this.add.tween(_leaderboard).to({y: 1500}, 300, "Quart.easeOut");

        this.slideStatsUp = this.add.tween(_stats).to({y: 1182}, 300, "Quart.easeOut");
        this.slideLeaderboardUp = this.add.tween(_leaderboard).to({y: 1368}, 300, "Quart.easeOut");
        this.slideNewGameBottomDown = this.add.tween(_startNewGameBottom).to({y: 1104}, 300, "Quart.easeOut");
        this.slideNewGameBottomUp = this.add.tween(_startNewGameBottom).to({y: 1020}, 300, "Quart.easeOut");
        this.slideGameModeFriendDown = this.add.tween(_gameModeFriend).to({y: 1104}, 300, "Quart.easeOut");
        this.slideGameModeFriendUp = this.add.tween(_gameModeFriend).to({y: 1020}, 300, "Quart.easeOut");
        this.slideGameModeRandomDown = this.add.tween(_gameModeRandom).to({y: 1104}, 300, "Quart.easeOut");
        this.slideGameModeRandomUp = this.add.tween(_gameModeRandom).to({y: 1020}, 300, "Quart.easeOut");
        this.slideGameModeSoloDown = this.add.tween(_gameModeSolo).to({y: 1104}, 300, "Quart.easeOut");
        this.slideGameModeSoloUp = this.add.tween(_gameModeSolo).to({y: 1020}, 300, "Quart.easeOut");
    }

    startNewGameTopInputDown() {
        this.startNewGameBottomSlider.frame = 1;
    }

    startNewGameTopInputUp() {
        this.startNewGameBottomSlider.frame = 0;
    }

    buttonHandler() {
        console.log('New Game Button Clicked');
        if (this.slideDirection === 0) {
            this.arrowRotateRightToDown.start();
            this.slideNewGameBottomDown.start();
            this.slideGameModeSoloDown.start();
            this.slideGameModeRandomDown.start();
            this.slideGameModeFriendDown.start();
            this.slideStatsDown.start();
            this.slideLeaderboardDown.start();
            this.gameModeSolo.inputEnabled = true;
            this.gameModeFriend.inputEnabled = true;
            this.gameModeRandom.inputEnabled = true;
        }
        else {
            this.arrowRotateDownToRight.start();
            this.slideGameModeFriendUp.start();
            this.slideGameModeRandomUp.start();
            this.slideGameModeSoloUp.start();
            this.slideNewGameBottomUp.start();
            this.slideLeaderboardUp.start();
            this.slideStatsUp.start();
            this.gameModeSolo.inputEnabled = false;
            this.gameModeRandom.inputEnabled = false;
            this.gameModeFriend.inputEnabled = false;
        }
        this.slideDirection = (this.slideDirection + 1) % 2;
    }
}