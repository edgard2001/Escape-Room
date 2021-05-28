const basicCardNames = [
    'Archer',
    'Spartan',
    'Peasant',
    'Templar'
];

const heroCardNames = [
    'Mage',
    'Knight',
    'Healing',
    'Pheonix'
];

const scrollNames = [
    'Fireball',
    'Freezing',
    'Poisoning',
    'Health'
];

document.addEventListener("DOMContentLoaded", function() { displayInventory(); });

var inCardGame = false;
var inCombat = false;

function addItem(item, count) {

    var inventory = JSON.parse(sessionStorage.getItem('inventory'));

    var itemName = item;
    var itemCount = count;
    var itemDescription;

    switch (item) {
        case 'Coin':
            itemDescription = 'Gold coin with crown emblem';
            break;
        case 'Lockpick':
            itemDescription = 'Allows to pick locks open';
            break;
        case 'BasicCard':
            var randomIndex = Math.floor(Math.random() * basicCardNames.length);
            itemName = basicCardNames[randomIndex];
            itemDescription = 'A common unit card for a card game';
            break;
        case 'HeroCard':
            var randomIndex = Math.floor(Math.random() * heroCardNames.length);
            itemName = heroCardNames[randomIndex];
            itemDescription = 'A special hero card for a card game';
            break;
        case 'Sword':
            itemDescription = 'Sharp double edged sword';
            break;
        case 'Shield':
            itemDescription = 'Sturdy steel shield with a deer coat of arms';
            break;
        case 'Potion':
            itemDescription = 'Bubbling healing potion';
            break;
        case 'Scroll':
            var randomIndex = Math.floor(Math.random() * scrollNames.length);
            itemName = scrollNames[randomIndex];
            itemDescription = 'Magic spell scroll covered in runes';
            break;
        default:
            if (basicCardNames.includes(item)) {
                itemDescription = 'A common unit card for a card game';
            } else if (heroCardNames.includes(item)) {
                itemDescription = 'Bubbling healing potion';
            } else if (scrollNames.includes(item)) {
                itemDescription = 'Magic spell scroll covered in runes';
            } else {
                itemDescription = 'Mysterious item';
            }
    }

    var itemStacked = false;
    if (inventory.length > 0) {
        for (var index = 0; index < inventory.length; index++) {
            if (inventory[index].name == itemName) {
                inventory[index].count += itemCount;
                itemStacked = true;
                break;
            }
        }
    }
    if (!itemStacked) {
        var object = {
            name: itemName,
            count: itemCount,
            description: itemDescription
        }
        inventory.push(object);
    }

    sessionStorage.setItem('inventory', JSON.stringify(inventory));
    displayInventory();
}

function removeItem(itemName, itemCount) {

    var inventory = JSON.parse(sessionStorage.getItem('inventory'));

    for (var index = 0; index < inventory.length; index++) {

        if (inventory[index].name == itemName && inventory[index].count >= itemCount) {
            inventory[index].count -= itemCount;
            if (inventory[index].count == 0) {
                inventory.splice(index, 1);
            }
            sessionStorage.setItem('inventory', JSON.stringify(inventory));
            displayInventory();
            return true;
        }
    }
    return false;

}

function displayInventory() {
    var inventory = JSON.parse(sessionStorage.getItem('inventory'));

    document.getElementById('inventory').innerHTML = '';

    var script;
    if (inCardGame) {
        script = 'onclick="displayCardPreview(this.id)"';
    } else if (inCombat) {
        script = 'onclick="useItem(this.id)"';
    } else {
        script = '';
    }

    var inventoryHTML = '';
    for (var index = inventory.length - 1; index >= 0; index--) {
        inventoryHTML += '<div class="inventory-item" id="item' + index + '"' + script + '>';
        if (basicCardNames.includes(inventory[index].name)) {
            inventoryHTML += '<img src="images/collectables/BasicCard.png" alt="' + inventory[index].description + '" draggable="false">'
            if (inventory[index].count == 1) {
                inventoryHTML += '<p>' + inventory[index].name + ' Card</p>';
            } else {
                inventoryHTML += '<p>' + inventory[index].name + ' Cards x' + inventory[index].count + '</p>';
            }
        } else if (heroCardNames.includes(inventory[index].name)) {
            inventoryHTML += '<img src="images/collectables/HeroCard.png" alt="' + inventory[index].description + '" draggable="false">'
            if (inventory[index].count == 1) {
                inventoryHTML += '<p>' + inventory[index].name + ' Card</p>';
            } else {
                inventoryHTML += '<p>' + inventory[index].name + ' Cards x' + inventory[index].count + '</p>';
            }
        } else if (scrollNames.includes(inventory[index].name)) {
            inventoryHTML += '<img src="images/collectables/Scroll.png" alt="' + inventory[index].description + '" draggable="false">'
            if (inventory[index].count == 1) {
                inventoryHTML += '<p>' + inventory[index].name + ' Spell Scroll</p>';
            } else {
                inventoryHTML += '<p>' + inventory[index].name + ' Spell Scrolls x' + inventory[index].count + '</p>';
            }
        } else {
            inventoryHTML += '<img src="images/collectables/' + inventory[index].name + '.png" alt="' + inventory[index].description + '" draggable="false">'
            if (inventory[index].count == 1) {
                inventoryHTML += '<p>' + inventory[index].name + '</p>';
            } else {
                inventoryHTML += '<p>' + inventory[index].name + 's x' + inventory[index].count + '</p>';
            }
        }
        inventoryHTML += '</div>';
    }

    document.getElementById('inventory').innerHTML = inventoryHTML;
}