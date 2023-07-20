const world = {
    width: canvas.width,
    height: canvas.height,
    gravity: 10,
    distanceTravelled: 0,
    level: null,
    collisionMap: null,
    tickCount: 0,

    enemies: [],

    loadLevel: function () {
        this.level = new Image();
        this.level.src = './src/level/map.png';

        let collisionMapImage = new Image();

        collisionMapImage.onload = function (loadEvent) {
            let hiddenCanvas = document.createElement('CANVAS');
            hiddenCanvas.setAttribute('width', this.width);
            hiddenCanvas.setAttribute('height', this.height);
            world.collisionMap = hiddenCanvas.getContext('2d');
            world.collisionMap.drawImage(this, 0, 0);
        };

        collisionMapImage.src = './src/level/map.png'
    },

    getFloorBelowY: function (x, y) {
        for (let tempY = y; tempY <= world.height; tempY++) {
            if (this.isSolidSurface(x, tempY)) {
                return tempY;
            };
        };

        return 0;
    },

    isSolidSurface: function (x, y) {
        return this.getPixelType(x, y) === '#';
    },

    getPixelType: function (x, y) {
        if (!this.collisionMap) {
            return '.';
        };

        let rawData = this.collisionMap.getImageData(x, y, 1, 1).data;
        let mask = rawData[0] + ' ' + rawData[1] + ' ' + rawData[2] + ' ' + rawData[3];

        if (mask === '255 0 0 255') return 'pit';
        if (mask === '76 255 0 255') return 'exit';
        if (mask === '255 255 255 255') return '.';
        if (mask === '0 0 0 255') return '#';
    },

    tick: function () {
        if (!this.level) {
            this.loadLevel();
            this.enemies.push(new enemy(500, 100));
            this.enemies.push(new enemy(2000, 100));
            this.enemies.push(new enemy(3700, 100));
            this.enemies.push(new enemy(4000, 100));
            this.enemies.push(new enemy(5600, 100));
            this.enemies.push(new enemy(6500, 100));
            this.enemies.push(new enemy(7600, 100));
        };

        this.distanceTravelled += player.character.speed;
        this.tickCount++;
        this.activateEnemies();
    },

    activateEnemies: function () {
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].tick();
        };
    },

    levelEndOffset: function () {
        return this.level.width - this.width;
    },

    atLevelEnd: function () {
        return this.distanceTravelled >= this.levelEndOffset();
    },

    draw: function () {
        let drawAtX = this.distanceTravelled * -1;
        drawAtX = drawAtX > 0 ? 0 : drawAtX;
        drawAtX = this.atLevelEnd() ? this.levelEndOffset() * -1 : drawAtX;
        ctx.drawImage(this.level, drawAtX, 0);

        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].draw();
        };
    }
};