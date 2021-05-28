function objectInteract(objectId) {
    var objectName = objectId.substring(0, objectId.length - 1);
    switch (objectName) {
        case 'door':
            doorInteract(objectId);
            break;
        case 'vase':
            vaseInteract(objectId);
            break;
        case 'chest':
            chestInteract(objectId);
            break;
        case 'podium':
            podiumInteract(objectId);
            break;
        case 'troll':
            displayOptions();
            break;
    }
}

function doorInteract(doorId) {
    var doorImg = document.getElementById(doorId).getElementsByTagName('img')[0];
    if (doorImg.src.includes('Locked')) {
        sessionStorage.setItem('unlockSubject', doorId);
        var url = 'Lockpicking.html';
        window.open(url, '_self');
    } else if (doorImg.src.includes('Unlocked')) {
        var doorNum = parseInt(doorId.charAt(doorId.length - 1));
        var rooms = JSON.parse(sessionStorage.getItem('rooms'));
        var currentRoomIndex = 0;
        while (!rooms[currentRoomIndex].currentRoom) currentRoomIndex++;
        var nextRoomIndex = rooms[currentRoomIndex].leadsToRooms[doorNum - 1];
        rooms[currentRoomIndex].currentRoom = false;
        rooms[nextRoomIndex].currentRoom = true;
        rooms[nextRoomIndex].visitedRoom = true;
        sessionStorage.setItem('rooms', JSON.stringify(rooms));
        var url = rooms[nextRoomIndex].name + '.html';

        var sound = new Audio('sound/door-3-open.mp3');
        sound.volume = parseFloat(sessionStorage.getItem('soundVolume'));
        sound.play();

        setTimeout(function() { window.open(url, '_self'); }, 1000);
    } else {
        var message = '<p class="player">' + sessionStorage.getItem('playerName') + ': I cannot open this door; it is blocked.</p>';
        addDialog(message);
    }

}

function vaseInteract(vaseId) {
    var vaseImg = document.getElementById(vaseId).getElementsByTagName('img')[0];
    if (vaseImg.src.includes('Breakable')) {

        var sound = new Audio('sound/ice-hit-ground-01.mp3');
        sound.volume = parseFloat(sessionStorage.getItem('soundVolume'));
        sound.play();

        var vasesBrokenNum = parseInt(sessionStorage.getItem('vasesBrokenNum'));
        sessionStorage.setItem('vasesBrokenNum', ++vasesBrokenNum);

        vaseImg.src = 'images/objects/BrokenVase.png';
        vaseImg.alt = 'Empty Broken Vase';
        var vaseNum = parseInt(vaseId.charAt(vaseId.length - 1));
        var rooms = JSON.parse(sessionStorage.getItem('rooms'));
        var currentRoomIndex = 0;
        while (!rooms[currentRoomIndex].currentRoom) currentRoomIndex++;
        rooms[currentRoomIndex].vaseStates[vaseNum - 1] = 'broken';
        sessionStorage.setItem('rooms', JSON.stringify(rooms));

        var randomNumber = Math.floor(Math.random() * 3);
        switch (randomNumber) {
            case 0:
                var itemCount = Math.floor(Math.random() * 10) + 1;

                addItem('Coin', itemCount);
                var coinsNum = parseInt(sessionStorage.getItem('coinsNum'));
                sessionStorage.setItem('coinsNum', coinsNum + itemCount);

                var message;
                if (itemCount == 1) {
                    message = '<p class="narrator">Mysterious Narrator: ' + sessionStorage.getItem('playerName') + ' found a gold coin.</p>';
                } else {
                    message = '<p class="narrator">Mysterious Narrator: ' + sessionStorage.getItem('playerName') + ' found ' + itemCount + ' gold coins.</p>';
                }
                addDialog(message);
                break;
            case 1:
                var itemCount = Math.floor(Math.random() * 3) + 1;

                addItem('Lockpick', itemCount);

                var message;
                if (itemCount == 1) {
                    message = '<p class="narrator">Mysterious Narrator: ' + sessionStorage.getItem('playerName') + ' found a lockpick.</p>';
                } else {
                    message = '<p class="narrator">Mysterious Narrator: ' + sessionStorage.getItem('playerName') + ' found ' + itemCount + ' lockpicks.</p>';
                }
                addDialog(message);
                break;
            case 2:
                var itemCount = 1;

                addItem('BasicCard', itemCount);
                var cardsNum = parseInt(sessionStorage.getItem('cardsNum'));
                sessionStorage.setItem('cardsNum', ++cardsNum);

                var message = '<p class="narrator">Mysterious Narrator: ' + sessionStorage.getItem('playerName') + ' found a common card.</p>';
                addDialog(message);
                break;
        }
    } else {
        var message = '<p class="player">' + sessionStorage.getItem('playerName') + ': I already searched this vase.</p>';
        addDialog(message);
    }
}

function chestInteract(chestId) {
    var chestImg = document.getElementById(chestId).getElementsByTagName('img')[0];
    if (chestImg.src.includes('Left')) {

        if (chestImg.src.includes('Locked')) {
            sessionStorage.setItem('unlockSubject', chestId);
            var url = 'Lockpicking.html';
            window.open(url, '_self');
        } else if (chestImg.src.includes('Unlocked')) {

            var sound = new Audio('sound/book-cover-close-01.mp3');
            sound.volume = parseFloat(sessionStorage.getItem('soundVolume'));
            sound.play();

            var chestsOpenedNum = parseInt(sessionStorage.getItem('chestsOpenedNum'));
            sessionStorage.setItem('chestsOpenedNum', ++chestsOpenedNum);

            chestImg.src = 'images/objects/ChestLeftSearched.png';
            chestImg.alt = 'Chest -  Empty';
            var chestNum = parseInt(chestId.charAt(chestId.length - 1));
            var rooms = JSON.parse(sessionStorage.getItem('rooms'));
            var currentRoomIndex = 0;
            while (!rooms[currentRoomIndex].currentRoom) currentRoomIndex++;
            rooms[currentRoomIndex].chestStates[chestNum - 1] = 'searched';
            sessionStorage.setItem('rooms', JSON.stringify(rooms));

            var randomNumber = Math.floor(Math.random() * 4);
            switch (randomNumber) {
                case 0:
                    var itemCount = Math.floor(Math.random() * 31) + 20;

                    addItem('Coin', itemCount);
                    var coinsNum = parseInt(sessionStorage.getItem('coinsNum'));
                    sessionStorage.setItem('coinsNum', coinsNum + itemCount);

                    var message = '<p class="narrator">Mysterious Narrator: ' + sessionStorage.getItem('playerName') + ' found a treasure - ' + itemCount + ' gold coins.</p>';
                    addDialog(message);
                    break;
                case 1:
                    addItem('Potion', 1);
                    var message = '<p class="narrator">Mysterious Narrator: ' + sessionStorage.getItem('playerName') + ' found a treasure - healing potion.</p>';
                    addDialog(message);
                    break;
                case 2:
                    addItem('Scroll', 1);
                    var message = '<p class="narrator">Mysterious Narrator: ' + sessionStorage.getItem('playerName') + ' found a treasure - magic spell scroll.</p>';
                    addDialog(message);
                    break;
                case 3:
                    addItem('HeroCard', 1);
                    var cardsNum = parseInt(sessionStorage.getItem('cardsNum'));
                    sessionStorage.setItem('cardsNum', ++cardsNum);

                    var message = '<p class="narrator">Mysterious Narrator: ' + sessionStorage.getItem('playerName') + ' found a treasure - hero card.</p>';
                    addDialog(message);
                    break;
            }
        } else {
            var message = '<p class="player">' + sessionStorage.getItem('playerName') + ': This chest is empty, I must have searched it already.</p>';
            addDialog(message);
        }

    } else {

        if (chestImg.src.includes('Locked')) {
            sessionStorage.setItem('unlockSubject', chestId);
            var url = 'Lockpicking.html';
            window.open(url, '_self');
        } else if (chestImg.src.includes('Unlocked')) {
            var sound = new Audio('sound/book-cover-close-01.mp3');
            sound.volume = parseFloat(sessionStorage.getItem('soundVolume'));
            sound.play();

            var chestsOpenedNum = parseInt(sessionStorage.getItem('chestsOpenedNum'));
            sessionStorage.setItem('chestsOpenedNum', ++chestsOpenedNum);

            chestImg.src = 'images/objects/ChestRightSearched.png';
            chestImg.alt = 'Chest -  Empty';
            var chestNum = parseInt(chestId.charAt(chestId.length - 1));
            var rooms = JSON.parse(sessionStorage.getItem('rooms'));
            var currentRoomIndex = 0;
            while (!rooms[currentRoomIndex].currentRoom) currentRoomIndex++;
            rooms[currentRoomIndex].chestStates[chestNum - 1] = 'searched';
            sessionStorage.setItem('rooms', JSON.stringify(rooms));

            var randomNumber = Math.floor(Math.random() * 4);
            switch (randomNumber) {
                case 0:
                    var itemCount = Math.floor(Math.random() * 31) + 20;

                    addItem('Coin', itemCount);
                    var coinsNum = parseInt(sessionStorage.getItem('coinsNum'));
                    sessionStorage.setItem('coinsNum', coinsNum + itemCount);

                    var message = '<p class="narrator">Mysterious Narrator: ' + sessionStorage.getItem('playerName') + ' found a treasure - ' + itemCount + ' gold coins.</p>';
                    addDialog(message);
                    break;
                case 1:
                    addItem('Potion', 1);
                    var message = '<p class="narrator">Mysterious Narrator: ' + sessionStorage.getItem('playerName') + ' found a treasure - healing potion.</p>';
                    addDialog(message);
                    break;
                case 2:
                    addItem('Scroll', 1);
                    var message = '<p class="narrator">Mysterious Narrator: ' + sessionStorage.getItem('playerName') + ' found a treasure - magic spell scroll.</p>';
                    addDialog(message);
                    break;
                case 3:
                    addItem('HeroCard', 1);
                    var cardsNum = parseInt(sessionStorage.getItem('cardsNum'));
                    sessionStorage.setItem('cardsNum', ++cardsNum);

                    var message = '<p class="narrator">Mysterious Narrator: ' + sessionStorage.getItem('playerName') + ' found a treasure - hero card.</p>';
                    addDialog(message);
                    break;
            }
        } else {
            var message = '<p class="player">' + sessionStorage.getItem('playerName') + ': This chest is empty, I must have searched it already.</p>';
            addDialog(message);
        }

    }

}

function podiumInteract(podiumId) {
    var podiumImg = document.getElementById(podiumId).getElementsByTagName('img')[0];
    if (podiumImg.src.includes('Locked')) {
        sessionStorage.setItem('unlockSubject', podiumId);
        var url = 'permutationPuzzle.html';
        window.open(url, '_self');
    } else {
        var message = '<p class="player">' + sessionStorage.getItem('playerName') + ': This podium is empty, I must have searched it already.</p>';
        addDialog(message);
    }
}

function displayOptions() {
    var sound = new Audio('sound/troll-growl.mp3');
    sound.volume = 0.5 * parseFloat(sessionStorage.getItem('soundVolume'));
    sound.play();
    var message = '<p class="trollText">Troll: What do you want?</p>';
    addDialog(message);
    document.getElementById('troll-options').innerHTML =
        '<div id="troll-options-close-button">' +
        '<a style="color:black; cursor: pointer;" onclick="hideOptions()">&nbsp;x&nbsp;</a>' +
        '</div>' +
        '<div class="troll-option" onclick="displayShop()">' +
        'Trade' +
        '</div><br>' +
        '<div class="troll-option" onclick="window.open(\'cardGame.html\',\'_self\')">' +
        'Play Cards' +
        '</div><br>' +
        '<div class="troll-option" onclick="window.open(\'fightRoom.html\',\'_self\')">' +
        'Fight' +
        '</div>';
    document.getElementById('troll-options').style.display = 'block';
}

function hideOptions() {
    document.getElementById('troll-options').style.display = 'none';
}

function displayShop() {
    document.getElementById('troll-options').innerHTML =
        '<div id="troll-options-close-button">' +
        '<a style="color:black; cursor: pointer;" onclick="hideOptions()">&nbsp;x&nbsp;</a><br>' +
        '</div>' +
        '<div class="shop-item">' +
        '<img src="images/collectables/Lockpick.png" alt="Lockpick">' +
        '<p>Lockpick</p>' +
        '<div class="shop-button" onclick="buyItem(\'Lockpick\', 1, 1)">Buy: 1</div>' +
        '<div class="shop-button" onclick="sellItem(\'Lockpick\', 1, 1)">Sell: 1</div>' +
        '</div>' +
        '<div class="shop-item">' +
        '<img src="images/collectables/BasicCard.png" alt="Peasant Basic Card">' +
        '<p>Peasant Basic Card</p>' +
        '<div class="shop-button" onclick="buyItem(\'Peasant\', 1, 5)">Buy: 5</div>' +
        '<div class="shop-button" onclick="sellItem(\'Peasant\', 1, 5)">Sell: 5</div>' +
        '</div>' +
        '<div class="shop-item">' +
        '<img src="images/collectables/BasicCard.png" alt="Templar Basic Card">' +
        '<p>Templar Basic Card</p>' +
        '<div class="shop-button" onclick="buyItem(\'Templar\', 1, 5)">Buy: 5</div>' +
        '<div class="shop-button" onclick="sellItem(\'Templar\', 1, 5)">Sell: 5</div>' +
        '</div>' +
        '<div class="shop-item">' +
        '<img src="images/collectables/BasicCard.png" alt="Spartan Basic Card">' +
        '<p>Spartan Basic Card</p>' +
        '<div class="shop-button" onclick="buyItem(\'Spartan\', 1, 5)">Buy: 5</div>' +
        '<div class="shop-button" onclick="sellItem(\'Spartan\', 1, 5)">Sell: 5</div>' +
        '</div>' +
        '<div class="shop-item">' +
        '<img src="images/collectables/BasicCard.png" alt="Archer Basic Card">' +
        '<p>Archer Basic Card</p>' +
        '<div class="shop-button" onclick="buyItem(\'Archer\', 1, 5)">Buy: 5</div>' +
        '<div class="shop-button" onclick="sellItem(\'Archer\', 1, 5)">Sell: 5</div>' +
        '</div>' +
        '<div class="shop-item">' +
        '<img src="images/collectables/HeroCard.png" alt="Mage Hero Card">' +
        '<p>Mage Hero Card</p>' +
        '<div class="shop-button" onclick="buyItem(\'Mage\', 1, 20)">Buy: 20</div>' +
        '<div class="shop-button" onclick="sellItem(\'Mage\', 1, 20)">Sell: 20</div>' +
        '</div>' +
        '<div class="shop-item">' +
        '<img src="images/collectables/HeroCard.png" alt="Knight Hero Card">' +
        '<p>Knight Hero Card</p>' +
        '<div class="shop-button" onclick="buyItem(\'Knight\', 1, 20)">Buy: 20</div>' +
        '<div class="shop-button" onclick="sellItem(\'Knight\', 1, 20)">Sell: 20</div>' +
        '</div>' +
        '<div class="shop-item">' +
        '<img src="images/collectables/HeroCard.png" alt="Healing Hero Card">' +
        '<p>Healing Hero Card</p>' +
        '<div class="shop-button" onclick="buyItem(\'Healing\', 1, 20)">Buy: 20</div>' +
        '<div class="shop-button" onclick="sellItem(\'Healing\', 1, 20)">Sell: 20</div>' +
        '</div>' +
        '<div class="shop-item">' +
        '<img src="images/collectables/HeroCard.png" alt="Pheonix Hero Card">' +
        '<p>Pheonix Hero Card</p>' +
        '<div class="shop-button" onclick="buyItem(\'Pheonix\', 1, 20)">Buy: 20</div>' +
        '<div class="shop-button" onclick="sellItem(\'Pheonix\', 1, 20)">Sell: 20</div>' +
        '</div>' +
        '<div class="shop-item">' +
        '<img src="images/collectables/Potion.png" alt="Healing Potion">' +
        '<p>Healing Potion</p>' +
        '<div class="shop-button" onclick="buyItem(\'Potion\', 1, 15)">Buy: 15</div>' +
        '<div class="shop-button" onclick="sellItem(\'Potion\', 1, 15)">Sell: 15</div>' +
        '</div>' +
        '<div class="shop-item">' +
        '<img src="images/collectables/Scroll.png" alt="Freezing Spell Scroll">' +
        '<p>Freezing Spell Scroll</p>' +
        '<div class="shop-button" onclick="buyItem(\'Freezing\', 1, 15)">Buy: 15</div>' +
        '<div class="shop-button" onclick="sellItem(\'Freezing\', 1, 15)">Sell: 15</div>' +
        '</div>' +
        '<div class="shop-item">' +
        '<img src="images/collectables/Scroll.png" alt="Fireball Spell Scroll">' +
        '<p>Fireball Spell Scroll</p>' +
        '<div class="shop-button" onclick="buyItem(\'Fireball\', 1, 15)">Buy: 15</div>' +
        '<div class="shop-button" onclick="sellItem(\'Fireball\', 1, 15)">Sell: 15</div>' +
        '</div>' +
        '<div class="shop-item">' +
        '<img src="images/collectables/Scroll.png" alt="Poisoning Spell Scroll">' +
        '<p>Poisoning Spell Scroll</p>' +
        '<div class="shop-button" onclick="buyItem(\'Poisoning\', 1, 15)">Buy: 15</div>' +
        '<div class="shop-button" onclick="sellItem(\'Poisoning\', 1, 15)">Sell: 15</div>' +
        '</div>' +
        '<div class="shop-item">' +
        '<img src="images/collectables/Scroll.png" alt="Health Spell Scroll">' +
        '<p>Health Spell Scroll</p>' +
        '<div class="shop-button" onclick="buyItem(\'Health\', 1, 15)">Buy: 15</div>' +
        '<div class="shop-button" onclick="sellItem(\'Health\', 1, 15)">Sell: 15</div>' +
        '</div>';


}

function buyItem(itemName, itemCount, price) {
    var inventory = JSON.parse(sessionStorage.getItem('inventory'));
    var index = 0;
    while (index < inventory.length && inventory[index].name != 'Coin') index++;
    if (index < inventory.length) {
        if (inventory[index].count >= price) {
            removeItem('Coin', price);
            addItem(itemName, itemCount);
        } else {
            var message = '<p class="trollText">Troll: You don\'t have enough coins to buy this item!</p>';
            addDialog(message);
        }
    } else {
        var message = '<p class="trollText">Troll: You don\'t have any coins!</p>';
        addDialog(message);
    }
}

function sellItem(itemName, itemCount, price) {
    var inventory = JSON.parse(sessionStorage.getItem('inventory'));
    var index = 0;
    while (index < inventory.length && inventory[index].name != itemName) index++;
    if (index < inventory.length) {
        if (inventory[index].count >= itemCount) {
            removeItem(itemName, itemCount);
            addItem('Coin', price);
        } else {
            var message = '<p class="trollText">Troll: You don\'t have enough of this item to sell!</p>';
            addDialog(message);
        }
    } else {
        var message = '<p class="trollText">Troll: You don\'t have this item!</p>';
        addDialog(message);
    }
}