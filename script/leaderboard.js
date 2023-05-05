let local_leaderboard = JSON.parse(localStorage['leaderboard']);
let sorted_leaderboard = [];

drawLeaderboard();

function drawLeaderboard() {

    let html_code = `
    <table>
        <tr>
            <td>NAME</td>
            <td>TURNS</td>
        </tr>
    `;

    for (let i = 0; i < local_leaderboard.length; i++) {
        let temp = 0;;
        for (let j = 0; j < local_leaderboard.length; j++) {
            console.log("checking: " + i)
            if (i != j) {
                if (local_leaderboard[i].score > local_leaderboard[j].score) {
                    temp += 1;
                } else if (local_leaderboard[i].score == local_leaderboard[j].score) {
                    if (i > j) {
                        temp += 1;
                    }
                }
            }
        }
        sorted_leaderboard[temp] = local_leaderboard[i];
    }

    for (let i = 0; i < sorted_leaderboard.length; i++) {
        html_code += `
            <tr>
                <td style="border-color: ${sorted_leaderboard[i].color};">${sorted_leaderboard[i].name}</td>
                <td style="border-color: ${sorted_leaderboard[i].color};">${sorted_leaderboard[i].score}</td>
            </tr>
        `;
    }

    html_code += `</table>`;
    document.getElementById("leaderboard").innerHTML = html_code;

}