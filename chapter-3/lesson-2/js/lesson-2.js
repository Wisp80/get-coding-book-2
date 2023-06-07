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
    bestOfOption: 3,
    playersModeOption: 11,
    ballCountOption: 3,
    aiDifficulty: 1,
    theme: 'default',
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
                    [players.playerOne.strokeColor, ai.aiOne.strokeColor],
                    [players.playerOne.paddleImage, ai.aiOne.paddleImage]
                );
                break;

            case 12:
                render.draw(
                    [players.playerOne, ai.aiOne, ai.aiTwo],
                    ballsArray,
                    [players.playerOne.color, ai.aiOne.color, ai.aiTwo.color],
                    [players.playerOne.strokeColor, ai.aiOne.strokeColor, ai.aiTwo.strokeColor],
                    [players.playerOne.paddleImage, ai.aiOne.paddleImage, ai.aiTwo.paddleImage]
                );
                break;

            case 21:
                render.draw(
                    [players.playerOne, players.playerTwo, ai.aiOne],
                    ballsArray,
                    [players.playerOne.color, players.playerTwo.color, ai.aiOne.color],
                    [players.playerOne.strokeColor, players.playerTwo.strokeColor, ai.aiOne.strokeColor],
                    [players.playerOne.paddleImage, players.playerTwo.paddleImage, ai.aiOne.paddleImage]
                );
                break;

            case 22:
                render.draw(
                    [players.playerOne, players.playerTwo, ai.aiOne, ai.aiTwo],
                    ballsArray,
                    [players.playerOne.color, players.playerTwo.color, ai.aiOne.color, ai.aiTwo.color],
                    [players.playerOne.strokeColor, players.playerTwo.strokeColor, ai.aiOne.strokeColor, ai.aiTwo.strokeColor],
                    [players.playerOne.paddleImage, players.playerTwo.paddleImage, ai.aiOne.paddleImage, ai.aiTwo.paddleImage]
                );
                break;

            case 33:
                render.draw(
                    [players.playerOne, players.playerTwo],
                    ballsArray,
                    [players.playerOne.color, players.playerTwo.color],
                    [players.playerOne.strokeColor, players.playerTwo.strokeColor],
                    [players.playerOne.paddleImage, players.playerTwo.paddleImage]
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
                helper.getRandomNumberFromRange(11, 13),
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
                playersPaddlesData.playerTwoPaddleData.strokeColor,
                playersPaddlesData.playerTwoPaddleData.paddleImage
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
                aiPaddlesData.aiTwoPaddleData.strokeColor,
                aiPaddlesData.aiTwoPaddleData.paddleImage
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
                    aiPaddlesData.aiOnePaddleData.paddleImage
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
                playersPaddlesData.playerTwoPaddleData.strokeColor,
                playersPaddlesData.playerTwoPaddleData.paddleImage
            );
        };

        game.resetScore();
        game.generateBalls(game.ballCountOption);
        game.resetPaddlesAndBalls();
        ui.updateWinsInfoAndScoreText();
        ui.changeDisplay('start-screen', 'none');
        ui.changeDisplay('mainframe', 'flex');
        audio.playSound(audio.checkMusicTheme());
        game.tick();
    },

    defineWinner: function () {
        if (game.aiWins >= (game.bestOfOption + 1) / 2 || game.playersWins >= (game.bestOfOption + 1) / 2) {
            controls.ballsControls.freeze(ballsArray);

            ui.changeDisplay('mainframe', 'none');
            audio.pauseSound(audio.checkMusicTheme());
            ui.changeDisplay('gameover-container', 'flex');
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

    countHighlightedButtons: function (parentContainerClass) {
        let highlightedButtonsCount = 0;

        for (let i = 0; i < document.getElementsByClassName(parentContainerClass)[0].children.length; i++) {
            if (document.getElementsByClassName(parentContainerClass)[0].children[i].classList.contains('highlighted-button')) {
                highlightedButtonsCount++;
            };
        };

        return highlightedButtonsCount;
    },

    enableDisablePlayButton: function () {
        let highlightedMainSettingsButtonsCount = ui.countHighlightedButtons('players-mode-container')
            + ui.countHighlightedButtons('ai-difficulty-container')
            + ui.countHighlightedButtons('best-of-mode-container');

        if (highlightedMainSettingsButtonsCount === 3) {
            document.getElementsByClassName('play-button')[0].disabled = false;
        } else {
            document.getElementsByClassName('play-button')[0].disabled = true;
        };
    },

    changeTheme: function (el) {
        ui.highlightElement(el, 'themes-music-settings-buttons-container');

        switch (el.innerText) {
            case 'Default':
                game.theme = 'default';
                document.getElementsByClassName('start-screen')[0].classList.remove('sonic-picture');
                document.getElementsByClassName('start-screen')[0].classList.add('default-picture');
                break;

            case 'Sonic':
                game.theme = 'sonic';
                document.getElementsByClassName('start-screen')[0].classList.remove('default-picture');
                document.getElementsByClassName('start-screen')[0].classList.add('sonic-picture');
                break;

            default:
                break;
        };
    },

    changeVolume: function (el) {
        audio.volume = Number(el.value);
    },

    choosePlayersModeOption: function (el) {
        ui.highlightElement(el, 'players-mode-container');

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
        ui.highlightElement(el, 'ai-difficulty-container');

        switch (el.innerText) {
            case 'Easy 🤡':
                game.aiDifficulty = 1;
                break;

            case 'Normal 🍻':
                game.aiDifficulty = 2;
                break;

            case 'Hard 💀':
                game.aiDifficulty = 3;
                break;

            case 'Very Hard 😈':
                game.aiDifficulty = 4;
                break;

            case 'Impossible 👽':
                game.aiDifficulty = 5;
                break;

            default:
                break;
        };
    },

    chooseBestOfOption: function (el) {
        ui.highlightElement(el, 'best-of-mode-container');

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

        ui.changeDisplay('gameover-container', 'none');
        ui.changeDisplay('mainframe', 'flex');
        audio.playSound(audio.checkMusicTheme());
    },

    goToMainMenuFromGameoverScreen: function () {
        controls.ballsControls.freeze(ballsArray);

        ui.changeDisplay('start-screen', 'flex');
        ui.changeDisplay('gameover-container', 'none');
    },

    goToMainMenuFromMainframe: function () {
        controls.ballsControls.freeze(ballsArray);

        ui.changeDisplay('start-screen', 'flex');
        ui.changeDisplay('mainframe', 'none');
        audio.pauseSound(audio.checkMusicTheme());
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

    pauseTheGame: function () {
        alert(`Click 'OK' to resume`);
    }
};

/*-------------------------------------------------------------------------------------------------------------*/

function Paddle(x, y, width, height, defaultSpeedModifier, increasedSpeedModifier, speed, color, strokeColor, paddleImage) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.defaultSpeedModifier = defaultSpeedModifier;
    this.increasedSpeedModifier = increasedSpeedModifier;
    this.speed = speed;
    this.color = color;
    this.strokeColor = strokeColor;
    this.paddleImage = paddleImage;

    this.hasCollidedWithTopWall = function (ball, hitbox) {
        let paddleLeftWall = this.x;
        let paddleRightWall = this.x + this.width;
        let paddleTopWall = this.y;

        if (
            ball.x >= paddleLeftWall
            && ball.x <= paddleRightWall
            && ball.y <= paddleTopWall
            && ball.y >= paddleTopWall - hitbox
        ) {
            return true;
        };

        return false;
    };

    this.hasCollidedWithBottomWall = function (ball, hitbox) {
        let paddleLeftWall = this.x;
        let paddleRightWall = this.x + this.width;
        let paddleBottomWall = this.y + this.height;

        if (
            ball.x >= paddleLeftWall
            && ball.x <= paddleRightWall
            && ball.y >= paddleBottomWall
            && ball.y <= paddleBottomWall + hitbox
        ) {
            return true;
        };

        return false;
    };

    this.hasCollidedWithRightWall = function (ball, hitbox) {
        let paddleRightWall = this.x + this.width;
        let paddleTopWall = this.y;
        let paddleBottomWall = this.y + this.height;

        if (
            ball.x >= paddleRightWall
            && ball.x <= paddleRightWall + hitbox
            && ball.y >= paddleTopWall
            && ball.y <= paddleBottomWall
        ) {
            return true;
        };

        return false;
    };

    this.hasCollidedWithLeftWall = function (ball, hitbox) {
        let paddleLeftWall = this.x;
        let paddleTopWall = this.y;
        let paddleBottomWall = this.y + this.height;

        if (
            ball.x <= paddleLeftWall
            && ball.x >= paddleLeftWall - hitbox
            && ball.y >= paddleTopWall
            && ball.y <= paddleBottomWall
        ) {
            return true;
        };

        return false;
    };

    this.hasCollidedWithInnerSpace = function (ball) {
        let paddleLeftWall = this.x;
        let paddleRightWall = this.x + this.width;
        let paddleTopWall = this.y;
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
        width: 30,
        height: 160,
        xPosition: 3,
        yPosition: 500,
        defaultSpeedModifier: 0.5,
        increasedSpeedModifier: 0.7,
        speed: 9,
        color: helper.getRandomColor(),
        strokeColor: helper.getRandomColor(),
        paddleImage: './src/images/paddles/01-0.png'
    },

    playerTwoPaddleData: {
        width: 30,
        height: 160,
        xPosition: 3,
        yPosition: 200,
        defaultSpeedModifier: 0.5,
        increasedSpeedModifier: 0.7,
        speed: 9,
        color: helper.getRandomColor(),
        strokeColor: helper.getRandomColor(),
        paddleImage: './src/images/paddles/02-0.png'
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
        playersPaddlesData.playerOnePaddleData.paddleImage
    ),

    playerTwo: null
};

let aiPaddlesData = {
    aiOnePaddleData: {
        width: 30,
        height: 160,
        xPosition: 1567,
        yPosition: 500,
        defaultSpeedModifier: 0.5,
        increasedSpeedModifier: 0.7,
        speed: 6,
        color: helper.getRandomColor(),
        strokeColor: helper.getRandomColor(),
        paddleImage: './src/images/paddles/01-X.png'
    },

    aiTwoPaddleData: {
        width: 30,
        height: 160,
        xPosition: 1567,
        yPosition: 200,
        defaultSpeedModifier: 0.5,
        increasedSpeedModifier: 0.7,
        speed: 6,
        color: helper.getRandomColor(),
        strokeColor: helper.getRandomColor(),
        paddleImage: './src/images/paddles/02-X.png'
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
        aiPaddlesData.aiOnePaddleData.strokeColor,
        aiPaddlesData.aiOnePaddleData.paddleImage
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

    this.playLoseWinSounds = function () {
        if (game.aiWins >= (game.bestOfOption + 1) / 2) {
            if (game.playersModeOption === 33) {
                audio.playSound(audio.generateWinSound());
            } else {
                audio.playSound(audio.generateLoseSound());
            };
        } else if (game.playersWins >= (game.bestOfOption + 1) / 2) {
            audio.playSound(audio.generateWinSound());
        } else {
            audio.playSound(audio.generateScoreSound());
        };
    };

    this.checkCollisionWithTopAndBottomWalls = function (hitbox, safespace) {
        let collidedWithPlayerOneTopWall = false;
        let collidedWithPlayerTwoTopWall = false;
        let collidedWithAiOneTopWall = false;
        let collidedWithAiTwoTopWall = false;

        let collidedWithPlayerOneBottomWall = false;
        let collidedWithPlayerTwoBottomWall = false;
        let collidedWithAiOneBottomWall = false;
        let collidedWithAiTwoBottomWall = false;

        collidedWithPlayerOneTopWall = players.playerOne.hasCollidedWithTopWall(this, hitbox);
        collidedWithPlayerOneBottomWall = players.playerOne.hasCollidedWithBottomWall(this, hitbox);

        if (players.playerTwo !== null) {
            collidedWithPlayerTwoTopWall = players.playerTwo.hasCollidedWithTopWall(this, hitbox);
            collidedWithPlayerTwoBottomWall = players.playerTwo.hasCollidedWithBottomWall(this, hitbox);
        };

        if (ai.aiOne !== null) {
            collidedWithAiOneTopWall = ai.aiOne.hasCollidedWithTopWall(this, hitbox);
            collidedWithAiOneBottomWall = ai.aiOne.hasCollidedWithBottomWall(this, hitbox);
        };

        if (ai.aiTwo !== null) {
            collidedWithAiTwoTopWall = ai.aiTwo.hasCollidedWithTopWall(this, hitbox);
            collidedWithAiTwoBottomWall = ai.aiTwo.hasCollidedWithBottomWall(this, hitbox);
        };

        if (collidedWithPlayerOneTopWall || collidedWithPlayerOneBottomWall) {
            this.increaseSpeed('38', '40', players.playerOne);
        };

        if (collidedWithPlayerTwoTopWall || collidedWithPlayerTwoBottomWall) {
            this.increaseSpeed('83', '87', players.playerTwo);
        };

        if (collidedWithAiOneTopWall || collidedWithAiOneBottomWall) {
            if (ai.aiOne.defaultSpeedModifier === 0.5) {
                audio.playSound(audio.generateDefaultHitSound());
            } else {
                audio.playSound(audio.generateIncreasedHitSound());
            };

            this.modifyXSpeedBy(ai.aiOne.defaultSpeedModifier);
            this.modifyYSpeedBy(ai.aiOne.defaultSpeedModifier);
        };

        if (collidedWithAiTwoTopWall || collidedWithAiTwoBottomWall) {
            if (ai.aiTwo.defaultSpeedModifier === 0.5) {
                audio.playSound(audio.generateDefaultHitSound());
            } else {
                audio.playSound(audio.generateIncreasedHitSound());
            };

            this.modifyXSpeedBy(ai.aiTwo.defaultSpeedModifier);
            this.modifyYSpeedBy(ai.aiTwo.defaultSpeedModifier);
        };

        if (collidedWithPlayerOneTopWall) {
            this.y = players.playerOne.y - safespace;
        };

        if (collidedWithPlayerOneBottomWall) {
            this.y = players.playerOne.y + players.playerOne.height + safespace;
        };

        if (collidedWithPlayerTwoTopWall) {
            this.y = players.playerTwo.y - safespace;
        };

        if (collidedWithPlayerTwoBottomWall) {
            this.y = players.playerTwo.y + players.playerTwo.height + safespace;
        };

        if (collidedWithAiOneTopWall) {
            this.y = ai.aiOne.y - safespace;
        };

        if (collidedWithAiOneBottomWall) {
            this.y = ai.aiOne.y + ai.aiOne.height + safespace;
        };

        if (collidedWithAiTwoTopWall) {
            this.y = ai.aiTwo.y - safespace;
        };

        if (collidedWithAiTwoBottomWall) {
            this.y = ai.aiTwo.y + ai.aiTwo.height + safespace;
        };

        if (collidedWithPlayerOneTopWall || collidedWithPlayerOneBottomWall || collidedWithPlayerTwoTopWall || collidedWithPlayerTwoBottomWall
            || collidedWithAiOneTopWall || collidedWithAiOneBottomWall || collidedWithAiTwoTopWall || collidedWithAiTwoBottomWall) {
            this.reverseY();
            this.reverseX();
            return true;
        } else {
            return false;
        };
    };

    this.checkCollisionWithLeftAndRightBalls = function (hitbox, safespace) {
        let collidedWithPlayerOneRightWall = false;
        let collidedWithPlayerTwoRightWall = false;
        let collidedWithAiOneRightWall = false;
        let collidedWithAiTwoRightWall = false;

        let collidedWithPlayerOneLeftWall = false;
        let collidedWithPlayerTwoLeftWall = false;
        let collidedWithAiOneLeftWall = false;
        let collidedWithAiTwoLeftWall = false;

        collidedWithPlayerOneRightWall = players.playerOne.hasCollidedWithRightWall(this, hitbox);
        collidedWithPlayerOneLeftWall = players.playerOne.hasCollidedWithLeftWall(this, hitbox);

        if (players.playerTwo !== null) {
            collidedWithPlayerTwoRightWall = players.playerTwo.hasCollidedWithRightWall(this, hitbox);
            collidedWithPlayerTwoLeftWall = players.playerTwo.hasCollidedWithLeftWall(this, hitbox);
        };

        if (ai.aiOne !== null) {
            collidedWithAiOneRightWall = ai.aiOne.hasCollidedWithRightWall(this, hitbox);
            collidedWithAiOneLeftWall = ai.aiOne.hasCollidedWithLeftWall(this, hitbox);
        };

        if (ai.aiTwo !== null) {
            collidedWithAiTwoRightWall = ai.aiTwo.hasCollidedWithRightWall(this, hitbox);
            collidedWithAiTwoLeftWall = ai.aiTwo.hasCollidedWithLeftWall(this, hitbox);
        };

        if (collidedWithPlayerOneRightWall || collidedWithPlayerOneLeftWall) {
            this.increaseSpeed('38', '40', players.playerOne);
        };

        if (collidedWithPlayerTwoRightWall || collidedWithPlayerTwoLeftWall) {
            this.increaseSpeed('83', '87', players.playerTwo);
        };

        if (collidedWithAiOneLeftWall || collidedWithAiOneRightWall) {
            if (ai.aiOne.defaultSpeedModifier === 0.5) {
                audio.playSound(audio.generateDefaultHitSound());
            } else {
                audio.playSound(audio.generateIncreasedHitSound());
            };

            this.modifyXSpeedBy(ai.aiOne.defaultSpeedModifier);
            this.modifyYSpeedBy(ai.aiOne.defaultSpeedModifier);
        };

        if (collidedWithAiTwoLeftWall || collidedWithAiTwoRightWall) {
            if (ai.aiTwo.defaultSpeedModifier === 0.5) {
                audio.playSound(audio.generateDefaultHitSound());
            } else {
                audio.playSound(audio.generateIncreasedHitSound());
            };

            this.modifyXSpeedBy(ai.aiTwo.defaultSpeedModifier);
            this.modifyYSpeedBy(ai.aiTwo.defaultSpeedModifier);
        };

        if (collidedWithPlayerOneRightWall) {
            this.x = playersPaddlesData.playerOnePaddleData.xPosition + playersPaddlesData.playerOnePaddleData.width + safespace;
        };

        if (collidedWithPlayerOneLeftWall) {
            this.x = playersPaddlesData.playerOnePaddleData.xPosition - safespace;
        };

        if (game.playersModeOption === 33) {
            if (collidedWithPlayerTwoRightWall) {
                this.x = aiPaddlesData.aiOnePaddleData.xPosition + playersPaddlesData.playerTwoPaddleData.width + safespace;
            };

            if (collidedWithPlayerTwoLeftWall) {
                this.x = aiPaddlesData.aiOnePaddleData.xPosition - safespace;
            };

        } else {

            if (collidedWithPlayerTwoRightWall) {
                this.x = playersPaddlesData.playerTwoPaddleData.xPosition + playersPaddlesData.playerTwoPaddleData.width + safespace;
            };

            if (collidedWithPlayerTwoLeftWall) {
                this.x = playersPaddlesData.playerTwoPaddleData.xPosition - safespace;
            };
        };

        if (collidedWithAiOneLeftWall) {
            this.x = aiPaddlesData.aiOnePaddleData.xPosition - safespace;
        };

        if (collidedWithAiOneRightWall) {
            this.x = aiPaddlesData.aiOnePaddleData.xPosition + aiPaddlesData.aiOnePaddleData.width + safespace;
        };

        if (collidedWithAiTwoLeftWall) {
            this.x = aiPaddlesData.aiTwoPaddleData.xPosition - safespace;
        };

        if (collidedWithAiTwoRightWall) {
            this.x = aiPaddlesData.aiTwoPaddleData.xPosition + aiPaddlesData.aiTwoPaddleData.width + safespace;
        };

        if (collidedWithPlayerOneRightWall || collidedWithPlayerOneLeftWall || collidedWithPlayerTwoRightWall || collidedWithPlayerTwoLeftWall
            || collidedWithAiOneLeftWall || collidedWithAiOneRightWall || collidedWithAiTwoLeftWall || collidedWithAiTwoRightWall) {
            this.reverseX();
        };
    };

    this.checkCollisionWithInnerSpace = function (safespace) {
        let collidedWithPlayerOneInnerSpace = false;
        let collidedWithPlayerTwoInnerSpace = false;
        let collidedWithAiOneInnerSpace = false;
        let collidedWithAiTwoInnerSpace = false;

        collidedWithPlayerOneInnerSpace = players.playerOne.hasCollidedWithInnerSpace(this);

        if (players.playerTwo !== null) {
            collidedWithPlayerTwoInnerSpace = players.playerTwo.hasCollidedWithInnerSpace(this);
        };

        if (ai.aiOne !== null) {
            collidedWithAiOneInnerSpace = ai.aiOne.hasCollidedWithInnerSpace(this);
        };

        if (ai.aiTwo !== null) {
            collidedWithAiTwoInnerSpace = ai.aiTwo.hasCollidedWithInnerSpace(this);
        };

        if (collidedWithPlayerOneInnerSpace) {
            if (this.y - players.playerOne.y < (players.playerOne.y + players.playerOne.height) - this.y) {
                this.y = players.playerOne.y - safespace;
            } else {
                this.y = (players.playerOne.y + players.playerOne.height) + safespace;
            };
        };

        if (collidedWithPlayerTwoInnerSpace) {
            if (this.y - players.playerTwo.y < (players.playerTwo.y + players.playerTwo.height) - this.y) {
                this.y = players.playerTwo.y - safespace;
            } else {
                this.y = (players.playerTwo.y + players.playerTwo.height) + safespace;
            };
        };

        if (collidedWithAiOneInnerSpace) {
            if (this.y - ai.aiOne.y < (ai.aiOne.y + ai.aiOne.height) - this.y) {
                this.y = ai.aiOne.y - safespace;
            } else {
                this.y = (ai.aiOne.y + ai.aiOne.height) + safespace;
            };
        };

        if (collidedWithAiTwoInnerSpace) {
            if (this.y - ai.aiTwo.y < (ai.aiTwo.y + ai.aiTwo.height) - this.y) {
                this.y = ai.aiTwo.y - safespace;
            } else {
                this.y = (ai.aiTwo.y + ai.aiTwo.height) + safespace;
            };
        };
    };

    this.updateBall = function () {
        if (this.x < 0) {
            game.aiWins++;
            this.playLoseWinSounds();
            ui.updateScore();
        };

        if (this.x > canvas.width) {
            game.playersWins++;
            this.playLoseWinSounds();
            ui.updateScore();
        };

        if (this.y <= 10 || this.y >= canvas.height - 10) {
            this.reverseY();
        };

        let anyCollisionWithTopAndBottomWalls = this.checkCollisionWithTopAndBottomWalls(14, 16 + playersPaddlesData.playerOnePaddleData.speed);

        if (!anyCollisionWithTopAndBottomWalls) {
            this.checkCollisionWithLeftAndRightBalls(14, 16);
        };

        this.checkCollisionWithInnerSpace(16 + playersPaddlesData.playerOnePaddleData.speed);

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.y < 0) {
            this.y = 11;
            this.ySpeed = 14.2;
        } else if (this.y > 800) {
            this.y = 789;
            this.ySpeed = -14.2;
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

        drawTarget: function (ai, aiMiddle, ballToControl, color) {
            ctx.beginPath();
            ctx.moveTo(ai.x, aiMiddle);
            ctx.lineTo(ballsArray[ballToControl].x, ballsArray[ballToControl].y);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.closePath();
        },

        /*-------------------------------------------------------------------------------------------------------------*/

        findTheBallThatHasMinimumDistanceToAI: function (ballsArray, ai) {
            if (ballsArray.length === 0 || !ai) {
                return 0;
            };

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

        findTheBallThatHasMinimumDistanceToAIConsideringBallXDirection: function (ballsArray, ai) {
            if (ballsArray.length === 0 || !ai) {
                return 0;
            };

            let distancesFromBallsToAI = [];

            for (let i = 0; i < ballsArray.length; i++) {
                distancesFromBallsToAI[i] = Math.sqrt(Math.pow((ai.x - ballsArray[i].x), 2) + Math.pow((ai.y + (ai.height / 2) - ballsArray[i].y), 2));
            };

            let minimumDistanceToAI = canvas.width;
            let ballThatHasMinimumDistanceToAI = null;

            for (let i = 0; i < distancesFromBallsToAI.length; i++) {
                if (distancesFromBallsToAI[i] < minimumDistanceToAI && ballsArray[i].xSpeed > 0) {
                    minimumDistanceToAI = distancesFromBallsToAI[i];
                    ballThatHasMinimumDistanceToAI = i;
                };
            };

            if (ballThatHasMinimumDistanceToAI === null) {
                ballThatHasMinimumDistanceToAI = controls.aiControls.findTheBallThatHasMinimumDistanceToAI(ballsArray, ai)
            };

            return ballThatHasMinimumDistanceToAI;
        },

        findTheBallThatHasMinimumDistanceToRightSide: function (ballsArray) {
            if (ballsArray.length === 0) {
                return 0;
            };

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

        findTheBallThatHasMinimumDistanceToRightSideConsideringBallXDirection: function (ballsArray) {
            if (ballsArray.length === 0) {
                return 0;
            };

            let distancesFromBallsToRightSide = [];

            for (let i = 0; i < ballsArray.length; i++) {
                distancesFromBallsToRightSide[i] = canvas.width - ballsArray[i].x;
            };

            let minimumDistanceToRightSide = canvas.width;
            let ballThatHasMinimumDistanceToRightSide = null;

            for (let i = 0; i < distancesFromBallsToRightSide.length; i++) {
                if (distancesFromBallsToRightSide[i] < minimumDistanceToRightSide && ballsArray[i].xSpeed > 0) {
                    minimumDistanceToRightSide = distancesFromBallsToRightSide[i];
                    ballThatHasMinimumDistanceToRightSide = i;
                };
            };

            if (ballThatHasMinimumDistanceToRightSide === null) {
                ballThatHasMinimumDistanceToRightSide = controls.aiControls.findTheBallThatHasMinimumDistanceToRightSide(ballsArray);
            };

            return ballThatHasMinimumDistanceToRightSide;
        },

        updateAiControlsOne: function (ai) {
            let aiMiddle = ai.y + (ai.height / 2);
            let ballToControl;

            if (game.playersModeOption === 11 || game.playersModeOption === 21) {
                switch (game.aiDifficulty) {
                    case 1:
                        ai.speed = aiPaddlesData.aiOnePaddleData.speed - 3;
                        ballToControl = ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToAI(ballsArray, ai);
                        break;

                    case 2:
                        ai.speed = aiPaddlesData.aiOnePaddleData.speed - 1;
                        ballToControl = ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToAI(ballsArray, ai);
                        break;

                    case 3:
                        ai.speed = aiPaddlesData.aiOnePaddleData.speed + 1;
                        ballToControl = ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToAIConsideringBallXDirection(ballsArray, ai);
                        break;

                    case 4:
                        ai.speed = aiPaddlesData.aiOnePaddleData.speed + 2;
                        ballToControl = ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToRightSide(ballsArray);
                        break;

                    case 5:
                        ai.speed = aiPaddlesData.aiOnePaddleData.speed + 3;
                        ballToControl = ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToRightSideConsideringBallXDirection(ballsArray);
                        break;

                    default:
                        break;
                };

                if (!ballToControl) {
                    ballToControl = 0;
                };

                if (ballsArray[ballToControl]) {
                    if (aiMiddle < ballsArray[ballToControl].y) {
                        controls.aiControls.move('40', ai);
                    };

                    if (aiMiddle > ballsArray[ballToControl].y) {
                        controls.aiControls.move('38', ai);
                    };

                    if (aiMiddle === ballsArray[ballToControl].y) {
                        ai.defaultSpeedModifier = aiPaddlesData.aiOnePaddleData.defaultSpeedModifier;
                    };
                };

            } else {

                switch (game.aiDifficulty) {
                    case 1:
                        ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToAI(ballsArray, ai);

                        if (ballsArray.length > 2) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed;
                        } else if (ballsArray.length === 1) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed - 4;
                        } else if (ballsArray.length === 2) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed - 4;
                        };

                        break;

                    case 2:
                        ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToAIConsideringBallXDirection(ballsArray, ai);

                        if (ballsArray.length > 2) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed - 1;
                        } else if (ballsArray.length === 1) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed - 3;
                        } else if (ballsArray.length === 2) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed - 3;
                        };

                        break;

                    case 3:
                        ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToRightSide(ballsArray);

                        if (ballsArray.length > 2) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed;
                        } else if (ballsArray.length === 1) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed - 3;
                        } else if (ballsArray.length === 2) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed - 2.5;
                        };

                        break;

                    case 4:
                        ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToRightSideConsideringBallXDirection(ballsArray);

                        if (ballsArray.length > 2) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed;
                        } else if (ballsArray.length === 1) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed - 2;
                        } else if (ballsArray.length === 2) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed - 1.5;
                        };

                        break;

                    case 5:
                        ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToRightSideConsideringBallXDirection(ballsArray);

                        if (ballsArray.length > 2) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed + 3;
                        } else if (ballsArray.length === 1) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed - 1.5;
                        } else if (ballsArray.length === 2) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed - 1;
                        };

                        break;

                    default:
                        break;
                };

                if (!ballToControl) {
                    ballToControl = 0;
                };

                if (ballsArray[ballToControl]) {
                    if (aiMiddle < ballsArray[ballToControl].y) {
                        controls.aiControls.move('40', ai);
                    };

                    if (aiMiddle > ballsArray[ballToControl].y) {
                        controls.aiControls.move('38', ai);
                    };

                    if (aiMiddle === ballsArray[ballToControl].y) {
                        ai.defaultSpeedModifier = aiPaddlesData.aiOnePaddleData.defaultSpeedModifier;
                    };
                };
            };

            // controls.aiControls.drawTarget(ai, aiMiddle, ballToControl, ai.color);
        },

        /*-------------------------------------------------------------------------------------------------------------*/

        findTheBallThatHasSecondMinimumDistanceToAI: function (ballsArray, ai) {
            if (ballsArray.length === 0 || !ai) {
                return 0;
            };

            let distancesFromBallsToAI = [];

            for (let i = 0; i < ballsArray.length; i++) {
                distancesFromBallsToAI[i] = Math.sqrt(Math.pow((ai.x - ballsArray[i].x), 2) + Math.pow((ai.y + (ai.height / 2) - ballsArray[i].y), 2));
            };

            let sortedDistancesFromBallsToAI = helper.sortArray(distancesFromBallsToAI);

            for (let i = 0; i < distancesFromBallsToAI.length; i++) {
                if (distancesFromBallsToAI[i] === sortedDistancesFromBallsToAI[1]) {
                    return i;
                };
            };
        },

        findTheBallThatHasSecondMinimumDistanceToAIConsideringBallXDirection: function (ballsArray, ai) {
            if (ballsArray.length === 0 || !ai) {
                return 0;
            };

            let distancesFromBallsToAI = [];

            for (let i = 0; i < ballsArray.length; i++) {
                distancesFromBallsToAI[i] = Math.sqrt(Math.pow((ai.x - ballsArray[i].x), 2) + Math.pow((ai.y + (ai.height / 2) - ballsArray[i].y), 2));
            };

            let sortedDistancesFromBallsToAI = helper.sortArray(distancesFromBallsToAI);

            for (let i = 1; i < sortedDistancesFromBallsToAI.length; i++) {
                for (let j = 0; j < distancesFromBallsToAI.length; j++) {
                    if (distancesFromBallsToAI[j] === sortedDistancesFromBallsToAI[i] && ballsArray[j].xSpeed > 0) {
                        return j;
                    };
                };
            };

            return controls.aiControls.findTheBallThatHasSecondMinimumDistanceToAI(ballsArray, ai);
        },

        findTheBallThatHasSeconsMinimumDistanceToRightSide: function (ballsArray) {
            if (ballsArray.length === 0) {
                return 0;
            };

            let distancesFromBallsToRightSide = [];

            for (let i = 0; i < ballsArray.length; i++) {
                distancesFromBallsToRightSide[i] = canvas.width - ballsArray[i].x;
            };

            let sortedDistancesFromBallsToRightSide = helper.sortArray(distancesFromBallsToRightSide);

            for (let i = 0; i < distancesFromBallsToRightSide.length; i++) {
                if (distancesFromBallsToRightSide[i] === sortedDistancesFromBallsToRightSide[1]) {
                    return i;
                };
            };
        },

        findTheBallThatHasSeconsMinimumDistanceToRightSideConsideringBallXDirection: function (ballsArray) {
            if (ballsArray.length === 0) {
                return 0;
            };

            let distancesFromBallsToRightSide = [];

            for (let i = 0; i < ballsArray.length; i++) {
                distancesFromBallsToRightSide[i] = canvas.width - ballsArray[i].x;
            };

            let sortedDistancesFromBallsToRightSide = helper.sortArray(distancesFromBallsToRightSide);

            for (let i = 1; i < sortedDistancesFromBallsToRightSide.length; i++) {
                for (let j = 0; j < distancesFromBallsToRightSide.length; j++) {
                    if (distancesFromBallsToRightSide[j] === sortedDistancesFromBallsToRightSide[i] && ballsArray[j].xSpeed > 0) {
                        return j;
                    };
                };
            };

            return controls.aiControls.findTheBallThatHasSeconsMinimumDistanceToRightSide(ballsArray);
        },

        updateAiControlsTwo: function (aiOne, aiTwo) {
            let aiMiddle = aiOne.y + (aiOne.height / 2);
            let ballToControl;

            if (game.ballCountOption > 1) {
                switch (game.aiDifficulty) {
                    case 1:
                        ballToControl = controls.aiControls.findTheBallThatHasSecondMinimumDistanceToAI(ballsArray, aiOne);

                        if (ballsArray.length > 2) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed;
                        } else if (ballsArray.length === 1) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed - 4;
                        } else if (ballsArray.length === 2) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed - 4;
                        };

                        break;

                    case 2:
                        ballToControl = controls.aiControls.findTheBallThatHasSecondMinimumDistanceToAIConsideringBallXDirection(ballsArray, aiOne);

                        if (ballsArray.length > 2) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed - 1;
                        } else if (ballsArray.length === 1) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed - 4;
                        } else if (ballsArray.length === 2) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed - 3;
                        };

                        break;

                    case 3:
                        ballToControl = controls.aiControls.findTheBallThatHasSecondMinimumDistanceToAIConsideringBallXDirection(ballsArray, aiOne);

                        if (ballsArray.length > 2) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed + 3;
                        } else if (ballsArray.length === 1) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed - 3;
                        } else if (ballsArray.length === 2) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed - 1.5;
                        };

                        break;

                    case 4:
                        ballToControl = controls.aiControls.findTheBallThatHasSeconsMinimumDistanceToRightSide(ballsArray);

                        if (ballsArray.length > 2) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed + 1;
                        } else if (ballsArray.length === 1) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed - 3;
                        } else if (ballsArray.length === 2) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed - 1.5;
                        };

                        break;

                    case 5:
                        ballToControl = controls.aiControls.findTheBallThatHasSeconsMinimumDistanceToRightSideConsideringBallXDirection(ballsArray);

                        if (ballsArray.length > 2) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed;
                        } else if (ballsArray.length === 1) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed - 2;
                        } else if (ballsArray.length === 2) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed - 1;
                        };

                        break;

                    default:
                        break;
                };

                if (ballsArray[ballToControl]) {
                    if (aiMiddle < ballsArray[ballToControl].y) {
                        controls.aiControls.move('40', aiOne);
                    };

                    if (aiMiddle > ballsArray[ballToControl].y) {
                        controls.aiControls.move('38', aiOne);
                    };

                    if (aiMiddle === ballsArray[ballToControl].y) {
                        aiOne.defaultSpeedModifier = aiPaddlesData.aiTwoPaddleData.defaultSpeedModifier;
                    };
                };

            } else if (game.ballCountOption === 1) {

                ballToControl = 0;
                aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed;

                if (ballsArray[0]) {
                    if (aiMiddle < ballsArray[ballToControl].y) {
                        controls.aiControls.move('40', aiOne);
                    };

                    if (aiMiddle > ballsArray[ballToControl].y) {
                        controls.aiControls.move('38', aiOne);
                    };

                    if (aiMiddle === ballsArray[ballToControl].y) {
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
            };

            // controls.aiControls.drawTarget(aiOne, aiMiddle, ballToControl, aiOne.color);
        },

        /*-------------------------------------------------------------------------------------------------------------*/

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
                balls[i].radius = helper.getRandomNumberFromRange(11, 13);
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

    renderPaddle: function (paddle, color, strokeColor, paddleImage) {
        if (game.theme === 'default') {
            ctx.beginPath();
            ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);

            ctx.fillStyle = color;
            ctx.fill();

            ctx.lineWidth = 2.5;
            ctx.strokeStyle = strokeColor;
            ctx.stroke();
        } else if (game.theme === 'sonic') {
            ctx.beginPath();
            ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);

            ctx.fillStyle = color;
            ctx.fill();

            ctx.lineWidth = 2.5;
            ctx.strokeStyle = strokeColor;
            ctx.stroke();

            let image = new Image(28, 28);
            image.src = paddleImage;
            ctx.drawImage(image, paddle.x + 1, paddle.y + (paddle.height - image.width) / 2, image.width, image.height);
        };
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

    draw: function (paddles, balls, paddlesColors, paddlesStrokeColors, paddlesImages) {
        ctx.globalCompositeOperation = 'source-over';
        this.renderField();

        for (let i = 0; i < paddles.length; i++) {
            if (paddles[i]) {
                ctx.globalCompositeOperation = 'source-over';
                this.renderPaddle(paddles[i], paddlesColors[i], paddlesStrokeColors[i], paddlesImages[i]);

                // ctx.font = '30px serif';
                // ctx.fillStyle = 'white';
                // ctx.fillText(i, paddles[i].x, paddles[i].y + (paddles[i].height / 2));
            };
        };

        for (let i = 0; i < balls.length; i++) {
            if (balls[i]) {
                ctx.globalCompositeOperation = 'source-over';
                this.renderBall(balls[i], balls[i].color, balls[i].strokeColor);

                ctx.font = '30px serif';
                // ctx.fillStyle = 'white';
                // ctx.fillText(i, balls[i].x, balls[i].y);

                // if (balls[i].xSpeed > 0) {
                //     ctx.fillStyle = 'white';
                //     ctx.fillText('#' + i + ` I'm good ` + (canvas.width - balls[i].x), balls[i].x, balls[i].y);
                // };

                // if (balls[i].xSpeed < 0) {
                //     ctx.fillStyle = 'red';
                //     ctx.fillText('#' + i + ` I'm bad ` + (canvas.width - balls[i].x), balls[i].x, balls[i].y);
                // };

                // ctx.beginPath();
                // ctx.moveTo(balls[i].x, balls[i].y);
                // ctx.lineTo(balls[i].x + balls[i].xSpeed * 20, balls[i].y + balls[i].ySpeed * 20);
                // ctx.strokeStyle = 'white';
                // ctx.lineWidth = 3;
                // ctx.stroke();
                // ctx.closePath();
            };
        };
    }
};

/*-------------------------------------------------------------------------------------------------------------*/

let audio = {
    volume: 0.05,

    generateDefaultHitSound: function () {
        switch (game.theme) {
            case 'default':
                return new Audio('./src/sounds/default-sounds/default-hit-sound-default.wav');

            case 'sonic':
                return new Audio('./src/sounds/sonic-sounds/default-hit-sound-sonic.mp3');

            default:
                break;
        };
    },

    generateIncreasedHitSound: function () {
        switch (game.theme) {
            case 'default':
                return new Audio('./src/sounds/default-sounds/increased-hit-sound-default.wav');

            case 'sonic':
                return new Audio('./src/sounds/sonic-sounds/increased-hit-sound-sonic.mp3');

            default:
                break;
        };
    },

    generateScoreSound: function () {
        switch (game.theme) {
            case 'default':
                return new Audio('./src/sounds/default-sounds/score-sound-default.wav');

            case 'sonic':
                return new Audio('./src/sounds/sonic-sounds/score-sound-sonic.mp3');

            default:
                break;
        };
    },

    generateLoseSound: function () {
        switch (game.theme) {
            case 'default':
                return new Audio('./src/sounds/default-sounds/lose-sound-default.wav');

            case 'sonic':
                return new Audio('./src/sounds/sonic-sounds/lose-sound-sonic.mp3');

            default:
                break;
        };
    },

    generateWinSound: function () {
        switch (game.theme) {
            case 'default':
                return new Audio('./src/sounds/default-sounds/win-sound-default.wav');

            case 'sonic':
                return new Audio('./src/sounds/sonic-sounds/win-sound-sonic.mp3');

            default:
                break;
        };
    },

    defaultBackgroundMusic: new Audio('./src/music/music-default.wav'),
    sonicBackgroundMusic: new Audio('./src/music/music-sonic.mp3'),

    isBackgroundMusicPaused: false,

    checkMusicTheme: function () {
        switch (game.theme) {
            case 'default':
                return audio.defaultBackgroundMusic;

            case 'sonic':
                return audio.sonicBackgroundMusic;

            default:
                break;
        };
    },

    playSound: function (sound) {
        sound.volume = audio.volume;
        sound.play();
    },

    pauseSound: function (sound) {
        audio.sonicBackgroundMusic.currentTime = 0;
        audio.defaultBackgroundMusic.currentTime = 0;

        sound.volume = audio.volume;
        sound.pause();
    },

    initiateBackgroudMusicLooping: function () {
        audio.defaultBackgroundMusic.loop = true;
        audio.sonicBackgroundMusic.loop = true;
    }
};

audio.initiateBackgroudMusicLooping();