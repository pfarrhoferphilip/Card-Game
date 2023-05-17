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
let curr_selected_card_element;
let end_turn_button;
let p1_orbs = 0;
let p2_orbs = 2;
let p1_orbs_gain = 3;
let p2_orbs_gain = 3;
let p1_orbs_element;
let p2_orbs_element;
let max_orbs = 15;
let p1_hp = 19;
let p2_hp = 19;
let hp_max = 20;
let p1_hp_element;
let p2_hp_element;
let p1_overlay;
let p2_overlay;
let turn_count = 0;
let p1_remove;
let p2_remove;
let scores;
var r = document.querySelector(':root');
let p1_name;
let p2_name;
let game_is_over = false;
let ability_display_p1;
let ability_display_p2;

startGame();
function startGame() {
    p2_hand_element = document.getElementsByClassName("p2_hand");
    p1_hand_element = document.getElementsByClassName("p1_hand");
    p2_actives_element = document.getElementsByClassName("p2_actives");
    p1_actives_element = document.getElementsByClassName("p1_actives");
    end_turn_button = document.getElementById("end-turn-button-p1");
    p1_orbs_element = document.getElementById("orbs_p1_count");
    p2_orbs_element = document.getElementById("orbs_p2_count");
    p1_hp_element = document.getElementById("hp_p1_count");
    p2_hp_element = document.getElementById("hp_p2_count");
    p1_overlay = document.getElementById("overlay-p1");
    p2_overlay = document.getElementById("overlay-p2");
    p1_remove = document.getElementById("remove-p1");
    p2_remove = document.getElementById("remove-p2")
    ability_display_p1 = document.getElementById("ability-display-p1");
    ability_display_p2 = document.getElementById("ability-display-p2");
    r.style.setProperty('--p1_color', localStorage['p1_color']);
    r.style.setProperty('--p2_color', localStorage['p2_color']);
    p1_name = localStorage['p1_name'];
    p2_name = localStorage['p2_name'];

    p1_orbs_element.innerHTML = p1_orbs;
    p2_orbs_element.innerHTML = p2_orbs;
    p1_hp_element.innerHTML = p1_hp;
    p2_hp_element.innerHTML = p2_hp;
    document.getElementById("p1-overlay-text").innerHTML = `${p2_name} TURN`;
    document.getElementById("p2-overlay-text").innerHTML = `${p1_name} TURN`;

    if (localStorage['scores']) {
        scores = JSON.parse(localStorage['scores']);
    } else {
        scores = [0];
    }

    let date = new Date();
    if (date.getHours() > 20) {
        console.log("LATE NIGHT GAMING???");
    }

    dealCardsOnHand(1);
}

function applyPoison() {
    for (let i = 0; i < p1_actives.length; i++) {
        if (p1_actives[i].poison == true && p1_actives[i].hp > 1) {
            damageCard(1, i, 1, false);
        }
    }

    for (let i = 0; i < p2_actives.length; i++) {
        if (p2_actives[i].poison == true && p2_actives[i].hp > 1) {
            damageCard(2, i, 1, false);
        }
    }
}

function poisonCard(player, slot) {
    if (player == 1) {
        p1_actives[slot].poison = true;
    } else {
        p2_actives[slot].poison = true;
    }
}

function applyEffect(player, active_slot) {
    console.log("AMOGUS");
    if (player == 1) {

        if (p1_actives[active_slot].effect.heal_self != 0) {
            p1_actives[active_slot].hp += p1_actives[active_slot].effect.heal_self;
            if (p1_actives[active_slot].hp > p1_actives[active_slot].max_hp)
                p1_actives[active_slot].hp = p1_actives[active_slot].max_hp;
        }

        if (p1_actives[active_slot].effect.heal_all != 0) {
            console.log("heal_all");
            for (let i = 0; i < p1_actives.length; i++) {
                if (p1_actives[i].name != "empty") {
                    p1_actives[i].hp += p1_actives[active_slot].effect.heal_all;
                    if (p1_actives[i].hp > p1_actives[i].max_hp)
                        p1_actives[i].hp = p1_actives[i].max_hp;
                }
            }
        }

        if (p1_actives[active_slot].effect.dmg_single != 0) {
            if (p2_actives[active_slot].name != "empty")
                damageCard(2, active_slot, p1_actives[active_slot].effect.dmg_single);
        }
    } else {

        if (p2_actives[active_slot].effect.heal_self != 0) {
            p2_actives[active_slot].hp += p2_actives[active_slot].effect.heal_self;
            if (p2_actives[active_slot].hp > p2_actives[active_slot].max_hp)
                        p2_actives[active_slot].hp = p2_actives[active_slot].max_hp;
        }

        if (p2_actives[active_slot].effect.heal_all != 0) {
            for (let i = 0; i < p2_actives.length; i++) {
                if (p2_actives[i].name != "empty") {
                    p2_actives[i].hp += p2_actives[active_slot].effect.heal_all;
                    if (p2_actives[i].hp > p2_actives[i].max_hp)
                        p2_actives[i].hp = p2_actives[i].max_hp;
                }
            }
        }

        if (p2_actives[active_slot].effect.dmg_single != 0) {
            if (p1_actives[active_slot].name != "empty")
                damageCard(1, active_slot, p1_actives[active_slot].effect.dmg_single);
        }
    }

    removeDeadCards();
    updateCardsOnActives(1);
    updateCardsOnActives(2);
}

function endGame(winner) {

    if (game_is_over == false) {
        game_is_over = true;

        if (winner == 1) {
            localStorage['is_draw'] = false;
            localStorage['winner_name'] = p1_name;
            let leaderboard;
            if (localStorage['leaderboard']) {
                leaderboard = JSON.parse(localStorage['leaderboard']);
            } else {
                leaderboard = [];
            }

            let new_entry = {
                "name": p1_name,
                "score": turn_count,
                "color": localStorage['p1_color']
            }
            leaderboard.push(new_entry);
            localStorage['leaderboard'] = JSON.stringify(leaderboard);

        } else if (winner == 2) {
            localStorage['is_draw'] = false;
            localStorage['winner_name'] = p2_name;

            let leaderboard;
            if (localStorage['leaderboard']) {
                leaderboard = JSON.parse(localStorage['leaderboard']);
            } else {
                leaderboard = [];
            }

            let new_entry = {
                "name": p2_name,
                "score": turn_count,
                "color": localStorage['p2_color']
            }
            leaderboard.push(new_entry);
            localStorage['leaderboard'] = JSON.stringify(leaderboard);
        } else {
            localStorage['is_draw'] = true;
        }

        window.open("finishGame.html", "_self");
    }
}

function checkActiveStatus(player) {
    if (player == 1) {
        for (let i = 0; i < p1_actives.length; i++) {
            if (p1_actives[i].turns_till_active == 0 && p1_actives_element[i].classList.contains("opacity-low")) {
                p1_actives[i].is_grey = false;
            }
        }
    } else {
        for (let i = 0; i < p2_actives.length; i++) {
            if (p2_actives[i].turns_till_active == 0 && p2_actives_element[i].classList.contains("opacity-low")) {
                p2_actives[i].is_grey = false;
            }
        }
    }
}

function realRemoveCard(player) {
    if (curr_selected_card != null && curr_selected_card.name != "empty") {
        console.log("removing card...")
        let current_orbs;
        if (player == 1) {
            current_orbs = p1_orbs;
        } else {
            current_orbs = p2_orbs;
        }
        if (current_orbs >= curr_selected_card.cost) {
            current_orbs -= curr_selected_card.cost;
            removeCardOnHand(player, curr_selected_hand_slot);
        }
        if (player == 1) {
            p1_orbs = current_orbs;
            p1_orbs_element.innerHTML = p1_orbs;
        } else {
            p2_orbs = current_orbs;
            p2_orbs_element.innerHTML = p2_orbs;
        }
    }

    if (player == 1) {
        p1_hand[curr_selected_hand_slot] = no_card;
        for (let i = 0; i < p1_actives_element.length; i++) {
            p1_actives_element[i].classList.remove("glow");
        }
        p1_remove.classList.remove("glow");
    } else {
        p2_hand[curr_selected_hand_slot] = no_card;
        for (let i = 0; i < p2_actives_element.length; i++) {
            p2_actives_element[i].classList.remove("glow");
        }
        p2_remove.classList.remove("glow");
    }

    curr_selected_card = null;
    ability_display_p1.classList.remove("ability-display-active");
    ability_display_p2.classList.remove("ability-display-active");
}

function healPlayer(player, heal) {
    if (player == 1) {
        p1_hp += heal;
        if (p1_hp > hp_max) {
            p1_hp = hp_max;
        }
        p1_hp_element.innerHTML = p1_hp;
    } else {
        p2_hp += heal;
        if (p2_hp > hp_max) {
            p2_hp = hp_max;
        }
        p2_hp_element.innerHTML = p2_hp;
    }
    console.log(`healt ${heal} damage from Player ${player}`);
}

function damagePlayer(player, damage) {
    if (player == 1) {
        p1_hp -= damage;
        if (p1_hp < 0)
            p1_hp = 0;
        p1_hp_element.innerHTML = p1_hp;
    } else {
        p2_hp -= damage;
        if (p2_hp < 0)
            p2_hp = 0;
        p2_hp_element.innerHTML = p2_hp;
    }
    console.log(`dealt ${damage} damage to Player ${player}`);

    checkPlayerHP();
}

function checkPlayerHP() {

    if (p1_hp <= 0 && p2_hp <= 0) {
        endGame(0);
    } else {
        if (p1_hp <= 0) {
            endGame(2);
        }

        if (p2_hp <= 0) {
            endGame(1);
        }
    }
}

function removeDeadCards() {
    console.log("Removing dead cards...")

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
                if (p1_actives[i].turns_till_active == 0) {
                    damageCard(2, i, p1_actives[i].dmg, false);
                    //POISON
                    if (p1_actives[i].effect && p1_actives[i].effect.poisonous == 1) {
                        poisonCard(2, i);
                    }
                } else {
                    p1_actives[i].turns_till_active -= 1;
                }
            } else {
                if (p1_actives[i].turns_till_active == 0) {
                    damagePlayer(2, p1_actives[i].dmg);
                } else {
                    p1_actives[i].turns_till_active -= 1;
                }
            }
        }
    }

    for (let i = 0; i < p2_actives.length; i++) {
        if (p2_actives[i].name !== "empty") {
            if (p1_actives[i].name !== "empty") {
                if (p2_actives[i].turns_till_active == 0) {
                    damageCard(1, i, p2_actives[i].dmg, false);
                    //POISON
                    if (p2_actives[i].effect && p2_actives[i].effect.poisonous == 1) {
                        poisonCard(1, i);
                    }
                } else {
                    p2_actives[i].turns_till_active -= 1;
                }


            } else {
                if (p2_actives[i].turns_till_active == 0) {
                    damagePlayer(1, p2_actives[i].dmg);
                } else {
                    p2_actives[i].turns_till_active -= 1;
                }
            }
        }
    }

    removeDeadCards();
}

function endTurn() {

    for (let i = 0; i < p1_actives.length; i++) {
        if (p1_actives[i].turns_till_active == 0) {
            console.log("ANIM")
            p1_actives_element[i].classList.add("attacking-card-p1");
        }
    }

    for (let i = 0; i < p2_actives.length; i++) {
        if (p2_actives[i].turns_till_active == 0) {
            console.log("ANIM")
            p2_actives_element[i].classList.add("attacking-card-p2");
        }
    }

    p1_turn = !p1_turn;
    if (curr_selected_card != null) {
        curr_selected_card_element.id = "";
        curr_selected_card = null;
        ability_display_p1.classList.remove("ability-display-active");
        ability_display_p2.classList.remove("ability-display-active");
        if (p1_turn) {
            p2_remove.classList.remove("glow");
        } else {
            p1_remove.classList.remove("glow");
        }
    }

    if (p1_turn == true) {
        end_turn_button.id = "no-button";
        p1_overlay.classList.remove("overlay-active");
    } else {
        end_turn_button.id = "no-button";
        p2_overlay.classList.remove("overlay-active");
    }

    setTimeout(() => {

        if (p1_turn == true) {
            end_turn_button.id = "end-turn-button-p1";
            p2_overlay.classList.add("overlay-active");
            dealCardsOnHand(1);
        } else {
            end_turn_button.id = "end-turn-button-p2";
            p1_overlay.classList.add("overlay-active");
            dealCardsOnHand(2);
        }


        checkActiveStatus(1);
        checkActiveStatus(2);
        startAttacks();



        //if (turn_count > 0) {
        //    startAttacks();
        //}
        applyPoison();
        turn_count++;
        document.title = `TURN ${turn_count}: WILDLIFE WARRIORS`;

    }, 500);
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

function damageCard(player, slot, damage, is_counter_damage) {
    let current_card;
    let other_player;

    if (player == 1) {
        current_card = p1_actives[slot];
        other_player = 2;
    } else {
        current_card = p2_actives[slot];
        other_player = 1;
    }

    current_card.hp -= damage;

    //damage other card
    //if (is_counter_damage == false) {
    //    damageCard(other_player, slot, p2_actives[slot].damage, true);
    //}

    //if (current_card.effect && current_card.effect.poisonous != 0)
    //    poisonCard(other_player, slot);

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
            if (current_actives[i].turns_till_active == 0 && current_actives[i].is_grey == false) {
                if (current_actives[i].poison == false) {
                    current_actives_e[i].outerHTML = `

                    <div class="active-card-game-actives p${player}_actives">
                        <h1 class="active-name-game">${current_actives[i].name}</h1>
                        <div class="flex-center">
                            <img class="active-sprite-game" src="../img/cards/${current_actives[i].sprite}" alt="${current_actives[i].name}">
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

                    <div class="active-card-game-actives p${player}_actives">
                        <h1 style="color: #14a02e;" class="active-name-game">${current_actives[i].name}</h1>
                        <div class="flex-center">
                            <img class="active-sprite-game" src="../img/cards/${current_actives[i].sprite}" alt="${current_actives[i].name}">
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
                }



            } else {
                if (current_actives[i].poison == false) {
                    current_actives_e[i].outerHTML = `

                        <div class="active-card-game-actives p${player}_actives opacity-low">
                            <h1 class="active-name-game">${current_actives[i].name}</h1>
                            <div class="flex-center">
                                <img class="active-sprite-game" src="../img/cards/${current_actives[i].sprite}" alt="${current_actives[i].name}">
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
                    <div class="active-card-game-actives p${player}_actives opacity-low">
                            <h1 style="color: #14a02e;" class="active-name-game">${current_actives[i].name}</h1>
                            <div class="flex-center">
                                <img class="active-sprite-game" src="../img/cards/${current_actives[i].sprite}" alt="${current_actives[i].name}">
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
                }

            }

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
                p1_remove.classList.remove("glow");
                p1_orbs -= curr_selected_card.cost;
            } else {
                p2_actives = current_actives;
                p2_hand[curr_selected_hand_slot] = no_card;
                for (let i = 0; i < p2_actives_element.lengthq; i++) {
                    p2_actives_element[i].classList.remove("glow");
                }
                p2_remove.classList.remove("glow");
                p2_orbs -= curr_selected_card.cost;
            }

            console.log(curr_selected_card);

            if (curr_selected_card.effect) {
                if (curr_selected_card.effect.active_on_place) {
                    applyEffect(player, active_slot);
                    console.log(curr_selected_card.effect.active_on_place);
                }
            }


            curr_selected_card = null;
            curr_selected_hand_slot = null;
            ability_display_p1.classList.remove("ability-display-active");
            ability_display_p2.classList.remove("ability-display-active");

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

    if (curr_selected_card_element != null)
        curr_selected_card_element.id = "";

    if (player == 1 && p1_turn == true) {
        if (p1_orbs >= p1_hand[slot].cost) {
            curr_selected_card = p1_hand[slot];
            curr_selected_hand_slot = slot;
            curr_selected_card_element = p1_hand_element[slot];
            letElementsGlow(p1_actives_element);
            p1_remove.classList.add("glow");
            if (curr_selected_card.effect) {
                ability_display_p1.classList.add("ability-display-active");
                ability_display_p1.innerHTML = `
                    <h1>${curr_selected_card.effect.name}</h1>
                    <p>${curr_selected_card.effect.description}</p>
                `
            } else {
                ability_display_p1.classList.remove("ability-display-active");
            }
        }
    } else if (player == 2 && p1_turn == false) {
        if (p2_orbs >= p2_hand[slot].cost) {
            curr_selected_card = p2_hand[slot];
            curr_selected_hand_slot = slot;
            curr_selected_card_element = p2_hand_element[slot];
            letElementsGlow(p2_actives_element);
            p2_remove.classList.add("glow");
            if (curr_selected_card.effect) {
                ability_display_p2.classList.add("ability-display-active");
                ability_display_p2.innerHTML = `
                    <h1>${curr_selected_card.effect.name}</h1>
                    <p>${curr_selected_card.effect.description}</p>
                `
            } else {
                ability_display_p2.classList.remove("ability-display-active");
            }
        }
    }

    if (curr_selected_card != null)
        curr_selected_card_element.id = "curr-selected-card";
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

function chooseRandomDeckCard(player, slot) {
    let current_deck;
    let random_card;
    if (player == 1) {
        current_deck = p1_deck;
    } else {
        current_deck = p2_deck;
    }

    random_card = Math.floor(Math.random() * current_deck.length);
    if (turn_count > 0 || slot != 0) {
        return random_card;
    } else {
        if (cards[random_card].cost <= 3) {
            return random_card;
        } else {
            return 0;
        }
    }
}

function dealCardsOnHand(player) {
    let current_hand;
    if (player == 1) {
        current_hand = p1_hand;
        p1_orbs += p1_orbs_gain;
        if (p1_orbs > max_orbs) {
            p1_orbs = max_orbs;
        }
    } else {
        current_hand = p2_hand;
        p2_orbs += p2_orbs_gain;
        if (p2_orbs > max_orbs) {
            p2_orbs = max_orbs;
        }
    }

    for (let i = 0; i < current_hand.length; i++) {
        if (current_hand[i].name === "empty") {
            placeCardOnHand(player, chooseRandomDeckCard(player, i));
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
        p1_orbs_element.innerHTML = p1_orbs;
    } else {
        current_hand_e = p2_hand_element;
        current_hand = p2_hand;
        p2_orbs_element.innerHTML = p2_orbs;
    }

    for (let i = 0; i < current_hand.length; i++) {
        if (current_hand[i].name !== "empty") {
            current_hand_e[i].outerHTML = `

            <div onclick="selectCard(${player}, ${i})" id="" class="active-card-game p${player}_hand">
                <h1 class="active-name-game">${current_hand[i].name}</h1>
                <div class="flex-center">
                    <img class="active-sprite-game" src="../img/cards/${current_hand[i].sprite}" alt="${current_hand[i].name}">
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

window.onbeforeunload = function () {
    if (p1_hp > 0 && p2_hp > 0)
        return "U sure?";
};