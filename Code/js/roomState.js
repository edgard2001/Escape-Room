document.addEventListener('DOMContentLoaded', function() { getRoomState(); });

function getRoomState() {

    var doors = document.getElementsByClassName('door');
    var vases = document.getElementsByClassName('vase');
    var chests = document.getElementsByClassName('chest');

    var rooms = JSON.parse(sessionStorage.getItem('rooms'));

    var index = 0;
    while (!rooms[index].currentRoom) index++;
    room = rooms[index];

    for (var doorNum = 0; doorNum < room.doors; doorNum++) {
        switch (room.doorStates[doorNum]) {
            case 'locked':
                doors[doorNum].getElementsByTagName('img')[0].src = 'images/objects/LockedDoor.png';
                break;
            case 'unlocked':
                doors[doorNum].getElementsByTagName('img')[0].src = 'images/objects/UnlockedDoor.png';
                break;
            case 'dead-end':
                doors[doorNum].getElementsByTagName('img')[0].src = 'images/objects/DeadEndDoor.png';
                break;
        }
    }

    for (var vaseNum = 0; vaseNum < room.vases; vaseNum++) {
        switch (room.vaseStates[vaseNum]) {
            case 'untouched':
                vases[vaseNum].getElementsByTagName('img')[0].src = 'images/objects/BreakableVase.png';
                break;
            case 'broken':
                vases[vaseNum].getElementsByTagName('img')[0].src = 'images/objects/BrokenVase.png';
                break;
        }
    }

    for (var chestNum = 0; chestNum < room.chests; chestNum++) {
        switch (room.chestStates[chestNum]) {
            case 'locked':
                if (chests[chestNum].getElementsByTagName('img')[0].src.includes('Left')) {
                    chests[chestNum].getElementsByTagName('img')[0].src = 'images/objects/ChestLeftLocked.png';
                } else {
                    chests[chestNum].getElementsByTagName('img')[0].src = 'images/objects/ChestRightLocked.png';
                }
                break;
            case 'unlocked':
                if (chests[chestNum].getElementsByTagName('img')[0].src.includes('Left')) {
                    chests[chestNum].getElementsByTagName('img')[0].src = 'images/objects/ChestLeftUnlocked.png';
                } else {
                    chests[chestNum].getElementsByTagName('img')[0].src = 'images/objects/ChestRightUnlocked.png';
                }
                break;
            case 'searched':
                if (chests[chestNum].getElementsByTagName('img')[0].src.includes('Left')) {
                    chests[chestNum].getElementsByTagName('img')[0].src = 'images/objects/ChestLeftSearched.png';
                } else {
                    chests[chestNum].getElementsByTagName('img')[0].src = 'images/objects/ChestRightSearched.png';
                }
                break;
        }
    }
}