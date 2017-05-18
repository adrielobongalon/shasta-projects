/*
       document : modellingMain.js, for shasta-projects
     created on : thursday, may 18, 2017, 09:09 am
         author : audrey bongalon
    description : main javascript file for the modelling program

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

/* global $ */




var i = 0;
var canvas = $('#canvas').get(0);
var canvasWidth = 720;                                                          // 16:9 ratio
var canvasHeight = 405;
var bgColour = "#ffdbe2";   // make sure to match with html window colour & css stylings
















//      ----------------
//      |    jQuery    |
//      ----------------

var $canvasDiv = $("#canvas-div");

function resizeCanvas() {

    // begin by setting the variables, assuming it isn't too tall
    canvasWidth = Math.floor($canvasDiv.parent().width());
    canvasHeight = Math.floor(canvasWidth * (9 / 16));                          // 16:9 ratio

    var top = $("#above-canvas").height();
    var bottom = $("#below-canvas").height();
    var winht = $(window).height();
    console.log(bottom);


    // if it's too tall, reset the values
    if (top + canvasHeight + bottom > winht) {
        canvasHeight = Math.floor(winht - (top + bottom));                      // set height to max height of canvas
        canvasWidth = Math.floor(canvasHeight * (16 / 9));                      // scale width to 16:9 ratio
    }

    // resize the canvas
    $canvasDiv.css({width: canvasWidth + "px"});
    $canvasDiv.css({height: canvasHeight + "px"});
    $(canvas).attr("width", canvasWidth);
    $(canvas).attr("height", canvasHeight);
}




$("body").ready(function() {
    resizeCanvas();                     // resize canvas on start
    $(window).resize(resizeCanvas);     // resize canvas on window resize

    $("#clearCanvas").on("click", clearDrawing);
});

function clearDrawing() {
    // clear
}
















// what happens each "frame" of the animation
function frame() {
    // clear
    // set background colour

    // recursive function
    window.requestAnimationFrame(frame);
}

// frame();