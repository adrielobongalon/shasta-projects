/*
                                                                                                          88
                                                                                                          88
                                                                                                          88
       document : modellingMain.js, for molecules in shasta-projects    ,adPPYYba,  88       88   ,adPPYb,88  8b,dPPYba,   ,adPPYba,  8b       d8
     created on : thursday, may 18, 2017, 09:09 am                      ""     `Y8  88       88  a8"    `Y88  88P'   "Y8  a8P,,,,,88  `8b     d8'
         author : audrey bongalon                                       ,adPPPPP88  88       88  8b      :88  88          8PP"""""""   `8b   d8'
    description : main javascript file for the modelling program        88,    ,88  "8a,   ,a88  "8a,   ,d88  88          "8b,   ,aa    `8b,d8'
                                                                        `"8bbdP"Y8   `"YbbdP'Y8   `"8bbdP"Y8  88           `"Ybbd8"'      Y88'
                                                                                                                                          d8'
                                                                                                                                         d8'
      88                       88                                                   88                       88             
      88                       88                                                   88                       ""             
      88                       88                                                   88                                      
      88,dPPYba,    ,adPPYba,  88   ,adPPYba,  8b,dPPYba,                ,adPPYba,  88,dPPYba,   8b,dPPYba,  88  ,adPPYba,  
      88P'    "8a  a8P,,,,,88  88  a8P,,,,_88  88P'   `"8a              a8"     ""  88P'    "8a  88P'   "Y8  88  I8(    ""  
      88       88  8PP"""""""  88  8PP"""""""  88       88              8b          88       88  88          88   `"Y8ba,   
      88       88  "8b,   ,aa  88  "8b,   ,aa  88       88              "8a,   ,aa  88       88  88          88  aa    )8I  
      88       88   `"Ybbd8"'  88   `"Ybbd8"'  88       88               `"Ybbd8"'  88       88  88          88  `"YbbdP"'

*/

/* global $ THREE */




var i = 0;
var canvas = $("#canvas").get(0);
var $canvas = $("#canvas");
var canvasWidth = 720;                                                          // 16:9 ratio
var canvasHeight = 405;
var bgColour = "#ffdbe2";   // make sure to match with html window colour & css stylings

var scene, camera, renderer;
var boxGeometry, sphereGeometry, wireMaterial;

var kyoob, sphere;
















//      ----------------
//      |    jQuery    |
//      ----------------

function resizeCanvas() {

    // begin by setting the variables, assuming it isn't too tall
    canvasWidth = Math.floor($canvas.parent().width());
    canvasHeight = Math.floor(canvasWidth * (9 / 16));                          // 16:9 ratio

    var top = $("#above-canvas").height();
    var bottom = $("#below-canvas").height();
    var winht = $(window).height();

    // if it's too tall, reset the values
    if (top + canvasHeight + bottom > winht) {
        canvasHeight = Math.floor(winht - (top + bottom));                      // set height to max height of canvas
        canvasWidth = Math.floor(canvasHeight * (16 / 9));                      // scale width to 16:9 ratio
    }

    // resize the div
    $canvas.css({width: canvasWidth + "px"});
    $canvas.css({height: canvasHeight + "px"});

    // resize within Three.js
    if (camera) {                                       // this is a hacky way of preventing this from running on function call
        camera.aspect = canvasWidth / canvasHeight;     // from $(document).ready, since camera isn't defined at that point
        camera.updateProjectionMatrix();                // we could have just done something like "var initialised = false",
        renderer.setSize(canvasWidth, canvasHeight);    // but i didn't want to waste memory                        -audrey
    }
}
















function initialise() {
	scene = new THREE.Scene();

    // canvasWidth and canvasHeight should be properly set by now from resizeCanvas()
	camera = new THREE.PerspectiveCamera(10, canvasWidth / canvasHeight, 1, 10000);
	camera.position.z = 9000;




	boxGeometry = new THREE.BoxGeometry(200, 200, 200);
	sphereGeometry = new THREE.SphereGeometry(400, 32, 32);
	wireMaterial = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true});




	kyoob = new THREE.Mesh(boxGeometry, wireMaterial);
	scene.add(kyoob);

    sphere = new THREE.Mesh(sphereGeometry, wireMaterial);
    scene.add(sphere);




	renderer = new THREE.WebGLRenderer({alpha: true});
	renderer.setSize(canvasWidth, canvasHeight);

	canvas.appendChild(renderer.domElement);
}




function animate() {
	kyoob.rotation.x += 0.01;
	kyoob.rotation.y += 0.02;
	kyoob.rotation.z += 0.03;

	renderer.render(scene, camera);

    window.requestAnimationFrame(animate);
}




$(document).ready(function() {
    // event listeners
    $(window).resize(resizeCanvas);
    $("#clearCanvas").on("click", clearDrawing);

    // run at start
    resizeCanvas();                     // resize canvas on start
    initialise();
    animate();
});

function clearDrawing() {
    // clear
}
















var atomArray = [];         // will store all the atoms




function Atom(x, y, z, element) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.element = element;
    this.radius = 0;            // radius of nucleus
    this.possibleBonds = 1;     // maximum number of bonds the atom can make
    this.currentBonds = [];      // atoms this is currently bonded to (use this.currentBonds.length)

    this.setelement = function(element) {
        this.element = element;
        // radius is a function of element?
        // bond angle is a function of element and currentBonds?
    };
}

function createAtom() {
    var atom = new Atom(0, 0, 0, "carbon");
    atomArray.push(atom);
}