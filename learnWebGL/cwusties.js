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




const canvas = $("#canvas").get(0);
const $canvas = $("#canvas");
let canvasWidth = 720;                                                          // 16:9 ratio
let canvasHeight = 405;
const bgColour = "#ffdbe2";   // make sure to match with html window colour & css stylings

var scene, camera, mainLight, ambientLight, controls, renderer;
var sphereGeometry, cylinderGeometry, wireMaterial;
var whiteMaterial, greyMaterial, blackMaterial, redMaterial, blooMaterial;
// var boxGeometry, kyoob;

var atomArray = [];         // will store all the atoms
var currentAtom;
















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
    if (camera) {                                       // this is a hacky way of preventing this from running on function call
        camera.aspect = canvasWidth / canvasHeight;     // from $(document).ready, since camera isn't defined at that point
        camera.updateProjectionMatrix();                // we could have just done something like "var initialised = false",
        renderer.setSize(canvasWidth, canvasHeight);    // but i didn't want to waste memory                        -audrey
    }
}












var bondLengths = [
{
    name: "hydrogen",
    hydrogen: [74],     // bond lengths should be in the form [single, double, triple]
    fluorine: [92],
    chlorine: [127],
    bromine:  [141],
    iodine:   [161],
    oxygen:   [96],
    silicon:  [148],
    carbon:   [109]
},
{
    name: "oxygen",
    hydrogen:   [96],
    phosphorus: [160],
    oxygen:     [148, 121],
    sulfur:     [151],
    fluorine:   [142],
    chlorine:   [164],
    bromine:    [172],
    iodine:     [194]
},
{
    name: "silicon",
    hydrogen:   [148],
    silicon:    [234],
    oxygen:     [161],
    sulfur:     [210],
    fluorine:   [156],
    chlorine:   [204],
    bromine:    [216],
    iodine:     [240]
},
{
    name: "carbon",
    hydrogen:   [109],
    carbon:     [154, 134, 121],
    silicon:    [186],
    nitrogen:   [147, 127, 115],
    oxygen:     [143, 123, 113],
    phosphorus: [187],
    sulfur:     [181],
    fluorine:   [133],
    chlorine:   [177],
    bromine:    [194],
    iodine:     [213]
},
{
    name: "nitrogen",
    hydrogen:   [101],
    nitrogen:   [146, 122, 110],
    phosphorus: [177],
    oxygen:     [144, 120, 106],
    fluorine:   [139],
    chlorine:   [191],
    bromine:    [214],
    iodine:     [222]
},
{
    name: "phosphorus",
    hydrogen:   [142],
    silicon:    [227],
    phosphorus: [221],
    fluorine:   [156],
    chlorine:   [204],
    bromine:    [222],
    iodine:     [246]
},
{
    name: "sulfur",
    hydrogen: [134],
    sulfur:   [204],
    fluorine: [158],
    chlorine: [201],
    bromine:  [225],
    iodine:   [234]
},
{
    name: "fluorine",
    fluorine: [143],
    chlorine: [166],
    bromine:  [178],
    iodine:   [187]
},
{
    name: "chlorine",
    chlorine: [199],
    bromine:  [214],
    iodine:   [243]
},
{
    name: "bromine",
    bromine: [228],
    iodine:  [248],
},
{
    name: "iodine",
    iodine: [266]
}
];




const periodicTable = [];

function PrdcElmt(name, bonds, bondLength, radius) {
    this.name = name;
    this.possibleBonds = bonds;
    this.bondLength = bondLength; // TODO replace with object
    this.atomicRadius = radius; //in amu
}
//note: bond length not yet accounted for, radius in progress (pm)
//for radius, referring to http://periodictable.com/Properties/A/AtomicRadius.v.html
//finished first column for radius as of 5:08 may 31

// elements 1-10
periodicTable.push(new PrdcElmt("hydrogen",     1, null, 53));
periodicTable.push(new PrdcElmt("helium",       0, null, 31));
periodicTable.push(new PrdcElmt("lithium",      1, null, 167));
periodicTable.push(new PrdcElmt("beryllium",    2, null, 112));
periodicTable.push(new PrdcElmt("boron",        3, null, 87));
periodicTable.push(new PrdcElmt("carbon",       4, null, 67));
periodicTable.push(new PrdcElmt("nitrogen",     3, null, 56));
periodicTable.push(new PrdcElmt("oxygen",       2, null, 48));
periodicTable.push(new PrdcElmt("fluorine",     1, null, 42));
periodicTable.push(new PrdcElmt("neon",         0, null, 38));

//elements 11-20
periodicTable.push(new PrdcElmt("sodium",       1, null, 227));
periodicTable.push(new PrdcElmt("magnesium",    2, null, 145));
periodicTable.push(new PrdcElmt("aluminium",    3, null, 118));
periodicTable.push(new PrdcElmt("silicon",      4, null, 111));
periodicTable.push(new PrdcElmt("phosphorus",   3, null, 98));
periodicTable.push(new PrdcElmt("sulfur",       2, null, 88));
periodicTable.push(new PrdcElmt("chlorine",     1, null, 79));
periodicTable.push(new PrdcElmt("argon",        1, null, 71));
periodicTable.push(new PrdcElmt("potassium",    1, null, 243));
periodicTable.push(new PrdcElmt("calcium",      2, null, 194));

// //elements 21-39
// periodicTable.push(new PrdcElmt("scandium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("titanium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("vanadium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("chromium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("manganese", 2, 20, 5));
// periodicTable.push(new PrdcElmt("iron", 2, 20, 5));
// periodicTable.push(new PrdcElmt("cobalt", 2, 20, 5));
// periodicTable.push(new PrdcElmt("nickel", 2, 20, 5));
// periodicTable.push(new PrdcElmt("copper", 2, 20, 5));


//elements 30-40
periodicTable.push(new PrdcElmt("zinc",         2, null, 142));
periodicTable.push(new PrdcElmt("gallium",      3, null, 136));
periodicTable.push(new PrdcElmt("germanium",    4, null, 125));
periodicTable.push(new PrdcElmt("arsenic",      3, null, 114));
periodicTable.push(new PrdcElmt("selenium",     2, null, 103));
periodicTable.push(new PrdcElmt("bromine",      1, null, 94));
periodicTable.push(new PrdcElmt("krypton",      0, null, 88));
periodicTable.push(new PrdcElmt("rubidium",     1, null, 265));
periodicTable.push(new PrdcElmt("strontium",    2, null, 219));

//elements 39-47
// periodicTable.push(new PrdcElmt("yttrium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("zirconium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("niobium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("molybdenum", 2, 20, 5));
// periodicTable.push(new PrdcElmt("technetium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("ruthenium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("rhodium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("palladium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("silver", 2, 20, 5));

//element 48-56
periodicTable.push(new PrdcElmt("cadmium",      2, null, 161));
periodicTable.push(new PrdcElmt("indium",       3, null, 156));
periodicTable.push(new PrdcElmt("tin",          4, null, 145));
periodicTable.push(new PrdcElmt("antimony",     3, null, 133));
periodicTable.push(new PrdcElmt("tellurium",    2, null, 123));
periodicTable.push(new PrdcElmt("iodine",       1, null, 115));
periodicTable.push(new PrdcElmt("xenon",        0, null, 108));
periodicTable.push(new PrdcElmt("caesium",      1, null, 300));
periodicTable.push(new PrdcElmt("barium",       2, null, 253));

// //elements 57-71
// periodicTable.push(new PrdcElmt("lanthanum", 2, 20, 5));
// periodicTable.push(new PrdcElmt("cerium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("praseodymium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("neodymium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("promethium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("samarium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("europium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("gadolinium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("terbium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("dysprosium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("holmium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("erbium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("thulium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("ytterbium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("lutetium", 2, 20, 5));

// //elements 72-79
// periodicTable.push(new PrdcElmt("hafnium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("tantalum", 2, 20, 5));
// periodicTable.push(new PrdcElmt("tungsten", 2, 20, 5));
// periodicTable.push(new PrdcElmt("rhenium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("osmium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("iridium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("platinum", 2, 20, 5));
// periodicTable.push(new PrdcElmt("gold", 2, 20, 5));

//elements 80-88
periodicTable.push(new PrdcElmt("mercury",     2, null, 171));
periodicTable.push(new PrdcElmt("thallium",    3, null, 156));
periodicTable.push(new PrdcElmt("lead",        4, null, 154));
periodicTable.push(new PrdcElmt("bismuth",     3, null, 143));
periodicTable.push(new PrdcElmt("polonium",    2, null, 135));
periodicTable.push(new PrdcElmt("astatine",    1, null, 127));
periodicTable.push(new PrdcElmt("radon",       0, null, 120));

// bottom row -> molecules by collision
// periodicTable.push(new PrdcElmt("francium", 1, 20, 5));
// periodicTable.push(new PrdcElmt("radium", 2, 20, 5));

// //elements 89-103
// periodicTable.push(new PrdcElmt("actinium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("thorium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("protactinium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("uranium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("neptunium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("plutonium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("americium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("curium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("berkelium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("californium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("einsteinium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("fermium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("mendelevium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("nobelium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("lawrencium", 2, 20, 5));

// //elements 104-111
// periodicTable.push(new PrdcElmt("rutherfordum", 2, 20, 5));
// periodicTable.push(new PrdcElmt("dubnium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("seaborgium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("bohrium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("hassium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("meitnerium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("darmstadtium", 2, 20, 5));
// periodicTable.push(new PrdcElmt("roentgenium", 2, 20, 5));

function putBondsInTable() {
    for (let item of periodicTable) {
        for (let lengths of bondLengths) {
            if (lengths.name == item.name) {
                item.bondLength = lengths;
            }
        }
    }
}

function getMaxBonds(atom, bondingTo) {
    for (let item of bondLengths){
        if (item.name == atom){
            if (item[bondingTo]) {                  // check if the second element exists in the object of the first element
                return item[bondingTo].length;      // if so, return the max number of bonds it can make to that element
            }
            else {
                console.error("error: there is no data on " + atom + " bonding to " + bondingTo);
                return false;
            }
        }
    }
    console.error("nah bwuh das cwusti. theh's no data on " + atom);
    return false;
}























































function drawAxes() {
    const blueMaterial = new THREE.LineBasicMaterial({color: 0x0000ff});
    const greenMaterial = new THREE.LineBasicMaterial({color: 0x00ff00});
    const redMaterial = new THREE.LineBasicMaterial({color: 0xff0000});

    const xLineGeometry = new THREE.Geometry();
    xLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    xLineGeometry.vertices.push(new THREE.Vector3(1000, 0, 0));

    const yLineGeometry = new THREE.Geometry();
    yLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    yLineGeometry.vertices.push(new THREE.Vector3(0, 1000, 0));

    const zLineGeometry = new THREE.Geometry();
    zLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    zLineGeometry.vertices.push(new THREE.Vector3(0, 0, 1000));

    const xAxis = new THREE.Line(xLineGeometry, blueMaterial);
    const yAxis = new THREE.Line(yLineGeometry, greenMaterial);
    const zAxis = new THREE.Line(zLineGeometry, redMaterial);

    scene.add(xAxis);
    scene.add(yAxis);
    scene.add(zAxis);
}




function initialise() {

    // data
    putBondsInTable();




	scene = new THREE.Scene();

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

    controls = new THREE.OrbitControls(camera);

    drawAxes();




	sphereGeometry = new THREE.SphereGeometry(150, 32, 32);

	wireMaterial = new THREE.MeshBasicMaterial({color: 0x66ff66, wireframe: true});
	whiteMaterial = new THREE.MeshLambertMaterial({color: 0xbbbbbb});
	greyMaterial = new THREE.MeshLambertMaterial({color: 0x888888});
	blackMaterial = new THREE.MeshPhongMaterial({color: 0x222222});
	blooMaterial = new THREE.MeshLambertMaterial({color: 0x4444ff});
	redMaterial = new THREE.MeshLambertMaterial({color: 0xff2222});




    atomArray.push(new Atom(0, 0, 0, "carbon"));
    currentAtom = atomArray[atomArray.length - 1];                              // current atom is last in array

    if (atomArray.length > 0) {
        for (let item of atomArray) {
            item.create();
        }
    }




	renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
	renderer.setSize(canvasWidth, canvasHeight);

	canvas.appendChild(renderer.domElement);++++++++++++++++++++++++++++++++++++++++++++
}




function animate() {
    // update Three.js tools
	controls.update();
	renderer.render(scene, camera);

    // recursive loop
    window.requestAnimationFrame(animate);
}




$(document).ready(function() {
    // event listeners
    $(window).resize(resizeCanvas);
    $("#addAtom").on("click", function() {newAtom(400, 0, 0)});
    $("#clearCanvas").on("click", clearDrawing);
    $(document).keypress(function(event) {
        if (event.which == 13) {
            atomArray[1].moov(0, 100, 0);
        }
    });

    // run at start
    resizeCanvas();                                                             // resize canvas on start
    initialise();
    animate();
});

function connectAtoms() {
    for (let item of atomArray) {
        
    }
}

function newAtom(x, y, z) {
    let xPos = currentAtom.x + currentAtom.radius + x;
    let yPos = currentAtom.y + currentAtom.radius + y;
    let zPos = currentAtom.z + currentAtom.radius + z;
    atomArray.push(new Atom(xPos, yPos, zPos, "carbon"));
    currentAtom = atomArray[atomArray.length - 1];                              // set to last in array
    currentAtom.create();
    connectAtoms();
}


function clearDrawing() {
    // clear data
    atomArray = [];
    scene.children = [];

    // reset lights and base atom
    drawAxes();
    scene.add(mainLight);
    scene.add(ambientLight);
    currentAtom = new Atom(0, 0, 0, "carbon");
    currentAtom.create();
}


function Atom(x, y, z, element) {
    this.mesh;
    this.x = x;
    this.y = y;
    this.z = z;
    this.element = element;
    this.colour = blackMaterial;
    this.radius = 0;            // radius of nucleus
    this.possibleBonds = 1;     // maximum number of bonds the atom can make
    this.currentBonds = [];     // atoms this is currently bonded to (use this.currentBonds.length)

    this.setElement = function(newElement) {
        this.element = newElement;

        // radius is a function of element?
        if (newElement == "carbon") {
            this.radius = 1;
            this.colour = blackMaterial;
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

    this.setPosition = function(xPos, yPos, zPos) {
        this.x = xPos;
        this.y = yPos;
        this.z = zPos;
        this.mesh.position.set(xPos, yPos, zPos);
    };

    this.moov = function(xDir, yDir, zDir) {
        this.mesh.translateX(xDir);
        this.mesh.translateY(yDir);
        this.mesh.translateZ(zDir);
    };

    this.create = function() {
        this.setElement("carbon");
        this.mesh = new THREE.Mesh(sphereGeometry, this.colour);
        this.mesh.scale.set(this.radius, this.radius, this.radius);
        this.mesh.position.set(this.x, this.y, this.z);
        scene.add(this.mesh);
    };
}