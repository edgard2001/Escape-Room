function fillBackgrounds() {
    document.getElementById("display").style.backgroundImage = "url(images/Rooms/RoomWithCeilingHole.png)";
    document.getElementById("puzzleScreen").style.backgroundImage = "url(images/Puzzles/MapPuzzleRoom/PuzzleMapGrid.png)";
    var rooms = JSON.parse(sessionStorage.getItem('rooms'));
    var currentRoomIndex = 0;
    while (!rooms[currentRoomIndex].currentRoom) currentRoomIndex++;
    if (rooms[currentRoomIndex].puzzleSolved == true) {
        document.getElementById('puzzleLink').onclick = '';
        document.getElementById('hintDiv').style.visibility = 'hidden';
        return;
    }
    switch (correctLocation) {
        case 'B2':
            {
                document.getElementById('hintParagraph').innerHTML = "<b>West 6 miles, North 7 miles, West 1 mile</b>";
            }
            break;
        case 'E2':
            {
                document.getElementById('hintParagraph').innerHTML = "<b>West 1 mile, North 3 miles, West 3 miles, North 4 miles</b>";
            }
            break;
        case 'F5':
            {
                document.getElementById('hintParagraph').innerHTML = "<b>North 3 miles, West 2 miles, North 1 mile, West 1 mile</b>";
            }
            break;
        case 'I5':
            {
                document.getElementById('hintParagraph').innerHTML = "<b>West 1 mile, North 2 miles, East 2 miles, North 2 miles, West 1 mile</b>";
            }
            break;
        case 'F8':
            {
                document.getElementById('hintParagraph').innerHTML = "<b>South 1 mile, West 6 Miles, North 3 miles, East 3 miles, South 1 mile</b>";
            }
            break;
        case 'B9':
            {
                document.getElementById('hintParagraph').innerHTML = "<b>North 7 miles, West 4 miles, South 3 miles, West 3 miles, South 4 miles</b>";
            }
            break;
    }
}

function showPuzzleScreen() {
    document.getElementById("puzzleScreen").style.zIndex = 2;
    document.getElementById("puzzleScreen").style.visibility = "visible";
    document.getElementById('livesParagraph').innerHTML = '<b>Lives Left: ' + lives + '</b>';
    document.getElementById('LifeCounter').style.zIndex = 2;
    document.getElementById('LifeCounter').style.visibility = 'visible';
}

function hidePuzzleScreen() {
    document.getElementById("puzzleScreen").style.zIndex = -1;
    document.getElementById("puzzleScreen").style.visibility = "hidden";
    document.getElementById('LifeCounter').style.zIndex = -1;
    document.getElementById('LifeCounter').style.visibility = 'hidden';
}

var locationArray = ['B2', 'E2', 'F5', 'I5', 'F8', 'B9'];
var lives = 3;
const correctLocation = locationArray[Math.floor(Math.random() * locationArray.length)];
//document.getElementById('hintParagraph').setAttribute.fontFamily='paint';

function locationClick(iden) {
    if (iden == correctLocation) {
        puzzleComplete();
    } else {
        lives = lives - 1;
        document.getElementById('livesParagraph').innerHTML = '<b>Lives Left: ' + lives + '</b>';
        document.getElementById(iden).style.backgroundColor = "hsla(0, 100%, 25%, 0.5)";
        if (lives == 0) {
            hidePuzzleScreen();
            lockPuzzle();
        }
    }
}

function puzzleComplete() {
    hidePuzzleScreen();
    lockPuzzle();
    addItem('Coin', 200);
    var coinsNum = parseInt(sessionStorage.getItem('coinsNum'));
    sessionStorage.setItem('coinsNum', coinsNum + 200);
}

function lockPuzzle() {
    document.getElementById('puzzleLink').onclick = '';
    document.getElementById('hintDiv').style.visibility = 'hidden';
    var rooms = JSON.parse(sessionStorage.getItem('rooms'));
    var currentRoomIndex = 0;
    while (!rooms[currentRoomIndex].currentRoom) currentRoomIndex++;
    rooms[currentRoomIndex].puzzleSolved = true;
    sessionStorage.setItem('rooms', JSON.stringify(rooms));
}