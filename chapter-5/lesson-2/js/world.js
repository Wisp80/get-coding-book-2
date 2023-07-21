const world = {
    screenWidth: canvas.width,
    screenHeight: canvas.height,
    gravity: 10,
    distanceTravelledFromSpawnPoint: 0,
    levelImage: null,
    collisionMapImage: null,
    collisionMapCanvas2DContext: null,

    loadLevelImage: function () {
        this.levelImage = new Image();
        this.levelImage.src = './src/level/level.png';
    },

    loadCollisionMapCanvas2DContext: function () {
        this.collisionMapImage = new Image();
        this.collisionMapImage.src = './src/level/map.png';
        this.collisionMapImage.onload = function () {
            let hiddenCanvas = document.createElement('canvas');
            hiddenCanvas.setAttribute('width', this.width); // 8000
            hiddenCanvas.setAttribute('height', this.height); // 480
            world.collisionMapCanvas2DContext = hiddenCanvas.getContext('2d', { willReadFrequently: true });
            world.collisionMapCanvas2DContext.drawImage(this, 0, 0);
        };
    },

    getYOfClosestSolidSurfaceBelowPlayer: function (x, y) {
        for (let tempY = y; tempY <= world.screenHeight; tempY++) {
            if (this.isSolidSurface(x, tempY)) { return tempY };
        };

        return 0;
    },

    isSolidSurface: function (x, y) {
        return this.getPixelType(x, y) === '#';
    },

    getPixelType: function (x, y) {
        if (!this.collisionMapCanvas2DContext) return '.';

        let rawPixelData = this.collisionMapCanvas2DContext.getImageData(x, y, 1, 1).data; // []
        let RGBAPixelData = `${rawPixelData[0]} ${rawPixelData[1]} ${rawPixelData[2]} ${rawPixelData[3]}`;

        if (RGBAPixelData === '255 0 0 255') return 'pit';
        if (RGBAPixelData === '76 255 0 255') return 'exit';
        if (RGBAPixelData === '255 255 255 255') return '.';
        if (RGBAPixelData === '0 0 0 255') return '#';
    },

    prepareWorldData: function () {
        if (!this.levelImage) { this.loadLevelImage() };
        if (!this.collisionMapCanvas2DContext) { this.loadCollisionMapCanvas2DContext() };
        this.distanceTravelledFromSpawnPoint += player.character.speed;
    },

    findXOfBeginningOfLevelEnd: function () {
        return this.levelImage.width - this.screenWidth;
    },

    findIfPlayerIsAtLevelEnd: function () {
        return this.distanceTravelledFromSpawnPoint >= this.findXOfBeginningOfLevelEnd();
    },

    draw: function () {
        /*Умножаем на -1, так как при движении игрока в какую-то сторону, мы должны двигать изображение
        уровня в противоположную сторону.*/
        let drawAtX = this.distanceTravelledFromSpawnPoint * -1;
        /*Проверяем не прошел ли игрок дальше точки спавна в левую сторону, и если так, то перестаем двигать
        изображения уровня.*/
        drawAtX = drawAtX > 0 ? 0 : drawAtX;
        /*Проверяем не находится ли игрок в конце уровня в правой стороне, и если так, то перестаем двигать
        изображение уровня.*/
        drawAtX = this.findIfPlayerIsAtLevelEnd() ? this.findXOfBeginningOfLevelEnd() * -1 : drawAtX;

        ctx.drawImage(this.levelImage, drawAtX, 0);        
    }
};