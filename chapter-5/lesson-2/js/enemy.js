function Enemy(x, y, maxJumpHeight) {
    this.character = new Character(
        x, y,
        25, 25,
        maxJumpHeight,
        new Animation('./src/tiger/tiger', 5), new Animation('./src/tiger/backwards/tiger.backwards', 5)
    );

    this.prepareEnemyData = function () {
        let distanceFromPlayer = Math.abs(player.character.x - this.character.x);

        if (distanceFromPlayer <= world.screenWidth * 2) {
            this.character.currentSpeedX = 2;
            if (player.character.x < this.character.x) { this.character.currentSpeedX *= -1 };
            if (this.character.collidesWith(player.character)) { game.stop() };
            if (!game.finished) { this.character.prepareCharacterData() };
        };
    };

    this.draw = function () { this.character.draw() };
};

const enemies = {
    enemiesList: [
        new Enemy(500, 100, 300),
        new Enemy(2000, 100, 300),
        new Enemy(3700, 100, 300),
        new Enemy(4000, 100, 300),
        new Enemy(5600, 100, 300),
        new Enemy(6500, 100, 300),
        new Enemy(7600, 100, 300)
    ],

    prepareEnemiesData: function () {
        for (let i = 0; i < enemies.enemiesList.length; i++) { enemies.enemiesList[i].prepareEnemyData() };
    }
};