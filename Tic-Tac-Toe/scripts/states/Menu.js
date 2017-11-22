'use strict';
import globalVariableInstance from '../objects/gameGlobalVariables'
import Background from '../objects/Background';
import Logo from '../objects/Logo';
import OnGoingGameButton from '../objects/OnGoingGameButton';
import StartNewGameBottomSlider from '../objects/StartNewGameBottomSlider';
import VsFriendGameButton from '../objects/VsFriendGameButton';
import VsRandomGameButton from '../objects/VsRandomGameButton';
import VsBotGameButton from '../objects/VsBotGameButton';
import StartNewGameTopButton from '../objects/StartNewGameTopButton';
import StatsButton from "../objects/StatsButton";
import LeaderboardButton from "../objects/LeaderboardButton";
import HelpButton from "../objects/HelpButton";
import BackButton from "../objects/BackButton";
import MusicButton from "../objects/MusicButton";

export class Menu extends Phaser.State { // TODO : formatting ?
    create() {
        globalVariableInstance.set("screenState", 0);
        this.bg = new Background({
            phaserGameObj: this.game, // TODO : rename key to just game ?
            posX: 0,
            posY: 0,
            label: 'arena',
            anchorX: 0,
            anchorY: 0
        });

        this.logo = new Logo({
            phaserGameObj: this.game,
            posX: 165,
            posY: 285,
            label: 'logo',
            anchorX: 0,
            anchorY: 0
        });

        this.activeGames = new OnGoingGameButton({ // TODO : Should the class be named to Active game Button or viceversa ?
            phaserGameObj: this.game,
            posX: 48,
            posY: 768,
            label: 'onGoing',
            anchorX: 0,
            anchorY: 0,
            overFrame: 0,
            outFrame: 0,
            downFrame: 1,
            upFrame: 0
        });


        this.startNewGameBottom = new StartNewGameBottomSlider({ // TODO : rename it to NewGameButton and this.newGameButton
            phaserGameObj: this.game,
            posX: 48,
            posY: 1020,
            label: 'newGameBottom',
            anchorX: 0,
            anchorY: 0,
            frame: 0
        });

        this.gameModeFriend = new VsFriendGameButton({
            phaserGameObj: this.game,
            posX: 48,
            posY: 1020,
            label: 'gameModes',
            anchorX: 0,
            anchorY: 0,
            overFrame: 0,
            outFrame: 0,
            downFrame: 0,
            upFrame: 0,
            inputEnabled: false
        });

        this.gameModeRandom = new VsRandomGameButton({
            phaserGameObj: this.game,
            posX: 48,
            posY: 1020,
            label: 'gameModes',
            anchorX: 0,
            anchorY: 0,
            overFrame: 1,
            outFrame: 1,
            downFrame: 1,
            upFrame: 1,
            inputEnabled: false
        });

        this.gameModeSolo = new VsBotGameButton({
            phaserGameObj: this.game,
            posX: 48,
            posY: 1020,
            label: 'gameModes',
            anchorX: 0,
            anchorY: 0,
            overFrame: 2,
            outFrame: 2,
            downFrame: 2,
            upFrame: 2,
            inputEnabled: false
        });

        this.arrowRight = this.add.sprite(972, 1062, 'arrowRight');
        this.arrowRight.anchor.setTo(0.5, 0.5);

        this.stats = new StatsButton({
            phaserGameObj: this.game,
            posX: 48,
            posY: 1182,
            label: 'stats',
            anchorX: 0,
            anchorY: 0,
            overFrame: 0,
            outFrame: 0,
            downFrame: 1,
            upFrame: 0,
            bg: this.bg
        });

        this.leaderboard = new LeaderboardButton({
            phaserGameObj: this.game,
            posX: 48,
            posY: 1368,
            label: 'leaderBoard',
            anchorX: 0,
            anchorY: 0,
            overFrame: 0,
            outFrame: 0,
            downFrame: 1,
            upFrame: 0
        });

        this.startNewGameTop = new StartNewGameTopButton({
            phaserGameObj: this.game,
            posX: 48,
            posY: 996,
            label: 'newGameTop',
            anchorX: 0,
            anchorY: 0,
            overFrame: 0,
            outFrame: 0,
            downFrame: 1,
            upFrame: 0,
            startNewGameBottomSlider: this.startNewGameBottom,
            arrowObj: this.arrowRight,
            stats: this.stats,
            leaderboard: this.leaderboard,
            startNewGameBottom: this.startNewGameBottom,
            gameModeFriend: this.gameModeFriend,
            gameModeRandom: this.gameModeRandom,
            gameModeSolo: this.gameModeSolo
        });

        this.backButton = new BackButton({
            phaserGameObj: this.game,
            posX: 48,
            posY: 96,
            label: 'back',
            anchorX: 0,
            anchorY: 0,
            callback: this.backButtonHandler.bind(this)
        });

        this.musicButton = new MusicButton({
            phaserGameObj: this.game,
            posX: 960,
            posY: 96,
            label: 'music',
            anchorX: 0,
            anchorY: 0,
        });

        this.helpButton = new HelpButton({
            phaserGameObj: this.game,
            posX: 840,
            posY: 96,
            label: 'help',
            anchorX: 0,
            anchorY: 0,
        });
    }

    update() {
    }

    backButtonHandler() {
        kapow.close();
    }

}
