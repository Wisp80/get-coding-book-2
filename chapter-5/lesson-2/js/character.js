function Character(x, y, width, height, maxJumpHeight, runningSpriteRight, runningSpriteLeft) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.currentSpeedX = 0;
    this.currentDirectionX = 'right';
    this.downwardForce = 0;
    this.currentJumpHeight = 0;
    this.maxJumpHeight = maxJumpHeight;
    this.runningSpriteRight = runningSpriteRight;
    this.runningSpriteLeft = runningSpriteLeft;
    this.leadingEdgeX = 0;
    this.trailingEdgeX = 0;

    this.prepareCharacterData = function () {
        this.applyGravity();
        this.applyMovement();
        this.defineDirectionX();
    };

    this.applyGravity = function () {
        if (this.findIfCharacterIsJumping()) {
            this.currentJumpHeight += this.downwardForce * -1;

            if (this.currentJumpHeight >= this.maxJumpHeight) {
                this.downwardForce = world.gravity;
                this.currentJumpHeight = 0;
            };

        } else {

            if (this.findIfPlayerIsStandingOnAPlatform()) { // fix it, we need to predict it !!!
                this.downwardForce = 0;
            } else {
                this.downwardForce = world.gravity;
            };
        };
    };

    this.applyMovement = function () {
        let nextX = this.x + this.currentSpeedX;
        let nextY = this.y + this.downwardForce;

        /*Не работает если платформа перед котом короче по высоте его самого.*/
        let predictedLeadingEdgeX = this.findLeadingEdgeXOfCharacter() + this.currentSpeedX;
        let isCharacterWalkingIntoSurface = world.findIfPixelIsSolidSurface(predictedLeadingEdgeX, nextY);

        if (this.findIfCharacterIsMovingX() && isCharacterWalkingIntoSurface) {
            nextX = this.x;
            this.currentSpeedX = 0;
        };

        /*Не работает если платформа над котом короче по ширине его самого.*/
        let isPredictedTopLeadingAngleSolid = world.findIfPixelIsSolidSurface(this.findLeadingEdgeXOfCharacter() + this.currentSpeedX, nextY);
        let isPredictedTopTrailingAngleSolid = world.findIfPixelIsSolidSurface(this.findTrailingEdgeXOfCharacter() + this.currentSpeedX, nextY);

        if ((isPredictedTopLeadingAngleSolid || isPredictedTopTrailingAngleSolid) && this.findIfCharacterIsJumping()) {
            this.downwardForce = world.gravity;
            this.currentJumpHeight = 0;
        };

        this.x = nextX;
        this.y = nextY;
    };

    this.findIfCharacterIsJumping = function () { return this.downwardForce < 0 };
    this.isFalling = function () { return this.downwardForce > 0 };
    this.findIfCharacterIsMovingX = function () { return this.currentSpeedX !== 0 };

    this.findLeadingEdgeXOfCharacter = function () {
        if (this.currentSpeedX < 0) { return this.leadingEdgeX = this.x }
        else { return this.leadingEdgeX = this.x + this.width };
    };

    this.findTrailingEdgeXOfCharacter = function () {
        if (this.currentSpeedX < 0) { return this.trailingEdgeX = this.x + this.width }
        else { return this.trailingEdgeX = this.x };
    };

    this.findIfPlayerIsStandingOnAPlatform = function () {
        return world.findIfPixelIsSolidSurface(this.findLeadingEdgeXOfCharacter(), this.y + this.height + 1) ||
            world.findIfPixelIsSolidSurface(this.findTrailingEdgeXOfCharacter(), this.y + this.height + 1);
    };

    this.defineDirectionX = function () {
        if (this.currentSpeedX > 0) {
            this.currentDirectionX = 'right';
        } else if (this.currentSpeedX < 0) {
            this.currentDirectionX = 'left';
        };
    };

    this.drawHitbox = function (drawAtX) {
        ctx.fillStyle = 'rgb(234, 0, 255)';
        ctx.fillRect(drawAtX, this.y, this.width, this.height);
    };

    this.draw = function () {
        let drawAtX = this.x - world.distanceTravelledFromSpawnPoint;

        /*Проверяем не прошел ли игрок дальше точки спавна в левую сторону, и если так, то двигаем
        изображения персонажа.*/
        drawAtX = drawAtX > this.x ? this.x : drawAtX;

        /*Проверяем не находится ли игрок в конце уровня в правой стороне, и если так, то двигаем
        изображения персонажа.*/
        if (world.findIfPlayerIsAtLevelEnd()) {
            drawAtX = world.screenWidth - (world.levelImage.width - world.distanceTravelledFromSpawnPoint - (this.x - world.distanceTravelledFromSpawnPoint));
        };

        let sprite = null;

        if (this.currentDirectionX === 'right') {
            sprite = this.runningSpriteRight;
        } else if (this.currentDirectionX === 'left') {
            sprite = this.runningSpriteLeft;
        };

        if (!game.finished) {
            this.drawHitbox(drawAtX);

            if (this.findIfCharacterIsJumping() || this.isFalling()) {
                sprite.drawFrame(4, drawAtX, this.y, this.width, this.height);
            } else if (this.findIfCharacterIsMovingX()) {
                sprite.drawAnimation(game.ticks, drawAtX, this.y, this.width, this.height);
            } else {
                sprite.drawFrame(1, drawAtX, this.y, this.width, this.height);
            };
        };
    };

    this.collidesWith = function (other) {
        if (this.x >= other.x &&
            this.x <= other.x + other.width &&
            this.y >= other.y &&
            this.y <= other.y + other.height) {
            return true;
        };

        return false;
    };
};