let p1_hand_element;
let p2_hand_element;
let p1_hand = [no_card, no_card, no_card, no_card, no_card];
let p2_hand = [no_card, no_card, no_card, no_card, no_card];
let p1_deck = cards;
let p2_deck = cards;

startGame();
function startGame() {
    p2_hand_element = document.getElementsByClassName("p2_hand");
    p1_hand_element = document.getElementsByClassName("p1_hand");
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
    } else {
        current_hand = p2_hand;
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
            current_hand[i] = cards[cardID];
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

            <div class="active-card-game p${player}_hand">
                <h1 class="active-name-game">${current_hand[i].name}</h1>
                <div class="flex-center">
                    <img class="active-sprite-game" src="../img/${current_hand[i].sprite}" alt="COW">
                </div>
                <div class="flex-center">
                    <div class="flex-center-no-width">
                        <img class="active-icon-game" src="../img/heartIcon.png">
                        <h2 class="">${current_hand[i].hp}</h2>
                    </div>
                    <div class="flex-center-no-width">
                        <h2 class="">${current_hand[i].dmg}</h2>
                        <img class="active-icon-game" src="../img/swordIcon.png">
                    </div>
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