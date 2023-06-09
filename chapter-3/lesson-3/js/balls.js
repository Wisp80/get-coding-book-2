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