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
    }
};

/*-------------------------------------------------------------------------------------------------------------*/

let game = {
    bestOfOption: 3,
    playersModeOption: 11,
    playersWins: 0,
    aiWins: 0,
    matchesCount: 1,

    tickTimeout: null,
    tickRate: 1000 / 60,

    tick: function () {
        window.clearTimeout(game.tickTimeout);

        controls.playersControls.initializeWatchPlayersControls();
        controls.playersControls.updatePlayersControls(players.playerOne, '38', '40');

        if (game.playersModeOption === 21) {
            controls.playersControls.updatePlayersControls(players.playerTwo, '87', '83');
        };

        controls.aiControls.aiOneControls.updateAiOneControls(ai.aiOne, balls.ballOne);

        balls.ballOne.updateBall();

        if (game.playersModeOption === 11) {
            render.draw([players.playerOne, ai.aiOne], [balls.ballOne]);
        } else if (game.playersModeOption === 12) {
            render.draw([players.playerOne, ai.aiOne], [balls.ballOne]);
        } else if (game.playersModeOption === 21) {
            render.draw([players.playerOne, players.playerTwo, ai.aiOne], [balls.ballOne]);
        } else {
            render.draw([players.playerOne, players.playerTwo, ai.aiOne], [balls.ballOne]);
        };

        game.tickTimeout = window.setTimeout('game.tick()', game.tickRate);
    },

    chooseBestOfOption: function (el) {
        el.classList.add('highlighted-button')

        for (let i = 0; i < document.getElementsByClassName('best-of-mode-container')[0].children.length; i++) {
            if (document.getElementsByClassName('best-of-mode-container')[0].children[i] !== el) {
                document.getElementsByClassName('best-of-mode-container')[0].children[i].classList.remove('highlighted-button');
            };
        };

        if (el.innerText === 'Best of 1') {
            game.bestOfOption = 1;
        } else if (el.innerText === 'Best of 3') {
            game.bestOfOption = 3;
        } else {
            game.bestOfOption = 5;
        };
    },

    choosePlayersModeOption: function (el) {
        el.classList.add('highlighted-button')

        for (let i = 0; i < document.getElementsByClassName('players-mode-container')[0].children.length; i++) {
            if (document.getElementsByClassName('players-mode-container')[0].children[i] !== el) {
                document.getElementsByClassName('players-mode-container')[0].children[i].classList.remove('highlighted-button');
            };
        };

        if (el.innerText === '1 Player VS 1 AI') {
            game.playersModeOption = 11;
        } else if (el.innerText === '1 Player VS 2 AI') {
            game.playersModeOption = 12;
        } else if (el.innerText === '2 Players VS 1 AI') {
            game.playersModeOption = 21;
        } else {
            game.playersModeOption = 22;
        };
    },

    startGame: function () {
        if (game.playersModeOption === 11 || game.playersModeOption === 12) {
            players.playerOne.y = (canvasHeight - playersPaddlesData.playerOnePaddleData.height) / 2;

            players.playerTwo = null;
        };

        if (game.playersModeOption === 21 || game.playersModeOption === 22) {
            players.playerTwo = new Paddle(
                playersPaddlesData.playerTwoPaddleData.xPosition,
                playersPaddlesData.playerTwoPaddleData.yPosition,
                playersPaddlesData.playerTwoPaddleData.width,
                playersPaddlesData.playerTwoPaddleData.height,
                playersPaddlesData.playerTwoPaddleData.defaultSpeedModifier,
                playersPaddlesData.playerTwoPaddleData.currentSpeedModifier
            );
        };

        game.updateWinsInfoAndScoreText();
        document.getElementsByClassName('start-screen')[0].style.display = 'none';
        document.getElementsByClassName('mainframe')[0].style.display = 'flex';
        balls.ballOne.reset();
        game.tick();
    },

    restart: function () {
        document.getElementsByClassName('gameover-container')[0].style.display = 'none';
        document.getElementsByClassName('mainframe')[0].style.display = 'flex';
        balls.ballOne.reset();
    },

    goToMenu: function () {
        document.getElementsByClassName('start-screen')[0].style.display = 'flex';
        document.getElementsByClassName('gameover-container')[0].style.display = 'none';
    },

    updateScore: function () {
        balls.ballOne.reset();
        players.playerOne.reset();
        ai.aiOne.reset();

        game.updateWinsInfoAndScoreText();

        game.matchesCount++;

        if (game.aiWins >= (game.bestOfOption / 2) + 0.5 || game.playersWins >= (game.bestOfOption / 2) + 0.5) {
            balls.ballOne.freeze();

            document.getElementsByClassName('mainframe')[0].style.display = 'none';
            document.getElementsByClassName('gameover-container')[0].style.display = 'flex';

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
        game.matchesCount = 1;
    }
};

/*-------------------------------------------------------------------------------------------------------------*/

function Paddle(x, y, width, height, speedModifier, currentSpeedModifier) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedModifier = speedModifier;
    this.currentSpeedModifier = currentSpeedModifier;

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

    this.reset = function () {
        this.x = x;

        if (game.playersModeOption === 11 || game.playersModeOption === 12) {
            this.y = (canvasHeight - playerOnePaddleData.height) / 2;
        } else {
            this.y = y;
        };
    }
};

let playersPaddlesData = {
    playerOnePaddleData: {
        width: 25,
        height: 100,
        xPosition: 5,
        yPosition: 500,
        defaultSpeedModifier: 1,
        currentSpeedModifier: 1.5
    },

    playerTwoPaddleData: {
        width: 25,
        height: 100,
        xPosition: 5,
        yPosition: 200,
        defaultSpeedModifier: 1,
        currentSpeedModifier: 1.5,
    }
};

let players = {
    playerOne: new Paddle(
        playersPaddlesData.playerOnePaddleData.xPosition,
        playersPaddlesData.playerOnePaddleData.yPosition,
        playersPaddlesData.playerOnePaddleData.width,
        playersPaddlesData.playerOnePaddleData.height,
        playersPaddlesData.playerOnePaddleData.defaultSpeedModifier,
        playersPaddlesData.playerOnePaddleData.currentSpeedModifier
    ),

    playerTwo: null
};

let aiPaddlesData = {
    aiOnePaddleData: {
        width: 25,
        height: 100,
        xPosition: 1570,
        yPosition: 350,
        defaultSpeedModifier: 1,
        currentSpeedModifier: 1.5
    },

    aiTwoPaddleData: {
        width: 25,
        height: 100,
        xPosition: 1570,
        yPosition: 500,
        defaultSpeedModifier: 1,
        currentSpeedModifier: 1.5
    }
};

let ai = {
    aiOne: new Paddle(
        aiPaddlesData.aiOnePaddleData.xPosition,
        aiPaddlesData.aiOnePaddleData.yPosition,
        aiPaddlesData.aiOnePaddleData.width,
        aiPaddlesData.aiOnePaddleData.height,
        aiPaddlesData.aiOnePaddleData.defaultSpeedModifier,
        aiPaddlesData.aiOnePaddleData.currentSpeedModifier
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

    this.reset = function () {
        this.x = ballOneData.xPosition;
        this.y = ballOneData.yPosition;
        this.xSpeed = ballOneData.xSpeed;
        this.ySpeed = helper.getTrueRandomNumber(-4, 4);
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

    this.freeze = function () {
        this.xSpeed = 0;
        this.ySpeed = 0;
    };

    this.updateBall = function (ball) {
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

        if (players.playerTwo !== null) {
            collidedWithPlayer = players.playerOne.hasCollidedWith(this) || players.playerTwo.hasCollidedWith(this);
        } else {
            collidedWithPlayer = players.playerOne.hasCollidedWith(this);
        };

        let collidedWithAi = ai.aiOne.hasCollidedWith(this);

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
    xSpeed: 11,
    ySpeed: helper.getTrueRandomNumber(-4, 4)
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
    aiControls: {
        aiOneControls: {
            move: function (keyCode) {
                let nextY = ai.aiOne.y;

                if (keyCode === '40') {
                    nextY += 5;
                    ai.aiOne.speedModifier = ai.aiOne.currentSpeedModifier;
                } else if (keyCode === '38') {
                    nextY += -5;
                    ai.aiOne.speedModifier = ai.aiOne.currentSpeedModifier;
                };

                nextY = nextY < 0 ? 0 : nextY;
                nextY = nextY + ai.aiOne.height > canvasHeight ? canvasHeight - ai.aiOne.height : nextY;
                ai.aiOne.y = nextY;
            },

            updateAiOneControls: function (ai, ball) {
                let aiMiddle = ai.y + (ai.height / 2);

                if (aiMiddle < ball.y) {
                    controls.aiControls.aiOneControls.move('40');
                };

                if (aiMiddle > ball.y) {
                    controls.aiControls.aiOneControls.move('38');
                };
            }
        },

        aiTwoControl: {
            updateAiTwoControls: function () {

            }
        }
    },

    playersControls: {
        heldDownKeysByPlayers: {},

        move: function (keyCode, player, keyUp, keyDown) {
            let nextY = player.y;

            if (keyCode === keyDown) {
                nextY += 5;
                player.speedModifier = player.currentSpeedModifier;
            } else if (keyCode === keyUp) {
                nextY += -5;
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
        }
    }
};

/*-------------------------------------------------------------------------------------------------------------*/

let render = {
    renderField: function () {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    },

    renderPaddle: function (paddle) {
        ctx.fillStyle = 'white';
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    },

    renderBall: function (ball) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'white';
        ctx.fill();
    },

    draw: function (paddles, balls) {
        this.renderField();

        for (let i = 0; i < paddles.length; i++) {
            if (paddles[i]) {
                this.renderPaddle(paddles[i]);
            };
        };

        for (let i = 0; i < balls.length; i++) {
            if (balls[i]) {
                this.renderBall(balls[i]);
            };
        };
    }
};

/*-------------------------------------------------------------------------------------------------------------*/