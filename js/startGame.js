var rooms = [];
var nearestChestRooms = [];
var maxPathDepth;

const splitRoomNames = [
    'splitRoom1',
    'splitRoom2',
    'splitRoom3',
    'splitRoom4'
];

const chestRoomNames = [
    'chestRoom1',
    'chestRoom2',
    'chestRoom3'
];

var puzzleRoomNames = [
    'puzzleRoom1',
    'puzzleRoom2',
    'puzzleRoom3',
    'puzzleRoom4'
];

function generateRoom(depth) {

    var room = {
        name: '',
        doors: 1,
        vases: 0,
        chests: 0,
        currentRoom: false,
        visitedRoom: false,
        puzzleRoom: false,
        puzzleSolved: false,
        doorStates: [],
        vaseStates: [],
        chestStates: [],
        leadsToRooms: []
    };

    var roomType = depth % 2;
    switch (roomType) {
        case 0:
            var randomIndex = Math.floor(Math.random() * (splitRoomNames.length));
            room.name = splitRoomNames[randomIndex];
            room.chests = 0;
            switch (room.name) {
                case 'splitRoom1':
                    room.doors = 3;
                    room.vases = 3;
                    break;
                default:
                    room.doors = 2;
                    room.vases = 3;
                    break;
            }
            break;
        case 1:
            var randomIndex = Math.floor(Math.random() * (chestRoomNames.length));
            room.name = chestRoomNames[randomIndex];
            switch (room.name) {
                case 'chestRoom1':
                    room.vases = 3;
                    room.chests = 2;
                    break;
                case 'chestRoom2':
                    room.vases = 5;
                    room.chests = 1;
                    break;
                case 'chestRoom3':
                    room.vases = 3;
                    room.chests = 4;
                    break;
            }
            break;
    }

    for (var doorNum = 0; doorNum < room.doors; doorNum++) {
        if (Math.random() > 0.666) {
            room.doorStates.push('locked');
        } else {
            room.doorStates.push('unlocked');
        }
    }
    for (var vaseNum = 0; vaseNum < room.vases; vaseNum++) {
        room.vaseStates.push('untouched');
    }
    for (var chestNum = 0; chestNum < room.chests; chestNum++) {
        room.chestStates.push('locked');
    }

    if (depth == maxPathDepth) {
        for (var doorNum = 0; doorNum < room.doors; doorNum++) {
            room.doorStates[doorNum] = 'dead-end';
        }
        rooms.push(room);
        return;
    } else {
        rooms.push(room);
        for (var roomNum = 0; roomNum < room.doors; roomNum++) {
            room.leadsToRooms.push(rooms.length);
            generateRoom(depth + 1);
        }
        return;
    }
}

function findNearestChestRooms(index, depth) {
    if (depth > 2) {
        return;
    } else if (depth != 0 && depth != 2) {
        findNearestChestRooms(rooms[index].leadsToRooms[0], depth + 1);
    } else {
        var length = rooms[index].leadsToRooms.length;
        for (var roomIndex = 0; roomIndex < length; roomIndex++) {
            nearestChestRooms.push(rooms[index].leadsToRooms[roomIndex]);
        }
        for (var roomIndex = 0; roomIndex < length; roomIndex++) {
            findNearestChestRooms(rooms[index].leadsToRooms[roomIndex], depth + 1);
        }
    }
}

function generateDungeon() {

    var room = {
        name: 'startRoom',
        doors: 1,
        vases: 5,
        chests: 0,
        currentRoom: true,
        visitedRoom: true,
        puzzleRoom: false,
        puzzleSolved: false,
        doorStates: ['unlocked'],
        vaseStates: ['untouched', 'untouched', 'untouched', 'untouched', 'untouched'],
        chestStates: [],
        leadsToRooms: [1]
    };

    rooms.push(room);

    generateRoom(0);
    findNearestChestRooms(1, 0);

    var index;
    var randomPuzzleIndex;
    while (puzzleRoomNames.length > 0) {
        index = nearestChestRooms[0];
        if (rooms[index].name.includes('chest')) {
            randomPuzzleIndex = Math.floor(Math.random() * puzzleRoomNames.length);
            rooms[index].name = puzzleRoomNames[randomPuzzleIndex];
            switch (rooms[index].name) {
                case 'puzzleRoom1':
                    rooms[index].vases = 3;
                    rooms[index].chests = 1;
                    break;
                case 'puzzleRoom2':
                    rooms[index].vases = 3;
                    rooms[index].chests = 0;
                    break;
                case 'puzzleRoom3':
                    rooms[index].vases = 0;
                    rooms[index].chests = 1;
                    break;
                case 'puzzleRoom4':
                    rooms[index].vases = 2;
                    rooms[index].chests = 0;
                    break;
            }
            for (var vaseNum = 0; vaseNum < rooms[index].vases; vaseNum++) {
                rooms[index].vaseStates.push('untouched');
            }
            for (var chestNum = 0; chestNum < rooms[index].chests; chestNum++) {
                rooms[index].chestStates.push('locked');
            }
            rooms[index].doors = 1;
            rooms[index].puzzleRoom = true;
            puzzleRoomNames.splice(randomPuzzleIndex, 1);
            nearestChestRooms.splice(0, 1);
        }
    }

}

function startGame() {

    var playerName = document.getElementById('name').value;
    if (playerName == '') {
        playerName = 'Adventurer';
    }
    sessionStorage.setItem('playerName', playerName);

    var dungeonSize;
    var radioButtons = document.getElementsByName('dungeon-size');
    for (var index = 0; index < radioButtons.length; index++) {
        if (radioButtons[index].checked) {
            dungeonSize = radioButtons[index].value;
            break;
        }
    }
    switch (dungeonSize) {
        case 'small':
            maxPathDepth = 3;
            break;
        case 'large':
            maxPathDepth = 7;
            break;
        default:
            maxPathDepth = 5;
            break;
    }

    generateDungeon();
    sessionStorage.setItem('rooms', JSON.stringify(rooms));
    sessionStorage.setItem('gameWon', 'false');

    var inventory = [];

    var occupation;
    var radioButtons = document.getElementsByName('occupation');
    for (var index = 0; index < radioButtons.length; index++) {
        if (radioButtons[index].checked) {
            occupation = radioButtons[index].value;
            break;
        }
    }

    var object = {
        name: 'Lockpick',
        count: 1,
        description: 'Allows to pick locks open'
    }
    switch (occupation) {
        case 'mage':
            object.name = 'Fireball';
            object.count = 2;
            object.description = 'Magic spell scroll covered in runes';
            break;
        case 'merchant':
            object.name = 'Coin';
            object.count = 50;
            object.description = 'Gold coin with crown emblem';
            break;
        case 'warrior':
            object.name = 'Potion';
            object.count = 2;
            object.description = 'Bubbling healing potion';
            break;
        default:
            object.count = 10;
            break;
    }
    inventory.push(object);

    sessionStorage.setItem('inventory', JSON.stringify(inventory));

    sessionStorage.setItem('time', 0);
    sessionStorage.setItem('coinsNum', 0);
    sessionStorage.setItem('cardsNum', 0);
    sessionStorage.setItem('vasesBrokenNum', 0);
    sessionStorage.setItem('locksPickedNum', 0);
    sessionStorage.setItem('chestsOpenedNum', 0);

    var lockedDoorsNum = 0;
    var chestsNum = 0;
    var vasesNum = 0;
    for (var index = 0; index < rooms.length; index++) {
        for (var doorIndex = 0; doorIndex < rooms[index].doors; doorIndex++) {
            if (rooms[index].doorStates[doorIndex] == 'locked') {
                lockedDoorsNum += 1;
            }
        }
        chestsNum += rooms[index].chests;
        vasesNum += rooms[index].vases;
    }

    sessionStorage.setItem('totalVasesNum', vasesNum);
    sessionStorage.setItem('totalLocksNum', lockedDoorsNum + chestsNum);
    sessionStorage.setItem('totalChestsNum', chestsNum);

    var dialogContent = '';
    sessionStorage.setItem('dialog', dialogContent);

    window.open('startRoom.html', '_self');

}

sessionStorage.setItem('soundMuted', 'false');
sessionStorage.setItem('soundVolume', '0.60');