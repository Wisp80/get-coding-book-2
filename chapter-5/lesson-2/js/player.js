const player = {
    character: new character(160, 390, 25, 25, new animation('./src/cat/cat', 5), new animation('./src/cat/backwards/cat.backwards', 5)),

    tick: function () {
        let currentLocation = world.getPixelType(this.character.leadingEdge(), this.character.y);

        if (currentLocation === 'exit' || currentLocation === 'pit') {
            let state = currentLocation === 'exit' ? 'win' : 'lose';
            game.stop(state);
            return;
        };

        this.processControls();
        this.character.tick();
    },

    processControls: function () {
        if (controls.isRightKeyDown) {
            this.character.speed = 5;
        };

        if (controls.isLeftKeyDown) {
            this.character.speed = -5;
        };

        if (!controls.isLeftKeyDown && !controls.isRightKeyDown) {
            this.character.speed = 0;
        };

        if (controls.isUpKeyDown && this.character.standingOnAPlatform()) {
            this.character.downwardForce = -8;
            audio.jump();
        };
    },

    draw: function () {
        this.character.draw();
    }
};

function character(x, y, width, height, runningSprite, reverseSprite) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.speed = 0;
    this.downwardForce = 0;
    this.jumpHeight = 0;
    this.runningSprite = runningSprite;
    this.runningSpriteReversed = reverseSprite;

    this.tick = function () {
        this.applyGravity();
        this.applyMovement();
    };

    this.applyGravity = function () {
        if (this.isJumping()) {
            this.jumpHeight += (this.downwardForce * -1);

            if (this.jumpHeight >= this.height * 12) {
                this.downwardForce = world.gravity;
                this.jumpHeight = 0;
            };

        } else {

            if (this.standingOnAPlatform()) {
                this.downwardForce = 0;
            } else {
                this.downwardForce = world.gravity;
            };
        };
    };

    this.applyMovement = function () {
        let nextX = this.x + this.speed;
        let nextY = this.y + this.downwardForce;

        let nextLeadingX = this.leadingEdge() + this.speed;
        let walkingIntoSurface = world.isSolidSurface(nextLeadingX, this.y);

        if (this.isMoving() && walkingIntoSurface) {
            nextX = this.x;
            this.speed = 0;
        };

        let topLeftIsSolid = world.isSolidSurface(this.leadingEdge(), this.y);
        let topRightIsSolid = world.isSolidSurface(this.trailingEdge(), this.y);

        if ((topLeftIsSolid || topRightIsSolid) && this.isJumping()) {
            this.downwardForce = world.gravity;
            this.jumpHeight = 0;
        };

        this.x = nextX;
        this.y = nextY;
    };

    this.bottom = function () {
        return this.y + this.height;
    };

    this.isJumping = function () {
        return this.downwardForce < 0;
    };

    this.isFalling = function () {
        return this.downwardForce > 0;
    };

    this.isMoving = function () {
        return this.speed !== 0;
    };

    this.leadingEdge = function () {
        return this.speed < 0 ? this.x : this.x + this.width;
    };

    this.trailingEdge = function () {
        return this.speed < 0 ? this.x + this.width : this.x;
    };

    this.standingOnAPlatform = function () {
        return world.isSolidSurface(this.leadingEdge(), this.bottom() + 1) ||
            world.isSolidSurface(this.trailingEdge(), this.bottom() + 1);
    };

    this.draw = function () {
        if (!this.runningSprite) {
            return;
        };

        let drawAtX = this.x - world.distanceTravelledFromSpawnPoint;
        drawAtX = drawAtX > this.x ? this.x : drawAtX;

        if (world.findIfPlayerIsAtLevelEnd()) {
            drawAtX = (world.screenWidth - (world.levelImage.width - world.distanceTravelledFromSpawnPoint - (this.x - world.distanceTravelledFromSpawnPoint)));
        };

        let sprite = this.speed < 0 ? this.runningSpriteReversed : this.runningSprite;

        if (this.isJumping() || this.isFalling()) {
            sprite.drawFrame(4, drawAtX, this.y, this.height, this.width);
        } else if (this.isMoving()) {
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

function animation(filename, frameCount) {
    this.frames = [];

    this.currentFrameId = 1;

    for (let frameId = 1; frameId <= frameCount; frameId++) {
        let frame = new Image();
        frame.src = filename + '.' + frameId + '.png';
        this.frames[frameId] = frame;
    };

    this.draw = function (ticks, x, y, height, width) {
        if (ticks % 5 === 0) {
            this.currentFrameId++;
        };

        this.currentFrameId = this.currentFrameId >= this.frames.length ? 1 : this.currentFrameId;
        this.drawFrame(this.currentFrameId, x, y, height, width);
    };

    this.drawFrame = function (frameNumber, x, y, height, width) {
        ctx.drawImage(this.frames[frameNumber], x, y, width, height);
    };
};

function enemy(x, y) {
    this.character = new character(x, y, 25, 25, new animation('./src/tiger/tiger', 5), new animation('./src/tiger/backwards/tiger.backwards', 5));

    this.tick = function () {
        let distanceFromPlayer = Math.abs(player.character.x - this.character.x);

        if (distanceFromPlayer <= world.screenWidth * 2) {
            this.character.speed = 2;

            if (player.character.x < this.character.x) {
                this.character.speed *= -1;
            };

            if (this.character.collidesWith(player.character)) {
                game.stop();
            };

            this.character.tick();
        };
    };

    this.draw = function () {
        this.character.draw();
    };
};

let enemies = [];

function activateEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].tick();
    };
};