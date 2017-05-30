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
      88,dPPYba,    ,adPPYba,  88   ,adPPYba,  8b,dPPYba,                ,adPPYba,  88,dPPYba,   8b,dPPYba,  88   ,adPPYba,  
      88P'    "8a  a8P,,,,,88  88  a8P,,,,,88  88P'   `"8a              a8"     ""  88P'    "8a  88P'   "Y8  88   I8(    ""  
      88       88  8PP"""""""  88  8PP"""""""  88       88              8b          88       88  88          88    `"Y8ba,   
      88       88  "8b,   ,aa  88  "8b,   ,aa  88       88              "8a,   ,aa  88       88  88          88   aa    )8I  
      88       88   `"Ybbd8"'  88   `"Ybbd8"'  88       88               `"Ybbd8"'  88       88  88          88   `"YbbdP"'

*/

/* global $ THREE */




var i = 0;
var canvas = $("#canvas").get(0);
var $canvas = $("#canvas");
var canvasWidth = 720;                                                          // 16:9 ratio
var canvasHeight = 405;
var bgColour = "#ffdbe2";   // make sure to match with html window colour & css stylings

var scene, camera, mainLight, ambientLight, controls, renderer;
var boxGeometry, sphereGeometry, wireMaterial, solidMaterial;

var kyoob;
















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
















function drawAxes() {
    var blueMaterial = new THREE.LineBasicMaterial({color: 0x0000ff});
    var greenMaterial = new THREE.LineBasicMaterial({color: 0x00ff00});
    var redMaterial = new THREE.LineBasicMaterial({color: 0xff0000});

    var xLineGeometry = new THREE.Geometry();
    xLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    xLineGeometry.vertices.push(new THREE.Vector3(1000, 0, 0));

    var yLineGeometry = new THREE.Geometry();
    yLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    yLineGeometry.vertices.push(new THREE.Vector3(0, 1000, 0));

    var zLineGeometry = new THREE.Geometry();
    zLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    zLineGeometry.vertices.push(new THREE.Vector3(0, 0, 1000));

    var xAxis = new THREE.Line(xLineGeometry, blueMaterial);
    var yAxis = new THREE.Line(yLineGeometry, greenMaterial);
    var zAxis = new THREE.Line(zLineGeometry, redMaterial);

    scene.add(xAxis);
    scene.add(yAxis);
    scene.add(zAxis);
}




function initialise() {
	scene = new THREE.Scene();

    // canvasWidth and canvasHeight should be properly set by now from resizeCanvas()
	camera = new THREE.PerspectiveCamera(10, canvasWidth / canvasHeight, 1000, 100000);
	camera.position.z = 9001;   // IT's OVER 9000!

    mainLight = new THREE.DirectionalLight(0x888888);
    ambientLight = new THREE.AmbientLight(0xcccccc);
    mainLight.position.set(0, 1, 5).normalize();
    ambientLight.position.set(0, 2, -5).normalize();
    scene.add(mainLight);
    scene.add(ambientLight);

    controls = new THREE.OrbitControls(camera);

    // drawAxes();




	boxGeometry = new THREE.BoxGeometry(200, 200, 200);
	sphereGeometry = new THREE.SphereGeometry(400, 32, 32);

	wireMaterial = new THREE.MeshBasicMaterial({color: 0x66ff66, wireframe: true});
	solidMaterial = new THREE.MeshLambertMaterial({color: 0xff2222});




	kyoob = new THREE.Mesh(boxGeometry, solidMaterial);
	scene.add(kyoob);




    atomArray.push(new Atom(0, 0, 0, "carbon"));

    if (atomArray.length > 0) {
        for (let item of atomArray) {
            item.create();
        }
    }




	renderer = new THREE.WebGLRenderer({alpha: true});
	renderer.setSize(canvasWidth, canvasHeight);

	canvas.appendChild(renderer.domElement);
}




function animate() {
	// the actual animation
	kyoob.rotation.x += 0.01;
	kyoob.rotation.y += 0.02;
	kyoob.rotation.z += 0.03;

    // update Three.js tools
	controls.update();
	renderer.render(scene, camera);

    // recursive loop
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
    this.mesh;
    this.x = x;
    this.y = y;
    this.z = z;
    this.element = element;
    this.radius = 0;            // radius of nucleus
    this.possibleBonds = 1;     // maximum number of bonds the atom can make
    this.currentBonds = [];     // atoms this is currently bonded to (use this.currentBonds.length)

    this.setElement = function(newElement) {
        this.element = newElement;

        // radius is a function of element?
        if (newElement == "carbon") {
            this.radius = 1;
        }
        else {
            console.error("Error: tried to set atom to \"" + newElement + "\", which is not defined in the program");
        }

        // bond angle is a function of element and currentBonds?
        if (true) {
            // angle = ?
        }
        // error was already thrown when setting radius
    };

    this.create = function() {
        this.setElement("carbon");
        this.mesh = new THREE.Mesh(sphereGeometry, wireMaterial);
        this.mesh.scale.set(this.radius, this.radius, this.radius);
        scene.add(this.mesh);
    };

    this.moov = function(xDir, yDir, zDir) {
        this.mesh.translateX(xDir);
        this.mesh.translateY(yDir);
        this.mesh.translateZ(zDir);
    };
}