/*
       document : canvasData.js, for molecules in shasta-projects
     created on : wednesday, february 14, 2018, 15:16 pm
         author : audrey bongalon
    description : stores assorted stuff that has to do with modifying the canvas
                  originally from main.js (formerly modellingMain.js)


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

/* global $ threeData */


const canvasData = {
    width: 720,             // 16:9 ratio, placeholder value
    height: 405,
    bgColour: "#ccffff",    // make sure to match with html window colour & css stylings

    resize() {
        // begin by setting the variables, assuming it isn't too tall
        this.width = Math.floor($("#canvas").parent().width());
        this.height = Math.floor(this.width * (9 / 16));                        // 16:9 ratio
    
        const top = $("#above-canvas").height();
        const bottom = $("#below-canvas").height();
        const winht = $(window).height();
    
        // if it's too tall, reset the values
        if (top + this.height + bottom > winht) {
            this.height = Math.floor(winht - (top + bottom));                   // set height to max height of canvas
            this.width = Math.floor(this.height * (16 / 9));                    // scale width to 16:9 ratio
        }
    
        // resize the div
        $("#canvas").css({width: this.width + "px", height: this.height + "px"});
    
        // resize #below-canvas so that its contents line up
        $("#below-canvas").css({width: this.width + "px"});
    
        // resize within Three.js
        threeData.updateCameraRatio(this.width, this.height);
    }
};