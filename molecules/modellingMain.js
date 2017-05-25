/*
       document : modellingMain.js, for molecules in shasta-projects
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

/* global $ THREE */




var i = 0;
var canvas = $("#canvas").get(0);
var $canvas = $("#canvas");
var canvasWidth = 720;                                                          // 16:9 ratio
var canvasHeight = 405;
var bgColour = "#ffdbe2";   // make sure to match with html window colour & css stylings

var scene, camera, renderer;
var geometry, material, mesh;
















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
    if (camera) {
        camera.aspect = canvasWidth / canvasHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasWidth, canvasHeight);
    }
}
















function initialise() {
	scene = new THREE.Scene();

    // canvasWidth and canvasHeight should be properly set by now from resizeCanvas()
	camera = new THREE.PerspectiveCamera(10, canvasWidth / canvasHeight, 1, 10000);
	camera.position.z = 9000;



	geometry = new THREE.BoxGeometry(200, 200, 200);
	material = new THREE.MeshBasicMaterial({color: 0xcc0066, wireframe: true});

	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);




	renderer = new THREE.WebGLRenderer();
	renderer.setSize(canvasWidth, canvasHeight);

	canvas.appendChild(renderer.domElement);
}




function animate() {
	requestAnimationFrame(animate);

	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;
	mesh.rotation.z += 0.03;

	renderer.render(scene, camera);
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