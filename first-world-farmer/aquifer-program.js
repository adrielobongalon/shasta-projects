/*
       document : aquifer-program.js
     created on : thursday, may 03, 2018, 12:17 am
         author : audrey bongalon
    description : for an AP Environmental Science demonstration

                                        88
                                        88
                                        88
      ,adPPYYba,  88       88   ,adPPYb,88  8b,dPPYba,   ,adPPYba,  8b       d8
      ""     `Y8  88       88  a8"    `Y88  88P'   "Y8  a8P,,,,,88  `8b     d8'
      ,adPPPPP88  88       88  8b      :88  88          8PP"""""""   `8b   d8'
      88,    ,88  "8a,   ,a88  "8a,   ,d88  88          "8b,   ,aa    `8b,d8'
      `"8bbdP"Y8   `"YbbdP'Y8   `"8bbdP"Y8  88           `"Ybbd8"'      Y88'
                                                                        d8'
                                                                       d8'
*/

/* global $ firebase */

let players = [];
let currentPlayer;
let playerTurnIndex = 0;
let season = 1;
let aquiferLevel = 10000;
let countdownStarted = false;
let countdown = 3;

class Player {
    constructor(name) {
        this.name = name;
        this.cash = 50;
    }
}

$(document).ready(() => {
    $("#main").hide();          // hide main game until registry is done
    // $("#overlay").hide();       // prevents unclickable

    $("#add-name-button").click(() => {
        let name = $("#name-box").val();
        
        if (name && name.length != 0 && !/^\s*$/.test(name)) {
            for (let item of players) {
                if (item.name == name) {
                    alert("Sorry. That name is already taken. Please try another one.");
                    $("#name-box").val("");
                    return;
                }
            }
            players.push(new Player(name));
    
            let newName = "<li>" + name + "</li>";
            $("#name-list").append(newName);
        }
        $("#name-box").val("");
    });


    $("#done-name-button").click(() => {
        if (players.length > 0) {
            $("#player-registry").hide();
            $("#main").show();

            $("#player-turn").text(players[playerTurnIndex].name);
            $("#cash").text(players[playerTurnIndex].cash);
            $("#season").text(season);
            currentPlayer = players[playerTurnIndex];

            aquiferLevel = 5000 * players.length;
        }
        else {
            alert("No players have been registered.");
        }
    });

    $("#next-player").click(() => {
        // $("#overlay").show();
        // $("#overlay").fadeIn(1500, () => {
            
            // $("#overlay").fadeOut(1500, () => {
            //     $("#overlay").hide();
            // });
        // });
        let selectedMethod = $("input[name=irrigation]:checked").val();
        if (selectedMethod == "flood") {
            currentPlayer.cash += 100;
            aquiferLevel -= 1000;
        }
        else if (selectedMethod == "spray") {
            currentPlayer.cash += 50;
            aquiferLevel -= 100;
        }
        else if (selectedMethod == "drip") {
            currentPlayer.cash += 10;
            aquiferLevel -= 10;
        }

        playerTurnIndex++;
        if (playerTurnIndex >= players.length) {
            playerTurnIndex = 0;
            season++;
        }
        nextPlayer(players[playerTurnIndex]);
    });

    $("#empty-answer-button").click(() => {
        $("#round").text((season - 3) - 1);
        $("#answer").show();
    });
});

function nextPlayer(player) {
    currentPlayer = player;

    $("#player-turn").text(player.name);
    $("#cash").text(player.cash);
    $("#season").text(season);
    $("input[name=irrigation]").first().prop("checked", true);

    if (player == players[0]) {
        if (aquiferLevel <= 0 && !countdownStarted) {
            countdownStarted = true;
            console.log("countdown started");
        }
        if (countdownStarted) {
            countdown--;
            console.log("turns left: " + countdown);
        }
        if (countdown < 0) {
            $("#aquifer-is-empty-box").show();
            $("#next-player").prop("disabled", true);
        }
    }
}