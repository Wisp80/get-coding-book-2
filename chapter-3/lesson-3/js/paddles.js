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