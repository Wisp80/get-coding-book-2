const world = {
    screenWidth: canvas.width,
    screenHeight: canvas.height,
    gravity: 10,
    distanceTravelledFromSpawnPoint: 0,
    levelImage: null,
    collisionMapImage: null,
    collisionMapCanvas2DContext: null,
    collisionMapWidth: 8000,
    collisionMapHeight: 480,
    worldGrid: [],
    worldGridCellSize: 20,

    loadLevelImage: function () {
        this.levelImage = new Image();
        this.levelImage.src = './src/level/map-three.png';
    },

    loadCollisionMapCanvas2DContext: function () {
        this.collisionMapImage = new Image();
        this.collisionMapImage.src = collisionMapImageBase64;
        // this.collisionMapImage.src = './src/level/map-three.png';
        this.collisionMapImage.onload = function () {
            let hiddenCanvas = document.createElement('canvas');
            hiddenCanvas.setAttribute('width', this.width); // 8000
            hiddenCanvas.setAttribute('height', this.height); // 480
            world.collisionMapCanvas2DContext = hiddenCanvas.getContext('2d', { willReadFrequently: true });
            world.collisionMapCanvas2DContext.drawImage(this, 0, 0);
        };
    },

    fillWorldGrid: function () { // method to get data about solid pixels by using sets in order to have better optimization
        let rows = this.collisionMapHeight / this.worldGridCellSize;
        let columns = this.collisionMapWidth / this.worldGridCellSize;

        for (let i = 0; i < rows; i++) { // y - iterate through every row
            this.worldGrid.push([]); // add data about a row

            for (let j = 0; j < columns; j++) { // x - iterate through every column

                // check if a cell contains any solid pixels
                if (helper.checkPixelCollisionUpDownLeftRight(j * this.worldGridCellSize, i * this.worldGridCellSize, this.worldGridCellSize, this.worldGridCellSize)) {

                    this.worldGrid[i].push( // add data about the cell in the row
                        [
                            j * this.worldGridCellSize, // 0 - X-coordinate
                            i * this.worldGridCellSize, // 1 - Y-coordinate
                            this.worldGridCellSize, // 2 - width
                            this.worldGridCellSize, // 3 - height
                            true, // 4 - if the cell contains solid pixels
                            new Set() // 5 - a new empty set for data about every solid pixel in the cell
                        ]
                    );

                    // fill the set with the data about every solid pixel in the cell
                    for (let k = this.worldGrid[i][j][0]; k <= this.worldGrid[i][j][0] + this.worldGrid[i][j][2]; k++) { // iterate through X-Axis from left to right
                        for (let l = this.worldGrid[i][j][1]; l < this.worldGrid[i][j][1] + this.worldGrid[i][j][3]; l++) { // iterate through Y-Axis from top to bottom
                            if (this.findIfPixelIsSolidSurface(k, l)) { // if a pixel is a solid one
                                this.worldGrid[i][j][5].add({ x: k, y: l }); // add the coordinates of the pixel into the set
                            };
                        };
                    };

                } else {

                    this.worldGrid[i].push( // add data about the cell in the row
                        [
                            j * this.worldGridCellSize, // 0 - X-coordinate
                            i * this.worldGridCellSize, // 1 - Y-coordinate
                            this.worldGridCellSize, // 2 - width
                            this.worldGridCellSize, // 3 - height
                            false // 4 - if the cell contains solid pixels
                        ]
                    );

                };
            };
        };
    },

    findIfPixelIsSolidSurface: function (x, y) { return this.getPixelType(x, y) === '#' },

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
        this.distanceTravelledFromSpawnPoint += player.character.currentSpeedX;
    },

    findXOfBeginningOfLevelEnd: function () { return this.levelImage.width - this.screenWidth },

    findIfPlayerIsAtLevelEnd: function () { return this.distanceTravelledFromSpawnPoint >= this.findXOfBeginningOfLevelEnd() },

    drawWordlGrid: function (drawAtX) {
        let rows = this.collisionMapHeight / this.worldGridCellSize;
        let columns = this.collisionMapWidth / this.worldGridCellSize;

        ctx.lineWidth = 1;
        ctx.strokeStyle = 'orange';

        for (let i = 0; i < rows; i++) { // y
            for (let j = 0; j < columns; j++) { // x
                ctx.strokeRect(j * this.worldGridCellSize + drawAtX, i * this.worldGridCellSize, this.worldGridCellSize, this.worldGridCellSize);
            };
        };
    },

    draw: function () {
        /*Умножаем на -1, так как при движении игрока в какую-то сторону, мы должны двигать изображение уровня в противоположную сторону.*/
        let drawAtX = this.distanceTravelledFromSpawnPoint * -1;
        /*Проверяем не прошел ли игрок дальше точки спавна в левую сторону, и если так, то перестаем двигать изображения уровня.*/
        drawAtX = drawAtX > 0 ? 0 : drawAtX;
        /*Проверяем не находится ли игрок в конце уровня в правой стороне, и если так, то перестаем двигать изображение уровня.*/
        drawAtX = this.findIfPlayerIsAtLevelEnd() ? this.findXOfBeginningOfLevelEnd() * -1 : drawAtX;

        if (!game.finished) { ctx.drawImage(this.levelImage, drawAtX, 0) };

        // this.drawWordlGrid(drawAtX);
    }
};

