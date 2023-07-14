let backgrounds = [
    new Background('./src/images/background-one.png', 0, 115),
    new Background('./src/images/background-two.png', 800, 115),
    new Background('./src/images/background-two.png', 1600, 115)
];

function Background(src, x, y) {
    this.src = src;
    this.x = x;
    this.y = y;

    this.move = function (speedX) {
        this.x -= speedX;
    };

    this.drawBackground = function () {
        let firstBackground = new Image();
        firstBackground.src = this.src;
        ctx.drawImage(firstBackground, this.x, this.y);
    };
};