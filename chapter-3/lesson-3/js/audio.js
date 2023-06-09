let audio = {
    volume: 0.05,

    generateDefaultHitSound: function () {
        switch (game.theme) {
            case 'default':
                return new Audio('./src/sounds/default-sounds/default-hit-sound-default.wav');

            case 'sonic':
                return new Audio('./src/sounds/sonic-sounds/default-hit-sound-sonic.mp3');

            default:
                break;
        };
    },

    generateIncreasedHitSound: function () {
        switch (game.theme) {
            case 'default':
                return new Audio('./src/sounds/default-sounds/increased-hit-sound-default.wav');

            case 'sonic':
                return new Audio('./src/sounds/sonic-sounds/increased-hit-sound-sonic.mp3');

            default:
                break;
        };
    },

    generateScoreSound: function () {
        switch (game.theme) {
            case 'default':
                return new Audio('./src/sounds/default-sounds/score-sound-default.wav');

            case 'sonic':
                return new Audio('./src/sounds/sonic-sounds/score-sound-sonic.mp3');

            default:
                break;
        };
    },

    generateLoseSound: function () {
        switch (game.theme) {
            case 'default':
                return new Audio('./src/sounds/default-sounds/lose-sound-default.wav');

            case 'sonic':
                return new Audio('./src/sounds/sonic-sounds/lose-sound-sonic.mp3');

            default:
                break;
        };
    },

    generateWinSound: function () {
        switch (game.theme) {
            case 'default':
                return new Audio('./src/sounds/default-sounds/win-sound-default.wav');

            case 'sonic':
                return new Audio('./src/sounds/sonic-sounds/win-sound-sonic.mp3');

            default:
                break;
        };
    },

    defaultBackgroundMusic: new Audio('./src/music/music-default.wav'),
    sonicBackgroundMusic: new Audio('./src/music/music-sonic.mp3'),

    isBackgroundMusicPaused: false,

    checkMusicTheme: function () {
        switch (game.theme) {
            case 'default':
                return audio.defaultBackgroundMusic;

            case 'sonic':
                return audio.sonicBackgroundMusic;

            default:
                break;
        };
    },

    playSound: function (sound) {
        sound.volume = audio.volume;
        sound.play();
    },

    pauseSound: function (sound) {
        audio.sonicBackgroundMusic.currentTime = 0;
        audio.defaultBackgroundMusic.currentTime = 0;

        sound.volume = audio.volume;
        sound.pause();
    },

    initiateBackgroudMusicLooping: function () {
        audio.defaultBackgroundMusic.loop = true;
        audio.sonicBackgroundMusic.loop = true;
    }
};

audio.initiateBackgroudMusicLooping();