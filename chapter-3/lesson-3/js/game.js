let game = {
    bestOfOption: 3,
    playersModeOption: 11,
    ballCountOption: 3,
    aiDifficulty: 1,
    theme: 'default',
    playersWins: 0,
    aiWins: 0,
    tickTimeout: null,
    tickRate: 1000 / 120,

    tick: function () {
        window.clearTimeout(game.tickTimeout);
        game.prepareDataForNextTick();
        window.requestAnimationFrame(game.renderPreparedDataForNextTick);
        game.tickTimeout = window.setTimeout('game.tick()', game.tickRate);
    },

    prepareDataForNextTick: function () {
        controls.playersControls.initializeWatchPlayersControls();
        controls.playersControls.updatePlayersControls(players.playerOne, '38', '40');

        if (game.playersModeOption === 21 || game.playersModeOption === 22 || game.playersModeOption === 33) {
            controls.playersControls.updatePlayersControls(players.playerTwo, '87', '83');
        };

        if (game.playersModeOption !== 33) {
            controls.aiControls.updateAiControlsOne(ai.aiOne);
        };

        if (game.playersModeOption === 12 || game.playersModeOption === 22) {
            controls.aiControls.updateAiControlsTwo(ai.aiTwo, ai.aiOne);
        };

        for (let i = 0; i < ballsArray.length; i++) {
            ballsArray[i].updateBall();
        };
    },

    renderPreparedDataForNextTick: function () {
        switch (game.playersModeOption) {
            case 11:
                render.draw(
                    [players.playerOne, ai.aiOne],
                    ballsArray,
                    [players.playerOne.color, ai.aiOne.color],
                    [players.playerOne.strokeColor, ai.aiOne.strokeColor],
                    [players.playerOne.paddleImage, ai.aiOne.paddleImage]
                );
                break;

            case 12:
                render.draw(
                    [players.playerOne, ai.aiOne, ai.aiTwo],
                    ballsArray,
                    [players.playerOne.color, ai.aiOne.color, ai.aiTwo.color],
                    [players.playerOne.strokeColor, ai.aiOne.strokeColor, ai.aiTwo.strokeColor],
                    [players.playerOne.paddleImage, ai.aiOne.paddleImage, ai.aiTwo.paddleImage]
                );
                break;

            case 21:
                render.draw(
                    [players.playerOne, players.playerTwo, ai.aiOne],
                    ballsArray,
                    [players.playerOne.color, players.playerTwo.color, ai.aiOne.color],
                    [players.playerOne.strokeColor, players.playerTwo.strokeColor, ai.aiOne.strokeColor],
                    [players.playerOne.paddleImage, players.playerTwo.paddleImage, ai.aiOne.paddleImage]
                );
                break;

            case 22:
                render.draw(
                    [players.playerOne, players.playerTwo, ai.aiOne, ai.aiTwo],
                    ballsArray,
                    [players.playerOne.color, players.playerTwo.color, ai.aiOne.color, ai.aiTwo.color],
                    [players.playerOne.strokeColor, players.playerTwo.strokeColor, ai.aiOne.strokeColor, ai.aiTwo.strokeColor],
                    [players.playerOne.paddleImage, players.playerTwo.paddleImage, ai.aiOne.paddleImage, ai.aiTwo.paddleImage]
                );
                break;

            case 33:
                render.draw(
                    [players.playerOne, players.playerTwo],
                    ballsArray,
                    [players.playerOne.color, players.playerTwo.color],
                    [players.playerOne.strokeColor, players.playerTwo.strokeColor],
                    [players.playerOne.paddleImage, players.playerTwo.paddleImage]
                );
                break;

            default:
                break;
        };
    },

    resetPaddlesAndBalls: function () {
        controls.playersControls.reset([players.playerOne, players.playerTwo]);
        controls.aiControls.reset([ai.aiOne, ai.aiTwo]);
        controls.ballsControls.reset(ballsArray);
    },

    generateBalls: function (count) {
        ballsArray = [];

        for (let i = 0; i < count; i++) {
            ballsArray[i] = new Ball(
                ballData.xPosition + Math.random(),
                ballData.yPosition + Math.random(),
                helper.getRandomNumberFromRange(11, 13),
                helper.getRandomNumberFromLowerBoundToMinusOneOrFromOneToUpperBound(-3, 3),
                helper.getRandomNumberFromLowerBoundToZeroOrFromZeroToUpperBound(-3, 3),
                helper.getRandomColor(),
                helper.getRandomColor()
            );
        };
    },

    startGame: function () {
        if (game.playersModeOption === 11 || game.playersModeOption === 12) {
            players.playerTwo = null;
        };

        if (game.playersModeOption === 11 || game.playersModeOption === 21) {
            ai.aiTwo = null;
        };

        if (game.playersModeOption === 21 || game.playersModeOption === 22) {
            players.playerTwo = new Paddle(
                playersPaddlesData.playerTwoPaddleData.xPosition,
                playersPaddlesData.playerTwoPaddleData.yPosition,
                playersPaddlesData.playerTwoPaddleData.width,
                playersPaddlesData.playerTwoPaddleData.height,
                playersPaddlesData.playerTwoPaddleData.defaultSpeedModifier,
                playersPaddlesData.playerTwoPaddleData.increasedSpeedModifier,
                playersPaddlesData.playerTwoPaddleData.speed,
                playersPaddlesData.playerTwoPaddleData.color,
                playersPaddlesData.playerTwoPaddleData.strokeColor,
                playersPaddlesData.playerTwoPaddleData.paddleImage
            );
        };

        if (game.playersModeOption === 12 || game.playersModeOption === 22) {
            ai.aiTwo = new Paddle(
                aiPaddlesData.aiTwoPaddleData.xPosition,
                aiPaddlesData.aiTwoPaddleData.yPosition,
                aiPaddlesData.aiTwoPaddleData.width,
                aiPaddlesData.aiTwoPaddleData.height,
                aiPaddlesData.aiTwoPaddleData.defaultSpeedModifier,
                aiPaddlesData.aiTwoPaddleData.increasedSpeedModifier,
                aiPaddlesData.aiTwoPaddleData.speed,
                aiPaddlesData.aiTwoPaddleData.color,
                aiPaddlesData.aiTwoPaddleData.strokeColor,
                aiPaddlesData.aiTwoPaddleData.paddleImage
            );
        };

        if (game.playersModeOption !== 33) {
            if (ai.aiOne === null) {
                ai.aiOne = new Paddle(
                    aiPaddlesData.aiOnePaddleData.xPosition,
                    aiPaddlesData.aiOnePaddleData.yPosition,
                    aiPaddlesData.aiOnePaddleData.width,
                    aiPaddlesData.aiOnePaddleData.height,
                    aiPaddlesData.aiOnePaddleData.defaultSpeedModifier,
                    aiPaddlesData.aiOnePaddleData.increasedSpeedModifier,
                    aiPaddlesData.aiOnePaddleData.speed,
                    aiPaddlesData.aiOnePaddleData.color,
                    aiPaddlesData.aiOnePaddleData.strokeColor,
                    aiPaddlesData.aiOnePaddleData.paddleImage
                );
            };
        };

        if (game.playersModeOption === 33) {
            ai.aiOne = null;
            ai.aiTwo = null;
            players.playerTwo = null;

            players.playerTwo = new Paddle(
                aiPaddlesData.aiOnePaddleData.xPosition,
                playersPaddlesData.playerTwoPaddleData.yPosition,
                playersPaddlesData.playerTwoPaddleData.width,
                playersPaddlesData.playerTwoPaddleData.height,
                playersPaddlesData.playerTwoPaddleData.defaultSpeedModifier,
                playersPaddlesData.playerTwoPaddleData.increasedSpeedModifier,
                playersPaddlesData.playerTwoPaddleData.speed,
                playersPaddlesData.playerTwoPaddleData.color,
                playersPaddlesData.playerTwoPaddleData.strokeColor,
                playersPaddlesData.playerTwoPaddleData.paddleImage
            );
        };

        game.resetScore();
        game.generateBalls(game.ballCountOption);
        game.resetPaddlesAndBalls();
        ui.updateWinsInfoAndScoreText();
        ui.changeDisplay('start-screen', 'none');
        ui.changeDisplay('mainframe', 'flex');
        audio.playSound(audio.checkMusicTheme());
        game.tick();
    },

    defineWinner: function () {
        if (game.aiWins >= (game.bestOfOption + 1) / 2 || game.playersWins >= (game.bestOfOption + 1) / 2) {
            controls.ballsControls.freeze(ballsArray);

            ui.changeDisplay('mainframe', 'none');
            audio.pauseSound(audio.checkMusicTheme());
            ui.changeDisplay('gameover-container', 'flex');
            ui.updateWinsInfoAndScoreText();
            game.resetScore();

            if (game.playersModeOption === 33) {
                document.getElementsByClassName('wins-info')[0].innerHTML = 'Player One ' + game.playersWins + ' : ' + game.aiWins + ' Player Two';
            } else {
                document.getElementsByClassName('wins-info')[0].innerHTML = 'You ' + game.playersWins + ' : ' + game.aiWins + ' AI';
            };
        };
    },

    resetScore: function () {
        game.aiWins = 0;
        game.playersWins = 0;
    }
};