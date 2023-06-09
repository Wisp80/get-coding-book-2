let controls = {
    playersControls: {
        heldDownKeysByPlayers: {},

        move: function (keyCode, player, keyUp, keyDown) {
            let nextY = player.y;

            if (keyCode === keyDown) {
                nextY += player.speed;
            } else if (keyCode === keyUp) {
                nextY += -1 * player.speed;
            };

            nextY = nextY < 0 ? 0 : nextY;
            nextY = nextY + player.height > canvas.height ? canvas.height - player.height : nextY;
            player.y = nextY;
        },

        updatePlayersControls: function (player, keyUp, keyDown) {
            for (let keyCode in this.heldDownKeysByPlayers) {
                controls.playersControls.move(keyCode, player, keyUp, keyDown);
            };
        },

        initializeWatchPlayersControls: function () {
            window.addEventListener('keydown', () => { this.heldDownKeysByPlayers[event.keyCode] = true; }, false);
            window.addEventListener('keyup', () => { delete this.heldDownKeysByPlayers[event.keyCode]; }, false);
        },

        reset: function (players) {
            if (game.playersModeOption === 11 || game.playersModeOption === 12) {
                players[0].y = (canvas.height - playersPaddlesData.playerOnePaddleData.height) / 2;
            } else if (game.playersModeOption === 21 || game.playersModeOption === 22) {
                players[0].y = playersPaddlesData.playerOnePaddleData.yPosition;

                if (players[1] !== null) {
                    players[1].y = playersPaddlesData.playerTwoPaddleData.yPosition;
                };
            } else if (game.playersModeOption === 33) {
                players[0].y = (canvas.height - playersPaddlesData.playerOnePaddleData.height) / 2;
                players[1].y = (canvas.height - playersPaddlesData.playerTwoPaddleData.height) / 2;
            };
        }
    },

    aiControls: {
        move: function (keyCode, ai) {
            let nextY = ai.y;

            if (keyCode === '40') {
                nextY += ai.speed;
                ai.defaultSpeedModifier = ai.increasedSpeedModifier;
            } else if (keyCode === '38') {
                nextY += -1 * ai.speed;
                ai.defaultSpeedModifier = ai.increasedSpeedModifier;
            };

            nextY = nextY < 0 ? 0 : nextY;
            nextY = nextY + ai.height > canvas.height ? canvas.height - ai.height : nextY;
            ai.y = nextY;
        },

        drawTarget: function (ai, aiMiddle, ballToControl, color) {
            ctx.beginPath();
            ctx.moveTo(ai.x, aiMiddle);
            ctx.lineTo(ballsArray[ballToControl].x, ballsArray[ballToControl].y);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.closePath();
        },

        /*-------------------------------------------------------------------------------------------------------------*/

        findTheBallThatHasMinimumDistanceToAI: function (ballsArray, ai) {
            if (ballsArray.length === 0 || !ai) {
                return 0;
            };

            let distancesFromBallsToAI = [];

            for (let i = 0; i < ballsArray.length; i++) {
                distancesFromBallsToAI[i] = Math.sqrt(Math.pow((ai.x - ballsArray[i].x), 2) + Math.pow((ai.y + (ai.height / 2) - ballsArray[i].y), 2));
            };

            let minimumDistanceToAI = canvas.width;
            let ballThatHasMinimumDistanceToAI;

            for (let i = 0; i < distancesFromBallsToAI.length; i++) {
                if (distancesFromBallsToAI[i] < minimumDistanceToAI) {
                    minimumDistanceToAI = distancesFromBallsToAI[i];
                    ballThatHasMinimumDistanceToAI = i;
                };
            };

            return ballThatHasMinimumDistanceToAI;
        },

        findTheBallThatHasMinimumDistanceToAIConsideringBallXDirection: function (ballsArray, ai) {
            if (ballsArray.length === 0 || !ai) {
                return 0;
            };

            let distancesFromBallsToAI = [];

            for (let i = 0; i < ballsArray.length; i++) {
                distancesFromBallsToAI[i] = Math.sqrt(Math.pow((ai.x - ballsArray[i].x), 2) + Math.pow((ai.y + (ai.height / 2) - ballsArray[i].y), 2));
            };

            let minimumDistanceToAI = canvas.width;
            let ballThatHasMinimumDistanceToAI = null;

            for (let i = 0; i < distancesFromBallsToAI.length; i++) {
                if (distancesFromBallsToAI[i] < minimumDistanceToAI && ballsArray[i].xSpeed > 0) {
                    minimumDistanceToAI = distancesFromBallsToAI[i];
                    ballThatHasMinimumDistanceToAI = i;
                };
            };

            if (ballThatHasMinimumDistanceToAI === null) {
                ballThatHasMinimumDistanceToAI = controls.aiControls.findTheBallThatHasMinimumDistanceToAI(ballsArray, ai)
            };

            return ballThatHasMinimumDistanceToAI;
        },

        findTheBallThatHasMinimumDistanceToRightSide: function (ballsArray) {
            if (ballsArray.length === 0) {
                return 0;
            };

            let distancesFromBallsToRightSide = [];

            for (let i = 0; i < ballsArray.length; i++) {
                distancesFromBallsToRightSide[i] = canvas.width - ballsArray[i].x;
            };

            let minimumDistanceToRightSide = canvas.width;
            let ballThatHasMinimumDistanceToRightSide;

            for (let i = 0; i < distancesFromBallsToRightSide.length; i++) {
                if (distancesFromBallsToRightSide[i] < minimumDistanceToRightSide) {
                    minimumDistanceToRightSide = distancesFromBallsToRightSide[i];
                    ballThatHasMinimumDistanceToRightSide = i;
                };
            };

            return ballThatHasMinimumDistanceToRightSide;
        },

        findTheBallThatHasMinimumDistanceToRightSideConsideringBallXDirection: function (ballsArray) {
            if (ballsArray.length === 0) {
                return 0;
            };

            let distancesFromBallsToRightSide = [];

            for (let i = 0; i < ballsArray.length; i++) {
                distancesFromBallsToRightSide[i] = canvas.width - ballsArray[i].x;
            };

            let minimumDistanceToRightSide = canvas.width;
            let ballThatHasMinimumDistanceToRightSide = null;

            for (let i = 0; i < distancesFromBallsToRightSide.length; i++) {
                if (distancesFromBallsToRightSide[i] < minimumDistanceToRightSide && ballsArray[i].xSpeed > 0) {
                    minimumDistanceToRightSide = distancesFromBallsToRightSide[i];
                    ballThatHasMinimumDistanceToRightSide = i;
                };
            };

            if (ballThatHasMinimumDistanceToRightSide === null) {
                ballThatHasMinimumDistanceToRightSide = controls.aiControls.findTheBallThatHasMinimumDistanceToRightSide(ballsArray);
            };

            return ballThatHasMinimumDistanceToRightSide;
        },

        updateAiControlsOne: function (ai) {
            let aiMiddle = ai.y + (ai.height / 2);
            let ballToControl;

            if (game.playersModeOption === 11 || game.playersModeOption === 21) {
                switch (game.aiDifficulty) {
                    case 1:
                        ai.speed = aiPaddlesData.aiOnePaddleData.speed - 3;
                        ballToControl = ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToAI(ballsArray, ai);
                        break;

                    case 2:
                        ai.speed = aiPaddlesData.aiOnePaddleData.speed - 1;
                        ballToControl = ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToAI(ballsArray, ai);
                        break;

                    case 3:
                        ai.speed = aiPaddlesData.aiOnePaddleData.speed + 1;
                        ballToControl = ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToAIConsideringBallXDirection(ballsArray, ai);
                        break;

                    case 4:
                        ai.speed = aiPaddlesData.aiOnePaddleData.speed + 2;
                        ballToControl = ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToRightSide(ballsArray);
                        break;

                    case 5:
                        ai.speed = aiPaddlesData.aiOnePaddleData.speed + 3;
                        ballToControl = ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToRightSideConsideringBallXDirection(ballsArray);
                        break;

                    default:
                        break;
                };

                if (!ballToControl) {
                    ballToControl = 0;
                };

                if (ballsArray[ballToControl]) {
                    if (aiMiddle < ballsArray[ballToControl].y) {
                        controls.aiControls.move('40', ai);
                    };

                    if (aiMiddle > ballsArray[ballToControl].y) {
                        controls.aiControls.move('38', ai);
                    };

                    if (aiMiddle === ballsArray[ballToControl].y) {
                        ai.defaultSpeedModifier = aiPaddlesData.aiOnePaddleData.defaultSpeedModifier;
                    };
                };

            } else {

                switch (game.aiDifficulty) {
                    case 1:
                        ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToAI(ballsArray, ai);

                        if (ballsArray.length > 2) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed;
                        } else if (ballsArray.length === 1) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed - 4;
                        } else if (ballsArray.length === 2) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed - 4;
                        };

                        break;

                    case 2:
                        ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToAIConsideringBallXDirection(ballsArray, ai);

                        if (ballsArray.length > 2) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed - 1;
                        } else if (ballsArray.length === 1) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed - 3;
                        } else if (ballsArray.length === 2) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed - 3;
                        };

                        break;

                    case 3:
                        ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToRightSide(ballsArray);

                        if (ballsArray.length > 2) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed;
                        } else if (ballsArray.length === 1) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed - 3;
                        } else if (ballsArray.length === 2) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed - 2.5;
                        };

                        break;

                    case 4:
                        ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToRightSideConsideringBallXDirection(ballsArray);

                        if (ballsArray.length > 2) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed;
                        } else if (ballsArray.length === 1) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed - 2;
                        } else if (ballsArray.length === 2) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed - 1.5;
                        };

                        break;

                    case 5:
                        ballToControl = controls.aiControls.findTheBallThatHasMinimumDistanceToRightSideConsideringBallXDirection(ballsArray);

                        if (ballsArray.length > 2) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed + 3;
                        } else if (ballsArray.length === 1) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed - 1.5;
                        } else if (ballsArray.length === 2) {
                            ai.speed = aiPaddlesData.aiOnePaddleData.speed - 1;
                        };

                        break;

                    default:
                        break;
                };

                if (!ballToControl) {
                    ballToControl = 0;
                };

                if (ballsArray[ballToControl]) {
                    if (aiMiddle < ballsArray[ballToControl].y) {
                        controls.aiControls.move('40', ai);
                    };

                    if (aiMiddle > ballsArray[ballToControl].y) {
                        controls.aiControls.move('38', ai);
                    };

                    if (aiMiddle === ballsArray[ballToControl].y) {
                        ai.defaultSpeedModifier = aiPaddlesData.aiOnePaddleData.defaultSpeedModifier;
                    };
                };
            };

            // controls.aiControls.drawTarget(ai, aiMiddle, ballToControl, ai.color);
        },

        /*-------------------------------------------------------------------------------------------------------------*/

        findTheBallThatHasSecondMinimumDistanceToAI: function (ballsArray, ai) {
            if (ballsArray.length === 0 || !ai) {
                return 0;
            };

            let distancesFromBallsToAI = [];

            for (let i = 0; i < ballsArray.length; i++) {
                distancesFromBallsToAI[i] = Math.sqrt(Math.pow((ai.x - ballsArray[i].x), 2) + Math.pow((ai.y + (ai.height / 2) - ballsArray[i].y), 2));
            };

            let sortedDistancesFromBallsToAI = helper.sortArray(distancesFromBallsToAI);

            for (let i = 0; i < distancesFromBallsToAI.length; i++) {
                if (distancesFromBallsToAI[i] === sortedDistancesFromBallsToAI[1]) {
                    return i;
                };
            };
        },

        findTheBallThatHasSecondMinimumDistanceToAIConsideringBallXDirection: function (ballsArray, ai) {
            if (ballsArray.length === 0 || !ai) {
                return 0;
            };

            let distancesFromBallsToAI = [];

            for (let i = 0; i < ballsArray.length; i++) {
                distancesFromBallsToAI[i] = Math.sqrt(Math.pow((ai.x - ballsArray[i].x), 2) + Math.pow((ai.y + (ai.height / 2) - ballsArray[i].y), 2));
            };

            let sortedDistancesFromBallsToAI = helper.sortArray(distancesFromBallsToAI);

            for (let i = 1; i < sortedDistancesFromBallsToAI.length; i++) {
                for (let j = 0; j < distancesFromBallsToAI.length; j++) {
                    if (distancesFromBallsToAI[j] === sortedDistancesFromBallsToAI[i] && ballsArray[j].xSpeed > 0) {
                        return j;
                    };
                };
            };

            return controls.aiControls.findTheBallThatHasSecondMinimumDistanceToAI(ballsArray, ai);
        },

        findTheBallThatHasSeconsMinimumDistanceToRightSide: function (ballsArray) {
            if (ballsArray.length === 0) {
                return 0;
            };

            let distancesFromBallsToRightSide = [];

            for (let i = 0; i < ballsArray.length; i++) {
                distancesFromBallsToRightSide[i] = canvas.width - ballsArray[i].x;
            };

            let sortedDistancesFromBallsToRightSide = helper.sortArray(distancesFromBallsToRightSide);

            for (let i = 0; i < distancesFromBallsToRightSide.length; i++) {
                if (distancesFromBallsToRightSide[i] === sortedDistancesFromBallsToRightSide[1]) {
                    return i;
                };
            };
        },

        findTheBallThatHasSeconsMinimumDistanceToRightSideConsideringBallXDirection: function (ballsArray) {
            if (ballsArray.length === 0) {
                return 0;
            };

            let distancesFromBallsToRightSide = [];

            for (let i = 0; i < ballsArray.length; i++) {
                distancesFromBallsToRightSide[i] = canvas.width - ballsArray[i].x;
            };

            let sortedDistancesFromBallsToRightSide = helper.sortArray(distancesFromBallsToRightSide);

            for (let i = 1; i < sortedDistancesFromBallsToRightSide.length; i++) {
                for (let j = 0; j < distancesFromBallsToRightSide.length; j++) {
                    if (distancesFromBallsToRightSide[j] === sortedDistancesFromBallsToRightSide[i] && ballsArray[j].xSpeed > 0) {
                        return j;
                    };
                };
            };

            return controls.aiControls.findTheBallThatHasSeconsMinimumDistanceToRightSide(ballsArray);
        },

        updateAiControlsTwo: function (aiOne, aiTwo) {
            let aiMiddle = aiOne.y + (aiOne.height / 2);
            let ballToControl;

            if (game.ballCountOption > 1) {
                switch (game.aiDifficulty) {
                    case 1:
                        ballToControl = controls.aiControls.findTheBallThatHasSecondMinimumDistanceToAI(ballsArray, aiOne);

                        if (ballsArray.length > 2) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed;
                        } else if (ballsArray.length === 1) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed - 4;
                        } else if (ballsArray.length === 2) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed - 4;
                        };

                        break;

                    case 2:
                        ballToControl = controls.aiControls.findTheBallThatHasSecondMinimumDistanceToAIConsideringBallXDirection(ballsArray, aiOne);

                        if (ballsArray.length > 2) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed - 1;
                        } else if (ballsArray.length === 1) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed - 4;
                        } else if (ballsArray.length === 2) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed - 3;
                        };

                        break;

                    case 3:
                        ballToControl = controls.aiControls.findTheBallThatHasSecondMinimumDistanceToAIConsideringBallXDirection(ballsArray, aiOne);

                        if (ballsArray.length > 2) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed + 3;
                        } else if (ballsArray.length === 1) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed - 3;
                        } else if (ballsArray.length === 2) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed - 1.5;
                        };

                        break;

                    case 4:
                        ballToControl = controls.aiControls.findTheBallThatHasSeconsMinimumDistanceToRightSide(ballsArray);

                        if (ballsArray.length > 2) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed + 1;
                        } else if (ballsArray.length === 1) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed - 3;
                        } else if (ballsArray.length === 2) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed - 1.5;
                        };

                        break;

                    case 5:
                        ballToControl = controls.aiControls.findTheBallThatHasSeconsMinimumDistanceToRightSideConsideringBallXDirection(ballsArray);

                        if (ballsArray.length > 2) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed;
                        } else if (ballsArray.length === 1) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed - 2;
                        } else if (ballsArray.length === 2) {
                            aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed - 1;
                        };

                        break;

                    default:
                        break;
                };

                if (ballsArray[ballToControl]) {
                    if (aiMiddle < ballsArray[ballToControl].y) {
                        controls.aiControls.move('40', aiOne);
                    };

                    if (aiMiddle > ballsArray[ballToControl].y) {
                        controls.aiControls.move('38', aiOne);
                    };

                    if (aiMiddle === ballsArray[ballToControl].y) {
                        aiOne.defaultSpeedModifier = aiPaddlesData.aiTwoPaddleData.defaultSpeedModifier;
                    };
                };

            } else if (game.ballCountOption === 1) {

                ballToControl = 0;
                aiOne.speed = aiPaddlesData.aiTwoPaddleData.speed;

                if (ballsArray[0]) {
                    if (aiMiddle < ballsArray[ballToControl].y) {
                        controls.aiControls.move('40', aiOne);
                    };

                    if (aiMiddle > ballsArray[ballToControl].y) {
                        controls.aiControls.move('38', aiOne);
                    };

                    if (aiMiddle === ballsArray[ballToControl].y) {
                        aiOne.defaultSpeedModifier = aiPaddlesData.aiTwoPaddleData.defaultSpeedModifier;
                    };

                    let aiTwoBottom = aiOne.y + aiOne.height;
                    let aiOneTop = aiTwo.y;

                    if ((aiOneTop - aiTwoBottom) <= 150) {
                        controls.aiControls.move('38', aiOne);
                    };

                    if ((aiOneTop - aiTwoBottom) <= (-1 * aiOne.speed)) {
                        controls.aiControls.move('40', aiTwo);
                    };
                };
            };

            // controls.aiControls.drawTarget(aiOne, aiMiddle, ballToControl, aiOne.color);
        },

        /*-------------------------------------------------------------------------------------------------------------*/

        reset: function (ai) {
            if (game.playersModeOption === 11 || game.playersModeOption === 21) {
                ai[0].y = (canvas.height - aiPaddlesData.aiOnePaddleData.height) / 2;
            } else if (game.playersModeOption === 12 || game.playersModeOption === 22) {
                ai[0].y = aiPaddlesData.aiOnePaddleData.yPosition;

                if (ai[1] !== null) {
                    ai[1].y = aiPaddlesData.aiTwoPaddleData.yPosition;
                };
            };
        }
    },

    ballsControls: {
        reset: function (balls) {
            for (let i = 0; i < balls.length; i++) {
                balls[i].x = ballData.xPosition + Math.random();
                balls[i].y = ballData.yPosition + Math.random();
                balls[i].radius = helper.getRandomNumberFromRange(11, 13);
                balls[i].xSpeed = helper.getRandomNumberFromLowerBoundToMinusOneOrFromOneToUpperBound(-3, 3);
                balls[i].ySpeed = helper.getRandomNumberFromLowerBoundToZeroOrFromZeroToUpperBound(-3, 3);
                balls[i].color = helper.getRandomColor();
                balls[i].strokeColor = helper.getRandomColor();
            };
        },

        freeze: function (balls) {
            for (let i = 0; i < balls.length; i++) {
                balls[i].xSpeed = 0;
                balls[i].ySpeed = 0;
            };
        }
    }
};