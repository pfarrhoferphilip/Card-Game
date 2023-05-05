let is_draw = JSON.parse(localStorage['is_draw']);

if (is_draw == false) {
    let winner_name = localStorage['winner_name'];
    document.getElementById("head_title").innerHTML += `<span class="color-yellow">${winner_name}</span>`;
    document.title = `WINNER ${winner_name}: WILDLIFE WARRIORS`;

} else {
    document.getElementById("head_title").innerHTML = `<span class="color-yellow">DRAW</span>`
}