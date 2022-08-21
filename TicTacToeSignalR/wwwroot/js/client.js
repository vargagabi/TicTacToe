
"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/mainhub").build();

connection.start();


//Is it x's turn? just to see if we need to put X or O
let xNext = true;
//Is it the current client's turn?
let yourTurn;
//The name of the user: X or O
let user;
//The clients connection id
let myConnectionId;
//the connection list HTML select element
let connList = document.getElementById("ConnectionList");
//selected opponent
let opponent = undefined;


console.log(connList.selectedIndex);

connList.addEventListener("click", function(){
    opponent = connList.options[connList.selectedIndex].value;
    console.log(opponent);
});
console.log("opponent:");
console.log(opponent);

document.getElementById("submitButton").addEventListener("click", function (event) {
    console.log("Start Game");
    if (opponent == undefined)
        return;
    connection.invoke("InitGameWithClient", opponent, myConnectionId).catch(function (err) {
        return console.error(err.toString());
    })
    event.preventDefault();
})

connection.on("ClearBoard", function () {
    for (let i = 0; i < 9; i++) {
        document.getElementById("button_" + i).innerText = i + 1;
    }
    document.getElementById("Score").textContent = '';
    xNext = true;
    disableAll(false);
})
connection.on("GetOpponentId", function (opponentId) {
    opponent = opponentId;

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

//Add click event linteners to the tiles
for (let i = 0; i < 9; i++) {
    document.getElementById("button_" + i).addEventListener("click", function () {
        if (!yourTurn) {
            return;
        }
        connection.invoke("SendMoveToClient",opponent, user, i).catch(function (err) {
            return console.error(err.toString());
        })
        xNext = !xNext;
    })
}

//Check if there is a winner
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

//At the end of the game disable all tiles or enable all of them
function disableAll(isDisabled) {
    for (let i = 0; i < 9; i++) {
        document.getElementById("button_" + i).disabled = isDisabled;
    }
}



//Get the current client's connection id
connection.on("MyConnectionId", function (MyConnId) {
    myConnectionId = MyConnId;
})

//When an user connects refresh the user's and other user's list of connection ids
connection.on("UserConnected", function (connectionIds) {
    console.log("CONNECTED:");
    let list = document.getElementById("ConnectionList");
    list.innerHTML = '<option disabled selected value="0">Connected Users</option>';
    console.log(connectionIds);
    for (let i in connectionIds) {
        let option = document.createElement("option");
        option.value = connectionIds[i];
        option.text = connectionIds[i] == myConnectionId ? "Me" : connectionIds[i];
        if (connectionIds[i] == myConnectionId) {
            option.disabled = true;
        }
        list.add(option);
    }

});

//When an user disconnect refresh the other user's list of connection ids
connection.on("UserDisconnected", function (connectionIds) {
    console.log("DISCONNECTED:")
    console.log(connectionIds);
    let list = document.getElementById("ConnectionList");
    list.innerHTML = '<option disabled selected value="0">Connected Users</option>';
    for (let i in connectionIds) {
        let option = document.createElement("option");
        option.value = connectionIds[i];
        option.text = connectionIds[i] == myConnectionId ? "Me" : connectionIds[i];
        list.add(option);
    }

});





