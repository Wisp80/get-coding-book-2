let canvas = document.getElementsByClassName('canvas')[0];
let ctx = canvas.getContext('2d');
let canvasWidth = 1600;
let canvasHeight = 800;

/*-------------------------------------------------------------------------------------------------------------*/

let helper = {
    getTrueRandomNumber: function (lowerBound, upperBound) {
        let coin = Math.floor(Math.random() * 2);

        if (coin === 0) {
            return Math.floor(Math.random() * lowerBound);
        } else {
            return Math.floor(Math.random() * upperBound);
        };
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
    }
};

/*-------------------------------------------------------------------------------------------------------------*/

let game = {
    bestOfOption: 1,
    playersModeOption: 11,
    playersWins: 0,
    aiWins: 0,
    tickTimeout: null,
    tickRate: 1000 / 60,

    tick: function () {
        window.clearTimeout(game.tickTimeout);

        game.prepareDataForNextTick();

        game.renderPreparedDataForNextTick();

        game.tickTimeout = window.setTimeout('game.tick()', game.tickRate);
    },

    prepareDataForNextTick: function () {
        controls.playersControls.initializeWatchPlayersControls();

        controls.playersControls.updatePlayersControls(players.playerOne, '38', '40');

        if (game.playersModeOption === 21 || game.playersModeOption === 22) {
            controls.playersControls.updatePlayersControls(players.playerTwo, '87', '83');
        };

        controls.aiControls.updateAiControlsOne(ai.aiOne, balls.ballOne);

        if (game.playersModeOption === 12 || game.playersModeOption === 22) {
            controls.aiControls.updateAiControlsTwo(ai.aiTwo, ai.aiOne, balls.ballOne);
        };

        balls.ballOne.updateBall();
    },

    renderPreparedDataForNextTick: function () {
        switch (game.playersModeOption) {
            case 11:
                render.draw([players.playerOne, ai.aiOne], [balls.ballOne], ['red', 'yellow'], ['white']);
                break;

            case 12:
                render.draw([players.playerOne, ai.aiOne, ai.aiTwo], [balls.ballOne], ['red', 'yellow', 'green'], ['white']);
                break;

            case 21:
                render.draw([players.playerOne, players.playerTwo, ai.aiOne], [balls.ballOne], ['red', 'blue', 'yellow'], ['white']);
                break;

            case 22:
                render.draw([players.playerOne, players.playerTwo, ai.aiOne, ai.aiTwo], [balls.ballOne], ['red', 'blue', 'yellow', 'green'], ['white']);
                break;

            default:
                break;
        };
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

            default:
                break;
        };
    },

    choosePlayersModeOption: function (el) {
        helper.highlightElement(el, 'players-mode-container');

        switch (el.innerText) {
            case '1 Player VS 1 AI':
                game.playersModeOption = 11;
                break;

            case '1 Player VS 2 AI':
                game.playersModeOption = 12;
                break;

            case '2 Players VS 1 AI':
                game.playersModeOption = 21;
                break;

            case '2 Players VS 2 AI':
                game.playersModeOption = 22;
                break;

            default:
                break;
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
                playersPaddlesData.playerTwoPaddleData.currentSpeedModifier,
                playersPaddlesData.playerTwoPaddleData.speed
            );
        };

        if (game.playersModeOption === 12 || game.playersModeOption === 22) {
            ai.aiTwo = new Paddle(
                aiPaddlesData.aiOnePaddleData.xPosition,
                aiPaddlesData.aiOnePaddleData.yPosition,
                aiPaddlesData.aiOnePaddleData.width,
                aiPaddlesData.aiOnePaddleData.height,
                aiPaddlesData.aiOnePaddleData.defaultSpeedModifier,
                aiPaddlesData.aiOnePaddleData.currentSpeedModifier,
                aiPaddlesData.aiOnePaddleData.speed
            );
        };
        controls.playersControls.reset([players.playerOne, players.playerTwo]);
        controls.aiControls.reset([ai.aiOne, ai.aiTwo]);
        controls.ballsControls.reset([balls.ballOne]);

        game.updateWinsInfoAndScoreText();

        helper.changeDisplay('start-screen', 'none');
        helper.changeDisplay('mainframe', 'flex');

        game.tick();
    },

    restart: function () {
        helper.changeDisplay('gameover-container', 'none');
        helper.changeDisplay('mainframe', 'flex');

        controls.playersControls.reset([players.playerOne, players.playerTwo]);
        controls.aiControls.reset([ai.aiOne, ai.aiTwo]);
        controls.ballsControls.reset([balls.ballOne]);
    },

    goToMainMenu: function () {
        helper.changeDisplay('start-screen', 'flex');
        helper.changeDisplay('gameover-container', 'none');
    },

    updateScore: function () {
        controls.playersControls.reset([players.playerOne, players.playerTwo]);
        controls.aiControls.reset([ai.aiOne, ai.aiTwo]);
        controls.ballsControls.reset([balls.ballOne]);

        game.updateWinsInfoAndScoreText();

        if (game.aiWins >= (game.bestOfOption / 2) + 0.5 || game.playersWins >= (game.bestOfOption / 2) + 0.5) {
            controls.ballsControls.freeze([balls.ballOne]);

            helper.changeDisplay('mainframe', 'none');
            helper.changeDisplay('gameover-container', 'flex');

            game.updateWinsInfoAndScoreText();
            game.resetScore();
            document.getElementsByClassName('wins-info')[0].innerHTML = 'You ' + game.playersWins + ' : ' + game.aiWins + ' AI';
        };
    },

    updateWinsInfoAndScoreText: function () {
        document.getElementsByClassName('wins-info')[0].innerHTML = 'You ' + game.playersWins + ' : ' + game.aiWins + ' AI';
        document.getElementsByClassName('score-text')[0].innerHTML = 'You ' + game.playersWins + ' : ' + game.aiWins + ' AI';
    },

    resetScore: function () {
        game.aiWins = 0;
        game.playersWins = 0;
    }
};

/*-------------------------------------------------------------------------------------------------------------*/

function Paddle(x, y, width, height, speedModifier, currentSpeedModifier, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedModifier = speedModifier;
    this.currentSpeedModifier = currentSpeedModifier;
    this.speed = speed;

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
        width: 10,
        height: 100,
        xPosition: 5,
        yPosition: 500,
        defaultSpeedModifier: 1,
        currentSpeedModifier: 1.5,
        speed: 7
    },

    playerTwoPaddleData: {
        width: 10,
        height: 100,
        xPosition: 5,
        yPosition: 200,
        defaultSpeedModifier: 1,
        currentSpeedModifier: 1.5,
        speed: 7
    }
};

let players = {
    playerOne: new Paddle(
        playersPaddlesData.playerOnePaddleData.xPosition,
        playersPaddlesData.playerOnePaddleData.yPosition,
        playersPaddlesData.playerOnePaddleData.width,
        playersPaddlesData.playerOnePaddleData.height,
        playersPaddlesData.playerOnePaddleData.defaultSpeedModifier,
        playersPaddlesData.playerOnePaddleData.currentSpeedModifier,
        playersPaddlesData.playerOnePaddleData.speed
    ),

    playerTwo: null
};

let aiPaddlesData = {
    aiOnePaddleData: {
        width: 10,
        height: 100,
        xPosition: 1585,
        yPosition: 500,
        defaultSpeedModifier: 1,
        currentSpeedModifier: 1.5,
        speed: 7
    },

    aiTwoPaddleData: {
        width: 10,
        height: 100,
        xPosition: 1585,
        yPosition: 200,
        defaultSpeedModifier: 1,
        currentSpeedModifier: 1.5,
        speed: 7
    }
};

let ai = {
    aiOne: new Paddle(
        aiPaddlesData.aiOnePaddleData.xPosition,
        aiPaddlesData.aiOnePaddleData.yPosition,
        aiPaddlesData.aiOnePaddleData.width,
        aiPaddlesData.aiOnePaddleData.height,
        aiPaddlesData.aiOnePaddleData.defaultSpeedModifier,
        aiPaddlesData.aiOnePaddleData.currentSpeedModifier,
        aiPaddlesData.aiOnePaddleData.speed
    ),

    aiTwo: null
};

/*-------------------------------------------------------------------------------------------------------------*/

function Ball(x, y, radius, xSpeed, ySpeed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;

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

        this.xSpeed = nextValue;
    };

    this.modifyYSpeedBy = function (modification) {
        modification = this.ySpeed < 0 ? modification * -1 : modification;

        this.ySpeed += modification;
    };

    this.updateBall = function () {
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x < 0) {
            game.aiWins++;
            game.updateScore();
        };

        if (this.x > canvasWidth) {
            game.playersWins++;
            game.updateScore();
        };

        if (this.y <= 0 || this.y >= canvasHeight) {
            this.reverseY();
        };

        let collidedWithPlayer;
        let collidedWithAi

        if (players.playerTwo !== null) {
            collidedWithPlayer = players.playerOne.hasCollidedWith(this) || players.playerTwo.hasCollidedWith(this);
        } else {
            collidedWithPlayer = players.playerOne.hasCollidedWith(this);
        };

        if (ai.aiTwo !== null) {
            collidedWithAi = ai.aiOne.hasCollidedWith(this) || ai.aiTwo.hasCollidedWith(this);
        } else {
            collidedWithAi = ai.aiOne.hasCollidedWith(this);
        };

        if (collidedWithPlayer || collidedWithAi) {
            this.reverseX();
            this.modifyXSpeedBy(1);
            let speedUpValue = collidedWithPlayer ? players.playerOne.speedModifier : ai.aiOne.speedModifier;
            this.modifyYSpeedBy(speedUpValue);
        };
    };
};

let ballOneData = {
    xPosition: canvasWidth / 2,
    yPosition: canvasHeight / 2,
    radius: 3,
    xSpeed: 10,
    ySpeed: helper.getTrueRandomNumber(-5, 5)
};

let balls = {
    ballOne: new Ball(
        ballOneData.xPosition,
        ballOneData.yPosition,
        ballOneData.radius,
        ballOneData.xSpeed,
        ballOneData.ySpeed
    )
};

/*-------------------------------------------------------------------------------------------------------------*/

let controls = {
    playersControls: {
        heldDownKeysByPlayers: {},

        move: function (keyCode, player, keyUp, keyDown) {
            let nextY = player.y;

            if (keyCode === keyDown) {
                nextY += player.speed;
                player.speedModifier = player.currentSpeedModifier;
            } else if (keyCode === keyUp) {
                nextY += -1 * player.speed;
                player.speedModifier = player.currentSpeedModifier;
            };

            nextY = nextY < 0 ? 0 : nextY;
            nextY = nextY + player.height > canvasHeight ? canvasHeight - player.height : nextY;
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
                players[0].y = (canvasHeight - playersPaddlesData.playerOnePaddleData.height) / 2;
            } else if (game.playersModeOption === 21 || game.playersModeOption === 22) {
                players[0].y = playersPaddlesData.playerOnePaddleData.yPosition;

                if (players[1] !== null) {
                    players[1].y = playersPaddlesData.playerTwoPaddleData.yPosition;
                };
            };
        }
    },

    aiControls: {
        move: function (keyCode, ai) {
            let nextY = ai.y;

            if (keyCode === '40') {
                nextY += ai.speed;
                ai.speedModifier = ai.currentSpeedModifier;
            } else if (keyCode === '38') {
                nextY += -1 * ai.speed;
                ai.speedModifier = ai.currentSpeedModifier;
            };

            nextY = nextY < 0 ? 0 : nextY;
            nextY = nextY + ai.height > canvasHeight ? canvasHeight - ai.height : nextY;
            ai.y = nextY;
        },

        updateAiControlsOne: function (ai, ball) {
            let aiMiddle = ai.y + (ai.height / 2);

            if (aiMiddle < ball.y) {
                controls.aiControls.move('40', ai);
            };

            if (aiMiddle > ball.y) {
                controls.aiControls.move('38', ai);
            };
        },

        updateAiControlsTwo: function (aiOne, aiTwo, ball) {
            let aiMiddle = aiOne.y + (aiOne.height / 2);

            if (aiMiddle < ball.y) {
                controls.aiControls.move('40', aiOne);
            };

            if (aiMiddle > ball.y) {
                controls.aiControls.move('38', aiOne);
            };

            let aiTwoBottom = aiOne.y + aiOne.height;
            let aiOneTop = aiTwo.y;

            if ((aiOneTop - aiTwoBottom) <= 150) {
                controls.aiControls.move('38', aiOne);
            };

            if ((aiOneTop - aiTwoBottom) <= (-1 * aiOne.speed)) {
                controls.aiControls.move('40', aiTwo);
            };
        },

        reset: function (ai) {
            if (game.playersModeOption === 11 || game.playersModeOption === 21) {
                ai[0].y = (canvasHeight - aiPaddlesData.aiOnePaddleData.height) / 2;
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
                balls[i].x = ballOneData.xPosition;
                balls[i].y = ballOneData.yPosition;
                balls[i].xSpeed = ballOneData.xSpeed;
                balls[i].ySpeed = helper.getTrueRandomNumber(-5, 5);
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
        ctx.fillStyle = '#163728';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    },

    renderPaddle: function (paddle, color) {
        ctx.fillStyle = color;
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    },

    renderBall: function (ball, color) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
    },

    draw: function (paddles, balls, paddlesColors, ballsColors) {
        ctx.globalCompositeOperation = 'source-over';
        this.renderField();

        for (let i = 0; i < paddles.length; i++) {
            if (paddles[i]) {
                ctx.globalCompositeOperation = 'exclusion';
                this.renderPaddle(paddles[i], paddlesColors[i]);
            };
        };

        for (let i = 0; i < balls.length; i++) {
            if (balls[i]) {
                ctx.globalCompositeOperation = 'source-over';
                this.renderBall(balls[i], ballsColors[i]);
            };
        };
    }
};

/*-------------------------------------------------------------------------------------------------------------*/