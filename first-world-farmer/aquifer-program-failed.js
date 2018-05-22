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

// initialize firebase
let config = {
    apiKey: "AIzaSyDYpgmTv_ZcPJP30f9xBzvcWntDu0tsbzQ",
    authDomain: "aquifers-apes.firebaseapp.com",
    databaseURL: "https://aquifers-apes.firebaseio.com",
    projectId: "aquifers-apes",
    storageBucket: "aquifers-apes.appspot.com",
    messagingSenderId: "934515228705"
};
firebase.initializeApp(config);

let database = {
    names: firebase.database().ref("teams")
};
// firebase.database.enableLogging(message => {console.log("[FIREBASE]", message);});







// sync down from server
let names = [];
database.names.on("value", snapshot => {names = snapshot.val();console.log(names)});


let season = 1;
let aquiferLevel = 100;

/*ref.once('value').then(function(snap) {
    var array = snap.val();
    for (var i in array) {
        var value = array[i]
        console.log(value);
        if (value == 'whatever') { ... }
    }
});*/

$(document).ready(() => {
    // hide main game until registry is done
    $("#main").hide();

    // update ol with existing names on load
    database.names.once("value").then(snapshot => {
        let array = snapshot.val();
        for (let i in array) {
            let item = array[i];
            let newName = "<li>" + item + "</li>";
            $("#name-list").append(newName);
        }
    });

    $("#add-name-button").click(() => {
        let name = $("#name-box").val();

        if (!name || name.length == 0 || /^\s*$/.test(name)) {                  // name is blank or whitespace
            $("#name-box").val("");                                             // clear whitespace
            return;
        }

        let nameTaken = false;
        database.names.once("value").then(snapshot => {
            let array = snapshot.val();
            for (let i in array) {
let item = array[i];
                if (item == name) {
                    nameTaken = true;
                    alert("Sorry. That name is already taken. Please try another one.");
                    return;
                }
            }
            callback();
        });
        
        function callback() {
            if (!nameTaken) {
                database.names.push(name);
    
                let newName = "<li>" + name + "</li>";
                $("#name-list").append(newName);
            }
        }

        $("#name-box").val("");
    });


    $("#done-name-button").click(() => {
        database.names.once("value").then(snapshot => {
            let array = snapshot.val();
            if (names) {
                $("#player-registry").hide();
                $("#main").show();
            }
            else {
                alert("No teams have entered yet.");
            }
        });
        if (names.length > 0) {
            $("#player-registry").hide();
            $("#main").show();
            // startGame();

        }
    });

    // puts data from firebase into points array
    // database.names.on("child_added", point => {
    //     names.push(point.val());
    // });
});