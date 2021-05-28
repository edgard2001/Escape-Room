document.addEventListener("DOMContentLoaded", getPlayerStats);

function getPlayerStats() {

    if (sessionStorage.getItem('gameWon') == 'true') {
        document.getElementById('gameover-img').src = 'images/objects/UnlockedDoor.png';
        document.getElementById('game-outcome').textContent = 'You have escaped the dungeon!';
        document.body.style.backgroundImage = 'URL("images/Forest.jpg")';
    } else {
        document.getElementById('gameover-img').src = 'images/GameLost.png';
        document.getElementById('game-outcome').textContent = 'You have failed to escape the dungeon...';
        document.body.style.backgroundImage = 'URL("images/Cave.jpg")';
    }

    var time = parseInt(sessionStorage.getItem('time'));
    document.getElementById('time').textContent = Math.floor(time / 60) + ' min ' + time % 60 + ' sec ';
    document.getElementById('coins').textContent = sessionStorage.getItem('coinsNum');
    document.getElementById('cards').textContent = sessionStorage.getItem('cardsNum');
    document.getElementById('vases').textContent = sessionStorage.getItem('vasesBrokenNum') + '/' + sessionStorage.getItem('totalVasesNum');
    document.getElementById('chests').textContent = sessionStorage.getItem('chestsOpenedNum') + '/' + sessionStorage.getItem('totalChestsNum');
    document.getElementById('locks').textContent = sessionStorage.getItem('locksPickedNum') + '/' + sessionStorage.getItem('totalLocksNum');

    sessionStorage.clear();
}