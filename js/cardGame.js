document.addEventListener("DOMContentLoaded", function() { startCardGame(); });

const cardDetails = {
    'Templar': {
        name: 'Templar',
        power: 7,
        ability: '',
        effects: [],
        casts: 0
    },
    'Peasant': {
        name: 'Peasant',
        power: 3,
        ability: '',
        effects: [],
        casts: 0
    },
    'Archer': {
        name: 'Archer',
        power: 4,
        ability: 'Shoots an arrow dealing 3 damage',
        effects: [],
        casts: 1
    },
    'Spartan': {
        name: 'Spartan',
        power: 4,
        ability: 'Each spartan boosts each other spartan by 1',
        effects: [],
        casts: 0
    },
    'Mage': {
        name: 'Mage',
        power: 5,
        ability: 'Casts 3 spells dealing 3 damage each',
        effects: [],
        casts: 3
    },
    'Knight': {
        name: 'Knight',
        power: 12,
        ability: '',
        effects: [],
        casts: 0
    },
    'Healing': {
        name: 'Healing',
        power: 0,
        ability: 'Heal 3 units to their original power',
        effects: [],
        casts: 3
    },
    'Pheonix': {
        name: 'Pheonix',
        power: 4,
        ability: 'Boosts 2 units to by 4 power',
        effects: [],
        casts: 2
    }
}

var trollCardInventory = [];
var playerCardsRemaining = 0;
var playerCards = [];
var trollCards = [];
var playerCardsPlayed = 0;
var trollCardsPlayed = 0;
var abilityUsed = false;
var playerPower = 0;
var trollPower = 0;
var playerTurn = true;
var abilitiesToUse = 0;
var abilityType = '';
var abilityAmount = 0;

function startCardGame() {
    inCardGame = true;
    displayInventory();

    var inventory = JSON.parse(sessionStorage.getItem('inventory'));
    var numBasic = 0;
    var numHero = 0;
    var cardName;
    for (var itemIndex = 0; itemIndex < inventory.length; itemIndex++) {
        cardName = inventory[itemIndex].name
        if (basicCardNames.includes(cardName)) {
            numBasic += inventory[itemIndex].count;
        } else if (heroCardNames.includes(cardName)) {
            numHero += inventory[itemIndex].count;
        }
    }
    if ((numBasic + numHero) < 8) {
        numBasic = 5;
        numHero = 10;
    }
    for (var cardNum = 0; cardNum < numBasic; cardNum++) {
        cardName = basicCardNames[Math.floor(Math.random() * basicCardNames.length)];
        trollCardInventory.push(cardName);
    }
    for (var cardNum = 0; cardNum < numHero; cardNum++) {
        cardName = heroCardNames[Math.floor(Math.random() * heroCardNames.length)];
        trollCardInventory.push(cardName);
    }
    var inventory = JSON.parse(sessionStorage.getItem('inventory'));
    for (var itemIndex = 0; itemIndex < inventory.length; itemIndex++) {
        cardName = inventory[itemIndex].name;
        if (basicCardNames.includes(cardName) || heroCardNames.includes(cardName)) {
            playerCardsRemaining += inventory[itemIndex].count;
        }
    }
    hideCardPreview();
    displayCards();
    checkGameState();
}

function displayCardPreview(id) {
    var idName = id.substring(0, id.length - 1);
    var idIndex = id.substring(id.length - 1, id.length);
    var playCard;
    if (idName.includes('card')) {
        playCard = false;
        if (idName.includes('troll')) {
            card = trollCards[idIndex];
        } else {
            card = playerCards[idIndex];
        }
    } else {
        playCard = true;
        var inventory = JSON.parse(sessionStorage.getItem('inventory'));
        var cardName = inventory[idIndex].name;
        if (!basicCardNames.includes(cardName) && !heroCardNames.includes(cardName)) {
            return;
        }
        card = cardDetails[cardName];
    }
    var details = '';
    if (card.casts > 0) {
        details += 'Abilities: ' + card.casts + '<br>';
    }
    var cardBase;
    if (heroCardNames.includes(card.name)) {
        cardBase = 'images/cards/HeroCardTemplate.png';
    } else {
        cardBase = 'images/cards/BasicCardTemplate.png';
    }
    var element = document.getElementById('card-preview')
    element.innerHTML =
        '<img class="card-base" src="' + cardBase + '" alt="">' +
        '<img class="card-avatar" src="images/cards/Avatars/' + card.name + '.png" alt="">' +
        '<div class="object card-power">' + card.power + '</div>' +
        '<div class="object card-description">' + card.name + '<br>' + card.ability + '<br>' + details + '</div>' +
        '<div class="object" id="preview-cancel-button" onclick="hideCardPreview()">' +
        '<img src="images/Cancel.png" alt="Cancel">';
    if (playerTurn && playCard && abilitiesToUse == 0) {
        element.innerHTML +=
            '<div class="object" id="preview-accept-button" onclick = "playerPlayCard(\'' + id + '\')" >' +
            '<img src="images/Accept.png" alt="Play">' +
            '</div>';
    } else if (playerTurn && !playCard && abilitiesToUse > 0) {
        element.innerHTML +=
            '<div class="object" id="preview-accept-button" onclick="selectCard(\'' + id + '\')" >' +
            '<img src="images/Accept.png" alt="Select">' +
            '</div>';
    }
    element.style.display = 'block';
}

function hideCardPreview() {
    document.getElementById('card-preview').style.display = 'none';
}

function selectCard(id) {
    var idIndex = id.substring(id.length - 1, id.length);
    hideCardPreview();
    if (abilitiesToUse > 0) {
        if (playerTurn) {
            playerCards[playerCards.length - 1].casts--;
        } else {
            trollCards[trollCards.length - 1].casts--;
        }
        switch (abilityType) {
            case 'damage':
                if (id.includes('troll')) {
                    trollCards[idIndex].power -= abilityAmount;
                    if (trollCards[idIndex].power <= 0) {
                        trollCards.splice(idIndex, 1);
                    }
                } else {
                    playerCards[idIndex].power -= abilityAmount;
                    if (playerCards[idIndex].power <= 0) {
                        playerCards.splice(idIndex, 1);
                    }
                }
                abilitiesToUse--;
                break;
            case 'heal':
                if (id.includes('player')) {
                    if (playerCards[idIndex].power < cardDetails[playerCards[idIndex].name].power) {
                        playerCards[idIndex].power = cardDetails[playerCards[idIndex].name].power;
                    }
                } else {
                    if (trollCards[idIndex].power < cardDetails[trollCards[idIndex].name].power) {
                        trollCards[idIndex].power = cardDetails[trollCards[idIndex].name].power;
                    }
                }
                abilitiesToUse--;
                if (abilitiesToUse == 0) {
                    if (playerTurn) {
                        var index = 0;
                        while (playerCards[index].name != 'Healing') index++;
                        playerCards.splice(index, 1);
                        playerCardsPlayed--;
                    } else {
                        var index = 0;
                        while (trollCards[index].name != 'Healing') index++;
                        trollCards.splice(index, 1);
                        trollCardsPlayed--;
                    }
                }
                break;
            case 'boost':
                if (id.includes('player')) {
                    playerCards[idIndex].power += abilityAmount;
                } else {
                    trollCards[idIndex].power += abilityAmount;
                }
                abilitiesToUse--;
                break;
        }
    }
    checkGameState();
}

function checkGameState() {
    playerPower = 0;
    for (var cardIndex = 0; cardIndex < playerCards.length; cardIndex++) {
        playerPower += playerCards[cardIndex].power;
    }
    trollPower = 0;
    for (var cardIndex = 0; cardIndex < trollCards.length; cardIndex++) {
        trollPower += trollCards[cardIndex].power;
    }
    if ((playerCardsRemaining == 0 && trollCardInventory.length == 0 && abilitiesToUse == 0) ||
        (playerCardsPlayed == 8 && trollCardsPlayed == 8 && abilitiesToUse == 0) ||
        (playerCardsRemaining == 0 && trollCardsPlayed == 8 && abilitiesToUse == 0) ||
        (playerCardsPlayed == 8 && trollCardInventory.length == 0 && abilitiesToUse == 0)) {
        playerTurn = false;
        if (playerPower > trollPower) {
            document.getElementById('turn-label').innerText = 'Win';
            sessionStorage.setItem('gameWon', 'true');
            setTimeout(winCardGame, 3000);
        } else if (playerPower < trollPower) {
            document.getElementById('turn-label').innerText = 'Loss';
            setTimeout(loseCardGame, 3000);
        } else {
            document.getElementById('turn-label').innerText = 'Draw';
            setTimeout(resetGame, 3000);
        }
    } else if ((playerCardsRemaining == 0 || playerCardsPlayed == 8) && abilitiesToUse == 0) {
        playerTurn = false;
        document.getElementById('turn-label').innerText = 'Troll Turn';
        abilitiesToUse == 1;
        var randomDelay = Math.floor(Math.random() * 200) + 200;
        setTimeout(trollPlayCard, randomDelay);
    } else if ((trollCardInventory.length == 0 || trollCardsPlayed == 8) && abilitiesToUse == 0) {
        playerTurn = true;
        document.getElementById('turn-label').innerText = sessionStorage.getItem('playerName') + ' Turn';
        abilitiesToUse == 1;
    } else {
        if (playerTurn && abilitiesToUse == 0) {
            playerTurn = false;
            document.getElementById('turn-label').innerText = 'Troll Turn';
            abilitiesToUse == 1;
            var randomDelay = Math.floor(Math.random() * 500) + 500;
            setTimeout(trollPlayCard, randomDelay);
        } else if (!playerTurn && abilitiesToUse == 0) {
            playerTurn = true;
            document.getElementById('turn-label').innerText = sessionStorage.getItem('playerName') + ' Turn';
            abilitiesToUse == 1;
        }
    }
    displayCards();
}

function playerPlayCard(id) {
    hideCardPreview();
    var inventory = JSON.parse(sessionStorage.getItem('inventory'));
    var cardName = inventory[id.substring(id.length - 1, id.length)].name;
    if (!basicCardNames.includes(cardName) && !heroCardNames.includes(cardName)) {
        return;
    }
    var boostUnitCount = 0;
    switch (cardName) {
        case 'Templar':
            abilitiesToUse = 0;
            break;
        case 'Peasant':
            abilitiesToUse = 0;
            break;
        case 'Archer':
            abilitiesToUse = 1;
            abilityType = 'damage';
            abilityAmount = 3;
            break;
        case 'Spartan':
            for (var index = 0; index < playerCards.length; index++) {
                if (playerCards[index].name == 'Spartan') {
                    boostUnitCount++;
                }
            }
            for (var index = 0; index < playerCards.length; index++) {
                if (playerCards[index].name == 'Spartan') {
                    playerCards[index].power += 1;
                }
            }
            abilitiesToUse = 0;
            break;
        case 'Mage':
            abilitiesToUse = 3;
            abilityType = 'damage';
            abilityAmount = 3;
            break;
        case 'Knight':
            abilitiesToUse = 0;
            break;
        case 'Healing':
            abilitiesToUse = 3;
            abilityType = 'heal';
            abilityAmount = 0;
            break;
        case 'Pheonix':
            abilitiesToUse = 2;
            abilityType = 'boost';
            abilityAmount = 4;
            break;
    }
    playCard(cardName);
    if (cardName == 'Spartan' && boostUnitCount > 0) {
        playerCards[playerCards.length - 1].power += boostUnitCount;
    }
    removeItem(cardName, 1);
    playerCardsRemaining--;
    checkGameState();
}

function trollPlayCard() {
    var cardName;
    var randomIndex = Math.floor(Math.random() * trollCardInventory.length);
    cardName = trollCardInventory[randomIndex];
    var boostUnitCount = 0;
    switch (cardName) {
        case 'Templar':
            abilitiesToUse = 0;
            break;
        case 'Peasant':
            abilitiesToUse = 0;
            break;
        case 'Archer':
            abilitiesToUse = 1;
            abilityType = 'damage';
            abilityAmount = 3;
            break;
        case 'Spartan':
            for (var index = 0; index < trollCards.length; index++) {
                if (trollCards[index].name == 'Spartan') {
                    boostUnitCount++;
                }
            }
            for (var index = 0; index < trollCards.length; index++) {
                if (trollCards[index].name == 'Spartan') {
                    trollCards[index].power += 1;
                }
            }
            abilitiesToUse = 0;
            break;
        case 'Mage':
            abilitiesToUse = 3;
            abilityType = 'damage';
            abilityAmount = 3;
            break;
        case 'Knight':
            abilitiesToUse = 0;
            break;
        case 'Healing':
            abilitiesToUse = 3;
            abilityType = 'heal';
            abilityAmount = 0;
            break;
        case 'Pheonix':
            abilitiesToUse = 2;
            abilityType = 'boost';
            abilityAmount = 4;
            break;
    }
    playCard(cardName);
    if (cardName == 'Spartan' && boostUnitCount > 0) {
        trollCards[trollCards.length - 1].power += boostUnitCount;
    }
    trollCardInventory.splice(randomIndex, 1);
    checkGameState();
    if (abilitiesToUse > 0) {
        var randomDelay = Math.floor(Math.random() * 200) + 200;
        setTimeout(() => { trollUseAbilities(cardName); }, randomDelay);
    }
}

function trollUseAbilities(cardName) {
    var id = '';
    switch (cardName) {
        case 'Templar':
            break
        case 'Peasant':
            break;
        case 'Archer':
            id += 'player-card-';
            if (playerCards.length == 0) {
                abilitiesToUse = 0;
                trollCards[trollCards.length - 1].casts = 0;
            } else {
                id += Math.floor(Math.random() * playerCards.length);
            }
            break;
        case 'Spartan':
            break;
        case 'Mage':
            id += 'player-card-';
            if (playerCards.length == 0) {
                abilitiesToUse = 0;
                trollCards[trollCards.length - 1].casts = 0;
            } else {
                id += Math.floor(Math.random() * playerCards.length);
            }
            break;
        case 'Knight':
            break;
        case 'Healing':
            id += 'troll-card-';
            if (trollCards.length == 1) {
                abilitiesToUse = 0;
                trollCards[trollCards.length - 1].casts = 0;
                var index = 0;
                while (trollCards[index].name != 'Healing') index++;
                trollCards.splice(index, 1);
                trollCardsPlayed--;
            } else {
                var index = 0;
                while (index < trollCards.length && trollCards[index].power >= cardDetails[trollCards[index].name].power) index++;
                if (index == trollCards.length) {
                    abilitiesToUse = 0;
                    trollCards[trollCards.length - 1].casts = 0;
                    var index = 0;
                    while (trollCards[index].name != 'Healing') index++;
                    trollCards.splice(index, 1);
                    trollCardsPlayed--;
                } else {
                    id += index;
                }
            }
            break;
        case 'Pheonix':
            id += 'troll-card-';
            if (trollCards.length == 1) {
                abilitiesToUse = 0;
            } else {
                id += Math.floor(Math.random() * trollCards.length);
            }
            break;
    }
    selectCard(id);
    if (abilitiesToUse > 0) {
        var randomDelay = Math.floor(Math.random() * 200) + 200;
        setTimeout(() => { trollUseAbilities(cardName); }, randomDelay);
    }
    //else {
    //playerTurn = false;
    //abilitiesToUse = 0;
    //checkGameState();
    //}
}

function playCard(cardName) {
    var card = {
        name: '',
        power: 0,
        ability: '',
        effects: [],
        casts: 0
    }
    card.name = cardDetails[cardName].name;
    card.power = cardDetails[cardName].power;
    card.ability = cardDetails[cardName].ability;
    card.effects = cardDetails[cardName].effects;
    card.casts = cardDetails[cardName].casts;
    if (playerTurn) {
        playerCards.push(card);
        playerCardsPlayed++;
    } else {
        trollCards.push(card);
        trollCardsPlayed++;
    }
}

function displayCards() {
    var card;
    document.getElementById('player-cards').innerHTML = '';
    for (var cardIndex = 0; cardIndex < playerCards.length; cardIndex++) {
        card = playerCards[cardIndex];
        displayCard(card, cardIndex, true);
    }
    document.getElementById('troll-cards').innerHTML = '';
    for (var cardIndex = 0; cardIndex < trollCards.length; cardIndex++) {
        card = trollCards[cardIndex];
        displayCard(card, cardIndex, false);
    }
    document.getElementById('player-power').innerText = playerPower;
    document.getElementById('troll-power').innerText = trollPower;
    document.getElementById('player-cards-used-span').innerText = playerCardsPlayed;
    document.getElementById('troll-cards-used-span').innerText = trollCardsPlayed;
}

function displayCard(card, cardIndex, playerCard) {
    var cardId;
    var cardRowId;
    if (playerCard) {
        cardId = 'player-card-';
        cardRowId = 'player-cards';
    } else {
        cardId = 'troll-card-';
        cardRowId = 'troll-cards';
    }
    var details = '';
    if (card.casts > 0) {
        details += 'Abilities: ' + card.casts + '<br>';
    }
    var cardBase;
    if (heroCardNames.includes(card.name)) {
        cardBase = 'images/cards/HeroCardTemplate.png';
    } else {
        cardBase = 'images/cards/BasicCardTemplate.png';
    }
    var element = document.getElementById(cardRowId);
    element.innerHTML +=
        '<div class="card" id="' + cardId + cardIndex + '">' +
        '<img class="card-base" src="' + cardBase + '" alt="">' +
        '<img class="card-avatar" src="images/cards/Avatars/' + card.name + '.png" alt="">' +
        '<div class="object card-power">' + card.power + '</div>' +
        '<div class="object card-description">' + card.name + '<br>' + card.ability + '<br>' + details + '</div>' +
        '<svg viewBox="0 0 400 650">' +
        '<a href="#" onclick="displayCardPreview(this.parentNode.parentNode.id)">' +
        '<polygon points="0,617,0,35,5,21,12,12,21,5,33,0,364,0,378,4,386,10,393,18,398,27,400,39,400,616,397,627,391,636,384,643,375,649,31,649,19,645,9,637,3,627" />' +
        '</a>' +
        '</svg>' +
        '</div>';
}

function loseCardGame() {
    sessionStorage.setItem('gameWon', 'false');
    window.open('gameOver.html', '_self');
}

function winCardGame() {
    window.open('gameOver.html', '_self');
}

function resetGame() {
    trollCardInventory = [];
    playerCardsRemaining = 0;
    playerCards = [];
    trollCards = [];
    playerCardsPlayed = 0;
    trollCardsPlayed = 0;
    abilityUsed = false;
    playerPower = 0;
    trollPower = 0;
    playerTurn = true;
    abilitiesToUse = 0;
    abilityType = '';
    abilityAmount = 0;
    startCardGame();
}

function passRound() {
    abilitiesToUse = 0;
    playerCards[playerCards.length - 1].casts = 0;
    if (playerCards[playerCards.length - 1].name == 'Healing') {
        playerCards.splice(playerCards.length - 1, 1);
        playerCardsPlayed--;
    }
    checkGameState();
}