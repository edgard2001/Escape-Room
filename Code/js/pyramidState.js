document.addEventListener("DOMContentLoaded", function() { getPyramidState(); });

function getPyramidState() {
    var rooms = JSON.parse(sessionStorage.getItem('rooms'));
    var currentRoomIndex = 0;
    while (!rooms[currentRoomIndex].currentRoom) currentRoomIndex++;
    if (rooms[currentRoomIndex].puzzleSolved) {
        podium = document.getElementById('pyramid');
        podium.style.display = 'none';
    }
}