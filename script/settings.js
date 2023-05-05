let p1_name;
let p2_name;
let p1_color;
let p2_color;

if (localStorage['p1_name']) {
    document.getElementById("p1_name").value = localStorage['p1_name'];
    document.getElementById("p2_name").value = localStorage['p2_name'];
    document.getElementById("p1_color").value = localStorage['p1_color'];
    document.getElementById("p2_color").value = localStorage['p2_color'];
} else {
    document.getElementById("p1_name").value = "PLAYER 1";
    document.getElementById("p2_name").value = "PLAYER 2";
    document.getElementById("p1_color").value = "#14a02e";
    document.getElementById("p2_color").value = "#b4202a";
}

function setValues() {

    p1_name = document.getElementById("p1_name").value.toUpperCase();
    p2_name = document.getElementById("p2_name").value.toUpperCase();
    p1_color = document.getElementById("p1_color").value;
    p2_color = document.getElementById("p2_color").value;

    if (p1_name != "" && p2_name != "") {
        localStorage['p1_name'] = p1_name;
        localStorage['p2_name'] = p2_name;
        localStorage['p1_color'] = p1_color;
        localStorage['p2_color'] = p2_color;

        window.open("game.html", "_self");
    } else {
        document.getElementById("error").style.display = "block";
    }
}