let canvas = document.getElementsByClassName('canvas')[0];
let ctx = canvas.getContext('2d');

/*-------------------------------------------------------------------------------------------------------------*/

function floor(x, height) {
    this.x = x;
    this.width = canvas.width + 60;
    this.height = height;
};

const world = {
    height: canvas.height,
    width: canvas.width,
    gravity: 10,
    highestFloor: 240,
    speed: 5,
    distanceTravelled: 0,
    maxSpeed: 15,
    tilesPassed: 0,
    autoScroll: true,

    floorTiles: [
        new floor(0, 140)
    ],

    stop: function () {
        this.autoScroll = false;
    },

    moveFloor: function () {
        for (let i in this.floorTiles) {
            let tile = this.floorTiles[i];
            tile.x -= this.speed;
            this.distanceTravelled += this.speed;
        };
    },

    addFutureTiles: function () {
        if (this.floorTiles.length >= 3) {
            return;
        };

        let previousTile = this.floorTiles[this.floorTiles.length - 1];

        let biggestJumpableHeight = previousTile.height + player.height * 3.5;

        if (biggestJumpableHeight > this.highestFloor) {
            biggestJumpableHeight = this.highestFloor;
        };

        let randomHeight = Math.floor(Math.random() * biggestJumpableHeight) + player.height;
        let leftValue = previousTile.x + previousTile.width;
        let next = new floor(leftValue, randomHeight);
        this.floorTiles.push(next);
    },

    cleanOldTiles: function () {
        for (let i in this.floorTiles) {
            if (this.floorTiles[i].x <= -this.floorTiles[i].width) {
                this.floorTiles.splice(i, 1);
                this.tilesPassed++;
                
                if (this.tilesPassed % 3 === 0 && this.speed < this.maxSpeed) {
                    this.speed++;
                };
            };
        };
    },

    getDistanceToFloor: function (playerX) {
        for (let i in this.floorTiles) {
            let tile = this.floorTiles[i];
            if (tile.x <= playerX && tile.x + tile.width >= playerX) {
                return tile.height;
            };
        };

        return -1;
    },

    tick: function () {
        if (!this.autoScroll) {
            return;
        };

        this.cleanOldTiles();
        this.addFutureTiles();
        this.moveFloor();
    },

    draw: function () {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.width, this.height);

        for (let i in this.floorTiles) {
            let tile = this.floorTiles[i];
            let y = world.height - tile.height;
            ctx.fillStyle = 'blue';
            ctx.fillRect(tile.x, y, tile.width, tile.height);
        };

        ctx.fillStyle = 'white';
        ctx.font = '28px Arial';
        ctx.fillText('Скорость: ' + this.speed, 10, 40);
        ctx.fillText('Пройдено: ' + this.distanceTravelled, 10, 75);
    }
};

const player = {
    x: 160,
    y: 340,
    height: 20,
    width: 20,
    downwardForce: world.gravity,
    jumpHeight: 0,

    getDistanceFor: function (x) {
        let platformBelow = world.getDistanceToFloor(x);
        return world.height - this.y - platformBelow;
    },

    applyGravity: function () {
        this.currentDistanceAboveGround = player.getDistanceFor(this.x);
        let rightHandSideDistance = this.getDistanceFor(this.x + this.width);
        if (this.currentDistanceAboveGround < 0 || rightHandSideDistance < 0) {
            world.stop();
        };
    },

    processGravity: function () {
        this.y += this.downwardForce;
        let floorHeight = world.getDistanceToFloor(this.x, this.width);
        let topYofPlatform = world.height - floorHeight;
        if (this.y > topYofPlatform) {
            this.y = topYofPlatform;
        };

        if (this.downwardForce < 0) {
            this.jumpHeight += (this.downwardForce * -1);
            if (this.jumpHeight >= player.height * 6) {
                this.downwardForce = world.gravity;
                this.jumpHeight = 0;
            };
        };
    },

    keyPress: function (keyInfo) {
        let floorHeight = world.getDistanceToFloor(this.x, this.width);
        let onTheFloor = floorHeight == (world.height - this.y);
        if (onTheFloor) {
            this.downwardForce = -8;
        };
    },

    tick: function () {
        this.applyGravity();
        this.processGravity();
    },

    draw: function () {
        ctx.fillStyle = 'green';
        ctx.fillRect(player.x, player.y - player.height, this.height, this.width)
    }
};

/*-------------------------------------------------------------------------------------------------------------*/

window.addEventListener('keypress', function (keyInfo) { player.keyPress(keyInfo); }, false);

function tick() {
    player.tick();
    world.tick();
    world.draw();
    player.draw();
    window.setTimeout("tick()", 1000 / 60);
};

tick();