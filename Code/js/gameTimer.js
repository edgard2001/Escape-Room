document.addEventListener("DOMContentLoaded", startTimer);

var time;
var timerEvent;

function startTimer() {
    time = parseInt(sessionStorage.getItem('time'));
    var timeText;
    if ((300 - time) % 60 < 10) {
        timeText = Math.floor((300 - time) / 60) + ':0' + (300 - time) % 60;
    } else {
        timeText = Math.floor((300 - time) / 60) + ':' + (300 - time) % 60;
    }
    document.getElementById('display').innerHTML +=
        '<div class="object" id="timer" style="left: 10%; top: 5%;">' +
        timeText +
        '</div>';
    timerEvent = setInterval(checkTime, 1000);
}

function checkTime() {
    if (time >= 300) {
        time == 300;
        var timeText;
        if ((300 - time) % 60 < 10) {
            timeText = Math.floor((300 - time) / 60) + ':0' + (300 - time) % 60;
        } else {
            timeText = Math.floor((300 - time) / 60) + ':' + (300 - time) % 60;
        }
        document.getElementById('timer').textContent = timeText;
        sessionStorage.setItem('time', time);
        clearInterval(timerEvent);
        window.open('gameOver.html', '_self');
    } else {
        time += 1;
        var timeText;
        if ((300 - time) % 60 < 10) {
            timeText = Math.floor((300 - time) / 60) + ':0' + (300 - time) % 60;
        } else {
            timeText = Math.floor((300 - time) / 60) + ':' + (300 - time) % 60;
        }
        document.getElementById('timer').textContent = timeText;
        //console.log(time);
        sessionStorage.setItem('time', time);
    }
}