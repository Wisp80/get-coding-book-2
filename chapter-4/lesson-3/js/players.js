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
    this.width = 33;
    this.height = 48;
    this.currentSpeedX = 0;
    this.currentSpeedY = 0;
    this.maxSpeedX = 10;
    this.maxSpeedY = 26;
    this.currentAccelerationY = 20;
    this.accelerationY = 20;
    this.gravity = 2;
    this.accelerationX = 1;
    this.friction = 0.6; // [0; 1] трение, используется как множитель скорости для плавного торможения.
    this.color = 'orange';
    this.src = './src/images/human2.png'
    this.isActive = true; // Указывает активный ли для управления наш игрок.

    this.isPlayerOnTheFloor = false;
    this.currentJumpedDistance = 0;
    this.maxJumpedDistance = 640;

    this.predictedHorizontalWayToTheRight = null;
    this.predictedHorizontalWayToTheLeft = null;
    this.predictedVerticalWayDown = null;
    this.predictedVerticalWayUp = null;

    this.xGIFcoordinate = 0;
    this.gifFrames = 0;
    this.drawSlowingRate = 5;

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
            //game.worldSpeed = closestCollisionRight; // то в следующий тик его скорость равна расстоянию до самого ближайшего из этих препятствий.

            /*то сдвигаем все стенки на расстояние этой коллизии, чтобы они перескачили через игрока.*/
            for (let i = 0; i < walls.length; i++) {
                walls[i].x -= closestCollisionRight;
            };
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
            };

            /*Применяем гравитацию.*/
            this.currentSpeedY += this.gravity; // Каждый тик увеличиваем скорость по Y, чтобы при применении этой скорости к игроку двигать его вниз.

            if (this.currentAccelerationY !== 0 && this.currentSpeedY < 0) {
                this.currentJumpedDistance += (this.accelerationY - this.gravity);
                this.isPlayerOnTheFloor = false;

                if (this.currentJumpedDistance >= this.maxJumpedDistance) {
                    this.currentAccelerationY = 0;
                    this.currentJumpedDistance = 0;
                    this.color = 'red';
                };
            };

            if (this.isPlayerOnTheFloor) {
                this.color = 'orange';
                this.currentJumpedDistance = 0;
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

    this.drawGIF = function () {
        if (this.isActive) {
            ctx.drawImage(
                imagePlayerRunning,
                this.xGIFcoordinate, 0, 33, 48,
                this.x, this.y, 33, 48
            );

            if (this.xGIFcoordinate >= 99) {
                this.xGIFcoordinate = 0;
            } else if (this.gifFrames % this.drawSlowingRate === 0 && this.gifFrames !== 0) {
                this.xGIFcoordinate += 33;
            };

            this.gifFrames++;
        } else {
            ctx.drawImage(imagePlayer, this.x, this.y, 33, 48);

            this.xGIFcoordinate = 0;
            this.gifFrames = 0;
        };
    };

    this.draw = function () {
        this.drawGIF();
    };
};