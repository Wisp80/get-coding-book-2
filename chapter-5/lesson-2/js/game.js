const game = {
    setTimeoutID: null,
    ticks: 0,
    finished: false,

    tick: function () {
        window.clearTimeout(this.setTimeoutID);
        if (this.finished) { return };
        this.prepareDataForNextTick();
        this.renderPreparedDataForNextTick();
        this.setTimeoutID = window.setTimeout('game.tick()', 1000 / 60);
    },

    prepareDataForNextTick: function () {
        this.ticks++;

        if (!world.levelImage) {
            enemies.push(new enemy(500, 100));
            enemies.push(new enemy(2000, 100));
            enemies.push(new enemy(3700, 100));
            enemies.push(new enemy(4000, 100));
            enemies.push(new enemy(5600, 100));
            enemies.push(new enemy(6500, 100));
            enemies.push(new enemy(7600, 100));
        };

        activateEnemies();

        world.prepareWorldData();
        player.tick();
    },

    renderPreparedDataForNextTick: function () {
        world.draw();
        for (let i = 0; i < enemies.length; i++) { enemies[i].draw() };
        player.draw();
    },

    start: function () {
        // audio.backgroundMusic();
        this.tick();
    },

    stop: function (reason) {
        this.finished = true;
        window.clearTimeout(this.setTimeoutID);
        alert(reason === 'win' ? 'You won!' : 'You lost!');
    }
};