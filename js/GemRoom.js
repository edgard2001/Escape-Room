function fillBackgrounds() {
    document.getElementById("display").style.backgroundImage = "url(images/Rooms/RoomWithCeilingHole.png)";
    document.getElementById("puzzleScreen").style.backgroundImage = "url(images/puzzles/GemRoom/puzzleScreen.png)";
    var rooms = JSON.parse(sessionStorage.getItem('rooms'));
    var currentRoomIndex = 0;
    while (!rooms[currentRoomIndex].currentRoom) currentRoomIndex++;
    if (rooms[currentRoomIndex].puzzleSolved == true) {
        document.getElementById('puzzleLink').onclick = '';
        document.getElementById('gemPuzzle-image').src = 'images/puzzles/GemRoom/CompletePuzzleBoard.png';
    }
}

function checkFragments() {
    var frag1 = document.getElementById('slot-1');
    var frag2 = document.getElementById('slot-2');
    var frag3 = document.getElementById('slot-3');
    var frag4 = document.getElementById('slot-4');
    var frag5 = document.getElementById('slot-5');
    var frag6 = document.getElementById('slot-6');
    var frag7 = document.getElementById('slot-7');
    var frag8 = document.getElementById('slot-8');
    var correctPlaces = new Array(8).fill(false);
    if (frag1.getElementsByTagName('img').length == 1 && frag1.getElementsByTagName('img')[0].id == 'fragment-1') {
        correctPlaces[0] = true;
    }
    if (frag2.getElementsByTagName('img').length == 1 && frag2.getElementsByTagName('img')[0].id == 'fragment-2') {
        correctPlaces[1] = true;
    }
    if (frag3.getElementsByTagName('img').length == 1 && frag3.getElementsByTagName('img')[0].id == 'fragment-3') {
        correctPlaces[2] = true;
    }
    if (frag4.getElementsByTagName('img').length == 1 && frag4.getElementsByTagName('img')[0].id == 'fragment-4') {
        correctPlaces[3] = true;
    }
    if (frag5.getElementsByTagName('img').length == 1 && frag5.getElementsByTagName('img')[0].id == 'fragment-5') {
        correctPlaces[4] = true;
    }
    if (frag6.getElementsByTagName('img').length == 1 && frag6.getElementsByTagName('img')[0].id == 'fragment-6') {
        correctPlaces[5] = true;
    }
    if (frag7.getElementsByTagName('img').length == 1 && frag7.getElementsByTagName('img')[0].id == 'fragment-7') {
        correctPlaces[6] = true;
    }
    if (frag8.getElementsByTagName('img').length == 1 && frag8.getElementsByTagName('img')[0].id == 'fragment-8') {
        correctPlaces[7] = true;
    }
    if (!correctPlaces.includes(false)) {
        endPuzzle();
    }

}

function changePuzzleCompleteIndex(index) {
    document.getElementById('puzzleCompleteScreen').style.zIndex = index;
}

function endPuzzle() {
    document.getElementById('puzzleCompleteScreen').style.backgroundImage = 'url(images/puzzles/GemRoom/puzzleCompleteScreen.png)';
    document.getElementById('puzzleScreen').style.zIndex = -1;
    changePuzzleCompleteIndex(2);
    setTimeout(function() { changePuzzleCompleteIndex(-1); }, 1000);
    document.getElementById('puzzleLink').onclick = '';
    setTimeout(function() { document.getElementById('gemPuzzle-image').src = 'images/puzzles/GemRoom/CompletePuzzleBoard.png'; }, 1000);

    var rooms = JSON.parse(sessionStorage.getItem('rooms'));
    var currentRoomIndex = 0;
    while (!rooms[currentRoomIndex].currentRoom) currentRoomIndex++;
    rooms[currentRoomIndex].puzzleSolved = true;
    sessionStorage.setItem('rooms', JSON.stringify(rooms));

    addItem('Scroll', 1);
    addItem('Scroll', 1);
    addItem('Scroll', 1);
    addItem('Scroll', 1);
    addItem('Scroll', 1);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function returnToPiecesBoard(ev) {
    var data = ev.dataTransfer.getData("text");
    document.getElementById("fragmentPiecesBoard").appendChild(data);
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function dropGemFragment(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    var ID = document.getElementById(data).id;
    switch (ID) {
        case 'fragment-3':
            document.getElementById(data).style.cssText = 'height: 80%';
            break;
        case 'fragment-4':
            document.getElementById(data).style.cssText = 'height: 149%';
            break;
        case 'fragment-5':
            document.getElementById(data).style.cssText = 'height: 180%';
            break;
        case 'fragment-6':
            document.getElementById(data).style.cssText = 'height: 190%';
            break;
        case 'fragment-7':
            document.getElementById(data).style.cssText = 'height: 131%';
            break;
        case 'fragment-8':
            document.getElementById(data).style.cssText = 'height: 132%';
            break;
        default:
            document.getElementById(data).style.cssText = 'height: 160%';
            break;
    }
    //document.getElementById(ev.target).style.zIndex = 1;

}

function dropGemFragmentToSide(ev) {
    if (ev.target.id != 'slot-1' && ev.target.id != 'slot-2' && ev.target.id != 'slot-3' && ev.target.id != 'slot-4' && ev.target.id != 'slot-5' && ev.target.id != 'slot-6' && ev.target.id != 'slot-7' && ev.target.id != 'slot-8') {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        document.getElementById('fragmentPiecesBoard').appendChild(document.getElementById(data));
        document.getElementById(data).style.cssText = 'height:60%';
    }
    checkFragments();
}

function showGemPuzzle() {
    if (document.getElementById("puzzleScreen").style.zIndex == 1) {
        document.getElementById("puzzleScreen").style.zIndex = -1;
        document.getElementById("puzzleScreen").style.display = 'none';
    } else {
        document.getElementById("puzzleScreen").style.zIndex = 1;
        document.getElementById("puzzleScreen").style.display = 'block';
        var children = document.getElementById("puzzleScreen").children;
        for (var index = 0; index < children.length; index++) {
            children[index].style.zIndex = 2;
        }
    }
}