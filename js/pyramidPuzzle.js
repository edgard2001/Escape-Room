var quiz = {
    // (A) PROPERTIES 
    // (A1) QUESTIONS & ANSWERS
    // Q = QUESTION, O = OPTIONS, A = CORRECT ANSWER
    data: [{
        q: "What Eqyptian God/Goddess is written here?",
        o: [
            "Sobik",
            "Isis",
            "Horus",
            "Maat"
        ],
        a: 1 // Isis is the answer
    }],

    // (A2) HTML ELEMENTS
    hWrap: null, // HTML quiz container
    hQn: null, // HTML question wrapper
    hAns: null, // HTML answers wrapper

    // (A3) GAME FLAGS
    now: 0, // current question
    score: 0, // current score

    // (B) INIT QUIZ HTML
    init: function() {
        // (B1) WRAPPER
        quiz.hWrap = document.getElementById("quizWrap");

        // (B2) QUESTIONS SECTION
        quiz.hQn = document.createElement("div");
        quiz.hQn.id = "quizQn";
        quiz.hWrap.appendChild(quiz.hQn);

        // (B3) ANSWERS SECTION
        quiz.hAns = document.createElement("div");
        quiz.hAns.id = "quizAns";
        quiz.hWrap.appendChild(quiz.hAns);

        // (B4) GO!
        quiz.draw();
    },

    // (C) DRAW QUESTION
    draw: function() {
        // (C1) QUESTION
        quiz.hQn.innerHTML = quiz.data[quiz.now].q;

        // (C2) OPTIONS
        quiz.hAns.innerHTML = "";
        for (let i in quiz.data[quiz.now].o) {
            let radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "quiz";
            radio.id = "quizi" + i;
            quiz.hAns.appendChild(radio);
            let label = document.createElement("label");
            label.innerHTML = quiz.data[quiz.now].o[i];
            label.setAttribute("for", "quizi" + i);
            label.dataset.idx = i;
            label.addEventListener("click", quiz.select);
            quiz.hAns.appendChild(label);
        }
    },

    // (D) OPTION SELECTED
    select: function() {
        // (D1) DETACH ALL ONCLICK
        let all = quiz.hAns.getElementsByTagName("label");
        for (let label of all) {
            label.removeEventListener("click", quiz.select);
        }

        // (D2) CHECK IF CORRECT
        let correct = this.dataset.idx == quiz.data[quiz.now].a;
        if (correct) {
            quiz.score++;
            this.classList.add("correct");
            addItem('HeroCard', 1);
            addItem('HeroCard', 1);
            addItem('HeroCard', 1);
            addItem('HeroCard', 1);
            addItem('HeroCard', 1);
            var cardsNum = parseInt(sessionStorage.getItem('cardsNum'));
            sessionStorage.setItem('cardsNum', cardsNum + 5);
            var rooms = JSON.parse(sessionStorage.getItem('rooms'));
            var currentRoomIndex = 0;
            while (!rooms[currentRoomIndex].currentRoom) currentRoomIndex++;
            rooms[currentRoomIndex].puzzleSolved = true;
            sessionStorage.setItem('rooms', JSON.stringify(rooms));
            var message = '<p class="narrator">Mysterious Narrator: ' + sessionStorage.getItem('playerName') + ' has solved the ancient Egyptian cipher.</p>';
            addDialog(message);
            var sound = new Audio('sound/Unlock.mp3');
            sound.volume = parseFloat(sessionStorage.getItem('soundVolume'));
            sound.play();
            setTimeout(returnToRoom, 2000);
        } else {
            this.classList.add("wrong");
        }

        // (D3) NEXT QUESTION OR END GAME
        quiz.now++;
        setTimeout(function() {
            if (quiz.now < quiz.data.length) { quiz.draw(); } else {
                quiz.hQn.innerHTML = `You have answered ${quiz.score} of ${quiz.data.length} correctly.`;
                quiz.hAns.innerHTML = "";
            }
        }, 1000);
    }
};

function returnToRoom() {
    var rooms = JSON.parse(sessionStorage.getItem('rooms'));
    var currentRoomIndex = 0;
    while (!rooms[currentRoomIndex].currentRoom) currentRoomIndex++;
    var url = rooms[currentRoomIndex].name + '.html';
    window.open(url, '_self');
}

window.addEventListener("load", quiz.init);