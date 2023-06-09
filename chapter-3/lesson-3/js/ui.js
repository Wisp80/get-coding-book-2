let ui = {
    changeDisplay: function (element, displayValue) {
        document.getElementsByClassName(element)[0].style.display = displayValue;
    },

    highlightElement: function (el, parentContainerClass) {
        if (el.classList.contains('highlighted-button')) {
            el.classList.remove('highlighted-button');
            return;
        };

        el.classList.add('highlighted-button');

        for (let i = 0; i < document.getElementsByClassName(parentContainerClass)[0].children.length; i++) {
            if (document.getElementsByClassName(parentContainerClass)[0].children[i] !== el) {
                document.getElementsByClassName(parentContainerClass)[0].children[i].classList.remove('highlighted-button');
            };
        };
    },

    countHighlightedButtons: function (parentContainerClass) {
        let highlightedButtonsCount = 0;

        for (let i = 0; i < document.getElementsByClassName(parentContainerClass)[0].children.length; i++) {
            if (document.getElementsByClassName(parentContainerClass)[0].children[i].classList.contains('highlighted-button')) {
                highlightedButtonsCount++;
            };
        };

        return highlightedButtonsCount;
    },

    enableDisablePlayButton: function () {
        let highlightedMainSettingsButtonsCount = ui.countHighlightedButtons('players-mode-container')
            + ui.countHighlightedButtons('ai-difficulty-container')
            + ui.countHighlightedButtons('best-of-mode-container');

        if (highlightedMainSettingsButtonsCount === 3 ||
            (document.getElementsByClassName('one-player-vs-one-player-button')[0].classList.contains('highlighted-button') &&
                ui.countHighlightedButtons('best-of-mode-container') === 1)) {
            document.getElementsByClassName('play-button')[0].disabled = false;
        } else {
            document.getElementsByClassName('play-button')[0].disabled = true;
        };
    },

    changeTheme: function (el) {
        ui.highlightElement(el, 'themes-music-settings-buttons-container');

        switch (el.innerText) {
            case 'Default':
                game.theme = 'default';
                document.getElementsByClassName('start-screen')[0].classList.remove('sonic-picture');
                document.getElementsByClassName('start-screen')[0].classList.add('default-picture');
                break;

            case 'Sonic':
                game.theme = 'sonic';
                document.getElementsByClassName('start-screen')[0].classList.remove('default-picture');
                document.getElementsByClassName('start-screen')[0].classList.add('sonic-picture');
                break;

            default:
                break;
        };
    },

    changeVolume: function (el) {
        audio.volume = Number(el.value);
    },

    choosePlayersModeOption: function (el) {
        ui.highlightElement(el, 'players-mode-container');

        switch (el.innerText) {
            case '1P vs 1AI':
                game.playersModeOption = 11;
                break;

            case '1P vs 2AI':
                game.playersModeOption = 12;
                break;

            case '2P vs 1AI':
                game.playersModeOption = 21;
                break;

            case '2P vs 2AI':
                game.playersModeOption = 22;
                break;

            case 'PvP':
                game.playersModeOption = 33;
                break;

            default:
                break;
        };
    },

    chooseAIDifficulty: function (el) {
        ui.highlightElement(el, 'ai-difficulty-container');

        switch (el.innerText) {
            case 'Easy 🤡':
                game.aiDifficulty = 1;
                break;

            case 'Normal 🍻':
                game.aiDifficulty = 2;
                break;

            case 'Hard 💀':
                game.aiDifficulty = 3;
                break;

            case 'Very Hard 😈':
                game.aiDifficulty = 4;
                break;

            case 'Impossible 👽':
                game.aiDifficulty = 5;
                break;

            default:
                break;
        };
    },

    chooseBestOfOption: function (el) {
        ui.highlightElement(el, 'best-of-mode-container');

        switch (el.innerText) {
            case 'Best of 1':
                game.bestOfOption = 1;
                break;

            case 'Best of 3':
                game.bestOfOption = 3;
                break;

            case 'Best of 5':
                game.bestOfOption = 5;
                break;

            case 'Best of 7':
                game.bestOfOption = 7;
                break;

            case 'Best of 9':
                game.bestOfOption = 9;
                break;

            default:
                break;
        };
    },

    specifyBallCountOption: function (el) {
        if (el.innerHTML === '+1') {
            game.ballCountOption++;
        } else if (el.innerHTML === '-1') {
            game.ballCountOption--;
        };

        if (game.ballCountOption <= 0) {
            game.ballCountOption = 1;
        } else if (game.ballCountOption >= 11) {
            game.ballCountOption = 10;
        };

        document.getElementsByClassName('ball-count')[0].innerHTML = game.ballCountOption;
    },

    restart: function () {
        game.resetScore();
        ui.updateWinsInfoAndScoreText();
        game.resetPaddlesAndBalls();

        ui.changeDisplay('gameover-container', 'none');
        ui.changeDisplay('mainframe', 'flex');
        audio.playSound(audio.checkMusicTheme());
    },

    goToMainMenuFromGameoverScreen: function () {
        controls.ballsControls.freeze(ballsArray);

        ui.changeDisplay('start-screen', 'flex');
        ui.changeDisplay('gameover-container', 'none');
    },

    goToMainMenuFromMainframe: function () {
        controls.ballsControls.freeze(ballsArray);

        ui.changeDisplay('start-screen', 'flex');
        ui.changeDisplay('mainframe', 'none');
        audio.pauseSound(audio.checkMusicTheme());
    },

    updateScore: function () {
        game.resetPaddlesAndBalls();
        ui.updateWinsInfoAndScoreText();
        game.defineWinner();
    },

    updateWinsInfoAndScoreText: function () {
        if (game.playersModeOption === 33) {
            document.getElementsByClassName('wins-info')[0].innerHTML = 'Player One ' + game.playersWins + ' : ' + game.aiWins + ' Player Two';
            document.getElementsByClassName('score-text')[0].innerHTML = 'Player One ' + game.playersWins + ' : ' + game.aiWins + ' Player Two';
        } else {
            document.getElementsByClassName('wins-info')[0].innerHTML = 'You ' + game.playersWins + ' : ' + game.aiWins + ' AI';
            document.getElementsByClassName('score-text')[0].innerHTML = 'You ' + game.playersWins + ' : ' + game.aiWins + ' AI';
        };
    },

    pauseTheGame: function () {
        alert(`Click 'OK' to resume`);
    }
};