let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let canvasWidth = 1600;
let canvasHeight = 800;

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
};

let defaultPlayerPaddleWidth = 25;
let defaultPlayerPaddleHeight = 100;
let defaultPlayerPaddleXPosition = 5;
let defaultPlayerPaddleYPosition = (canvasHeight - defaultPlayerPaddleHeight) / 2;
let defaultPlayerPaddleSpeedModifier = 1;
let currentPlayerPaddleSpeedModifier = 1.5;

let player = new Paddle(
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

let ai = new Paddle(
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
        this.x = 800;
        this.y = 400;
        this.xSpeed = 6;
        this.ySpeed = 0;
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
};

let defaultBallOneXPosition = canvasWidth / 2;
let defaultBallOneYPosition = canvasHeight / 2;
let defaultBallOneRadius = 3;
let defaultBallOneXSpeed = 6;
let defaultBallOneYSpeed = 0;

let ballOne = new Ball(
    defaultBallOneXPosition,
    defaultBallOneYPosition,
    defaultBallOneRadius,
    defaultBallOneXSpeed,
    defaultBallOneYSpeed
);

/*-------------------------------------------------------------------------------------------------------------*/

function updateBall(ball) {
    ball.x += ball.xSpeed;
    ball.y += ball.ySpeed;

    if (ball.x < 0 || ball.x > canvasWidth) {
        ball.reset();
    };

    if (ball.y <= 0 || ball.y >= canvasHeight) {
        ball.reverseY();
    };

    let collidedWithPlayer = player.hasCollidedWith(ball);
    let collidedWithAi = ai.hasCollidedWith(ball);

    if (collidedWithPlayer || collidedWithAi) {
        ball.reverseX();
        ball.modifyXSpeedBy(1);
        let speedUpValue = collidedWithPlayer ? player.speedModifier : ai.speedModifier;
        ball.modifyYSpeedBy(speedUpValue);
    };
};

function updateAiControls(ai, ball) {
    var aiMiddle = ai.y + (ai.height / 2);

    if (aiMiddle < ball.y) {
        ai.move(40);
    };

    if (aiMiddle > ball.y) {
        ai.move(38);
    };
};

let playerControls = {
    heldDown: {},

    updatePlayerControls: function (player) {
        for (var keyCode in this.heldDown) {
            player.move(keyCode);
        };
    },

    initializeWatchPlayerControls: function () {
        window.addEventListener('keydown', () => { this.heldDown[event.keyCode] = true; }, false);
        window.addEventListener('keyup', () => { delete this.heldDown[event.keyCode]; }, false);
    }
};

/*-------------------------------------------------------------------------------------------------------------*/

let render = {
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

    renderField: function () {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    },

    draw: function () {
        this.renderField();
        this.renderPaddle(player);
        this.renderPaddle(ai);
        this.renderBall(ballOne);
    }
};

/*-------------------------------------------------------------------------------------------------------------*/

function tick() {
    updateBall(ballOne);
    playerControls.initializeWatchPlayerControls();
    playerControls.updatePlayerControls(player);
    updateAiControls(ai, ballOne);

    render.draw();

    window.setTimeout('tick()', 1000 / 60);
};

/*-------------------------------------------------------------------------------------------------------------*/

let bestOfOption = 3;

function chooseBestOfOption(el) {
    el.classList.add('highlighted-button')

    for (let i = 0; i < document.getElementsByClassName('best-of-mode-container')[0].children.length; i++) {
        if (document.getElementsByClassName('best-of-mode-container')[0].children[i] !== el) {
            document.getElementsByClassName('best-of-mode-container')[0].children[i].classList.remove('highlighted-button');
        };
    };

    if (el.innerText === 'Best of 1') {
        bestOfOption = 1;
    } else if (el.innerText === 'Best of 3') {
        bestOfOption = 3;
    } else {
        bestOfOption = 5;
    }
};

/*-------------------------------------------------------------------------------------------------------------*/

function startGame() {
    document.getElementsByClassName('start-screen')[0].style.display = 'none';
    document.getElementsByClassName('mainframe')[0].style.display = 'flex';

    initiateGameBasedOnBestOfOption();
};

function initiateGameBasedOnBestOfOption() {
    if (bestOfOption === 1) {
        startBestOfOneMode();
    } else if (bestOfOption === 3) {
        startBestOfThreeMode();
    } else if (bestOfOption === 5) {
        startBestOfFiveMode();
    };
};

function startBestOfOneMode() {
    tick();    
};










