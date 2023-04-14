let canvas = document.getElementsByClassName('canvas')[0];
let ctx = canvas.getContext('2d');

document.getElementsByClassName('play-button')[0].disabled = true;

/*-------------------------------------------------------------------------------------------------------------*/

let helper = {
    getRandomNumberFromLowerBoundToZeroOrFromZeroToUpperBound: function (lowerBound, upperBound) {
        let coin = Math.floor(Math.random() * 2);

        if (coin === 0) {
            return Math.floor(Math.random() * lowerBound) - Math.random();
        } else {
            return Math.floor(Math.random() * upperBound) + Math.random();
        };
    },

    getRandomNumberFromLowerBoundToMinusOneOrFromOneToUpperBound: function (lowerBound, upperBound) {
        let coin = Math.floor(Math.random() * 2);

        let randomNumber;

        if (coin === 0) {
            randomNumber = Math.floor(Math.random() * lowerBound) - Math.random();

            if (randomNumber > -1) {
                randomNumber = randomNumber - 2;
            };

            return randomNumber;
        } else {
            randomNumber = Math.floor(Math.random() * upperBound) + Math.random();

            if (randomNumber < 1) {
                randomNumber = randomNumber + 2;
            };

            return randomNumber;
        };
    },

    getRandomNumberFromRange: function (lowerBound, upperBound) {
        let randomNumber = Math.floor(Math.random() * upperBound) + 1;

        if (randomNumber < lowerBound) {
            randomNumber = lowerBound;
        };

        return randomNumber;
    },

    changeDisplay: function (element, displayValue) {
        document.getElementsByClassName(element)[0].style.display = displayValue;
    },

    highlightElement: function (el, parentContainerClass) {
        el.classList.add('highlighted-button');

        for (let i = 0; i < document.getElementsByClassName(parentContainerClass)[0].children.length; i++) {
            if (document.getElementsByClassName(parentContainerClass)[0].children[i] !== el) {
                document.getElementsByClassName(parentContainerClass)[0].children[i].classList.remove('highlighted-button');
            };
        };
    },

    getRandomColor: function () {
        let letters = '0123456789ABCDEF';
        let color = '#';

        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        };

        return color;
    },

    sortArray: function (arr) {
        if (arr.length < 2) {
            return arr;
        };

        let pivot = arr[0];
        let less = [];
        let greater = [];

        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < pivot) {
                less.push(arr[i]);
            } else {
                greater.push(arr[i]);
            };
        };

        return helper.sortArray(less).concat(pivot, helper.sortArray(greater));
    }
};

/*-------------------------------------------------------------------------------------------------------------*/

let game = {
    bestOfOption: 9,
    playersModeOption: 22,
    ballCountOption: 1,
    playersWins: 0,
    aiWins: 0,
    tickTimeout: null,
    tickRate: 1000 / 120,

    tick: function () {
        window.clearTimeout(game.tickTimeout);
        game.prepareDataForNextTick();
        window.requestAnimationFrame(game.renderPreparedDataForNextTick);
        game.tickTimeout = window.setTimeout('game.tick()', game.tickRate);
    },

    prepareDataForNextTick: function () {
        controls.playersControls.initializeWatchPlayersControls();
        controls.playersControls.updatePlayersControls(players.playerOne, '38', '40');

        if (game.playersModeOption === 21 || game.playersModeOption === 22 || game.playersModeOption === 33) {
            controls.playersControls.updatePlayersControls(players.playerTwo, '87', '83');
        };

        if (game.playersModeOption !== 33) {
            controls.aiControls.updateAiControlsOne(ai.aiOne);
        };

        if (game.playersModeOption === 12 || game.playersModeOption === 22) {
            controls.aiControls.updateAiControlsTwo(ai.aiTwo, ai.aiOne);
        };

        for (let i = 0; i < ballsArray.length; i++) {
            ballsArray[i].updateBall();
        };
    },

    renderPreparedDataForNextTick: function () {
        switch (game.playersModeOption) {
            case 11:
                render.draw(
                    [players.playerOne, ai.aiOne],
                    ballsArray,
                    [players.playerOne.color, ai.aiOne.color],
                    [players.playerOne.strokeColor, ai.aiOne.strokeColor]
                );
                break;

            case 12:
                render.draw(
                    [players.playerOne, ai.aiOne, ai.aiTwo],
                    ballsArray,
                    [players.playerOne.color, ai.aiOne.color, ai.aiTwo.color],
                    [players.playerOne.strokeColor, ai.aiOne.strokeColor, ai.aiTwo.strokeColor]
                );
                break;

            case 21:
                render.draw(
                    [players.playerOne, players.playerTwo, ai.aiOne],
                    ballsArray,
                    [players.playerOne.color, players.playerTwo.color, ai.aiOne.color],
                    [players.playerOne.strokeColor, players.playerTwo.strokeColor, ai.aiOne.strokeColor]
                );
                break;

            case 22:
                render.draw(
                    [players.playerOne, players.playerTwo, ai.aiOne, ai.aiTwo],
                    ballsArray,
                    [players.playerOne.color, players.playerTwo.color, ai.aiOne.color, ai.aiTwo.color],
                    [players.playerOne.strokeColor, players.playerTwo.strokeColor, ai.aiOne.strokeColor, ai.aiTwo.strokeColor]
                );
                break;

            case 33:
                render.draw(
                    [players.playerOne, players.playerTwo],
                    ballsArray,
                    [players.playerOne.color, players.playerTwo.color],
                    [players.playerOne.strokeColor, players.playerTwo.strokeColor]
                );
                break;

            default:
                break;
        };
    },

    resetPaddlesAndBalls: function () {
        controls.playersControls.reset([players.playerOne, players.playerTwo]);
        controls.aiControls.reset([ai.aiOne, ai.aiTwo]);
        controls.ballsControls.reset(ballsArray);
    },

    generateBalls: function (count) {
        ballsArray = [];

        for (let i = 0; i < count; i++) {
            ballsArray[i] = new Ball(
                ballData.xPosition + Math.random(),
                ballData.yPosition + Math.random(),
                helper.getRandomNumberFromRange(7, 10),
                helper.getRandomNumberFromLowerBoundToMinusOneOrFromOneToUpperBound(-3, 3),
                helper.getRandomNumberFromLowerBoundToZeroOrFromZeroToUpperBound(-3, 3),
                helper.getRandomColor(),
                helper.getRandomColor()
            );
        };
    },

    startGame: function () {
        if (game.playersModeOption === 11 || game.playersModeOption === 12) {
            players.playerTwo = null;
        };

        if (game.playersModeOption === 11 || game.playersModeOption === 21) {
            ai.aiTwo = null;
        };

        if (game.playersModeOption === 21 || game.playersModeOption === 22) {
            players.playerTwo = new Paddle(
                playersPaddlesData.playerTwoPaddleData.xPosition,
                playersPaddlesData.playerTwoPaddleData.yPosition,
                playersPaddlesData.playerTwoPaddleData.width,
                playersPaddlesData.playerTwoPaddleData.height,
                playersPaddlesData.playerTwoPaddleData.defaultSpeedModifier,
                playersPaddlesData.playerTwoPaddleData.increasedSpeedModifier,
                playersPaddlesData.playerTwoPaddleData.speed,
                playersPaddlesData.playerTwoPaddleData.color,
                playersPaddlesData.playerTwoPaddleData.strokeColor
            );
        };

        if (game.playersModeOption === 12 || game.playersModeOption === 22) {
            ai.aiTwo = new Paddle(
                aiPaddlesData.aiTwoPaddleData.xPosition,
                aiPaddlesData.aiTwoPaddleData.yPosition,
                aiPaddlesData.aiTwoPaddleData.width,
                aiPaddlesData.aiTwoPaddleData.height,
                aiPaddlesData.aiTwoPaddleData.defaultSpeedModifier,
                aiPaddlesData.aiTwoPaddleData.increasedSpeedModifier,
                aiPaddlesData.aiTwoPaddleData.speed,
                aiPaddlesData.aiTwoPaddleData.color,
                aiPaddlesData.aiTwoPaddleData.strokeColor
            );
        };

        if (game.playersModeOption !== 33) {
            if (ai.aiOne === null) {
                ai.aiOne = new Paddle(
                    aiPaddlesData.aiOnePaddleData.xPosition,
                    aiPaddlesData.aiOnePaddleData.yPosition,
                    aiPaddlesData.aiOnePaddleData.width,
                    aiPaddlesData.aiOnePaddleData.height,
                    aiPaddlesData.aiOnePaddleData.defaultSpeedModifier,
                    aiPaddlesData.aiOnePaddleData.increasedSpeedModifier,
                    aiPaddlesData.aiOnePaddleData.speed,
                    aiPaddlesData.aiOnePaddleData.color,
                    aiPaddlesData.aiOnePaddleData.strokeColor,
                );
            };
        };

        if (game.playersModeOption === 33) {
            ai.aiOne = null;
            ai.aiTwo = null;
            players.playerTwo = null;

            players.playerTwo = new Paddle(
                aiPaddlesData.aiOnePaddleData.xPosition,
                playersPaddlesData.playerTwoPaddleData.yPosition,
                playersPaddlesData.playerTwoPaddleData.width,
                playersPaddlesData.playerTwoPaddleData.height,
                playersPaddlesData.playerTwoPaddleData.defaultSpeedModifier,
                playersPaddlesData.playerTwoPaddleData.increasedSpeedModifier,
                playersPaddlesData.playerTwoPaddleData.speed,
                playersPaddlesData.playerTwoPaddleData.color,
                playersPaddlesData.playerTwoPaddleData.strokeColor
            );
        };

        game.resetScore();
        game.generateBalls(game.ballCountOption);
        game.resetPaddlesAndBalls();
        ui.updateWinsInfoAndScoreText();
        helper.changeDisplay('start-screen', 'none');
        helper.changeDisplay('mainframe', 'flex');
        audio.playSound(audio.backgroundMusic);
        game.tick();
    },

    defineWinner: function () {
        if (game.aiWins >= (game.bestOfOption + 1) / 2 || game.playersWins >= (game.bestOfOption + 1) / 2) {
            controls.ballsControls.freeze(ballsArray);

            helper.changeDisplay('mainframe', 'none');
            audio.pauseSound(audio.backgroundMusic);
            helper.changeDisplay('gameover-container', 'flex');
            ui.updateWinsInfoAndScoreText();
            game.resetScore();

            if (game.playersModeOption === 33) {
                document.getElementsByClassName('wins-info')[0].innerHTML = 'Player One ' + game.playersWins + ' : ' + game.aiWins + ' Player Two';
            } else {
                document.getElementsByClassName('wins-info')[0].innerHTML = 'You ' + game.playersWins + ' : ' + game.aiWins + ' AI';
            };
        };
    },

    resetScore: function () {
        game.aiWins = 0;
        game.playersWins = 0;
    }
};

/*-------------------------------------------------------------------------------------------------------------*/

let ui = {
    enableDisablePlayButton: function () {
        for (let i = 0; i < document.getElementsByClassName('players-mode-container')[0].children.length; i++) {
            if (document.getElementsByClassName('players-mode-container')[0].children[i].classList.contains('highlighted-button')) {
                for (let i = 0; i < document.getElementsByClassName('best-of-mode-container')[0].children.length; i++) {
                    if (document.getElementsByClassName('best-of-mode-container')[0].children[i].classList.contains('highlighted-button')) {
                        document.getElementsByClassName('play-button')[0].disabled = false;
                    };
                };
            };
        };
    },

    changeVolume: function (el) {
        audio.volume = Number(el.value);
        console.log(audio.volume);
    },

    choosePlayersModeOption: function (el) {
        helper.highlightElement(el, 'players-mode-container');

        switch (el.innerText) {
            case '1P vs 1AI':
                game.playersModeOption = 11;
                break;

            case '1P vs 2AI':
                game.playersModeOption = 12;
                break;

            case '2P vs 1AI':
                game.playersModeOption = 21;
                break;

            case '2P vs 2AI':
                game.playersModeOption = 22;
                break;

            case 'PvP':
                game.playersModeOption = 33;
                break;

            default:
                break;
        };
    },

    chooseAIDifficulty: function (el) {

    },

    chooseBestOfOption: function (el) {
        helper.highlightElement(el, 'best-of-mode-container');

        switch (el.innerText) {
            case 'Best of 1':
                game.bestOfOption = 1;
                break;

            case 'Best of 3':
                game.bestOfOption = 3;
                break;

            case 'Best of 5':
                game.bestOfOption = 5;
                break;

            case 'Best of 7':
                game.bestOfOption = 7;
                break;

            case 'Best of 9':
                game.bestOfOption = 9;
                break;

            default:
                break;
        };
    },

    specifyBallCountOption: function (el) {
        if (el.innerHTML === '+1') {
            game.ballCountOption++;
        } else if (el.innerHTML === '-1') {
            game.ballCountOption--;
        };

        if (game.ballCountOption <= 0) {
            game.ballCountOption = 1;
        } else if (game.ballCountOption >= 11) {
            game.ballCountOption = 10;
        };

        document.getElementsByClassName('ball-count')[0].innerHTML = game.ballCountOption;
    },

    restart: function () {
        game.resetScore();
        ui.updateWinsInfoAndScoreText();
        game.resetPaddlesAndBalls();

        helper.changeDisplay('gameover-container', 'none');
        helper.changeDisplay('mainframe', 'flex');
        audio.playSound(audio.backgroundMusic);
    },

    goToMainMenuFromGameoverScreen: function () {
        helper.changeDisplay('start-screen', 'flex');
        helper.changeDisplay('gameover-container', 'none');
    },

    goToMainMenuFromMainframe: function () {
        controls.ballsControls.freeze(ballsArray);

        helper.changeDisplay('start-screen', 'flex');
        helper.changeDisplay('mainframe', 'none');
        audio.pauseSound(audio.backgroundMusic);
    },

    updateScore: function () {
        game.resetPaddlesAndBalls();
        ui.updateWinsInfoAndScoreText();
        game.defineWinner();
    },

    updateWinsInfoAndScoreText: function () {
        if (game.playersModeOption === 33) {
            document.getElementsByClassName('wins-info')[0].innerHTML = 'Player One ' + game.playersWins + ' : ' + game.aiWins + ' Player Two';
            document.getElementsByClassName('score-text')[0].innerHTML = 'Player One ' + game.playersWins + ' : ' + game.aiWins + ' Player Two';
        } else {
            document.getElementsByClassName('wins-info')[0].innerHTML = 'You ' + game.playersWins + ' : ' + game.aiWins + ' AI';
            document.getElementsByClassName('score-text')[0].innerHTML = 'You ' + game.playersWins + ' : ' + game.aiWins + ' AI';
        };
    },
}

/*-------------------------------------------------------------------------------------------------------------*/

function Paddle(x, y, width, height, defaultSpeedModifier, increasedSpeedModifier, speed, color, strokeColor) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.defaultSpeedModifier = defaultSpeedModifier;
    this.increasedSpeedModifier = increasedSpeedModifier;
    this.speed = speed;
    this.color = color;
    this.strokeColor = strokeColor;

    this.hasCollidedWith = function (ball) {
        let paddleLeftWall = this.x;
        let paddleTopWall = this.y;
        let paddleRightWall = this.x + this.width;
        let paddleBottomWall = this.y + this.height;

        if (
            ball.x > paddleLeftWall
            && ball.x < paddleRightWall
            && ball.y > paddleTopWall
            && ball.y < paddleBottomWall
        ) {
            return true;
        };

        return false;
    };
};

let playersPaddlesData = {
    playerOnePaddleData: {
        width: 6,
        height: 160,
        xPosition: 3,
        yPosition: 500,
        defaultSpeedModifier: 0.5,
        increasedSpeedModifier: 0.7,
        speed: 9,
        color: helper.getRandomColor(),
        strokeColor: helper.getRandomColor()
    },

    playerTwoPaddleData: {
        width: 6,
        height: 160,
        xPosition: 3,
        yPosition: 200,
        defaultSpeedModifier: 0.5,
        increasedSpeedModifier: 0.7,
        speed: 9,
        color: helper.getRandomColor(),
        strokeColor: helper.getRandomColor()
    }
};

let players = {
    playerOne: new Paddle(
        playersPaddlesData.playerOnePaddleData.xPosition,
        playersPaddlesData.playerOnePaddleData.yPosition,
        playersPaddlesData.playerOnePaddleData.width,
        playersPaddlesData.playerOnePaddleData.height,
        playersPaddlesData.playerOnePaddleData.defaultSpeedModifier,
        playersPaddlesData.playerOnePaddleData.increasedSpeedModifier,
        playersPaddlesData.playerOnePaddleData.speed,
        playersPaddlesData.playerOnePaddleData.color,
        playersPaddlesData.playerOnePaddleData.strokeColor,
    ),

    playerTwo: null
};

let aiPaddlesData = {
    aiOnePaddleData: {
        width: 6,
        height: 160,
        xPosition: 1591,
        yPosition: 500,
        defaultSpeedModifier: 0.5,
        increasedSpeedModifier: 0.7,
        speed: 9,
        color: helper.getRandomColor(),
        strokeColor: helper.getRandomColor()
    },

    aiTwoPaddleData: {
        width: 6,
        height: 160,
        xPosition: 1591,
        yPosition: 200,
        defaultSpeedModifier: 0.5,
        increasedSpeedModifier: 0.7,
        speed: 9,
        color: helper.getRandomColor(),
        strokeColor: helper.getRandomColor()
    }
};

let ai = {
    aiOne: new Paddle(
        aiPaddlesData.aiOnePaddleData.xPosition,
        aiPaddlesData.aiOnePaddleData.yPosition,
        aiPaddlesData.aiOnePaddleData.width,
        aiPaddlesData.aiOnePaddleData.height,
        aiPaddlesData.aiOnePaddleData.defaultSpeedModifier,
        aiPaddlesData.aiOnePaddleData.increasedSpeedModifier,
        aiPaddlesData.aiOnePaddleData.speed,
        aiPaddlesData.aiOnePaddleData.color,
        aiPaddlesData.aiOnePaddleData.strokeColor
    ),

    aiTwo: null
};

/*-------------------------------------------------------------------------------------------------------------*/

function Ball(x, y, radius, xSpeed, ySpeed, color, strokeColor) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.color = color;
    this.strokeColor = strokeColor;

    this.reverseX = function () {
        this.xSpeed *= -1;
    };

    this.reverseY = function () {
        this.ySpeed *= -1;
    };

    this.modifyXSpeedBy = function (modification) {
        modification = this.xSpeed < 0 ? modification * -1 : modification;
        let nextValue = this.xSpeed + modification;
        nextValue = Math.abs(nextValue) > 9 ? 9 : nextValue;

        if (modification < 0 && nextValue > 0) {
            nextValue *= -1;
        };

        if (nextValue >= 4.3) {
            nextValue = 4.2;
        } else if (nextValue <= -4.3) {
            nextValue = -4.2;
        };

        this.xSpeed = nextValue;
    };

    this.modifyYSpeedBy = function (modification) {
        modification = this.ySpeed < 0 ? modification * -1 : modification;

        this.ySpeed += modification;

        if (this.ySpeed >= 14.3) {
            this.ySpeed = 14.2;
        } else if (this.ySpeed <= -14.3) {
            this.ySpeed = -14.2;
        };
    };

    this.increaseSpeed = function (keyOne, keyTwo, player) {
        let trueControlKeysPressed = 0;

        for (let key in controls.playersControls.heldDownKeysByPlayers) {
            if (key === keyOne || key === keyTwo) {
                trueControlKeysPressed++;
            };
        };

        let xSpeedModificator;
        let ySpeedModificator;

        if (trueControlKeysPressed > 0) {
            audio.playSound(audio.generateIncreasedHitSound());

            xSpeedModificator = player.increasedSpeedModifier;
            ySpeedModificator = player.increasedSpeedModifier;

            this.modifyXSpeedBy(xSpeedModificator);
            this.modifyYSpeedBy(ySpeedModificator);
        } else {
            audio.playSound(audio.generateDefaultHitSound());

            xSpeedModificator = player.defaultSpeedModifier;
            ySpeedModificator = player.defaultSpeedModifier;

            this.modifyXSpeedBy(xSpeedModificator);
            this.modifyYSpeedBy(ySpeedModificator);
        };
    };

    this.updateBall = function () {
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x < 0) {
            game.aiWins++;

            if (game.aiWins >= (game.bestOfOption + 1) / 2) {
                if (game.playersModeOption === 33) {
                    audio.playSound(audio.generateWinSound());
                } else {
                    audio.playSound(audio.generateLoseSound());
                };
            } else if (game.playersWins >= (game.bestOfOption + 1) / 2) {
                audio.playSound(audio.generateWinSound());
            } else {
                console.log('0');
                audio.playSound(audio.generateScoreSound());
            };

            ui.updateScore();
        };

        if (this.x > canvas.width) {
            game.playersWins++;

            if (game.aiWins >= (game.bestOfOption + 1) / 2) {
                if (game.playersModeOption === 33) {
                    audio.playSound(audio.generateWinSound());
                } else {
                    audio.playSound(audio.generateLoseSound());
                };
            } else if (game.playersWins >= (game.bestOfOption + 1) / 2) {
                audio.playSound(audio.generateWinSound());
            } else {
                console.log('0');
                audio.playSound(audio.generateScoreSound());
            };

            ui.updateScore();
        };

        if (this.y <= 10 || this.y >= canvas.height - 10) {
            this.reverseY();
        };

        let collidedWithPlayerOne;
        let collidedWithPlayerTwo;
        let collidedWithAiOne;
        let collidedWithAiTwo;

        collidedWithPlayerOne = players.playerOne.hasCollidedWith(this);

        if (players.playerTwo !== null) {
            collidedWithPlayerTwo = players.playerTwo.hasCollidedWith(this);
        };

        if (ai.aiOne !== null) {
            collidedWithAiOne = ai.aiOne.hasCollidedWith(this);
        };

        if (ai.aiTwo !== null) {
            collidedWithAiTwo = ai.aiTwo.hasCollidedWith(this);
        };

        if (collidedWithPlayerOne || collidedWithPlayerTwo || collidedWithAiOne || collidedWithAiTwo) {
            this.reverseX();
        };

        if (collidedWithPlayerOne) {
            this.increaseSpeed('38', '40', players.playerOne);
        };

        if (collidedWithPlayerTwo) {
            this.increaseSpeed('83', '87', players.playerTwo);
        };

        if (collidedWithAiOne) {
            if (ai.aiOne.defaultSpeedModifier === 0.5) {
                audio.playSound(audio.generateDefaultHitSound());
            } else {
                audio.playSound(audio.generateIncreasedHitSound());
            };

            this.modifyXSpeedBy(ai.aiOne.defaultSpeedModifier);
            this.modifyYSpeedBy(ai.aiOne.defaultSpeedModifier);
        };

        if (collidedWithAiTwo) {
            if (ai.aiTwo.defaultSpeedModifier === 0.5) {
                audio.playSound(audio.generateDefaultHitSound());
            } else {
                audio.playSound(audio.generateIncreasedHitSound());
            };

            this.modifyXSpeedBy(ai.aiTwo.defaultSpeedModifier);
            this.modifyYSpeedBy(ai.aiTwo.defaultSpeedModifier);
        };
    };
};

let ballData = {
    xPosition: canvas.width / 2,
    yPosition: canvas.height / 2,
};

let ballsArray = [];

/*-------------------------------------------------------------------------------------------------------------*/

let controls = {
    playersControls: {
        heldDownKeysByPlayers: {},

        move: function (keyCode, player, keyUp, keyDown) {
            let nextY = player.y;

            if (keyCode === keyDown) {
                nextY += player.speed;
            } else if (keyCode === keyUp) {
                nextY += -1 * player.speed;
            };

            nextY = nextY < 0 ? 0 : nextY;
            nextY = nextY + player.height > canvas.height ? canvas.height - player.height : nextY;
            player.y = nextY;
        },

        updatePlayersControls: function (player, keyUp, keyDown) {
            for (let keyCode in this.heldDownKeysByPlayers) {
                controls.playersControls.move(keyCode, player, keyUp, keyDown);
            };
        },

        initializeWatchPlayersControls: function () {
            window.addEventListener('keydown', () => { this.heldDownKeysByPlayers[event.keyCode] = true; }, false);
            window.addEventListener('keyup', () => { delete this.heldDownKeysByPlayers[event.keyCode]; }, false);
        },

        reset: function (players) {
            if (game.playersModeOption === 11 || game.playersModeOption === 12) {
                players[0].y = (canvas.height - playersPaddlesData.playerOnePaddleData.height) / 2;
            } else if (game.playersModeOption === 21 || game.playersModeOption === 22) {
                players[0].y = playersPaddlesData.playerOnePaddleData.yPosition;

                if (players[1] !== null) {
                    players[1].y = playersPaddlesData.playerTwoPaddleData.yPosition;
                };
            } else if (game.playersModeOption === 33) {
                players[0].y = (canvas.height - playersPaddlesData.playerOnePaddleData.height) / 2;
                players[1].y = (canvas.height - playersPaddlesData.playerTwoPaddleData.height) / 2;
            };
        }
    },

    aiControls: {
        move: function (keyCode, ai) {
            let nextY = ai.y;

            if (keyCode === '40') {
                nextY += ai.speed;
                ai.defaultSpeedModifier = ai.increasedSpeedModifier;
            } else if (keyCode === '38') {
                nextY += -1 * ai.speed;
                ai.defaultSpeedModifier = ai.increasedSpeedModifier;
            };

            nextY = nextY < 0 ? 0 : nextY;
            nextY = nextY + ai.height > canvas.height ? canvas.height - ai.height : nextY;
            ai.y = nextY;
        },

        findTheBallThatHasMinimumDistanceToRightSide: function (ballsArray) {
            let distancesFromBallsToRightSide = [];

            for (let i = 0; i < ballsArray.length; i++) {
                distancesFromBallsToRightSide[i] = canvas.width - ballsArray[i].x;
            };

            let minimumDistanceToRightSide = canvas.width;
            let ballThatHasMinimumDistanceToRightSide;

            for (let i = 0; i < distancesFromBallsToRightSide.length; i++) {
                if (distancesFromBallsToRightSide[i] < minimumDistanceToRightSide) {
                    minimumDistanceToRightSide = distancesFromBallsToRightSide[i];
                    ballThatHasMinimumDistanceToRightSide = i;
                };
            };

            return ballThatHasMinimumDistanceToRightSide;
        },

        findTheBallThatHasMinimumDistanceToAI: function (ballsArray, ai) {
            let distancesFromBallsToAI = [];

            for (let i = 0; i < ballsArray.length; i++) {
                distancesFromBallsToAI[i] = Math.sqrt(Math.pow((ai.x - ballsArray[i].x), 2) + Math.pow((ai.y + (ai.height / 2) - ballsArray[i].y), 2));
            };

            let minimumDistanceToAI = canvas.width;
            let ballThatHasMinimumDistanceToAI;

            for (let i = 0; i < distancesFromBallsToAI.length; i++) {
                if (distancesFromBallsToAI[i] < minimumDistanceToAI) {
                    minimumDistanceToAI = distancesFromBallsToAI[i];
                    ballThatHasMinimumDistanceToAI = i;
                };
            };

            return ballThatHasMinimumDistanceToAI;
        },

        updateAiControlsOne: function (ai) {
            let aiMiddle = ai.y + (ai.height / 2);

            let ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToRightSide(ballsArray);
            // let ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToAI(ballsArray, ai);
            // let ballToControl = controls.aiControls.findTheBallThatHasSeconsMinimumDistanceToRightSide(ballsArray);
            // let ballToControl = controls.aiControls.findTheBallThatHasSecondMinimumDistanceToAI(ballsArray, ai);
            // console.log('ai1 ' + ballToControl);

            if (!ballToControl) {
                ballToControl = 0;
            };

            if (aiMiddle < ballsArray[ballToControl].y) {
                controls.aiControls.move('40', ai);
            };

            if (aiMiddle > ballsArray[ballToControl].y) {
                controls.aiControls.move('38', ai);
            };

            if (aiMiddle === ballsArray[ballToControl].y) {
                ai.defaultSpeedModifier = aiPaddlesData.aiOnePaddleData.defaultSpeedModifier;
            };
        },

        findTheBallThatHasSeconsMinimumDistanceToRightSide: function (ballsArray) {
            let distancesFromBallsToRightSide = [];

            for (let i = 0; i < ballsArray.length; i++) {
                distancesFromBallsToRightSide[i] = canvas.width - ballsArray[i].x;
            };

            let sortedDistancesFromBallsToRightSide = helper.sortArray(distancesFromBallsToRightSide);
            let ballThatHasSecondMinimumDistanceToRightSide;

            for (let i = 0; i < distancesFromBallsToRightSide.length; i++) {
                if (distancesFromBallsToRightSide[i] === sortedDistancesFromBallsToRightSide[1]) {
                    ballThatHasSecondMinimumDistanceToRightSide = i;
                };
            };

            return ballThatHasSecondMinimumDistanceToRightSide;
        },

        findTheBallThatHasSecondMinimumDistanceToAI: function (ballsArray, ai) {
            let distancesFromBallsToAI = [];

            for (let i = 0; i < ballsArray.length; i++) {
                distancesFromBallsToAI[i] = Math.sqrt(Math.pow((ai.x - ballsArray[i].x), 2) + Math.pow((ai.y + (ai.height / 2) - ballsArray[i].y), 2));
            };

            let sortedDistancesFromBallsToAI = helper.sortArray(distancesFromBallsToAI);
            let ballThatHasSecondMinimumDistanceToAI;

            for (let i = 0; i < distancesFromBallsToAI.length; i++) {
                if (distancesFromBallsToAI[i] === sortedDistancesFromBallsToAI[1]) {
                    ballThatHasSecondMinimumDistanceToAI = i;
                };
            };

            return ballThatHasSecondMinimumDistanceToAI;
        },

        updateAiControlsTwo: function (aiOne, aiTwo) {
            let aiMiddle = aiOne.y + (aiOne.height / 2);

            if (game.ballCountOption > 1) {
                // let ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToRightSide(ballsArray);
                // let ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToAI(ballsArray, aiOne);
                let ballToControl = controls.aiControls.findTheBallThatHasSeconsMinimumDistanceToRightSide(ballsArray);
                // let ballToControl = controls.aiControls.findTheBallThatHasSecondMinimumDistanceToAI(ballsArray, aiOne);
                // console.log('ai2 ' + ballToControl);

                if (!ballToControl) {
                    ballToControl = 1;
                };

                if (aiMiddle < ballsArray[ballToControl].y) {
                    controls.aiControls.move('40', aiOne);
                };

                if (aiMiddle > ballsArray[ballToControl].y) {
                    controls.aiControls.move('38', aiOne);
                };

                if (aiMiddle === ballsArray[ballToControl].y) {
                    aiOne.defaultSpeedModifier = aiPaddlesData.aiTwoPaddleData.defaultSpeedModifier;
                };

            } else if (game.ballCountOption === 1) {

                if (aiMiddle < ballsArray[0].y) {
                    controls.aiControls.move('40', aiOne);
                };

                if (aiMiddle > ballsArray[0].y) {
                    controls.aiControls.move('38', aiOne);
                };

                if (aiMiddle === ballsArray[0].y) {
                    aiOne.defaultSpeedModifier = aiPaddlesData.aiTwoPaddleData.defaultSpeedModifier;
                };

                let aiTwoBottom = aiOne.y + aiOne.height;
                let aiOneTop = aiTwo.y;

                if ((aiOneTop - aiTwoBottom) <= 150) {
                    controls.aiControls.move('38', aiOne);
                };

                if ((aiOneTop - aiTwoBottom) <= (-1 * aiOne.speed)) {
                    controls.aiControls.move('40', aiTwo);
                };
            };
        },

        reset: function (ai) {
            if (game.playersModeOption === 11 || game.playersModeOption === 21) {
                ai[0].y = (canvas.height - aiPaddlesData.aiOnePaddleData.height) / 2;
            } else if (game.playersModeOption === 12 || game.playersModeOption === 22) {
                ai[0].y = aiPaddlesData.aiOnePaddleData.yPosition;

                if (ai[1] !== null) {
                    ai[1].y = aiPaddlesData.aiTwoPaddleData.yPosition;
                };
            };
        }
    },

    ballsControls: {
        reset: function (balls) {
            for (let i = 0; i < balls.length; i++) {
                balls[i].x = ballData.xPosition + Math.random();
                balls[i].y = ballData.yPosition + Math.random();
                balls[i].radius = helper.getRandomNumberFromRange(7, 10);
                balls[i].xSpeed = helper.getRandomNumberFromLowerBoundToMinusOneOrFromOneToUpperBound(-3, 3);
                balls[i].ySpeed = helper.getRandomNumberFromLowerBoundToZeroOrFromZeroToUpperBound(-3, 3);
                balls[i].color = helper.getRandomColor();
                balls[i].strokeColor = helper.getRandomColor();
            };
        },

        freeze: function (balls) {
            for (let i = 0; i < balls.length; i++) {
                balls[i].xSpeed = 0;
                balls[i].ySpeed = 0;
            };
        }
    }
};

/*-------------------------------------------------------------------------------------------------------------*/

let render = {
    renderField: function () {
        ctx.fillStyle = 'rgba(22, 55, 40, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    },

    renderPaddle: function (paddle, color, strokeColor) {
        ctx.beginPath();
        ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);

        ctx.fillStyle = color;
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
    },

    renderBall: function (ball, color, strokeColor) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);

        ctx.fillStyle = color;
        ctx.fill();

        ctx.lineWidth = 3;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
    },

    draw: function (paddles, balls, paddlesColors, paddlesStrokeColors) {
        ctx.globalCompositeOperation = 'source-over';
        this.renderField();

        for (let i = 0; i < paddles.length; i++) {
            if (paddles[i]) {
                ctx.globalCompositeOperation = 'source-over';
                this.renderPaddle(paddles[i], paddlesColors[i], paddlesStrokeColors[i]);
            };
        };

        for (let i = 0; i < balls.length; i++) {
            if (balls[i]) {
                ctx.globalCompositeOperation = 'source-over';
                this.renderBall(balls[i], balls[i].color, balls[i].strokeColor);

                // ctx.font = '30px serif';
                // ctx.fillStyle = 'white';
                // ctx.fillText(i, balls[i].x, balls[i].y);
            };
        };
    }
};

/*-------------------------------------------------------------------------------------------------------------*/

let audio = {
    volume: 0.3,

    generateDefaultHitSound: function () {
        return new Audio('./src/sounds/mixkit-arcade-retro-changing-tab-206.wav');
    },

    generateIncreasedHitSound: function () {
        return new Audio('./src/sounds/mixkit-arcade-mechanical-bling-210.wav');
    },

    generateScoreSound: function () {
        return new Audio('./src/sounds/mixkit-arcade-video-game-bonus-2044.wav');
    },

    generateLoseSound: function () {
        return new Audio('./src/sounds/mixkit-arcade-space-shooter-dead-notification-272.wav');
    },

    generateWinSound: function () {
        return new Audio('./src/sounds/mixkit-arcade-game-complete-or-approved-mission-205.wav');
    },

    generateBackgroundMusic: function () {
        return new Audio('./src/music/mixkit-game-level-music-689.wav');
    },

    backgroundMusic: new Audio('./src/music/mixkit-game-level-music-689.wav'),

    playSound: function (sound) {
        sound.volume = audio.volume;
        sound.play();
    },

    pauseSound: function (sound) {
        sound.volume = audio.volume;
        sound.pause();
    },

    initiateBackgroudMusicLooping: function () {
        audio.backgroundMusic.loop = true;
    }
};

audio.initiateBackgroudMusicLooping();