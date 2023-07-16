const player = {
    character: new Character(
        160, 390, 25, 25,
        new Animation('./src/cat', 5),
        new Animation('./src/cat/backwards', 5)
    ),

    tick: function () {

    },

    processControls: function () {

    },

    draw: function () {
        this.character.draw();
    }
};

function Character() {

};

function Animation() {

};

function Enemy(x, y) {
    this.character = new Character(
        x, y, 25, 25,
        new Animation('./src/tiger', 5),
        new Animation('./src/tiger/backwards', 5)
    ),

    this.tick = function () {

    };

    this.draw = function () {
        this.character.draw();
    }
};