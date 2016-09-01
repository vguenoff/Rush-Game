/* global lib createjs */
// logic for the Count game

class NumberedBox extends createjs.Container {
    constructor(game, number = 0) {
        super();
        
        this.game = game;
        this.number = number;

        let movieclip = new lib.NumberedBox();
        movieclip.numberText.text = number;
        movieclip.numberText.textBaseline = 'alphabet';

        movieclip.numberText.font = '32px Roboto Mono';
        this.addChild(movieclip);
 
        this.setBounds(0, 0, 50, 50);

        // handle click / tap
        this.on('click', this.handleClick.bind(this));
    }
    handleClick() {
        this.game.handleClick(this);
    }
}
// class Counter extends createjs.Container {
//     constructor(boxCount = 30, boxSeconds = 30) {
//         super();

//         this.boxCount = boxCount;
//         this.boxSeconds = boxSeconds;

//         let leftMC = new lib.Counter();
//         leftMC.boxCount.text = boxCount;
//         this.addChild(leftMC);

//         let rightMC = new lib.Counter();
//         rightMC.boxSeconds.text = boxSeconds;
//         this.addChild(rightMC);

//     }
// }

// this class controlls the game data
class GameData {
    constructor() {
        this.amountOfBox = 15;
        this.resetData();
    }
    resetData() {
        this.currentNumber = 1;
    }
    nextNumber() {
        this.currentNumber += 1;
    }
    isRightNUmber(number) {
        return (number === this.currentNumber);
    }
    isGameWin() {
        // TODO
        return (this.currentNumber > this.amountOfBox);
    }
}
class Game {
    constructor() {
        // 
        console.log(`Welkome to the game. Version ${this.version()}`);

        this.loadSound();

        this.canvas = document.getElementById('game-canvas');
        this.stage = new createjs.Stage(this.canvas);

        window.debugStage = this.stage; // debugStage.children in the browser console

        this.stage.enableMouseOver();

        // enable tap on touch device
        createjs.Touch.enable(this.stage);

        // enable retina
        this.retinalize();

        // FPS
        createjs.Ticker.setFPS(60);

        // game related initalization
        this.gameData = new GameData();

        // keep redrawing the stage
        createjs.Ticker.on('tick', this.stage);

        // furst init
        this.startRestartGame(true);
    }
    version() {
        return '3.0.1';
    }
    loadSound() {
        createjs.Sound.registerSound('../soundfx/coin.wav', 'tapp');
    }
    startRestartGame(first = true) {
        this.gameData.resetData();
        this.stage.removeAllChildren();

        // background
        // this.stage.addChild(new lib.Background());

        // head view
        let headView = new lib.HeadView();
        
        headView.setBounds(0, 0, 158, 88);
        headView.x = (this.stage.width - headView.getBounds().width) / 2;
        headView.y = 15;
        this.stage.addChild(headView);

        // Start View
        if(first) {
            let startView = new lib.StartView(this);
            this.stage.addChild(startView);
            
            startView.setBounds(0, 0, 300, 33.5);

            startView.x = (this.stage.width - startView.getBounds().width) / 2;
            startView.y = (this.stage.height - startView.getBounds().height) / 4 + 25;
            
            startView.startBtn.on('click', (() => {
                // generate boxes
                this.stage.removeChild(startView);
                this.generateMultipleBoxes(this.gameData.amountOfBox);

                // TODO: Counting
                // show Counter
                // this.stage.removeChild(headView);

                // let level = new Counter(15, 16);
                // level.setBounds(0, 0, 158, 88);
                // level.x = (this.stage.width - level.getBounds().width) / 2;
                // level.y = 15;
                // this.stage.addChild(level);

            }).bind(this));
        } else {
            this.generateMultipleBoxes(this.gameData.amountOfBox);   

        }
    }
    generateMultipleBoxes(amount = 10) {
        for (let i = amount; i ; i--) {
            let movieclip = new NumberedBox(this, i);
            this.stage.addChild(movieclip);

            // random position
            movieclip.x = parseInt(Math.random() * (this.stage.width - movieclip.getBounds().width));
            movieclip.y = parseInt(Math.random() * 0.7 * (this.stage.height - movieclip.getBounds().height) + this.stage.height / 5) + 25;
        }
    }
    handleClick(numberedBox) {
        if(this.gameData.isRightNUmber(numberedBox.number)) {
            createjs.Sound.play('tapp');
            this.gameData.nextNumber();

            createjs.Tween.get(numberedBox)
                .to({x: (numberedBox.x + 25), y: (numberedBox.y + 25), scaleX:0, scaleY:0, rotation: 30, visible:false}, 100, createjs.Ease.cubicInOut())
                .call(() => {
                    this.stage.removeChild(numberedBox);

                    // is game over?
                    if(this.gameData.isGameWin()) {
                        var gameOverView = new lib.GameOverView();
                        this.stage.addChild(gameOverView);

                        gameOverView.setBounds(0, 0, 300, 245.65);

                        gameOverView.x = (this.stage.width - gameOverView.getBounds().width) / 2;
                        gameOverView.y = (this.stage.height - gameOverView.getBounds().height) / 4 + 25;

                        gameOverView.restartBtn.on('click', (() => {
                            createjs.Tween.get(gameOverView.restartBtn)
                                .to({rotation: 360}, 500, createjs.Ease.cubicInOut())
                                .call(() => {
                                    this.startRestartGame(false);
                                });
                        }).bind(this));
                    }
                });
        }
    }
    retinalize() {
        this.stage.width = this.canvas.width;
        this.stage.height = this.canvas.height + 25;

        let ratio = window.devicePixelRatio;
        if(ratio === undefined) {
            return;
        }

        this.canvas.setAttribute('width', Math.round(this.stage.width * ratio));
        this.canvas.setAttribute('height', Math.round(this.stage.height * ratio) + 25);

        this.stage.scaleX = this.stage.scaleY = ratio;

        // set CSS style 
        this.canvas.style.width = `${this.stage.width}px`; 
        this.canvas.style.height = `${this.stage.height}px` ; 
    }
}
// start the game
let game = new Game();