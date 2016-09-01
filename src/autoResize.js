function resizeGame() {
    var gameArea = document.getElementById('game'),
        widthToHeight = 3 / 4,
        newWidth = window.innerWidth,
        newHeight = window.innerHeight,
        newWidthToHeight = newWidth / newHeight;

    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        gameArea.style.height = newHeight + 'px';
        gameArea.style.width = newWidth + 'px';
    } else {
        newHeight = newWidth / widthToHeight;
        gameArea.style.width = newWidth + 'px';
        gameArea.style.height = newHeight + 'px';
    }

    gameArea.style.marginTop = (-newHeight / 2) + 'px';
    gameArea.style.marginLeft = (-newWidth / 2) + 'px';

    gameArea.style.fontSize = (newWidth / 300) + 'em';

    var gameCanvas = document.getElementById('game-canvas');
    gameCanvas.width = newWidth;
    gameCanvas.height = newHeight;
}
resizeGame();

window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);
