const game = {
    tickTimeout: null,
    tickRate: 1000 / 60,
    ticks: 0,
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
        game.ticks = 0;
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
                helper.getRandomColor(), helper.getRandomColor(),
                1, 2
            )
        ];
    },

    generateBackground: function () {
        let tempBackground = new Background('./src/images/background-two.png', backgrounds[backgrounds.length - 1].x + 800, 115);
        backgrounds.push(tempBackground);
    },

    prepareDataForNextTick: function () {
        if (this.ticks % 600 === 0) {
            this.generateBackground();
        };

        for (let i = 0; i < backgrounds.length; i++) {
            if (backgrounds[i].x + 800 < 0) {
                backgrounds.splice(i, 1);
            };
        };

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
            if (document.getElementsByClassName('sound-off-on-button')[0].innerHTML === '🔊') {
                audio.playSound(audio.generateLoseSound());
            };
            audio.pauseSound(audio.defaultBackgroundMusic);
            game.stopWorld();
        };

        if (this.autoScroll) { // Пока прокручивается мир, двигаем стены.
            for (let i = 0; i < walls.length; i++) {
                walls[i].move(game.worldSpeed);
            };

            for (let j = 0; j < backgrounds.length; j++) {
                backgrounds[j].move(1);
            };
        };

        this.calculateDistanceTravelled();
        this.ticks++;
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
        let newWall = new Wall(newWallX, canvas.height - newWallHeight, canvas.width - 600, newWallHeight, helper.getRandomColor(), helper.getRandomColor(), this.tempWallID, 2);
        walls.push(newWall); /*Отправляем созданные данные в массив стен.*/

        this.tempWallID++; // Увеличиваем ID для последующей стены. 
    },

    /*Метод для удаления тайлов, которых больше не видно на экране.*/
    cleanOldTiles: function () {
        for (const i in walls) {
            /*Мы не видим какой-либо тайл, если он полностью ушел за экран, то есть на 700 пикселей влево от 0. Это
            значит, что его координата X как минимум равна -700.*/
            if (walls[i].x <= -walls[i].width) {
                this.tilesPassed++;
                walls.splice(i, 1); /*Удаляем выбранный тайл из массива с данными по тайлам.*/

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
        ctx.fillStyle = '#00a8f3';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < backgrounds.length; i++) {
            backgrounds[i].drawBackground();
        };

        for (let i = 0; i < walls.length; i++) {
            walls[i].draw();
        };

        players.playerOne.draw();

        ctx.fillStyle = 'white';
        ctx.font = '35px Arial';
        ctx.fillText('Скорость: ' + game.worldSpeed, 10, 40); /*Выводим текст о текущей скорости прокрутки мира.*/
        ctx.fillText('Пройденое расстояние: ' + game.distanceTravelled, 10, 80); /*Выводим текст о том, какое расстояние было пройдено.*/
        ctx.fillText('Пройдено тайлов: ' + game.tilesPassed, 10, 120); /*Выводим текст о том, какое расстояние было пройдено.*/

        ctx.strokeStyle = 'red';
        ctx.fillStyle = players.playerOne.color;
        ctx.strokeRect(550, 20, players.playerOne.maxJumpedDistance, 50);
        if (players.playerOne.currentAccelerationY !== 0) {
            ctx.fillRect(551, 21, players.playerOne.currentJumpedDistance, 48);
        } else {
            ctx.fillRect(551, 21, players.playerOne.maxJumpedDistance, 48);
        };
    },
};