function Character(x, y, width, height, maxJumpHeight, runningSprite, reverseSprite) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.currentSpeedX = 0;
    this.downwardForce = 0;
    this.currentJumpHeight = 0;
    this.maxJumpHeight = maxJumpHeight;
    this.runningSprite = runningSprite;
    this.runningSpriteReversed = reverseSprite;
    this.leadingEdgeX = 0;
    this.trailingEdgeX = 0;

    this.prepareCharacterData = function () {
        this.applyGravity();
        this.applyMovement();
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
        let isCharacterWalkingIntoSurface = world.findIfPixelIsSolidSurface(predictedLeadingEdgeX, this.y);

        if (this.findIfCharacterIsMovingX() && isCharacterWalkingIntoSurface) {
            nextX = this.x;
            this.currentSpeedX = 0;
        };

        // let isTopLeadingAngleSolid = world.findIfPixelIsSolidSurface(this.findLeadingEdgeXOfCharacter(), this.y);
        // let isTopTrailingAngleSolid = world.findIfPixelIsSolidSurface(this.findTrailingEdgeXOfCharacter(), this.y);

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

    this.findIfCharacterIsJumping = function () {
        return this.downwardForce < 0;
    };

    this.isFalling = function () {
        return this.downwardForce > 0;
    };

    this.findIfCharacterIsMovingX = function () {
        return this.currentSpeedX !== 0;
    };

    this.findLeadingEdgeXOfCharacter = function () {
        if (this.currentSpeedX < 0) {
            this.leadingEdgeX = this.x;
            return this.leadingEdgeX;
        } else if (this.currentSpeedX > 0) {
            this.leadingEdgeX = this.x + this.width;
            return this.leadingEdgeX;
        } else {
            return this.leadingEdgeX;
        };
    };

    this.findTrailingEdgeXOfCharacter = function () {
        if (this.currentSpeedX < 0) {
            this.trailingEdgeX = this.x + this.width;
            return this.trailingEdgeX;
        } else if (this.currentSpeedX > 0) {
            this.trailingEdgeX = this.x;
            return this.trailingEdgeX;
        } else {
            return this.trailingEdgeX;
        };
    };

    this.findIfPlayerIsStandingOnAPlatform = function () {
        return world.findIfPixelIsSolidSurface(this.findLeadingEdgeXOfCharacter(), this.y + this.height + 1) ||
            world.findIfPixelIsSolidSurface(this.findTrailingEdgeXOfCharacter(), this.y + this.height + 1);
    };

    this.draw = function () {
        // if (!this.runningSprite) { return };

        let drawAtX = this.x - world.distanceTravelledFromSpawnPoint;
        drawAtX = drawAtX > this.x ? this.x : drawAtX;

        if (world.findIfPlayerIsAtLevelEnd()) {
            drawAtX = (world.screenWidth - (world.levelImage.width - world.distanceTravelledFromSpawnPoint - (this.x - world.distanceTravelledFromSpawnPoint)));
        };

        let sprite = this.currentSpeedX < 0 ? this.runningSpriteReversed : this.runningSprite;

        if (this.findIfCharacterIsJumping() || this.isFalling()) {
            sprite.drawFrame(4, drawAtX, this.y, this.height, this.width);
        } else if (this.findIfCharacterIsMovingX()) {
            sprite.draw(game.ticks, drawAtX, this.y, this.height, this.width);
        } else {
            sprite.drawFrame(1, drawAtX, this.y, this.height, this.width);
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