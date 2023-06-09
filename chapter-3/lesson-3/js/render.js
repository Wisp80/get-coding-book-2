let render = {
    renderField: function () {
        ctx.fillStyle = 'rgba(22, 55, 40, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    },

    renderPaddle: function (paddle, color, strokeColor, paddleImage) {
        if (game.theme === 'default') {
            ctx.beginPath();
            ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);

            ctx.fillStyle = color;
            ctx.fill();

            ctx.lineWidth = 2.5;
            ctx.strokeStyle = strokeColor;
            ctx.stroke();
        } else if (game.theme === 'sonic') {
            ctx.beginPath();
            ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);

            ctx.fillStyle = color;
            ctx.fill();

            ctx.lineWidth = 2.5;
            ctx.strokeStyle = strokeColor;
            ctx.stroke();

            let image = new Image(28, 28);
            image.src = paddleImage;
            ctx.drawImage(image, paddle.x + 1, paddle.y + (paddle.height - image.width) / 2, image.width, image.height);
        };
    },

    renderBall: function (ball, color, strokeColor) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);

        ctx.fillStyle = color;
        ctx.fill();

        ctx.lineWidth = 3;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
    },

    draw: function (paddles, balls, paddlesColors, paddlesStrokeColors, paddlesImages) {
        ctx.globalCompositeOperation = 'source-over';
        this.renderField();

        for (let i = 0; i < paddles.length; i++) {
            if (paddles[i]) {
                ctx.globalCompositeOperation = 'source-over';
                this.renderPaddle(paddles[i], paddlesColors[i], paddlesStrokeColors[i], paddlesImages[i]);

                // ctx.font = '30px serif';
                // ctx.fillStyle = 'white';
                // ctx.fillText(i, paddles[i].x, paddles[i].y + (paddles[i].height / 2));
            };
        };

        for (let i = 0; i < balls.length; i++) {
            if (balls[i]) {
                ctx.globalCompositeOperation = 'source-over';
                this.renderBall(balls[i], balls[i].color, balls[i].strokeColor);

                ctx.font = '30px serif';
                // ctx.fillStyle = 'white';
                // ctx.fillText(i, balls[i].x, balls[i].y);

                // if (balls[i].xSpeed > 0) {
                //     ctx.fillStyle = 'white';
                //     ctx.fillText('#' + i + ` I'm good ` + (canvas.width - balls[i].x), balls[i].x, balls[i].y);
                // };

                // if (balls[i].xSpeed < 0) {
                //     ctx.fillStyle = 'red';
                //     ctx.fillText('#' + i + ` I'm bad ` + (canvas.width - balls[i].x), balls[i].x, balls[i].y);
                // };

                // ctx.beginPath();
                // ctx.moveTo(balls[i].x, balls[i].y);
                // ctx.lineTo(balls[i].x + balls[i].xSpeed * 20, balls[i].y + balls[i].ySpeed * 20);
                // ctx.strokeStyle = 'white';
                // ctx.lineWidth = 3;
                // ctx.stroke();
                // ctx.closePath();
            };
        };
    }
};