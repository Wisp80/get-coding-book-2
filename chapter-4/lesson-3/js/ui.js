const ui = {
    pressPlayButton: function () {
        game.tick();
        document.getElementsByClassName('play-button')[0].disabled = true;

        audio.initiateBackgroudMusicLooping();
        audio.playSound(audio.defaultBackgroundMusic);
    },

    pressResetButton: function () {
        game.reset();
        game.tick();
    },

    pressSoundButton: function () {
        if (document.getElementsByClassName('sound-off-on-button')[0].innerHTML === '🔊') {
            document.getElementsByClassName('sound-off-on-button')[0].innerHTML = '🔇'
            audio.defaultBackgroundMusic.muted = true;
            audio.generateLoseSound().muted = true;
        } else {
            document.getElementsByClassName('sound-off-on-button')[0].innerHTML = '🔊'
            audio.defaultBackgroundMusic.muted = false;
            audio.generateLoseSound().muted = false;
        };
    }
};