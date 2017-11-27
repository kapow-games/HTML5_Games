'use strict';

import gameInfo from '../objects/store/GameInfoStore'
import Background from '../objects/widgets/icons/Background';
import Logo from '../objects/widgets/icons/Logo';
import OnGoingGameButton from '../objects/widgets/button/OnGoingGameButton';
import StartNewGameBottomSlider from '../objects/widgets/icons/StartNewGameBottomSlider';
import VsFriendGameButton from '../objects/widgets/button/VsFriendGameButton';
import VsRandomGameButton from '../objects/widgets/button/VsRandomGameButton';
import VsBotGameButton from '../objects/widgets/button/VsBotGameButton';
import StartNewGameTopButton from '../objects/widgets/button/StartNewGameTopButton';
import StatsButton from "../objects/widgets/button/StatsButton";
import ScoreboardButton from "../objects/widgets/button/ScoreboardButton";
import HelpButton from "../objects/widgets/button/HelpButton";
import BackButton from "../objects/widgets/button/BackButton";
import MusicButton from "../objects/widgets/button/MusicButton";

export class Menu extends Phaser.State {
    create() {
        console.log("Loading Menu.");
        gameInfo.set("screenState", 0);
        this.bg = new Background({
            game: this.game,
            posX: 0,
            posY: 0,
            label: 'arena',
            anchorX: 0,
            anchorY: 0
        });
        this.game.stage.addChild(this.bg);
        this.logo = new Logo({
            game: this.game,
            posX: 165,
            posY: 285,
            label: 'logo',
            anchorX: 0,
            anchorY: 0
        });
        this.game.stage.addChild(this.logo);
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
        this.game.stage.addChild(this.onGoingGame);

        this.startNewGameBottom = new StartNewGameBottomSlider({ // TODO : rename it to NewGameButton and this.newGameButton // @sukhmeet there are two copies of newGameButton. (one underlying the other)
            game: this.game,
            posX: 48,
            posY: 1020,
            label: 'newGameBottom',
            anchorX: 0,
            anchorY: 0,
            frame: 0
        });
        this.game.stage.addChild(this.startNewGameBottom);
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
        this.game.stage.addChild(this.gameModeFriend);
        this.gameModeRandom = new VsRandomGameButton({
            game: this.game,
            posX: 375,
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
        this.game.stage.addChild(this.gameModeRandom);
        this.gameModeSolo = new VsBotGameButton({
            game: this.game,
            posX: 702,
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
        this.game.stage.addChild(this.gameModeSolo);
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
        this.game.stage.addChild(this.stats);
        this.scoreboard = new ScoreboardButton({
            game: this.game,
            posX: 48,
            posY: 1368,
            label: 'leaderBoard',
            anchorX: 0,
            anchorY: 0,
            overFrame: 0,
            outFrame: 0,
            downFrame: 1,
            upFrame: 0,
            inputEnabled: true
        });
        this.game.stage.addChild(this.scoreboard);
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
            // arrowObj: this.arrowRight,
            stats: this.stats,
            scoreboard: this.scoreboard,
            startNewGameBottom: this.startNewGameBottom,
            gameModeFriend: this.gameModeFriend,
            gameModeRandom: this.gameModeRandom,
            gameModeSolo: this.gameModeSolo
        });
        this.game.stage.addChild(this.startNewGameTop);
        this.backButton = new BackButton({
            game: this.game,
            posX: 48,
            posY: 96,
            label: 'kapowClose',
            anchorX: 0,
            anchorY: 0,
            callback: this.backButtonHandler.bind(this)
        });
        this.game.stage.addChild(this.backButton);
        this.musicButton = new MusicButton({
            game: this.game,
            posX: 960,
            posY: 96,
            label: 'music',
            anchorX: 0,
            anchorY: 0,
        });
        this.game.stage.addChild(this.musicButton);
        this.helpButton = new HelpButton({
            game: this.game,
            posX: 840,
            posY: 96,
            label: 'help',
            anchorX: 0,
            anchorY: 0,
            bg: this.bg
        });
        this.game.stage.addChild(this.helpButton);
    }

    update() {
    }

    shutdown() {
        this.game.stage.removeChild(this.bg);
        this.game.stage.removeChild(this.helpButton);
        this.game.stage.removeChild(this.backButton);
        this.game.stage.removeChild(this.startNewGameTop);
        this.game.stage.removeChild(this.musicButton);
        this.game.stage.removeChild(this.scoreboard);
        this.game.stage.removeChild(this.stats);
        this.game.stage.removeChild(this.startNewGameBottom);
        this.game.stage.removeChild(this.logo);
        this.game.stage.removeChild(this.gameModeSolo);
        this.game.stage.removeChild(this.gameModeFriend);
        this.game.stage.removeChild(this.gameModeRandom);
        this.game.stage.removeChild(this.onGoingGame);
    }

    backButtonHandler() {
        kapow.close();
    }

}
