function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function() {
        this.sound.volume = parseFloat(sessionStorage.getItem('soundVolume'));
        this.sound.play();
    }
    this.stop = function() {
        this.sound.pause();
    }
}

lockpickSSound = new sound("sound/Success.mp3")
lockpickFSound = new sound("sound/Fail.mp3")
unlockSound = new sound("sound/Unlock.mp3")

var inventory = JSON.parse(sessionStorage.getItem('inventory'));
for (var index = 0; index < inventory.length; index++) {
    if (inventory[index].name == 'Lockpick') {
        document.getElementById("lockpicks").innerHTML = inventory[index].count;
        break;
    }
}

function checkAns(textbox, button1, button2, ans, back) {
    var input = document.getElementById(textbox).value;
    //                    document.getElementById("test").innerHTML = input;
    var Lockpicks = document.getElementById("lockpicks").innerHTML;
    //                    document.getElementById("test").innerHTML = Lockpicks;

    if (ans == input && Lockpicks > 0) {
        var el = document.getElementById(textbox);
        el.style.backgroundColor = "green";
        document.getElementById(button1).style.display = "none";
        document.getElementById(button2).style.display = "block";
        lockpickSSound.play();
        switch (back) {
            case 1:
                document.getElementById("display").style.backgroundImage = "url('images/puzzles/lockpicking/Lockpick_1pin.png')";
                break;
            case 2:
                document.getElementById("display").style.backgroundImage = "url('images/puzzles/lockpicking/Lockpick_2pin.png')";
                break;
            case 3:
                document.getElementById("display").style.backgroundImage = "url('images/puzzles/lockpicking/Lockpick_3pin.png')";
                break;
            case 4:
                document.getElementById("display").style.backgroundImage = "url('images/puzzles/lockpicking/Lockpick_4pin.png')";
                document.getElementById("Success").style.display = "block";
                setTimeout(function() { document.getElementById("Success").style.display = "none"; }, 2000);
                unlockSound.play();
                unlock();
                setTimeout(returnToRoom, 2000);
                break;
            default:
                break;
        }
    } else {
        if (Lockpicks > 0) {
            var el = document.getElementById(textbox);
            el.style.backgroundColor = "red";
            var Lockpicks = Lockpicks - 1;
            document.getElementById("lockpicks").innerHTML = Lockpicks;
            removeItem('Lockpick', 1);
            lockpickFSound.play();
        } else {
            var message = '<p class="player">' + sessionStorage.getItem('playerName') + ': I ran out of lockpicks! I need to find more to open the lock.</p>';
            addDialog(message);
            //document.getElementById(button1).innerHTML = "Out Of Lockpicks";
            //alert("Out of Lockpicks.");
        }

    }
}

function unlock() {

    var roomsVisitedNum = parseInt(sessionStorage.getItem('locksPickedNum'));
    sessionStorage.setItem('locksPickedNum', ++roomsVisitedNum);

    var unlockSubject = sessionStorage.getItem('unlockSubject');
    if (unlockSubject.includes('door')) {
        var doorId = unlockSubject;
        var doorNum = parseInt(doorId.charAt(doorId.length - 1));
        var rooms = JSON.parse(sessionStorage.getItem('rooms'));
        var currentRoomIndex = 0;
        while (!rooms[currentRoomIndex].currentRoom) currentRoomIndex++;
        rooms[currentRoomIndex].doorStates[doorNum - 1] = 'unlocked';
        sessionStorage.setItem('rooms', JSON.stringify(rooms));
    } else {
        var chestId = unlockSubject;
        var chestNum = parseInt(chestId.charAt(chestId.length - 1));
        var rooms = JSON.parse(sessionStorage.getItem('rooms'));
        var currentRoomIndex = 0;
        while (!rooms[currentRoomIndex].currentRoom) currentRoomIndex++;
        rooms[currentRoomIndex].chestStates[chestNum - 1] = 'unlocked';
        sessionStorage.setItem('rooms', JSON.stringify(rooms));
    }
}

function returnToRoom() {
    var rooms = JSON.parse(sessionStorage.getItem('rooms'));
    var currentRoomIndex = 0;
    while (!rooms[currentRoomIndex].currentRoom) currentRoomIndex++;
    var url = rooms[currentRoomIndex].name + '.html';
    window.open(url, '_self');
}