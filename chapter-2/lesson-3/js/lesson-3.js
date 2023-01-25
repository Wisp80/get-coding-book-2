const game = {
    tickNumber: 0,

    tickRate: 300,

    timer: null,

    score: 0,

    boards: [
        [
            '####################',
            '#                  #',
            '#                  #',
            '#                  #',
            '#                  #',
            '#                  #',
            '#      ##  ##      #',
            '#      ##  ##      #',
            '#                  #',
            '#                  #',
            '#                  #',
            '#                  #',
            '#                  #',
            '####################'
        ],
        [
            '####################',
            '#                  #',
            '#  ##          ##  #',
            '#  #            #  #',
            '#                  #',
            '#                  #',
            '#                  #',
            '#                  #',
            '#                  #',
            '#                  #',
            '#  #            #  #',
            '#  ##          ##  #',
            '#                  #',
            '####################'
        ],
        [
            '####################',
            '#######      #######',
            '##                ##',
            '#                  #',
            '#    #             #',
            '#    #             #',
            '#    #        #    #',
            '#    #        #    #',
            '#             #    #',
            '#             #    #',
            '#                  #',
            '##                ##',
            '######       #######',
            '####################'
        ]
    ],

    board: [],

    tick: function () {
        window.clearTimeout(game.timer);

        game.tickNumber++;

        if (game.tickNumber % 10 === 0) {
            fruits.addRandomFruit();
        };

        let result = snake.move();

        if (result === "gameover") {
            alert("Игра окончена! Очков набрано: " + game.score);
            game.score = 0;
            return;
        };

        graphics.drawGame();

        game.timer = window.setTimeout("game.tick()", game.tickRate);
    },

    isEmpty: function (location) {
        return game.board[location.y][location.x] === ' ';
    },

    isWall: function (location) {
        return game.board[location.y][location.x] === '#';
    },

    isFruit: function (location) {
        for (let fruitNumber = 0; fruitNumber < fruits.fruit.length; fruitNumber++) {
            let fruit = fruits.fruit[fruitNumber];

            if (!!fruit && location.x === fruit.x && location.y === fruit.y) {
                fruits.fruit.splice(fruitNumber, 1);
                return true;
            };
        };

        return false;
    },
    
    isSnake: function (location) {
        for (let snakePart = 0; snakePart < snake.parts.length; snakePart++) {
            let part = snake.parts[snakePart];

            if (location.x === part.x && location.y === part.y) {
                return true;
            };
        };

        return false;
    },
    
    updateScore: function () {
        let tempScoreboard = document.getElementsByClassName('score')[0];
        tempScoreboard.innerHTML = 'Score: ' + game.score;
    },
    
    resetData: function () {
        window.clearTimeout(game.timer);
        game.tickNumber = 0;
        snake.parts = [
            { x: 7, y: 3 },
            { x: 6, y: 3 },
            { x: 5, y: 3 }
        ];
        snake.facing = "E";
        fruits.fruit = [];
        let tempScoreboard = document.getElementsByClassName('score')[0];
        tempScoreboard.innerHTML = 'Score: 0';
    },
    
    restart: function () {
        game.resetData();

        gameControl.startGame();
    },
    
    fullRestart: function () {
        game.resetData();

        document.getElementsByClassName('game-screen')[0].style.display = 'none';
        document.getElementsByClassName('difficulties')[0].style.display = 'flex';
    },
    
    chooseDifficultyListener: function (event) {
        document.getElementsByClassName('difficulties')[0].style.display = 'none';
        document.getElementsByClassName('maps')[0].style.display = 'flex';

        if (event.currentTarget.innerHTML === 'Easy') {
            game.tickRate = 300;
        } else if (event.currentTarget.innerHTML === 'Medium') {
            game.tickRate = 200;
        } else if (event.currentTarget.innerHTML === 'Hard') {
            game.tickRate = 100;
        };
    },
    
    chooseMapListener: function (event) {
        document.getElementsByClassName('maps')[0].style.display = 'none';
        document.getElementsByClassName('game-screen')[0].style.display = 'flex';

        if (event.currentTarget.classList.value === 'img-maps-01') {
            game.board = game.boards[0];
            console.log(game.board);
        } else if (event.currentTarget.classList.value === 'img-maps-02') {
            game.board = game.boards[1];
            console.log(game.board);
        } else if (event.currentTarget.classList.value === 'img-maps-03') {
            game.board = game.boards[2];
            console.log(game.board);
        };

        gameControl.startGame();
    },
    
    initializeListeners: function () {
        document.getElementsByClassName('btn-diff-easy')[0].addEventListener("click", game.chooseDifficultyListener, false);
        document.getElementsByClassName('btn-diff-med')[0].addEventListener("click", game.chooseDifficultyListener, false);
        document.getElementsByClassName('btn-diff-hard')[0].addEventListener("click", game.chooseDifficultyListener, false);

        document.getElementsByClassName('img-maps-01')[0].addEventListener("click", game.chooseMapListener, false);
        document.getElementsByClassName('img-maps-02')[0].addEventListener("click", game.chooseMapListener, false);
        document.getElementsByClassName('img-maps-03')[0].addEventListener("click", game.chooseMapListener, false);
    }
};

/*-------------------------------------------------------------------------------------------------------------*/

const snake = {
    parts: [
        { x: 7, y: 3 },
        { x: 6, y: 3 },
        { x: 5, y: 3 }
    ],

    facing: "E",

    nextLocation: function () {
        let snakeHead = snake.parts[0];
        let targetX = snakeHead.x;
        let targetY = snakeHead.y;

        targetY = snake.facing === "N" ? targetY - 1 : targetY;
        targetY = snake.facing === "S" ? targetY + 1 : targetY;
        targetX = snake.facing === "W" ? targetX - 1 : targetX;
        targetX = snake.facing === "E" ? targetX + 1 : targetX;

        return { x: targetX, y: targetY };
    },

    move: function () {
        let location = snake.nextLocation();

        if (game.isWall(location) || game.isSnake(location)) {
            game.restart();
            return "gameover";
        }

        if (game.isEmpty(location)) {
            snake.parts.unshift(location);
            snake.parts.pop();
        };

        if (game.isFruit(location)) {
            snake.parts.unshift(location);
            game.score++;
            game.updateScore();
        };
    }
};

/*-------------------------------------------------------------------------------------------------------------*/

const fruits = {
    fruit: [],

    addRandomFruit: function () {
        let randomY = Math.floor(Math.random() * game.board.length) + 0;
        let randomX = Math.floor(Math.random() * game.board[randomY].length) + 0;
        let randomLocation = { x: randomX, y: randomY };

        randomLocation.color = getRandomColor();

        if (game.isEmpty(randomLocation) && !game.isFruit(randomLocation)) {
            fruits.fruit.push(randomLocation);
        };
    },
    
    generateFirstFruit: function () {
        let tempX = getRandomNumberBetween(2, 19);
        let tempY = getRandomNumberBetween(2, 13);
        let randomLocation = { x: tempX, y: tempY, color: getRandomColor() };

        if (game.isEmpty(randomLocation) && !game.isFruit(randomLocation)) {
            return randomLocation;
        };
    }
};

/*-------------------------------------------------------------------------------------------------------------*/

const graphics = {
    canvas: document.getElementById('canvas'),

    squareSize: 50,

    drawBoard: function (ctx) {
        let currentYoffset = 0;

        game.board.forEach(function (line) {
            line = line.split('');

            let currentXoffset = 0;

            line.forEach(function (character) {
                if (character === '#') {
                    ctx.fillStyle = 'black';
                    ctx.fillRect(currentXoffset, currentYoffset, graphics.squareSize, graphics.squareSize);
                } else {
                    ctx.fillStyle = 'lightblue';
                    ctx.fillRect(currentXoffset, currentYoffset, graphics.squareSize, graphics.squareSize);
                };

                currentXoffset += graphics.squareSize;
            });

            currentYoffset += graphics.squareSize;
        });
    },

    draw: function (ctx, source, color, isSnake) {
        source.forEach(function (part, index) {
            let tempColor;

            if (index === 0 && isSnake) {
                tempColor = "rgb(143, 188, 143)";
            } else {
                tempColor = color;
            };

            let partXlocation = part.x * graphics.squareSize;
            let partYlocation = part.y * graphics.squareSize;

            ctx.fillStyle = tempColor;
            ctx.fillRect(partXlocation, partYlocation, graphics.squareSize, graphics.squareSize);
        });
    },

    drawGame: function () {
        let ctx = graphics.canvas.getContext("2d");
        ctx.clearRect(0, 0, graphics.canvas.width, graphics.canvas.height);

        graphics.drawBoard(ctx);

        for (let i = 0; i < fruits.fruit.length; i++) {
            if (!!fruits.fruit[i]) {
                graphics.draw(ctx, [fruits.fruit[i]], fruits.fruit[i].color, false);
            };
        };

        graphics.draw(ctx, snake.parts, "green", true);
    }
};

/*-------------------------------------------------------------------------------------------------------------*/

const gameControl = {
    processInput: function (keyPressed) {
        let key = keyPressed.key.toLowerCase();

        let targetDirection = snake.facing;

        if (key === "w" && snake.facing !== "S") {
            targetDirection = "N";
            game.tick();
        };

        if (key === "a" && snake.facing !== "E") {
            targetDirection = "W";
            game.tick();
        };

        if (key === "s" && snake.facing !== "N") {
            targetDirection = "S";
            game.tick();
        };

        if (key === "d" && snake.facing !== "W") {
            targetDirection = "E";
            game.tick();
        };

        snake.facing = targetDirection;
    },

    startGame: function () {
        window.addEventListener("keypress", gameControl.processInput, false);

        fruits.fruit.push(fruits.generateFirstFruit());

        game.tick();
    }
};

/*-------------------------------------------------------------------------------------------------------------*/

game.initializeListeners();

/*-------------------------------------------------------------------------------------------------------------*/

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    };

    return color;
};

function getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};