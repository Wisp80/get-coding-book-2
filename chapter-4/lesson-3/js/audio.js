let audio = {
    volume: 0.5,

    generateLoseSound: function () {
        return new Audio('./src/sounds/default-sounds/lose-sound-default.wav');
    },

    defaultBackgroundMusic: new Audio('./src/music/03WhatUNeed.mp3'),

    isBackgroundMusicPaused: false,

    playSound: function (sound) {
        sound.volume = audio.volume;
        sound.play();
    },

    pauseSound: function (sound) {
        audio.defaultBackgroundMusic.currentTime = 0;

        sound.volume = audio.volume;
        sound.pause();
    },

    initiateBackgroudMusicLooping: function () {
        audio.defaultBackgroundMusic.loop = true;
    }
};

audio.initiateBackgroudMusicLooping();