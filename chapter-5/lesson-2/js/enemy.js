function enemy(x, y, maxJumpHeight) {
    this.character = new Character(x, y, 25, 25, maxJumpHeight, new animation('./src/tiger/tiger', 5), new animation('./src/tiger/backwards/tiger.backwards', 5));

    this.tick = function () {
        let distanceFromPlayer = Math.abs(player.character.x - this.character.x);

        if (distanceFromPlayer <= world.screenWidth * 2) {
            this.character.currentSpeedX = 2;

            if (player.character.x < this.character.x) {
                this.character.currentSpeedX *= -1;
            };

            if (this.character.collidesWith(player.character)) {
                game.stop();
            };

            this.character.prepareCharacterData();
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