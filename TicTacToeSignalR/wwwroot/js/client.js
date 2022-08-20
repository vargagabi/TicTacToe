
"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/mainhub").build();

connection.start();



let xNext = true;
let yourTurn;
let user;
document.getElementById("submitButton").addEventListener("click", function (event) {
    console.log("Start Game");
    connection.invoke("ClearBoard").catch(function (err) {
        return console.error(err.toString());
    })
    event.preventDefault();
})
connection.on("ClearBoard", function () {
    for (let i = 0; i < 9; i++) {
        document.getElementById("button_" + i).innerText = i+1;
    }
    document.getElementById("Score").textContent = '';
    xNext = true;
    disableAll(false);
})


connection.on("UserMove", function (user, index) {
    document.getElementById("button_" + index).textContent = user;
    document.getElementById("button_" + index).disabled = true;
    check();

})
connection.on("DisableTurn", function () {
    yourTurn = false;
    document.getElementById("turn").innerText = "Enemy's turn";
})
connection.on("EnableTurn", function () {
    yourTurn = true;
    document.getElementById("turn").innerText = "Your turn"
})
connection.on("UserX", function () {
    user = 'X';
    document.getElementById("UserName").textContent = "User: X";
    yourTurn = true;
})
connection.on("UserO", function () {
    user = 'O';
    yourTurn = false;
    document.getElementById("UserName").textContent = "User: O";
})


for (let i = 0; i < 9; i++) {
    document.getElementById("button_" + i).addEventListener("click", function () {
        if (!yourTurn) {
            return;
        }
        connection.invoke("SendMove", user, i).catch(function (err) {
            return console.error(err.toString());
        })
        xNext = !xNext;
    })
}
function check() {
    console.log("checking");
    let wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    console.log(wins.length);
    for (let i = 0; i < wins.length; i++) {
        if (document.getElementById("button_" + wins[i][0]).textContent == 'X' && document.getElementById("button_" + wins[i][1]).textContent == 'X' && document.getElementById("button_" + wins[i][2]).textContent == 'X') {
            document.getElementById("Score").textContent = "THE WINNER IS X";
            disableAll(true);
        }
        if (document.getElementById("button_" + wins[i][0]).textContent == 'O' && document.getElementById("button_" + wins[i][1]).textContent == 'O' && document.getElementById("button_" + wins[i][2]).textContent == 'O') {
            document.getElementById("Score").textContent = "THE WINNER IS O";
            disableAll(true);
        }
    }
}
function disableAll(isDisabled) {
    for (let i = 0; i < 9; i++) {
        document.getElementById("button_" + i).disabled = isDisabled;
    }
}













