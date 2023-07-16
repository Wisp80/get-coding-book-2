const game = {
    timer: null,
    finished: false,
    controls: {},
    sounds: {
        enabled: true,

        jump: function () {
            this.play('./src/sounds/meow.wav')
        },

        backgroundMusic: function () {
            this.play('./src/sounds/background.mp3')
        },

        play: function (filename) {
            if (this.enabled) {
                new Audio(filename.play());
            };
        }
    },

    loop: function () {

    },

    start: function () {

    },

    stop: function () {

    }
};