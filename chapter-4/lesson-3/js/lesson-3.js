const canvas = document.getElementsByClassName('canvas-one')[0];
const ctx = canvas.getContext('2d');

window.onload = function () {
    controls.initializePlayersControlsListening();
};

/*-------------------------------------------------------------------------------------------------------------*/

const helper = {
    checkIntersectionBetweenTwoNotRotatedRectangles: function (
        farX1, closeX2,
        closeX1, farX2,
        farY1, closeY2,
        closeY1, farY2
    ) {
        if (farX1 >= closeX2 &&
            closeX1 <= farX2 &&
            farY1 >= closeY2 &&
            closeY1 <= farY2) {
            return true;
        } else {
            return false;
        };
    },

    findTheSmallestElementInArrayOfNumbers: function (arr) {
        let smallestElement = null;

        if (arr.length > 0) {
            for (let i = 0; i < arr.length; i++) {
                if (!smallestElement) {
                    smallestElement = arr[i];
                } else if (arr[i] < smallestElement) {
                    smallestElement = arr[i];
                };
            };
        };

        return smallestElement;
    },

    getRandomColor: function () {
        let letters = '0123456789ABCDEF';
        let color = '#';

        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        };

        return color;
    },
};

/*-------------------------------------------------------------------------------------------------------------*/

const ui = {
    pressPlayButton: function () {
        game.tick();
        document.getElementsByClassName('play-button')[0].disabled = true;

        audio.initiateBackgroudMusicLooping();
        audio.playSound(audio.defaultBackgroundMusic);
    },

    pressResetButton: function () {
        game.reset();
        game.tick();
    }
};

/*-------------------------------------------------------------------------------------------------------------*/

const game = {
    tickTimeout: null,
    tickRate: 1000 / 60,
    worldSpeed: 16, // Скорость прокрутки мира.
    maxWorldSpeed: 100,
    highestFloor: canvas.height / 2, /*Максимально возможная высота какого-либо тайла.*/
    autoScroll: true, // Показывает прокручивается ли мир в данный момент.
    tilesPassed: 0,
    distanceTravelled: 0,
    tempWallID: 2, // ID для стен при их создании.

    wallWidth: 950, // Ширина стен.
    maximumWallHeight: canvas.height / 2, // Максимально возможная высота какой-либо стены.
    minimumWallHeight: 50, // Минимально возможная высота какой-либо стены.
    maximumWallAtOneTIme: 5, // Количество стен, о которых мы можем иметь данных в данный момент.
    playerHeightMultiplayer: 2, /*Множитель высоты игрока, для определения на какую максимальную высоту может запрыгнуть игрок c текущей последней стены.*/
    differnceBetweenCurrentLastWallAndNewWall: 100, /*Число, указывающее на сколько следующая стена может быть минимально выше текущей последней стены.*/
    newWallLowHeightEnhancer: 60, /*Число, указывающее, на сколько надо увеличить высоту следующе стены, 
    если она ниже установленного ограничения между этой стены и предыдудщей текущей стеной.*/


    stopWorld: function () { // Метод для указания, что мир больше не прокручивается.
        this.autoScroll = false;
    },

    tick: function () {
        window.clearTimeout(game.tickTimeout);
        if (players.playerOne.isActive) {
            game.prepareDataForNextTick();
            window.requestAnimationFrame(game.renderPreparedDataForNextTick);
            game.tickTimeout = window.setTimeout('game.tick()', game.tickRate);
        };
    },

    reset: function () {
        audio.pauseSound(audio.defaultBackgroundMusic);
        audio.playSound(audio.defaultBackgroundMusic);

        game.autoScroll = true;
        game.worldSpeed = 16;
        game.tilesPassed = 0;
        game.distanceTravelled = 0;
        game.tempWallID = 2;

        players.playerOne.isActive = true;        
        players.playerOne.currentSpeedX = 0;
        players.playerOne.currentSpeedY = 0;
        players.playerOne.x = 300;
        players.playerOne.y = 485;

        walls = [
            new Wall(
                0, 550,
                1200, 450,
                helper.getRandomColor(), 1,
                2
            )
        ];
    },

    prepareDataForNextTick: function () {
        players.playerOne.checkIfPlayerIsInAPit();
        game.cleanOldTiles();
        game.addFutureWalls(
            this.maximumWallAtOneTIme,
            this.playerHeightMultiplayer,
            this.minimumWallHeight,
            this.differnceBetweenCurrentLastWallAndNewWall,
            this.newWallLowHeightEnhancer
        );
        players.playerOne.move();

        if (!players.playerOne.isActive) { // Если игрок не активный, то останавливаем прокрутку мира.
            audio.playSound(audio.generateLoseSound());
            audio.pauseSound(audio.defaultBackgroundMusic);
            game.stopWorld();
        };

        if (this.autoScroll) { // Пока прокручивается мир, двигаем стены.
            for (let i = 0; i < walls.length; i++) {
                walls[i].move(game.worldSpeed);
            };
        };

        this.calculateDistanceTravelled();
    },

    addFutureWalls: function (
        maximumWallAtOneTIme,
        playerHeightMultiplayer,
        minimumWallHeight,
        differnceBetweenCurrentLastWallAndNewWall,
        newWallLowHeightEnhancer
    ) {
        if (walls.length >= maximumWallAtOneTIme) { /*Если уже есть данные для минимум 4 стен, то ничего не делаем.*/
            return;
        };

        /*Получаем данные о самой последней стене в массиве для стен.*/
        let currentLastWall = walls[walls.length - 1];

        /*Определяем на какую максимальную высоту может запрыгнуть игрок c текущей последней стены.*/
        let biggestJumpableHeight = currentLastWall.height + (players.playerOne.accelerationY - players.playerOne.gravity) * playerHeightMultiplayer;

        /*Если так получилось, что максимальная высота, на которую может запрыгнуть игрок c текущей последней стены оказалась больше, 
        чем предустановленное ограничение на максимальную высоту стены, то мы делаем так, чтобы максимальная высота, на которую 
        может запрыгнуть игрок c текущей последней стены была равна этому ограничению, чтобы случайно не создать стену, на которую
        не будет возможности запрыгнуть.*/
        if (biggestJumpableHeight > this.maximumWallHeight) {
            biggestJumpableHeight = this.maximumWallHeight;
        };

        /*Генерируем высоту для следующей стены. Полученная высота будет в диапазоне от минимально указанной высоты, до максимальной 
        высоты, на которую игрок может запрыгнуть игрок c текущей последней стены, плюс минимально указанная высота.*/
        let newWallHeight = Math.floor(Math.random() * biggestJumpableHeight) + minimumWallHeight;

        /*Если текущая последняя стена ниже, чем следующая стена, которую мы пытаемся создать, и их разница по высоте меньше установленного ограничения,
        то увеличиваем высчитанную высоту для следующей стены.*/
        if (currentLastWall.height < newWallHeight && Math.abs(newWallHeight - currentLastWall.height) < differnceBetweenCurrentLastWallAndNewWall) {
            newWallHeight = newWallHeight + newWallLowHeightEnhancer;
        };

        /*Высчитываем координату X следующей стены, то есть там, где кончается предыдущая стены.*/
        let newWallX = currentLastWall.x + currentLastWall.width;

        if (this.tilesPassed % Math.floor(5 * Math.random()) === 0) {
            let newWallShift = Math.floor(400 * Math.random());

            if (newWallShift <= 200) {
                newWallShift = 200;
            };

            newWallX += newWallShift;
        };

        /*Создаем данные для следующего тайла.*/
        let newWall = new Wall(newWallX, canvas.height - newWallHeight, canvas.width - 600, newWallHeight, helper.getRandomColor(), this.tempWallID, 2);
        walls.push(newWall); /*Отправляем созданные данные в массив стен.*/

        this.tempWallID++; // Увеличиваем ID для последующей стены. 
    },

    /*Метод для удаления тайлов, которых больше не видно на экране.*/
    cleanOldTiles: function () {
        for (const i in walls) {
            /*Мы не видим какой-либо тайл, если он полностью ушел за экран, то есть на 700 пикселей влево от 0. Это
            значит, что его координата X как минимум равна -700.*/
            if (walls[i].x <= -walls[i].width) {
                walls.splice(i, 1); /*Удаляем выбранный тайл из массива с данными по тайлам.*/
                this.tilesPassed++; /*Обновляем количество пройденных тайлов.*/

                if (this.tilesPassed % 3 === 0 && this.worldSpeed < this.maxWorldSpeed) { /*Увеличиваем скорость прокрутки мира
                каждые 3 пройденных тайла.*/
                    this.worldSpeed++;
                };
            };
        };
    },

    calculateDistanceTravelled: function () {
        this.distanceTravelled += this.worldSpeed;
    },

    renderPreparedDataForNextTick: function () {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < walls.length; i++) {
            walls[i].draw();
        };

        players.playerOne.draw();

        ctx.fillStyle = 'white';
        ctx.font = '35px Arial';
        ctx.fillText('Скорость: ' + game.worldSpeed, 10, 40); /*Выводим текст о текущей скорости прокрутки мира.*/
        ctx.fillText('Пройденое расстояние: ' + game.distanceTravelled, 10, 80); /*Выводим текст о том, какое расстояние было пройдено.*/
        ctx.fillText('Пройдено тайлов: ' + game.tilesPassed, 10, 120); /*Выводим текст о том, какое расстояние было пройдено.*/
    },
};

/*-------------------------------------------------------------------------------------------------------------*/

const controls = {
    isUpKeyPressed: false,

    initializePlayersControlsListening: function () {
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'w':
                    this.isUpKeyPressed = true;
                    break;

                default:
                    break;
            };
        }, false);

        window.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'w':
                    this.isUpKeyPressed = false;
                    break;

                default:
                    break;
            };
        }, false);
    },
};

/*-------------------------------------------------------------------------------------------------------------*/

const players = {
    playerOne: new Player(),
};

function Player(
    x, y,
    width, height,
    currentSpeedX, currentSpeedY,
    maxSpeedX, maxSpeedY,
    accelerationY, gravity,
    velocityX, friction,
    color, src
) {
    this.x = 300;
    this.y = 485;
    this.width = 40;
    this.height = 60;
    this.currentSpeedX = 0;
    this.currentSpeedY = 0;
    this.maxSpeedX = 10;
    this.maxSpeedY = 40;
    this.currentAccelerationY = 15;
    this.accelerationY = 24;
    this.gravity = 3;
    this.accelerationX = 1;
    this.friction = 0.6; // [0; 1] трение, используется как множитель скорости для плавного торможения.
    this.color = 'orange';
    this.src = './src/images/human2.png'
    this.isActive = true; // Указывает активный ли для управления наш игрок.

    this.isPlayerOnTheFloor = false;
    this.currentJumpedDistance = 0;
    this.maxJumpedDistance = 300;

    this.predictedHorizontalWayToTheRight = null;
    this.predictedHorizontalWayToTheLeft = null;
    this.predictedVerticalWayDown = null;
    this.predictedVerticalWayUp = null;

    this.predictCollision = function () {
        /*Подготавливаем данные, где окажется игрок в следующий тик, если будет двигаться по Y.*/
        let predictedVerticalPosition = {
            x: this.x,
            y: this.y + this.currentSpeedY,
            width: this.width,
            height: this.height
        };

        /*Проверяем не будет ли коллизии по X или Y между игроком и стенами в следующем тике.*/
        for (let i = 0; i < walls.length; i++) { // Перебираем каждую стену.

            /*Проверяем не будет ли коллизии между игроком и стенами в следующем тике, если он будет двигаться по X.*/
            if (helper.checkIntersectionBetweenTwoNotRotatedRectangles(
                this.x + this.width, walls[i].x,
                this.x, walls[i].x + walls[i].width,
                this.y + this.height, walls[i].y,
                this.y, walls[i].y + walls[i].height)
            ) {
                this.isActive = false;
            };

            /*Проверяем не будет ли коллизии между игроком и стенами в следующем тике, если он будет двигаться по Y.*/
            if (helper.checkIntersectionBetweenTwoNotRotatedRectangles(
                predictedVerticalPosition.x + predictedVerticalPosition.width, walls[i].x,
                predictedVerticalPosition.x, walls[i].x + walls[i].width,
                predictedVerticalPosition.y + predictedVerticalPosition.height, walls[i].y,
                predictedVerticalPosition.y, walls[i].y + walls[i].height)
            ) {
                /*Если такая коллизия есть, то пока такая коллизия имеет место быть, сдвигаем по Y предполагаемую
                проекцию игрока, которая будет в следующем тике, ближе к текущей позиции игрока на 1 до тех пор, пока 
                не пропадет коллизия между предполагаемой позицией игрока и какой-то стеной.*/
                while (helper.checkIntersectionBetweenTwoNotRotatedRectangles(
                    predictedVerticalPosition.x + predictedVerticalPosition.width, walls[i].x,
                    predictedVerticalPosition.x, walls[i].x + walls[i].width,
                    predictedVerticalPosition.y + predictedVerticalPosition.height, walls[i].y,
                    predictedVerticalPosition.y, walls[i].y + walls[i].height)
                ) {
                    if (this.isActive) {
                        predictedVerticalPosition.y -= Math.sign(this.currentSpeedY);
                    } else {
                        predictedVerticalPosition.y -= 1;
                    };
                };

                /*Как только мы перестанем сдвигать по Y предполагаемую проекцию игрока, которая будет в следующем тике, ближе 
                к текущей позиции игрока, то это будет означать, что мы имеем самую близку позицию игрока для следующего тика,
                когда игрок будет касаться какой-то стены, но не проходит через нее. Поэтому указываем, что координата Y
                этой предполагаемой позиции должна быть текущей координатой Y игрока и останавливаем игрока по Y, чтобы он не
                пытался двигаться дальше в стену, так как это приведет к бесконечной работе цикла "while".*/
                if (this.isActive) {
                    this.y = predictedVerticalPosition.y;
                    this.currentSpeedY = 0;
                    this.isPlayerOnTheFloor = true;
                };
            };
        };

        /*----------------------------*/

        /*Подготавливаем данные, описывающие путь, который игрок может пройти за следующий тик, если будет двигаться по X.*/
        if (game.worldSpeed > 0) { // Если будет двигаться вправо.
            this.predictedHorizontalWayToTheRight = {
                x: this.x + this.width,
                y: this.y,
                width: game.worldSpeed - this.width,
                height: this.height
            };
        } else {
            this.predictedHorizontalWayToTheRight = null;
        };

        if (Math.abs(this.currentSpeedX) > this.width) {
            if (this.currentSpeedX < 0) { // Если будет двигаться влево.
                this.predictedHorizontalWayToTheLeft = {
                    x: this.x - Math.abs(this.currentSpeedX) + this.width,
                    y: this.y,
                    width: Math.abs(this.currentSpeedX) - this.width,
                    height: this.height
                };
            } else {
                this.predictedHorizontalWayToTheLeft = null;
            };
        };

        /*Подготавливаем данные, описывающие путь, который игрок может пройти за следующий тик, если будет двигаться по Y.*/
        if (Math.abs(this.currentSpeedY) > this.height) {
            if (this.currentSpeedY > 0) { // Если будет двигаться вниз.
                this.predictedVerticalWayDown = {
                    x: this.x,
                    y: this.y + this.height,
                    width: this.width,
                    height: this.currentSpeedY - this.height
                };
            } else {
                this.predictedVerticalWayDown = null;
            };

            if (this.currentSpeedY < 0) { // Если будет двигаться вверх.
                this.predictedVerticalWayUp = {
                    x: this.x,
                    y: this.y - Math.abs(this.currentSpeedY) + this.height,
                    width: this.width,
                    height: Math.abs(this.currentSpeedY) - this.height
                };
            } else {
                this.predictedVerticalWayUp = null;
            };
        };

        /*Создаем переменные, которые будут хранить расстояния до препятствий, которые могут потенциально оказаться на пути,
        который игрок пройдет за следующий тик.*/
        let potentialCollisionsRight = [];
        let potentialCollisionsLeft = [];
        let potentialCollisionsDown = [];
        let potentialCollisionsUp = [];

        for (let i = 0; i < walls.length; i++) { // Перебираем все стены.
            if (this.predictedHorizontalWayToTheRight) { // Если рассчитан путь вправо на следующий тик,
                if (helper.checkIntersectionBetweenTwoNotRotatedRectangles( // то проверяем не пересекается ли он с каким-то стенами,
                    this.predictedHorizontalWayToTheRight.x + this.predictedHorizontalWayToTheRight.width, walls[i].x,
                    this.predictedHorizontalWayToTheRight.x, walls[i].x + walls[i].width,
                    this.predictedHorizontalWayToTheRight.y + this.predictedHorizontalWayToTheRight.height, walls[i].y,
                    this.predictedHorizontalWayToTheRight.y, walls[i].y + walls[i].height
                )) { // и если пересекается, то сохраняем расстояние от игрока до этой стены.
                    potentialCollisionsRight.push(walls[i].x - this.x - this.width);
                };
            };

            if (this.predictedHorizontalWayToTheLeft) { // Если рассчитан путь влево на следующий тик,
                if (helper.checkIntersectionBetweenTwoNotRotatedRectangles( // то проверяем не пересекается ли он с каким-то стенами,
                    this.predictedHorizontalWayToTheLeft.x + this.predictedHorizontalWayToTheLeft.width, walls[i].x,
                    this.predictedHorizontalWayToTheLeft.x, walls[i].x + walls[i].width,
                    this.predictedHorizontalWayToTheLeft.y + this.predictedHorizontalWayToTheLeft.height, walls[i].y,
                    this.predictedHorizontalWayToTheLeft.y, walls[i].y + walls[i].height
                )) { // и если пересекается, то сохраняем расстояние от игрока до этой стены.
                    potentialCollisionsLeft.push(this.x - walls[i].x - walls[i].width);
                };
            };

            if (this.predictedVerticalWayDown) { // Если рассчитан путь вниз на следующий тик,
                if (helper.checkIntersectionBetweenTwoNotRotatedRectangles( // то проверяем не пересекается ли он с каким-то стенами,
                    this.predictedVerticalWayDown.x + this.predictedVerticalWayDown.width, walls[i].x,
                    this.predictedVerticalWayDown.x, walls[i].x + walls[i].width,
                    this.predictedVerticalWayDown.y + this.predictedVerticalWayDown.height, walls[i].y,
                    this.predictedVerticalWayDown.y, walls[i].y + walls[i].height
                )) { // и если пересекается, то сохраняем расстояние от игрока до этой стены.
                    potentialCollisionsDown.push(walls[i].y - this.y - this.height);
                };
            };

            if (this.predictedVerticalWayUp) { // Если рассчитан путь вверх на следующий тик,
                if (helper.checkIntersectionBetweenTwoNotRotatedRectangles( // то проверяем не пересекается ли он с каким-то стенами,
                    this.predictedVerticalWayUp.x + this.predictedVerticalWayUp.width, walls[i].x,
                    this.predictedVerticalWayUp.x, walls[i].x + walls[i].width,
                    this.predictedVerticalWayUp.y + this.predictedVerticalWayUp.height, walls[i].y,
                    this.predictedVerticalWayUp.y, walls[i].y + walls[i].height
                )) { // и если пересекается, то сохраняем расстояние от игрока до этой стены.
                    potentialCollisionsUp.push(this.y - walls[i].y - walls[i].height);
                };
            };
        };

        /*Среди полученных расстояний находим самые маленькие.*/
        let closestCollisionRight = helper.findTheSmallestElementInArrayOfNumbers(potentialCollisionsRight);
        let closestCollisionLeft = helper.findTheSmallestElementInArrayOfNumbers(potentialCollisionsLeft);
        let closestCollisionDown = helper.findTheSmallestElementInArrayOfNumbers(potentialCollisionsDown);
        let closestCollisionUp = helper.findTheSmallestElementInArrayOfNumbers(potentialCollisionsUp);

        if (game.worldSpeed > 0 && closestCollisionRight) { // Если игрок движется вправо и на его пути потенциально есть препятствия,
            game.worldSpeed = closestCollisionRight; // то в следующий тик его скорость равна расстоянию до самого ближайшего из этих препятствий.
        };

        if (this.currentSpeedX < 0 && closestCollisionLeft) { // Если игрок движется влево и на его пути потенциально есть препятствия,
            this.currentSpeedX = -closestCollisionLeft + 1; // то в следующий тик его скорость равна расстоянию до самого ближайшего из этих препятствий.
        };

        if (this.currentSpeedY > 0 && closestCollisionDown) { // Если игрок движется вниз и на его пути потенциально есть препятствия,
            this.specurrentSpeedYedY = closestCollisionDown - 1; // то в следующий тик его скорость равна расстоянию до самого ближайшего из этих препятствий.
        };

        if (this.currentSpeedY < 0 && closestCollisionUp) { // Если игрок движется вверх и на его пути потенциально есть препятствия,
            this.currentSpeedY = -closestCollisionUp + 1; // то в следующий тик его скорость равна расстоянию до самого ближайшего из этих препятствий.
        };
    };

    this.move = function () {
        if (this.isActive) { // Реализуем движение игрока, если он активен.
            /*Обработка скоростей по Y.*/
            if (controls.isUpKeyPressed) { // Если нажато вверх,
                this.currentSpeedY -= this.currentAccelerationY; // то значит уменьшаем скорость по Y, чтобы двигать игрока вверх.
                this.isPlayerOnTheFloor = false;
            };

            /*Применяем гравитацию.*/
            this.currentSpeedY += this.gravity; // Каждый тик увеличиваем скорость по Y, чтобы при применении этой скорости к игроку двигать его вниз.

            if (!this.isPlayerOnTheFloor && this.currentSpeedY < 0) {
                this.currentJumpedDistance += (this.accelerationY - this.gravity);
            };

            if (this.currentJumpedDistance >= this.maxJumpedDistance) {
                this.currentAccelerationY = 0;
            };

            if (this.isPlayerOnTheFloor) {
                this.currentJumpedDistance = 0;
            };

            if (this.isPlayerOnTheFloor) {
                this.currentAccelerationY = this.accelerationY;
            };

            /*Ограничиваем скорость по Y при достижения максимума.*/
            if (this.currentSpeedY >= this.maxSpeedY) { // Если достигаем максимума скорости по Y вверх,
                this.currentSpeedY = this.maxSpeedY; // то ограничиваем нашу скорость по Y максимально указанной.
            } else if (this.currentSpeedY < -this.maxSpeedY) { // Если достигаем максимума скорости по Y вниз,
                this.currentSpeedY = -this.maxSpeedY; // то ограничиваем нашу скорость по Y максимально указанной.
            };

            /*Округляем скорость по Y до целых значений. Поскольку метод "Math.floor()" для отрицательных значений, например,
            "-5,3" превращает в "-6", то есть модуль числа по факту округляется сверху, то для отрицательных значение используем 
            "Math.ceil()".*/
            if (this.currentSpeedY > 0) { // Если скорость по Y больше 0,
                this.currentSpeedY = Math.floor(this.currentSpeedY); // то округляем скорость по Y снизу. 
            } else {
                this.currentSpeedY = Math.ceil(this.currentSpeedY); // Если скорость по Y меньше или равна 0, то округляем скорость по Y сверху.
            };

            /*----------------------------*/

            this.predictCollision();

            /*----------------------------*/

            /*Двигаем нашего игрока по X и Y.*/
            this.y += this.currentSpeedY;
        };
    };

    this.checkIfPlayerIsInAPit = function () {
        if (players.playerOne.y > canvas.height) {
            players.playerOne.isActive = false;
        };
    };

    this.drawPredictedWays = function () {
        if (this.predictedHorizontalWayToTheRight) {
            ctx.fillStyle = 'blue';
            ctx.fillRect(this.predictedHorizontalWayToTheRight.x, this.predictedHorizontalWayToTheRight.y, this.predictedHorizontalWayToTheRight.width, this.predictedHorizontalWayToTheRight.height);
        };

        if (this.predictedHorizontalWayToTheLeft) {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.predictedHorizontalWayToTheLeft.x, this.predictedHorizontalWayToTheLeft.y, this.predictedHorizontalWayToTheLeft.width, this.predictedHorizontalWayToTheLeft.height);
        };

        if (this.predictedVerticalWayDown) {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.predictedVerticalWayDown.x, this.predictedVerticalWayDown.y, this.predictedVerticalWayDown.width, this.predictedVerticalWayDown.height);
        };

        if (this.predictedVerticalWayUp) {
            ctx.fillStyle = 'violet';
            ctx.fillRect(this.predictedVerticalWayUp.x, this.predictedVerticalWayUp.y, this.predictedVerticalWayUp.width, this.predictedVerticalWayUp.height);
        };
    };

    this.drawPlayerCoordinates = function () {
        ctx.font = '10px serif';
        ctx.fillStyle = 'white';
        ctx.fillText(this.x + ':' + this.y, this.x, this.y + 15);
        ctx.fillText((this.x + this.width) + ':' + this.y, this.x + this.width, this.y + 30);
        ctx.fillText(this.x + ':' + (this.y + this.height), this.x, this.y + this.height);
        ctx.fillText((this.x + this.width) + ':' + (this.y + this.height), this.x + this.width, this.y + this.height - 15);
    };

    this.draw = function () {
        // this.drawPredictedWays();

        img = new Image;
        img.src = this.src;
        ctx.drawImage(img, this.x, this.y)
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.x, this.y, this.width, this.height);

        // this.drawPlayerCoordinates();
    };
};

/*-------------------------------------------------------------------------------------------------------------*/
let walls = [
    new Wall(
        0, 550,
        1200, 450,
        helper.getRandomColor(), 1,
        2
    )
];

function Wall(
    x, y,
    width, height,
    color, id,
    type
) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.id = id;
    this.type = type;

    /*Метод для сдвига стенки влево.*/
    this.move = function (speedX) {
        this.x -= speedX;
    };

    this.drawWallsCoordinates = function () {
        ctx.font = '10px serif';
        ctx.fillStyle = 'white';
        ctx.fillText(this.x + ':' + this.y, this.x, this.y + 15);
        ctx.fillText((this.x + this.width) + ':' + this.y, this.x + this.width, this.y + 30);
        ctx.fillText(this.x + ':' + (this.y + this.height), this.x, this.y + this.height);
        ctx.fillText((this.x + this.width) + ':' + (this.y + this.height), this.x + this.width, this.y + this.height - 15);
    };

    this.drawWallsID = function () {
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(this.id, this.x + this.width / 2, this.y + this.height / 2);
    };

    this.draw = function () {
        if (this.type === 1) {
            ctx.fillStyle = 'white';
        } else if (this.type === 2) {
            ctx.fillStyle = this.color;
        };

        ctx.fillRect(this.x, this.y, this.width, this.height);

        // this.drawWallsCoordinates();
        this.drawWallsID();
    };
};

/*-------------------------------------------------------------------------------------------------------------*/

let audio = {
    volume: 0.05,

    generateLoseSound: function () {
        return new Audio('./src/sounds/default-sounds/lose-sound-default.wav');
    },

    defaultBackgroundMusic: new Audio('./src/music/03WhatUNeed.mp3'),

    isBackgroundMusicPaused: false,

    playSound: function (sound) {
        sound.volume = audio.volume;
        sound.play();
    },

    pauseSound: function (sound) {
        audio.defaultBackgroundMusic.currentTime = 0;

        sound.volume = audio.volume;
        sound.pause();
    },

    initiateBackgroudMusicLooping: function () {
        audio.defaultBackgroundMusic.loop = true;
    }
};

audio.initiateBackgroudMusicLooping();

/*-------------------------------------------------------------------------------------------------------------*/