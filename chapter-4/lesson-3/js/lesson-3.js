const canvas = document.getElementsByClassName('canvas-one')[0];
const ctx = canvas.getContext('2d');

const imagePlayer = new Image(33, 48);
const imagePlayerRunning = new Image(33, 48);

window.onload = function () {
    controls.initializePlayersControlsListening();
    imagePlayer.src = './src/images/human3-death.png';
    imagePlayerRunning.src = './src/images/human-run.png';
};