/*
       document : rotationTest.js, for learnWebGL in shasta-projects
     created on : tuesday, july 04, 2017, 21:01 pm    (happy 'murica day)
         author : audrey
    description : for testing the rotation matrix along all 3 WORLD axes

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




//      --------------------------------------
//      |    creation of global variables    |
//      --------------------------------------

const canvas = $("#canvas").get(0);
const $canvas = $("#canvas");
let canvasWidth = 720;                                                          // 16:9 ratio
let canvasHeight = 405;
const bgColour = "#ccffff";   // make sure to match with html window colour & css stylings

var scene, camera, mainLight, ambientLight, controls, renderer;
var coneGeometry, material, mesh;
















//      ----------------
//      |    jQuery    |
//      ----------------

function resizeCanvas() {
    // begin by setting the variables, assuming it isn't too tall
    canvasWidth = Math.floor($canvas.parent().width());
    canvasHeight = Math.floor(canvasWidth * (9 / 16));                          // 16:9 ratio

    const top = $("#above-canvas").height();
    const bottom = $("#below-canvas").height();
    const winht = $(window).height();

    // if it's too tall, reset the values
    if (top + canvasHeight + bottom > winht) {
        canvasHeight = Math.floor(winht - (top + bottom));                      // set height to max height of canvas
        canvasWidth = Math.floor(canvasHeight * (16 / 9));                      // scale width to 16:9 ratio
    }

    // resize the div
    $canvas.css({width: canvasWidth + "px"});
    $canvas.css({height: canvasHeight + "px"});

    // resize within Three.js
    if (camera) {                                       // this if-statement is a hacky way of preventing this from running on the
        camera.aspect = canvasWidth / canvasHeight;     // function call from $(document).ready, since camera isn't defined at that
        camera.updateProjectionMatrix();                // point. we could have just done something like "var initialised = false",
        renderer.setSize(canvasWidth, canvasHeight);    // but i didn't want to waste memory                        -audrey
    }
}
















//      ------------------------
//      |    rotation matrix   |
//      ------------------------

// Converts from degrees to radians.
Math.radians = function(degrees) {
  return (degrees * Math.PI / 180);
};

var rotationWorldMatrix;

var xVector = new THREE.Vector3(1, 0, 0);
var yVector = new THREE.Vector3(0, 1, 0);
var zVector = new THREE.Vector3(0, 0, 1);

function rotateAroundWorldAxis(object, axis, radians) {
    rotationWorldMatrix = new THREE.Matrix4();
    rotationWorldMatrix.makeRotationAxis(axis.normalize(), radians);

    rotationWorldMatrix.multiply(object.matrix);                // pre-multiply

    object.matrix = rotationWorldMatrix;

    object.rotation.setFromRotationMatrix(object.matrix);
}




let valueX = 0;
let valueY = 0;
let valueZ = 0;

function onInput(value, isSlider, slider, numBox) {
    if (isSlider) {     // if a slider was used as the input method
        value = slider.val();
        // numBox.attr({placeholder: value, value: value});
        numBox.attr("placeholder", value);
        numBox.val(value);
    }
    else {              // if a number box was used as the input method
        value = numBox.val();
        const max = parseInt(numBox.attr("max"));
        const min = parseInt(numBox.attr("min"));
        if (value > max) {
            value = max;
            numBox.attr("placeholder", value);
            numBox.val(value);
        }
        if (value < min) {
            value = min;
            numBox.attr("placeholder", value);
            numBox.val(value);
        }
        slider.val(value);
        slider.trigger("change");
    }
    // console.log(slider.val() + ", " + numBox.val());
    return value;
}

function setRotation() {
    mesh.rotation.set(0, 0, 0);                                     // reset rotation
    rotateAroundWorldAxis(mesh, xVector, Math.radians(valueX));     // then perform the rotations
    rotateAroundWorldAxis(mesh, yVector, Math.radians(valueY));
    rotateAroundWorldAxis(mesh, zVector, Math.radians(valueZ));
}
















//      -----------------------
//      |    functionality    |
//      -----------------------

function drawAxes() {
    const blueMaterial = new THREE.LineBasicMaterial({color: 0x0000ff});
    const greenMaterial = new THREE.LineBasicMaterial({color: 0x00ff00});
    const redMaterial = new THREE.LineBasicMaterial({color: 0xff0000});

    // THIS! IS! SPARTA!! (because 300 lol)
    const xLineGeometry = new THREE.Geometry();
    xLineGeometry.vertices.push(new THREE.Vector3(-300, 0, 0));
    xLineGeometry.vertices.push(new THREE.Vector3(300, 0, 0));

    const yLineGeometry = new THREE.Geometry();
    yLineGeometry.vertices.push(new THREE.Vector3(0, -300, 0));
    yLineGeometry.vertices.push(new THREE.Vector3(0, 300, 0));

    const zLineGeometry = new THREE.Geometry();
    zLineGeometry.vertices.push(new THREE.Vector3(0, 0, -300));
    zLineGeometry.vertices.push(new THREE.Vector3(0, 0, 300));

    const xAxis = new THREE.Line(xLineGeometry, blueMaterial);
    const yAxis = new THREE.Line(yLineGeometry, greenMaterial);
    const zAxis = new THREE.Line(zLineGeometry, redMaterial);

    scene.add(xAxis);
    scene.add(yAxis);
    scene.add(zAxis);
}




function initialise() {
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
	renderer.setSize(canvasWidth, canvasHeight);

    // canvasWidth and canvasHeight should be properly set by now from resizeCanvas()
	camera = new THREE.PerspectiveCamera(10, canvasWidth / canvasHeight, 1000, 100000);
	camera.position.z = 9001;   // IT's OVER 9000!

    // lighting
    mainLight = new THREE.DirectionalLight(0x888888);
    ambientLight = new THREE.AmbientLight(0xcccccc);
    mainLight.position.set(0, 300, 500).normalize();
    ambientLight.position.set(0, 200, -500).normalize();
    scene.add(mainLight);
    scene.add(ambientLight);

    // controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    drawAxes();




	coneGeometry = new THREE.ConeGeometry(100, 300, 32);
    material = new THREE.MeshPhongMaterial({color: 0x999999});
    mesh = new THREE.Mesh(coneGeometry, material);
    scene.add(mesh);




	canvas.appendChild(renderer.domElement);
}




function animate() {
    // update Three.js tools
	controls.update();
	renderer.render(scene, camera);

    // // rotate
    // rotateAroundWorldAxis(mesh, xVector, Math.radians(valueX));
    // rotateAroundWorldAxis(mesh, yVector, Math.radians(valueY));
    // rotateAroundWorldAxis(mesh, zVector, Math.radians(valueZ));

    // recursive loop
    window.requestAnimationFrame(animate);
}
















//      -----------------
//      |    startup    |
//      -----------------

$(document).ready(function() {
    // event listeners
    $(window).resize(resizeCanvas);
    $("#sliderX").on("input", function() {
        /* okay. i know this is sloppy code, but since this is just a test file, i decided to go for a
           quick and easy fix. on the file we're actually releasing, i'll write something better. but
           basically, i wanted the values (valueX, valueY, and valueZ) to be set WITHIN onInput, but i
           can't because the parameters are copies of the values. so i just put a return statement on
           the onInput function and set the values from within these jQuery callbacks. bad readability,
           i know, but whatevs                                                                  -audrey */
        valueX = onInput(valueX, true, $("#sliderX"), $("#inputX"));
        setRotation();
    });
    $("#sliderY").on("input", function() {valueY = onInput(valueY, true, $("#sliderY"), $("#inputY")); setRotation();});
    $("#sliderZ").on("input", function() {valueZ = onInput(valueZ, true, $("#sliderZ"), $("#inputZ")); setRotation();});
    $("#inputX").on("input", function() {valueX = onInput(valueX, false, $("#sliderX"), $("#inputX")); setRotation();});
    $("#inputY").on("input", function() {valueY = onInput(valueY, false, $("#sliderY"), $("#inputY")); setRotation();});
    $("#inputZ").on("input", function() {valueZ = onInput(valueZ, false, $("#sliderZ"), $("#inputZ")); setRotation();});

    // testing rotation-reset
    $(window).on("keydown", function(event) {
        if (event.which == 82) {        // on pressing "r" on the keyboard
            mesh.rotation.set(0, 0, 0); // reset the rotation
        }
    });

    // run at start
    resizeCanvas();     // canvas must be sized on start
    initialise();
    animate();
});