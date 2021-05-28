document.addEventListener("DOMContentLoaded", initSound);

var musicMuted = true;
var musicVolume = 0.20;
var musicPlaying = false;
var music = new Audio('sound/the-medieval-banquet.mp3');

function initSound() {
    document.getElementById('music-volume').value = musicVolume * 100;
    if (musicMuted) {
        document.getElementById('music-volume').value = 0;
        document.getElementById('mute-music').src = 'images/MuteMusic.png';
        document.getElementById('mute-music').alt = 'Turn Music ON';
    }
}

function playMusic() {
    if (!musicPlaying) {
        musicPlaying = true;
        if (!musicMuted) {
            music.loop = true;
            music.volume = musicVolume;
            music.play();
        }
    }
}

function stopMusic() {
    if (musicPlaying) {
        musicPlaying = false;
        music.pause();
    }
}

function updateMusicVolume() {
    var newVolumeValue = document.getElementById('music-volume').value / 100;
    if (newVolumeValue > 0.0) {
        musicVolume = newVolumeValue;
        document.getElementById('mute-music').src = 'images/Music.png';
        document.getElementById('mute-music').alt = 'Turn Music OFF';
        musicMuted = false;
        music.volume = musicVolume;
        if (!musicPlaying) {
            clickedOnce = false;
            playMusic();
        }
    } else {
        document.getElementById('mute-music').src = 'images/MuteMusic.png';
        document.getElementById('mute-music').alt = 'Turn Music ON';
        musicMuted = true;
        stopMusic();
    }
}

function toggleMusic() {
    if (document.getElementById('mute-music').src.includes('Mute')) {
        document.getElementById('music-volume').value = musicVolume * 100;
        document.getElementById('mute-music').src = 'images/Music.png';
        document.getElementById('mute-music').alt = 'Turn Music OFF';
        musicMuted = false;
        music.volume = musicVolume;
        if (!musicPlaying) {
            clickedOnce = false;
            playMusic();
        }
    } else {
        document.getElementById('music-volume').value = 0;
        document.getElementById('mute-music').src = 'images/MuteMusic.png';
        document.getElementById('mute-music').alt = 'Turn Music ON';
        musicMuted = true;
        stopMusic();
    }

}