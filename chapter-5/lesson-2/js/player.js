const player = {
    character: new Character(160, 390, 25, 25, 250, new animation('./src/cat/cat', 5), new animation('./src/cat/backwards/cat.backwards', 5)),

    tick: function () {
        let currentLocation = world.getPixelType(this.character.findLeadingEdgeXOfCharacter(), this.character.y);

        if (currentLocation === 'exit' || currentLocation === 'pit') {
            let state = currentLocation === 'exit' ? 'win' : 'lose';
            game.stop(state);
            return;
        };

        this.processControls();
        this.character.prepareCharacterData();
    },

    processControls: function () {
        if (controls.isRightKeyDown) {
            this.character.currentSpeedX = 5;
        };

        if (controls.isLeftKeyDown) {
            this.character.currentSpeedX = -5;
        };

        if (!controls.isLeftKeyDown && !controls.isRightKeyDown) {
            this.character.currentSpeedX = 0;
        };

        if (controls.isUpKeyDown && this.character.findIfPlayerIsStandingOnAPlatform()) {
            this.character.downwardForce = -8;
            audio.jump();
        };
    },

    draw: function () {
        this.character.draw();
    }
};