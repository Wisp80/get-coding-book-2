let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let canvasWidth = 1600;
let canvasHeight = 800;

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
        controls.playersControls.updatePlayersControls(playerOne, '38', '40');

        if (game.playersModeOption === 21) {
            controls.playersControls.updatePlayersControls(playerTwo, '87', '83');
        };

        controls.aiControls.aiOneControls.updateAiOneControls(aiOne, ballOne);

        ballOne.updateBall(ballOne);

        if (game.playersModeOption === 11) {
            render.draw([playerOne, aiOne], [ballOne]);
        } else if (game.playersModeOption === 12) {
            render.draw([playerOne, aiOne], [ballOne]);
        } else if (game.playersModeOption === 21) {
            render.draw([playerOne, playerTwo, aiOne], [ballOne]);
        } else {
            render.draw([playerOne, playerTwo, aiOne], [ballOne]);
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
        this.y = y;
    }
};

let defaultPlayerOnePaddleWidth = 25;
let defaultPlayerOnePaddleHeight = 100;
let defaultPlayerOnePaddleXPosition = 5;
let defaultPlayerOnePaddleYPosition = (canvasHeight - defaultPlayerOnePaddleHeight) / 2;
let defaultPlayerOnePaddleSpeedModifier = 1;
let currentPlayerOnePaddleSpeedModifier = 1.5;

let playerOne = new Paddle(
    defaultPlayerOnePaddleXPosition,
    defaultPlayerOnePaddleYPosition,
    defaultPlayerOnePaddleWidth,
    defaultPlayerOnePaddleHeight,
    defaultPlayerOnePaddleSpeedModifier,
    currentPlayerOnePaddleSpeedModifier
);

let defaultPlayerTwoPaddleWidth = 25;
let defaultPlayerTwoPaddleHeight = 100;
let defaultPlayerTwoPaddleXPosition = 5;
let defaultPlayerTwoPaddleYPosition = 0;
let defaultPlayerTwoPaddleSpeedModifier = 1;
let currentPlayerTwoPaddleSpeedModifier = 1.5;

let playerTwo = new Paddle(
    defaultPlayerTwoPaddleXPosition,
    defaultPlayerTwoPaddleYPosition,
    defaultPlayerTwoPaddleWidth,
    defaultPlayerTwoPaddleHeight,
    defaultPlayerTwoPaddleSpeedModifier,
    currentPlayerTwoPaddleSpeedModifier
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

        let collidedWithPlayer = playerOne.hasCollidedWith(ball) || playerTwo.hasCollidedWith(ball);
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
            move: function (keyCode) {
                let nextY = aiOne.y;

                if (keyCode === '40') {
                    nextY += 5;
                    aiOne.speedModifier = aiOne.currentSpeedModifier;
                } else if (keyCode === '38') {
                    nextY += -5;
                    aiOne.speedModifier = aiOne.currentSpeedModifier;
                };

                nextY = nextY < 0 ? 0 : nextY;
                nextY = nextY + aiOne.height > canvasHeight ? canvasHeight - aiOne.height : nextY;
                aiOne.y = nextY;
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