function goBackOneRoom() {
    var rooms = JSON.parse(sessionStorage.getItem('rooms'));
    var currentRoomIndex = 0;
    while (!rooms[currentRoomIndex].currentRoom) currentRoomIndex++;
    var previousRoomIndex = 0;
    while (!rooms[previousRoomIndex].leadsToRooms.includes(currentRoomIndex)) previousRoomIndex++;
    rooms[currentRoomIndex].currentRoom = false;
    rooms[previousRoomIndex].currentRoom = true;
    sessionStorage.setItem('rooms', JSON.stringify(rooms));
    var url = rooms[previousRoomIndex].name + '.html';

    var sound = new Audio('sound/door-3-open.mp3');
    sound.volume = parseFloat(sessionStorage.getItem('soundVolume'));
    sound.play();

    setTimeout(function() { window.open(url, '_self'); }, 1000);
}