var playerHealth = 100;
var playerMana = 100;
var trollHealth = 100;

var maxDamage = 15;
var minDamage = 5;
var maxTrollDamage = 30;
var minTrollDamage = 10;

inCombat = true;

var inventory = JSON.parse(sessionStorage.getItem('inventory'));

for (var index = 0; index < inventory.length; index++) {
    if (inventory[index].name == 'Sword') {
        maxDamage += 10;
        minDamage += 10;
        break;
    }
}

for (var index = 0; index < inventory.length; index++) {
    if (inventory[index].name == 'Shield') {
        maxTrollDamage -= 10;
        minTrollDamage -= 10;
        break;
    }
}

function damageHealth(damageAmt) {
    playerHealth -= damageAmt;
    if (playerHealth <= 0) {
        playerHealth = 0;
        canAtk = false;
        document.getElementById('canAttackIcon').style.display = 'none';
        setTimeout(loseFight, 3000);
    }
    document.getElementById('health').style.width = playerHealth + '%';
}


function useMana(manaAmt) {
    playerMana -= manaAmt;
    if (mana <= 0) {
        mana = 0;
    }
    document.getElementById('mana').style.width = playerMana + '%';
}

var regenManaInterval = window.setInterval(regenMana, 500);

function regenMana() {
    document.getElementById('mana').style.width = playerMana + '%';
    if (playerMana < 100) {
        playerMana += 1;
    }
}

function heal(healAmt) {
    playerHealth += healAmt;
    if (playerHealth >= 100) {
        playerHealth = 100;
    }
    document.getElementById('health').style.width = playerHealth + '%';
}

var randomTime = Math.floor((Math.random() * 1250) + 1000);
var trollAttackInterval = window.setInterval(trollAttack, randomTime);
var freezeAttackTime = 0;

function trollAttack() {
    if (freezeAttackTime == 0) {
        var randomdamage = Math.floor((Math.random() * (maxTrollDamage - minTrollDamage)) + minTrollDamage)
        damageHealth(randomdamage);
        var message = '<p class="narrator">Mysterious Narrator: The troll hits ' + sessionStorage.getItem('playerName') + ' for ' + randomdamage + ' damage </p>';
        addDialog(message);
    } else {
        freezeAttackTime -= randomTime;
        if (freezeAttackTime < 0) {
            freezeAttackTime = 0;
            document.getElementById('troll1').getElementsByTagName('polygon')[0].style = 'fill: rgba(0, 0, 0, 0);';
        }
    }

}

var canAtk = true,
    delay = 750;

function damageTroll() {
    if (canAtk) {
        canAtk = false;
        document.getElementById('canAttackIcon').style.display = 'none';

        var atkDamage = Math.floor((Math.random() * maxDamage) + minDamage)
        trollHealth -= atkDamage;
        if (trollHealth <= 0) {
            trollHealth = 0;
            sessionStorage.setItem('gameWon', 'true');
            window.clearInterval(trollAttackInterval);
            setTimeout(winFight, 3000);
        }

        var message = '<p class="narrator">Mysterious Narrator: ' + sessionStorage.getItem('playerName') + ' hit the troll for ' + atkDamage + ' damage</p>';
        addDialog(message);
        document.getElementById('trollHealth').style.width = trollHealth + '%';

        if (trollHealth > 0) {
            setTimeout(function() {
                if (playerHealth > 0) {
                    canAtk = true;
                    document.getElementById('canAttackIcon').style.display = 'block';
                }
            }, delay);
        }

        document.getElementById('troll1').getElementsByTagName('polygon')[0].style = 'fill: rgb(255,0,0);fill-opacity: .25;';
        setTimeout(() => {
            document.getElementById('troll1').getElementsByTagName('polygon')[0].style = 'fill: rgba(0, 0, 0, 0);';
            if (freezeAttackTime > 0) {
                document.getElementById('troll1').getElementsByTagName('polygon')[0].style = 'fill: rgb(100,200,255);fill-opacity: .5;';
            }
        }, 300);

    } else {
        var message = '<p class="narrator">Mysterious Narrator: ' + sessionStorage.getItem('playerName') + ' must wait until they can swing again</p>';
        addDialog(message);
    }

}

function useItem(id) {
    if (canAtk) {
        canAtk = false;
        document.getElementById('canAttackIcon').style.display = 'none';

        var idIndex = id.substring(id.length - 1, id.length);

        var inventory = JSON.parse(sessionStorage.getItem('inventory'));
        var itemName = inventory[idIndex].name;

        var itemUsed = false;
        var atkDamage;
        switch (itemName) {
            case 'Potion':
                itemUsed = true;
                setTimeout(() => { effectOverTime('heal', 5, 10) }, 1000);
                break;
            case 'Fireball':
                itemUsed = true;
                atkDamage = 5;
                setTimeout(() => { effectOverTime('damage', atkDamage, 10) }, 1000);
                var message = '<p class="narrator">Mysterious Narrator: ' + sessionStorage.getItem('playerName') + ' ignited the troll for ' + atkDamage + ' damage per second for 10 seconds</p>';
                addDialog(message);
                useMana(30);
                break;
            case 'Freezing':
                itemUsed = true;
                freezeAttackTime = 10000;
                var message = '<p class="narrator">Mysterious Narrator: ' + sessionStorage.getItem('playerName') + ' froze the troll for ' + freezeAttackTime / 1000 + ' seconds</p>';
                addDialog(message);
                useMana(30);
                document.getElementById('troll1').getElementsByTagName('polygon')[0].style = 'fill: rgb(100,200,255);fill-opacity: .5;';
                break;
            case 'Poisoning':
                itemUsed = true;
                atkDamage = 5;
                setTimeout(() => { effectOverTime('damage', atkDamage, 10) }, 1000);
                var message = '<p class="narrator">Mysterious Narrator: ' + sessionStorage.getItem('playerName') + ' poisoned the troll for ' + atkDamage + ' damage per second for 10 seconds</p>';
                addDialog(message);
                useMana(30);
                break;
            case 'Health':
                itemUsed = true;
                setTimeout(() => { effectOverTime('heal', 5, 10) }, 1000);
                useMana(30);
                break;
        }
        if (itemUsed) {
            removeItem(itemName, 1);
            if (trollHealth > 0) {
                setTimeout(function() {
                    if (playerHealth > 0) {
                        canAtk = true;
                        document.getElementById('canAttackIcon').style.display = 'block';
                    }
                }, delay);
            }
        }
    } else {
        var message = '<p class="narrator">Mysterious Narrator: ' + sessionStorage.getItem('playerName') + ' must wait until they can use items again</p>';
        addDialog(message);
    }
}

function effectOverTime(effectType, effectAmount, count) {
    if (count > 0) {
        if (effectType == 'damage') {
            trollHealth -= effectAmount;
            if (trollHealth <= 0) {
                trollHealth = 0;
                sessionStorage.setItem('gameWon', 'true');
                setTimeout(winFight, 3000);
            }
            document.getElementById('trollHealth').style.width = trollHealth + '%';
            document.getElementById('troll1').getElementsByTagName('polygon')[0].style = 'fill: rgb(255,0,0);fill-opacity: .25';
            setTimeout(() => {
                document.getElementById('troll1').getElementsByTagName('polygon')[0].style = 'fill: rgba(0, 0, 0, 0);';
                if (freezeAttackTime > 0) {
                    document.getElementById('troll1').getElementsByTagName('polygon')[0].style = 'fill: rgb(100,200,255); fill-opacity: .5;';
                }
            }, 300);
        } else {
            playerHealth += effectAmount;
            if (playerHealth >= 100) {
                playerHealth = 100;
            }
            document.getElementById('health').style.width = playerHealth + '%';
        }
        count--;
        setTimeout(() => { effectOverTime(effectType, effectAmount, count) }, 1000);
    }
}

function loseFight() {
    sessionStorage.setItem('gameWon', 'false');
    window.open('gameOver.html', '_self');
}

function winFight() {
    window.open('gameOver.html', '_self');
}