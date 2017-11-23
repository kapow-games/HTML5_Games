'use strict';

import globalVariableInstance from '../objects/store/gameGlobalVariables'
import Background from '../objects/widgets/icons/Background';
import Logo from '../objects/widgets/icons/Logo';
import OnGoingGameButton from '../objects/widgets/button/OnGoingGameButton';
import StartNewGameBottomSlider from '../objects/widgets/icons/StartNewGameBottomSlider';
import VsFriendGameButton from '../objects/widgets/button/VsFriendGameButton';
import VsRandomGameButton from '../objects/widgets/button/VsRandomGameButton';
import VsBotGameButton from '../objects/widgets/button/VsBotGameButton';
import StartNewGameTopButton from '../objects/widgets/button/StartNewGameTopButton';
import StatsButton from "../objects/widgets/button/StatsButton";
import LeaderboardButton from "../objects/widgets/button/ScoreboardButton";
import HelpButton from "../objects/widgets/button/HelpButton";
import BackButton from "../objects/widgets/button/BackButton";
import MusicButton from "../objects/widgets/button/MusicButton";

export class Menu extends Phaser.State { // TODO : formatting ?
    create() {
        console.log("Loading Menu.");
        globalVariableInstance.set("screenState", 0);
        this.bg = new Background({
            game: this.game, // TODO : rename key to just game ?
            posX: 0,
            posY: 0,
            label: 'arena',
            anchorX: 0,
            anchorY: 0
        });
        // this.bg = this.game.add.image(0,0,'arena');

        this.logo = new Logo({
            game: this.game,
            posX: 165,
            posY: 285,
            label: 'logo',
            anchorX: 0,
            anchorY: 0
        });

        this.onGoingGame = new OnGoingGameButton({ // TODO : Should the class be named to Active game Button or viceversa ?
            game: this.game,
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


        this.startNewGameBottom = new StartNewGameBottomSlider({ // TODO : rename it to NewGameButton and this.newGameButton // @sukhmeet there are two copies of newGameButton. (one underlying the other)
            game: this.game,
            posX: 48,
            posY: 1020,
            label: 'newGameBottom',
            anchorX: 0,
            anchorY: 0,
            frame: 0
        });

        this.gameModeFriend = new VsFriendGameButton({
            game: this.game,
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
            game: this.game,
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
            game: this.game,
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
            game: this.game,
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
            game: this.game,
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
            game: this.game,
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
            game: this.game,
            posX: 48,
            posY: 96,
            label: 'back',
            anchorX: 0,
            anchorY: 0,
            callback: this.backButtonHandler.bind(this)
        });

        this.musicButton = new MusicButton({
            game: this.game,
            posX: 960,
            posY: 96,
            label: 'music',
            anchorX: 0,
            anchorY: 0,
        });

        this.helpButton = new HelpButton({
            game: this.game,
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
