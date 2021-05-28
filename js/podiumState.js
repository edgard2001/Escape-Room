document.addEventListener("DOMContentLoaded", function() {getPodiumState();});

function getPodiumState() {
    var rooms = JSON.parse(sessionStorage.getItem('rooms'));
    var currentRoomIndex = 0;
    while (!rooms[currentRoomIndex].currentRoom) currentRoomIndex++;
    if (rooms[currentRoomIndex].puzzleSolved) {
        podiumImg = document.getElementById('podium1').getElementsByTagName('img')[0];
        podiumImg.src = 'images/objects/EmptyStonePodium.png';
        podiumImg.alt = 'Empty Stone Podium';
    }
}