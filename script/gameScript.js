let p1_hand_element;
let p2_hand_element;
let p1_actives_element;
let p2_actives_element;
let p1_hand = [no_card, no_card, no_card, no_card, no_card];
let p2_hand = [no_card, no_card, no_card, no_card, no_card];
let p1_actives = [no_card, no_card, no_card, no_card];
let p2_actives = [no_card, no_card, no_card, no_card];
let p1_deck = cards;
let p2_deck = cards;
let p1_turn = true;
let curr_selected_card;
let curr_selected_hand_slot;
let end_turn_button;
let p1_orbs = 0;
let p2_orbs = 0;
let p1_orbs_gain = 3;
let p2_orbs_gain = 3;

startGame();
function startGame() {
    p2_hand_element = document.getElementsByClassName("p2_hand");
    p1_hand_element = document.getElementsByClassName("p1_hand");
    p2_actives_element = document.getElementsByClassName("p2_actives");
    p1_actives_element = document.getElementsByClassName("p1_actives");
    end_turn_button = document.getElementById("end-turn-button-p1");

    dealCardsOnHand(1);
}

function removeDeadCards() {
    console.log("Removing dead cards")

    for (let i = 0; i < p1_actives.length; i++) {
        if (isDead(p1_actives[i])) {
            removeCardOnActive(1, i)
        }
    }

    for (let i = 0; i < p2_actives.length; i++) {
        if (isDead(p2_actives[i])) {
            removeCardOnActive(2, i)
        }
    }

    updateCardsOnActives(1);
    updateCardsOnActives(2);
}

function startAttacks() {
    for (let i = 0; i < p1_actives.length; i++) {
        if (p1_actives[i].name !== "empty") {
            if (p2_actives[i].name !== "empty") {
                damageCard(2, i, p1_actives[i].dmg);
            }
        }
    }
    for (let i = 0; i < p2_actives.length; i++) {
        if (p2_actives[i].name !== "empty") {
            if (p1_actives[i].name !== "empty") {
                damageCard(1, i, p2_actives[i].dmg);
            }
        }
    }

    removeDeadCards();
}

function endTurn() {
    p1_turn = !p1_turn;

    if (p1_turn == true) {
        end_turn_button.id = "end-turn-button-p1";
        startAttacks();
        dealCardsOnHand(1);
    } else {
        end_turn_button.id = "end-turn-button-p2";
        dealCardsOnHand(2);
    }
}

function placeSpecificCardOnActives(player, active_id, card) {
    let current_active;
    if (player == 1) {
        current_active = p1_actives;
    } else {
        current_active = p2_actives;
    }

    current_active[active_id] = card;

    if (player == 1) {
        current_active = p1_actives;
    } else {
        current_active = p2_actives;
    }

    updateCardsOnActives(player);
}

function removeCardOnActive(player, active_id) {
    placeSpecificCardOnActives(player, active_id, no_card);
}

function isDead(card) {
    return card.hp <= 0;
}

function damageCard(player, slot, damage) {
    let current_card;

    if (player == 1) {
        current_card = p1_actives[slot];
    } else {
        current_card = p2_actives[slot];
    }

    current_card.hp -= damage;
    console.log(`dealt ${damage} damage to Player ${player} slot ${slot}`);
}

function updateCardsOnActives(player) {

    let current_actives;
    let current_actives_e
    if (player == 1) {
        current_actives_e = p1_actives_element;
        current_actives = p1_actives;
    } else {
        current_actives_e = p2_actives_element;
        current_actives = p2_actives;
    }

    for (let i = 0; i < current_actives.length; i++) {
        if (current_actives[i].name !== "empty") {
            current_actives_e[i].outerHTML = `

            <div class="active-card-game-actives p${player}_actives">
                <h1 class="active-name-game">${current_actives[i].name}</h1>
                <div class="flex-center">
                    <img class="active-sprite-game" src="../img/${current_actives[i].sprite}" alt="${current_actives[i].name}">
                </div>
                <div class="flex-center">
                    <div class="flex-center-no-width">
                        <img class="active-icon-game" src="../img/heartIcon.png">
                        <h2 class="">${current_actives[i].hp}</h2>
                    </div>
                    <div class="flex-center-no-width">
                        <h2 class="">${current_actives[i].dmg}</h2>
                        <img class="active-icon-game" src="../img/swordIcon.png">
                    </div>
                </div>
            </div>

        `;
        } else {
            current_actives_e[i].outerHTML = `

            <div onclick="placeCardOnActive(${player}, -1, ${i})" class="card-background-game p${player}_actives">
                <h1>ACTIVE</h1>
            </div>

            `;
        }
    }

}

function placeCardOnActive(player, card, active_slot) {

    if (p1_turn && player == 1 || p1_turn == false && player == 2) {

        if (card != -1) {
            curr_selected_card = card;
        }

        if (curr_selected_card != null) {

            let current_actives;
            if (player == 1) {
                current_actives = p1_actives;
            } else {
                current_actives = p2_actives;
            }

            current_actives[active_slot] = Object.assign({}, curr_selected_card);

            if (player == 1) {
                p1_actives = current_actives;
                p1_hand[curr_selected_hand_slot] = no_card;
                for (let i = 0; i < p1_actives_element.length; i++) {
                    p1_actives_element[i].classList.remove("glow");
                }
            } else {
                p2_actives = current_actives;
                p2_hand[curr_selected_hand_slot] = no_card;
                for (let i = 0; i < p2_actives_element.lengthq; i++) {
                    p2_actives_element[i].classList.remove("glow");
                }
            }
            curr_selected_card = null;
            curr_selected_hand_slot = null;


            updateCardsOnHand(player);
            updateCardsOnActives(player);
        }

    }
}

function letElementsGlow(elements) {
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].classList.contains("card-background-game"))
            elements[i].classList.add("glow");
    }
}

function selectCard(player, slot) {
    if (player == 1 && p1_turn == true) {
        if (p1_orbs >= p1_hand[slot].cost) {
            p1_orbs -= p1_hand[slot].cost;
            curr_selected_card = p1_hand[slot];
            curr_selected_hand_slot = slot;
            letElementsGlow(p1_actives_element);
        }
    } else if (player == 2 && p1_turn == false) {
        if (p2_orbs >= p2_hand[slot].cost) {
            p2_orbs -= p2_hand[slot].cost;
            curr_selected_card = p2_hand[slot];
            curr_selected_hand_slot = slot;
            letElementsGlow(p2_actives_element);
        }
    }
}

function placeSpecificCardOnHand(player, hand_id, card) {
    let current_hand;
    if (player == 1) {
        current_hand = p1_hand;
    } else {
        current_hand = p2_hand;
    }

    current_hand[hand_id] = card;

    if (player == 1) {
        p1_hand = current_hand;
    } else {
        p2_hand = current_hand;
    }

    updateCardsOnHand(player);
}

function removeCardOnHand(player, hand_id) {
    placeSpecificCardOnHand(player, hand_id, no_card);
}

function chooseRandomDeckCard(player) {
    let current_deck;
    if (player == 1) {
        current_deck = p1_deck;
    } else {
        current_deck = p2_deck;
    }

    return Math.floor(Math.random() * current_deck.length);
}

function dealCardsOnHand(player) {
    let current_hand;
    if (player == 1) {
        current_hand = p1_hand;
        p1_orbs += p1_orbs_gain;
    } else {
        current_hand = p2_hand;
        p2_orbs += p2_orbs_gain;
    }

    for (let i = 0; i < current_hand.length; i++) {
        if (current_hand[i].name === "empty") {
            placeCardOnHand(player, chooseRandomDeckCard(player));
        }
    }
    updateCardsOnHand(player);
}

function placeCardOnHand(player, cardID) {
    let current_hand;
    if (player == 1) {
        current_hand = p1_hand;
    } else {
        current_hand = p2_hand;
    }

    for (let i = 0; i < current_hand.length; i++) {
        if (current_hand[i].name === "empty") {
            current_hand[i] = Object.assign({}, cards[cardID]);
            break;
        }
    }
}

function updateCardsOnHand(player) {
    let current_hand;
    let current_hand_e
    if (player == 1) {
        current_hand_e = p1_hand_element;
        current_hand = p1_hand;
    } else {
        current_hand_e = p2_hand_element;
        current_hand = p2_hand;
    }

    for (let i = 0; i < current_hand.length; i++) {
        if (current_hand[i].name !== "empty") {
            current_hand_e[i].outerHTML = `

            <div onclick="selectCard(${player}, ${i})" class="active-card-game p${player}_hand">
                <h1 class="active-name-game">${current_hand[i].name}</h1>
                <div class="flex-center">
                    <img class="active-sprite-game" src="../img/${current_hand[i].sprite}" alt="${current_hand[i].name}">
                </div>
                <div class="flex-center">
                    <div class="flex-center-no-width">
                        <img class="active-icon-game" src="../img/heartIcon.png">
                        <h2 class="nomargin">${current_hand[i].hp}</h2>
                    </div>
                    <div class="flex-center-no-width">
                        <h2 class="nomargin">${current_hand[i].dmg}</h2>
                        <img class="active-icon-game" src="../img/swordIcon.png">
                    </div>
                </div>
                <div class="flex-center">
                        <h2 class="nomargin">${current_hand[i].cost}</h2>
                        <img class="active-icon-game" src="../img/orb.png">
                    </div>
            </div>
        `;
        } else {
            current_hand_e[i].outerHTML = `

            <div class="card-background-game p${player}_hand">
                <h1>HAND</h1>
            </div>

            `;
        }

    }
}