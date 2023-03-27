let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let canvasWidth = 1600;
let canvasHeight = 800;

/*-------------------------------------------------------------------------------------------------------------*/

let game = {
    bestOfOption: 3,
    playersWins: 0,
    aiWins: 0,
    matchesCount: 1,

    tickTimeout: null,
    tickRate: 1000 / 60,

    tick: function () {
        window.clearTimeout(game.tickTimeout);

        controls.playersControls.playerOneControls.initializeWatchPlayerOneControls();
        controls.playersControls.playerOneControls.updatePlayerOneControls(playerOne);
        controls.aiControls.aiOneControls.updateAiOneControls(aiOne, ballOne);

        ballOne.updateBall(ballOne);

        render.draw([playerOne, aiOne], [ballOne]);

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

    startGame: function () {
        game.updateWinsInfoAndScoreText();
        document.getElementsByClassName('start-screen')[0].style.display = 'none';
        document.getElementsByClassName('mainframe')[0].style.display = 'flex';
        ballOne.reset();
        game.tick();
    },

    restart: function () {
        document.getElementsByClassName('gameover-container')[0].style.display = 'none';
        document.getElementsByClassName('mainframe')[0].style.display = 'flex';
        ballOne.reset();
    },

    goToMenu: function () {
        document.getElementsByClassName('start-screen')[0].style.display = 'flex';
        document.getElementsByClassName('gameover-container')[0].style.display = 'none';
    },

    updateScore: function () {
        ballOne.reset();
        playerOne.reset();
        aiOne.reset();

        game.updateWinsInfoAndScoreText();

        game.matchesCount++;

        if (game.aiWins >= (game.bestOfOption / 2) + 0.5 || game.playersWins >= (game.bestOfOption / 2) + 0.5) {
            ballOne.freeze();

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

    this.move = function (keyCode) {
        let nextY = this.y;

        if (keyCode == 40) {
            nextY += 5;
            this.speedModifier = currentSpeedModifier;
        } else if (keyCode == 38) {
            nextY += -5;
            this.speedModifier = currentSpeedModifier;
        };

        nextY = nextY < 0 ? 0 : nextY;
        nextY = nextY + this.height > canvasHeight ? canvasHeight - this.height : nextY;
        this.y = nextY;
    };

    this.reset = function () {
        this.x = x;
        this.y = y;
    }
};

let defaultPlayerPaddleWidth = 25;
let defaultPlayerPaddleHeight = 100;
let defaultPlayerPaddleXPosition = 5;
let defaultPlayerPaddleYPosition = (canvasHeight - defaultPlayerPaddleHeight) / 2;
let defaultPlayerPaddleSpeedModifier = 1;
let currentPlayerPaddleSpeedModifier = 1.5;

let playerOne = new Paddle(
    defaultPlayerPaddleXPosition,
    defaultPlayerPaddleYPosition,
    defaultPlayerPaddleWidth,
    defaultPlayerPaddleHeight,
    defaultPlayerPaddleSpeedModifier,
    currentPlayerPaddleSpeedModifier
);

let defaultAiPaddleWidth = 25;
let defaultAiPaddleHeight = 100;
let defaultAiPaddleXPosition = 1570;
let defaultAiPaddleYPosition = (canvasHeight - defaultAiPaddleHeight) / 2;
let defaultAiPaddleSpeedModifier = 1;
let currentAiPaddleSpeedModifier = 1.5;

let aiOne = new Paddle(
    defaultAiPaddleXPosition,
    defaultAiPaddleYPosition,
    defaultAiPaddleWidth,
    defaultAiPaddleHeight,
    defaultAiPaddleSpeedModifier,
    currentAiPaddleSpeedModifier
);

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
        this.x = defaultBallOneXPosition;
        this.y = defaultBallOneYPosition;
        this.xSpeed = defaultBallOneXSpeed;
        this.ySpeed = defaultBallOneYSpeed;
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
        ball.x += ball.xSpeed;
        ball.y += ball.ySpeed;

        if (ball.x < 0) {
            game.aiWins++;
            game.updateScore();
        };

        if (ball.x > canvasWidth) {
            game.playersWins++;
            game.updateScore();
        };

        if (ball.y <= 0 || ball.y >= canvasHeight) {
            ball.reverseY();
        };

        let collidedWithPlayer = playerOne.hasCollidedWith(ball);
        let collidedWithAi = aiOne.hasCollidedWith(ball);

        if (collidedWithPlayer || collidedWithAi) {
            ball.reverseX();
            ball.modifyXSpeedBy(1);
            let speedUpValue = collidedWithPlayer ? playerOne.speedModifier : aiOne.speedModifier;
            ball.modifyYSpeedBy(speedUpValue);
        };
    };
};

let defaultBallOneXPosition = canvasWidth / 2;
let defaultBallOneYPosition = canvasHeight / 2;
let defaultBallOneRadius = 3;
let defaultBallOneXSpeed = 11;
let defaultBallOneYSpeed = 0;

let ballOne = new Ball(
    defaultBallOneXPosition,
    defaultBallOneYPosition,
    defaultBallOneRadius,
    defaultBallOneXSpeed,
    defaultBallOneYSpeed
);

/*-------------------------------------------------------------------------------------------------------------*/

let controls = {
    aiControls: {
        aiOneControls: {
            updateAiOneControls: function (ai, ball) {
                let aiMiddle = ai.y + (ai.height / 2);

                if (aiMiddle < ball.y) {
                    ai.move(40);
                };

                if (aiMiddle > ball.y) {
                    ai.move(38);
                };
            }
        },

        aiTwoControl: {
            updateAiTwoControls: function () {

            }
        }
    },

    playersControls: {
        playerOneControls: {
            heldDownKeysByPlayerOne: {},

            updatePlayerOneControls: function (player) {
                for (let keyCode in this.heldDownKeysByPlayerOne) {
                    player.move(keyCode);
                };
            },

            initializeWatchPlayerOneControls: function () {
                window.addEventListener('keydown', () => { this.heldDownKeysByPlayerOne[event.keyCode] = true; }, false);
                window.addEventListener('keyup', () => { delete this.heldDownKeysByPlayerOne[event.keyCode]; }, false);
            }
        },

        playerTwoControls: {

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