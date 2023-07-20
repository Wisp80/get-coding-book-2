const game = {
    setTimeoutID: null,
    finished: false,

    tick: function () {
        window.clearTimeout(this.setTimeoutID);
        if (this.finished) { return };
        this.prepareDataForNextTick();
        this.renderPreparedDataForNextTick();
        this.setTimeoutID = window.setTimeout('game.tick()', 1000 / 60);
    },

    prepareDataForNextTick: function () {
        world.tick();
        player.tick();
    },

    renderPreparedDataForNextTick: function () {
        world.draw();
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