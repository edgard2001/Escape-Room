document.addEventListener("DOMContentLoaded", function() { drawDungeonMap(); });

function drawDungeonMap() {
    var rooms = JSON.parse(sessionStorage.getItem('rooms'));
    var mapContent =
        '<div id="dungeon-map-close-button">' +
        '<a style="color:black; cursor: pointer;" onclick="hideDungeonMap()">&nbsp;x&nbsp;</a>' +
        '</div>';
    mapContent +=
        '<div id="map-key">' +
        '<p>' +
        '<span style="background-color: red">Current</span><br>' +
        '<span style="background-color: green">Visited</span><br>' +
        '<span style="background-color: grey">Unvisited</span><br>' +
        'T - Troll<br>' +
        'S - Split<br>' +
        'C - Chest<br>' +
        'P - Puzzle<br>' +
        'U - Unknown' +
        '</p>' +
        '</div>';
    mapContent += addRoom(rooms, 0);
    //console.log(mapContent);
    document.getElementById('dungeon-map').innerHTML = mapContent;
}

function addRoom(rooms, roomIndex) {
    var mapContent = '';
    var linkedRoomsNum = rooms[roomIndex].leadsToRooms.length;
    mapContent += '<div class="dungeon-room-container">';
    if (linkedRoomsNum > 0) {
        for (var index = 0; index < linkedRoomsNum; index++) {
            mapContent += addRoom(rooms, rooms[roomIndex].leadsToRooms[index]);
        }
    }
    var style;
    var script;
    var roomName;
    if (rooms[roomIndex].name.includes('start')) {
        roomName = 'T';
    } else if (rooms[roomIndex].name.includes('split')) {
        roomName = 'S';
    } else if (rooms[roomIndex].name.includes('chest')) {
        roomName = 'C';
    } else {
        roomName = 'P';
    }
    if (rooms[roomIndex].visitedRoom) {
        style = 'background-color: green; cursor: pointer;';
        script = 'onclick="goToMapRoom(' + roomIndex + ')" ';
    } else {
        style = 'background-color: grey; cursor: default;';
        script = '';
        roomName = 'U';
    }
    if (rooms[roomIndex].currentRoom) {
        style = 'background-color: red; cursor: default;';
        script = '';
    }
    mapContent +=
        '<div class="map-room">' +
        '<a style="' + style + '" ' +
        script + '>' +
        '&nbsp;' + roomName + '&nbsp;' +
        '</a>' +
        '</div>';
    mapContent += '</div>';
    return mapContent;
}

function displayDungeonMap() {
    document.getElementById('dungeon-map').style.display = 'block';
}

function hideDungeonMap() {
    document.getElementById('dungeon-map').style.display = 'none';
}

function goToMapRoom(roomIndex) {
    var rooms = JSON.parse(sessionStorage.getItem('rooms'));
    var currentRoomIndex = 0;
    while (!rooms[currentRoomIndex].currentRoom) currentRoomIndex++;
    rooms[currentRoomIndex].currentRoom = false;
    rooms[roomIndex].currentRoom = true;
    sessionStorage.setItem('rooms', JSON.stringify(rooms));
    var url = rooms[roomIndex].name + '.html';

    var soundEffectVolume = 0.3;

    var sound = new Audio('sound/door-3-open.mp3');
    sound.volume = parseFloat(sessionStorage.getItem('soundVolume'));
    sound.play();

    setTimeout(function() { window.open(url, '_self'); }, 1000);
}