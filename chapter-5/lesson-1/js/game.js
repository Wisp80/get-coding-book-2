const game = {
    timer: null,

    finished: false,

    controls: {
        left: false,
        right: false,
        up: false,
        down: false,

        mapping: {
            65: 'left',
            68: 'right',
            87: 'up',
            83: 'down'
        },

        buttonPress: function (keyInfo) {
            this[this.mapping[keyInfo.keyCode]] = true;
        },

        buttonRelease: function (keyInfo) {
            this[this.mapping[keyInfo.keyCode]] = false;
        },

        connect: function () {
            window.addEventListener('keydown', function (keyInfo) {
                game.controls.buttonPress(event);
            }, false);

            window.addEventListener('keyup', function (keyInfo) {
                game.controls.buttonRelease(event);
            }, false);
        }
    },

    sounds: {
        enabled: true,

        jump: function () {
            this.play('./src/sounds/meow.wav');
        },

        backgroundMusic: function () {
            this.play('./src/sounds/background.mp3');
        },

        play: function (filename) {
            if (this.enabled) {
                new Audio(filename).play();
            };
        }
    },

    loop: function () {
        if (this.finished) {
            return;
        };

        world.tick();
        player.tick();
        world.draw();
        player.draw();

        this.timer = window.setTimeout('game.loop()', 1000 / 60);
    },

    start: function () {
        this.controls.connect();
        this.sounds.backgroundMusic();
        this.loop();
    },

    stop: function (reason) {
        this.finished = true;
        window.clearTimeout(this.timer);
        alert(reason === 'win' ? 'You won!' : 'You lost!');
    }
};

game.start();