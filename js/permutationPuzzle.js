window.onload = randomize;
var images = ["images/puzzles/Symbol1.png", "images/puzzles/Symbol2.png", "images/puzzles/Symbol3.png", "images/puzzles/Symbol4.png", "images/puzzles/Symbol5.png"];
var used = [];
var clicked = [];
var topImages = [];
var click = new Audio();
click.src = "sound/ButtonClick.mp3";
var podiumOpening = new Audio();
podiumOpening.src = "sound/PodiumOpening.mp3";


function randomize() {
    var top = document.getElementsByClassName("topRow");
    var bottom = document.getElementsByClassName("bottomRow")

    //randomizes top row of images and stores the used images in a new array
    for (i = 0; i < top.length; i++) {
        var randomNum = Math.floor(Math.random() * images.length)
        if (used.includes(images[randomNum])) {
            i--;
        } else {
            top[i].src = images[randomNum];
            topImages.push(top[i].src)
            used.push(images[randomNum]);
        }


        //console.log(topImages);
    }

    //randomizes array of used images
    used = used.sort(() => Math.random() - 0.5)

    //inserts the used images in the bottom row
    for (i = 0; i < used.length; i++) {
        bottom[i].src = used[i];
    }

    //empties array
    used = [];

}

function addToArray(imageID) {
    click.volume = parseFloat(sessionStorage.getItem('soundVolume'));
    click.play();
    clicked.push(document.getElementById(imageID).src)
        //console.log(clicked)

    if (clicked.length >= topImages.length) {
        checkButtons();
    }

}

function checkButtons() {
    if (clicked.toString() === topImages.toString()) {
        //console.log("true")
        //console.log(clicked.toString())
        //console.log(topImages.toString())
        clicked = [];
        unlockPodium();
        podiumOpening.volume = parseFloat(sessionStorage.getItem('soundVolume'));
        podiumOpening.play();
        setTimeout(returnToRoom, 500);
    } else {
        //console.log("false")
        clicked = [];
        topImages = [];
        randomize();
    }
}

function unlockPodium() {
    var rooms = JSON.parse(sessionStorage.getItem('rooms'));
    var currentRoomIndex = 0;
    while (!rooms[currentRoomIndex].currentRoom) currentRoomIndex++;
    rooms[currentRoomIndex].puzzleSolved = true;
    sessionStorage.setItem('rooms', JSON.stringify(rooms));
    addItem('Sword', 1);
    addItem('Shield', 1);
    var message = '<p class="narrator">Mysterious Narrator: Podium reveals a sword and shield.</p>';
    addDialog(message);
}

function returnToRoom() {
    var rooms = JSON.parse(sessionStorage.getItem('rooms'));
    var currentRoomIndex = 0;
    while (!rooms[currentRoomIndex].currentRoom) currentRoomIndex++;
    var url = rooms[currentRoomIndex].name + '.html';
    window.open(url, '_self');
}