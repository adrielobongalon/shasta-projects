/*
                                                                                                          88
                                                                                                          88
                                                                                                          88
       document : cwusties.js, for molecules in shasta-projects         ,adPPYYba,  88       88   ,adPPYb,88  8b,dPPYba,   ,adPPYba,  8b       d8
     created on : thursday, may 18, 2017, 09:09 am                      ""     `Y8  88       88  a8"    `Y88  88P'   "Y8  a8P,,,,,88  `8b     d8'
         author : audrey bongalon, helen so, christopher lim            ,adPPPPP88  88       88  8b      :88  88          8PP"""""""   `8b   d8'
    description : main javascript file for the modelling program        88,    ,88  "8a,   ,a88  "8a,   ,d88  88          "8b,   ,aa    `8b,d8'
                                                                        `"8bbdP"Y8   `"YbbdP'Y8   `"8bbdP"Y8  88           `"Ybbd8"'      Y88'
                                                                                                                                          d8'
                                                                                                                                         d8'
      88                       88                                                   88                       88             
      88                       88                                                   88                       ""             
      88                       88                                                   88                                      
      88,dPPYba,    ,adPPYba,  88   ,adPPYba,  8b,dPPYba,                ,adPPYba,  88,dPPYba,   8b,dPPYba,  88   ,adPPYba,  
      88P"    "8a  a8P,,,,,88  88  a8P,,,,,88  88P"   `"8a              a8"     ""  88P"    "8a  88P"   "Y8  88   I8(    ""  
      88       88  8PP"""""""  88  8PP"""""""  88       88              8b          88       88  88          88    `"Y8ba,   
      88       88  "8b,   ,aa  88  "8b,   ,aa  88       88              "8a,   ,aa  88       88  88          88   aa    )8I  
      88       88   `"Ybbd8"'  88   `"Ybbd8"'  88       88               `"Ybbd8"'  88       88  88          88   `"YbbdP"'

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

var currentModel = "ball and stick";

var scene, camera, mainLight, ambientLight, controls, mouse, raycaster, renderer;
var sphereGeometry, cylinderGeometry, skeletalMaterial, wireMaterial;

var whiteMaterial, greyMaterial, blackMaterial, redMaterial, blooMaterial, greenMaterial, darkRedMaterial,
    darkVioletMaterial, cyanMaterial, orangeMaterial, yellowMaterial, peachMaterial, violetMaterial,
    darkGreenMaterial, darkOrangeMaterial, pinkMaterial;
var whiteAltMaterial, greyAltMaterial, blackAltMaterial, redAltMaterial, blooAltMaterial, greenAltMaterial, darkRedAltMaterial,
    darkVioletAltMaterial, cyanAltMaterial, orangeAltMaterial, yellowAltMaterial, peachAltMaterial, violetAltMaterial,
    darkGreenAltMaterial, darkOrangeAltMaterial, pinkAltMaterial;
var highlightedAtom;

const atomSize = 150;
const connectionSize = Math.floor(atomSize / 2);
const connectionLength = 400;

let atomArray = [];         // will store all the atoms
let currentAtom, previousAtom;
















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
















//      --------------------------------
//      |    chemistry-related data    |
//      --------------------------------

var bondLengths = [
{
    name: "hydrogen",
    hydrogen:   [74],     // bond lengths should be in the form [single, double, triple]
    fluorine:   [92],
    chlorine:   [127],
    bromine:    [141],
    iodine:     [161],
    oxygen:     [96],
    silicon:    [148],
    carbon:     [109],
    nitrogen:   [101],
    phosphorus: [142],
    sulfur:     [134]
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
    iodine:     [194],
    silicon:    [161],
    carbon:     [143, 123, 113],
    nitrogen:   [144, 120, 106]
    
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
    iodine:     [240],
    carbon:     [186],
    phosphorus: [227]
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
    iodine:     [222],
    carbon:     [147, 127, 115]
},
{
    name: "phosphorus",
    hydrogen:   [142],
    silicon:    [227],
    phosphorus: [221],
    fluorine:   [156],
    chlorine:   [204],
    bromine:    [222],
    iodine:     [246],
    oxygen:     [160],
    carbon:     [187],
    nitrogen:   [177]
},
{
    name: "sulfur",
    hydrogen: [134],
    sulfur:   [204],
    fluorine: [158],
    chlorine: [201],
    bromine:  [225],
    iodine:   [234],
    oxygen:   [151],
    silicon:  [210],
    carbon:   [181]
},
{
    name: "fluorine",
    fluorine:  [143],
    chlorine:  [166],
    bromine:   [178],
    iodine:    [187],
    hydrogen:  [92],
    oxygen:    [142],
    silicon:   [156],
    carbon:    [133],
    nitrogen:  [139],
    phosphorus:[156],
    sulfur:    [158]
},
{
    name: "chlorine",
    chlorine:  [199],
    bromine:   [214],
    iodine:    [243],
    hydrogen:  [127],
    oxygen:    [164],
    silicon:   [204],
    carbon:    [177],
    nitrogen:  [191],
    phosphorus:[204],
    sulfur:    [201],
    fluorine:  [166]
},
{
    name: "bromine",
    bromine:   [228],
    iodine:    [248],
    hydrogen:  [141],
    oxygen:    [172],
    silicon:   [216],
    carbon:    [194],
    nitrogen:  [214],
    phosphorus:[222],
    sulfur:    [225],
    fluorine:  [178],
    chlorine:  [214]
},
{
    name: "iodine",
    iodine:    [266],
    hydrogen:  [161],
    oxygen:    [194],
    silicon:   [240],
    carbon:    [213],
    nitrogen:  [222],
    phosphorus:[246],
    sulfur:    [234],
    fluorine:  [187],
    chlorine:  [243],
    bromine:   [248]
}
];




const periodicTable = [];

function PrdcElmt(symbol, name, bonds, bondLength, radius, electrons, colour, hlColour) {
    this.symbol = symbol;
    this.name = name;
    this.possibleBonds = bonds;
    this.bondLength = bondLength;   // TODO replace with object
    this.atomicRadius = radius;     // in amu
    this.valenceElectrons = electrons;
    this.colour = colour;
    this.highlightColour = hlColour;
}

function createTable() {
    //note: bond length not yet accounted for, radius in progress (pm)
    //for radius, referring to http://periodictable.com/Properties/A/AtomicRadius.v.html
    //finished first column for radius as of 5:08 may 31
    
    // elements 1-10
    periodicTable.push(new PrdcElmt("H",  "hydrogen",     1, null, 53,   1, whiteMaterial,     whiteAltMaterial));
    periodicTable.push(new PrdcElmt("He", "helium",       0, null, 31,   2, cyanMaterial,      cyanAltMaterial));
    periodicTable.push(new PrdcElmt("Li", "lithium",      1, null, 167,  1, violetMaterial,    violetAltMaterial));
    periodicTable.push(new PrdcElmt("Be", "beryllium",    2, null, 112,  2, darkGreenMaterial, darkGreenAltMaterial));
    periodicTable.push(new PrdcElmt("B",  "boron",        3, null, 87,   3, peachMaterial,     peachAltMaterial));
    periodicTable.push(new PrdcElmt("C",  "carbon",       4, null, 67,   4, blackMaterial,     blackAltMaterial));
    periodicTable.push(new PrdcElmt("N",  "nitrogen",     3, null, 56,   5, blooMaterial,      blooAltMaterial));
    periodicTable.push(new PrdcElmt("O",  "oxygen",       2, null, 48,   6, redMaterial,       redAltMaterial));
    periodicTable.push(new PrdcElmt("F",  "fluorine",     1, null, 42,   7, greenMaterial,     greenAltMaterial));
    periodicTable.push(new PrdcElmt("Ne", "neon",         0, null, 38,   8, cyanMaterial,      cyanAltMaterial));
    
    // elements 11-20
    periodicTable.push(new PrdcElmt("Na", "sodium",       1, null, 227,  1, violetMaterial,    violetAltMaterial));
    periodicTable.push(new PrdcElmt("Mg", "magnesium",    2, null, 145,  2, darkGreenMaterial, darkGreenAltMaterial));
    periodicTable.push(new PrdcElmt("Al", "aluminium",    3, null, 118,  3, pinkMaterial,      pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Si", "silicon",      4, null, 111,  4, pinkMaterial,      pinkAltMaterial));
    periodicTable.push(new PrdcElmt("P",  "phosphorus",   3, null, 98,   5, orangeMaterial,    orangeAltMaterial));
    periodicTable.push(new PrdcElmt("S",  "sulfur",       2, null, 88,   6, yellowMaterial,    yellowAltMaterial));
    periodicTable.push(new PrdcElmt("Cl", "chlorine",     1, null, 79,   7, greenMaterial,     greenAltMaterial));
    periodicTable.push(new PrdcElmt("Ar", "argon",        1, null, 71,   8, cyanMaterial,      cyanAltMaterial));
    periodicTable.push(new PrdcElmt("K",  "potassium",    1, null, 243,  1, violetMaterial,    violetAltMaterial));
    periodicTable.push(new PrdcElmt("Ca", "calcium",      2, null, 194,  2, darkGreenMaterial, darkGreenAltMaterial));
    
    // elements 21-39
    // periodicTable.push(new PrdcElmt("scandium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("titanium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("vanadium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("chromium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("manganese", 2, null, 5));
    // periodicTable.push(new PrdcElmt("iron", 2, null, 5));
    // periodicTable.push(new PrdcElmt("cobalt", 2, null, 5));
    // periodicTable.push(new PrdcElmt("nickel", 2, null, 5));
    // periodicTable.push(new PrdcElmt("copper", 2, null, 5));
    
    
    // elements 30-40
    periodicTable.push(new PrdcElmt("Zn", "zinc",         2, null, 142,  2, peachMaterial, peachAltMaterial));
    periodicTable.push(new PrdcElmt("Ga", "gallium",      3, null, 136,  3, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Ge", "germanium",    4, null, 125,  4, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("As", "arsenic",      3, null, 114,  5, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Se", "selenium",     2, null, 103,  6, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Br", "bromine",      1, null, 94,   7, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Kr", "krypton",      0, null, 88,   8, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Rb", "rubidium",     1, null, 265,  1, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Sr", "strontium",    2, null, 219,  2, pinkMaterial,  pinkAltMaterial));
    
    // elements 39-47
    // periodicTable.push(new PrdcElmt("yttrium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("zirconium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("niobium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("molybdenum", 2, null, 5));
    // periodicTable.push(new PrdcElmt("technetium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("ruthenium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("rhodium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("palladium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("silver", 2, null, 5));
    
    // element 48-56
    periodicTable.push(new PrdcElmt("Cd", "cadmium",      2, null, 161, 2, peachMaterial,      peachAltMaterial));
    periodicTable.push(new PrdcElmt("In", "indium",       3, null, 156, 3, pinkMaterial,       pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Sn", "tin",          4, null, 145, 4, pinkMaterial,       pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Sb", "antimony",     3, null, 133, 5, pinkMaterial,       pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Te", "tellurium",    2, null, 123, 6, pinkMaterial,       pinkAltMaterial));
    periodicTable.push(new PrdcElmt("I",  "iodine",       1, null, 115, 7, darkVioletMaterial, darkVioletAltMaterial));
    periodicTable.push(new PrdcElmt("Xe", "xenon",        0, null, 108, 8, cyanMaterial,       cyanAltMaterial));
    periodicTable.push(new PrdcElmt("Cs", "caesium",      1, null, 300, 1, violetMaterial,     violetAltMaterial));
    periodicTable.push(new PrdcElmt("Ba", "barium",       2, null, 253, 2, darkGreenMaterial,  darkGreenAltMaterial));
    
    // elements 57-71
    // periodicTable.push(new PrdcElmt("lanthanum", 2, null, 5));
    // periodicTable.push(new PrdcElmt("cerium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("praseodymium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("neodymium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("promethium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("samarium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("europium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("gadolinium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("terbium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("dysprosium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("holmium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("erbium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("thulium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("ytterbium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("lutetium", 2, null, 5));
    
    // elements 72-79
    // periodicTable.push(new PrdcElmt("hafnium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("tantalum", 2, null, 5));
    // periodicTable.push(new PrdcElmt("tungsten", 2, null, 5));
    // periodicTable.push(new PrdcElmt("rhenium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("osmium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("iridium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("platinum", 2, null, 5));
    // periodicTable.push(new PrdcElmt("gold", 2, null, 5));
    
    // elements 80-88
    periodicTable.push(new PrdcElmt("Hg", "mercury",     2, null, 171, 2, peachMaterial, peachAltMaterial));
    periodicTable.push(new PrdcElmt("Tl", "thallium",    3, null, 156, 3, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Pb", "lead",        4, null, 154, 4, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Bi", "bismuth",     3, null, 143, 5, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Po", "polonium",    2, null, 135, 6, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("At", "astatine",    1, null, 127, 7, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Rn", "radon",       0, null, 120, 8, pinkMaterial,  pinkAltMaterial));
    
    // bottom row -> molecules by collision
    // periodicTable.push(new PrdcElmt("francium", 1, null, 5));
    // periodicTable.push(new PrdcElmt("radium", 2, null, 5));
    
    // elements 89-103
    // periodicTable.push(new PrdcElmt("actinium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("thorium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("protactinium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("uranium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("neptunium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("plutonium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("americium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("curium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("berkelium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("californium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("einsteinium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("fermium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("mendelevium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("nobelium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("lawrencium", 2, null, 5));
    
    // elements 104-111
    // periodicTable.push(new PrdcElmt("rutherfordum", 2, null, 5));
    // periodicTable.push(new PrdcElmt("dubnium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("seaborgium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("bohrium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("hassium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("meitnerium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("darmstadtium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("roentgenium", 2, null, 5));
}

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
    for (let item of bondLengths) {
        if (item.name == atom) {
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
















//      ------------------------------------------------
//      |    constructor and atom-related functions    |
//      ------------------------------------------------

function Atom(x, y, z, element) {
    this.mesh;                      // the sphere
    this.parentConnection = {       // cylinder to connect to parent atom (array of cylinders if end of chain)
        mesh: null,
        bondLength: 0,
        x: 0,
        y: 0,
        z: 0,
        angleX: 0,
        angleY: 0,
        angleZ: 0
    };
    this.childConnections = [];     // the cylinder(s) that connect to children atoms
    this.skeletalLine = null;
    this.x = x;
    this.y = y;
    this.z = z;
    this.element = element;
    this.radius = 0;                // radius of nucleus
    this.possibleBonds = 1;         // maximum number of bonds the atom can make
    this.colour = blackMaterial;    // colour of model
    this.currentBonds = [];         // atoms this is currently bonded to (use this.currentBonds.length)
    this.nextInChain = [];          // same as currentBonds, except without the parent atom
    this.parentAtom = null;         // if null, then is base; if object, part of chain; if array, end of a chain

    this.setElement = function(newElement) {
        this.element = newElement;

        // radius is a function of element? TODO replace with helen's array
        /*if (newElement == "carbon") {
            this.radius = 1;
            this.possibleBonds = 4;
            this.colour = blackMaterial;
        }*/

        for (let item of periodicTable) {
            if (item.name == newElement) {
                // this.atomicRadius = item.atomicRadius;
                this.possibleBonds = item.possibleBonds;
                this.radius = 1;
                this.colour = item.colour;
                this.highlightColour = item.highlightColour;
                return;
            }
        }
        // this will only run if newElement isnt in periodicTable
        console.error("Error: tried to set atom to \"" + newElement + "\", which is not defined in the program");

        // TODO bond angle is a function of element and currentBonds?
    };

    this.setPosition = function(xPos, yPos, zPos) {
        this.x = xPos;
        this.y = yPos;
        this.z = zPos;
        this.mesh.position.set(xPos, yPos, zPos);
    };

    this.moov = function(xDir, yDir, zDir) {
        this.x += xDir;
        this.y += yDir;
        this.z += zDir;
        this.mesh.translateX(xDir);
        this.mesh.translateY(yDir);
        this.mesh.translateZ(zDir);
    };

    this.connectToParent = function() {
        if (this.parentAtom) {

            //      ------------------------
            //      |    ball and stick    |
            //      ------------------------

            // if there's already a cylinder, remove it
            if (this.parentConnection.mesh) {
                scene.remove(this.parentConnection.mesh);
            }
            this.parentConnection.mesh = new THREE.Mesh(cylinderGeometry, this.colour);
    
            // cylinder position
            const position = getMidpoint([this.x, this.y, this.z], [this.parentAtom.x, this.parentAtom.y, this.parentAtom.z]);
            this.parentConnection.x = position[0];
            this.parentConnection.y = position[1];
            this.parentConnection.z = position[2];
            this.setPosition.call(this.parentConnection, position[0], position[1], position[2]);

            // cylinder rotation
            // this.parentConnection.mesh.rotation.x = Math.atan2((this.y - this.parentAtom.y), (this.z - this.parentAtom.z));
            // this.parentConnection.mesh.rotation.y = Math.atan2((this.y - this.parentAtom.y), (this.z - this.parentAtom.z)) + THREE.Math.degToRad(90);
            this.parentConnection.mesh.rotation.z = Math.atan2((this.y - this.parentAtom.y), (this.x - this.parentAtom.x)) + THREE.Math.degToRad(90);




            //      ------------------
            //      |    skeletal    |
            //      ------------------

            // if there's already a line, remove it
            if (this.skeletalLine) {
                scene.remove(this.skeletalLine);
            }
            if (this.element == "carbon" && this.parentAtom.element == "carbon") {          // only draw lines between carbon atoms
                const lineGeometry = new THREE.Geometry();
                lineGeometry.vertices.push(new THREE.Vector3(this.x, this.y, this.z));
                lineGeometry.vertices.push(new THREE.Vector3(this.parentAtom.x, this.parentAtom.y, this.parentAtom.z));
                this.skeletalLine = new THREE.Line(lineGeometry, skeletalMaterial);
            }
            //      -------------------
            //      |    lewis dot    |
            //      -------------------





            // this.parentConnection.bondLength = getMidpoint([], []);
            if (currentModel == "ball and stick") {
                scene.add(this.parentConnection.mesh);
            }
            if (currentModel == "skeletal") {
                scene.add(this.skeletalLine);
            }
        }
    };
    this.connectToChildren = function () {
        // loop
    };
    this.connectToAll = function() {
        // clear array; this function might be used after repositioning,
        this.connections = [];
        // TODO remove from scene

        this.connectToParent();     // so the old cylinders will need to go
        this.connectToChildren();
    };

    this.drawBallAndStick = function() {
        scene.add(this.mesh);

        // remove connection, if applicable
        if (this.parentAtom) {
            scene.add(this.parentConnection.mesh);
        }
    };
    this.drawSkeletal = function() {
        if (this.parentAtom) {
            scene.add(this.skeletalLine);
        }
    };
    this.drawLewisDot = function() {
        
    };

    this.clearBallAndStick = function() {
        scene.remove(this.mesh);

        // remove connection, if applicable
        if (this.parentAtom) {
            scene.remove(this.parentConnection.mesh);
        }
    };
    this.clearSkeletal = function() {
        scene.remove(this.skeletalLine);
    };
    this.clearLewisDot = function() {
        
    };

    this.create = function() {
        this.setElement("carbon");

        this.mesh = new THREE.Mesh(sphereGeometry, this.colour);
        this.mesh.scale.set(this.radius, this.radius, this.radius);
        this.mesh.position.set(this.x, this.y, this.z);

        if (currentModel == "ball and stick") {
            scene.add(this.mesh);
        }
    };
}




function changeColour(mesh, material) {
    mesh.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.material = material;
        }
        mesh.geometry.uvsNeedUpdate = true;
        mesh.needsUpdate = true;
    });
}




function highlightSelectedAtom() {
    // create ray
	raycaster.setFromCamera(mouse, camera);

    // this is an array that stores all of the things the ray touches, from front (closest to camera) to back
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {                                // if the ray touches anything
        if (highlightedAtom != intersects[0].object) {          //      if it's touching anything new
            if (highlightedAtom) {                              //      and the old thing was an atom
                changeColour(highlightedAtom, blackMaterial);   //      unhighlight the old atom
            }

            highlightedAtom = intersects[0].object;             // then update data to store the new highlighted atom
            changeColour(highlightedAtom, greenMaterial);       // and change its colour
        }
    }
    else {                                                      // if the ray doesn't touch anything
        if (highlightedAtom) {                                  //      if the old thing was an atom
            changeColour(highlightedAtom, blackMaterial);       //      unhighlight it
        }
        highlightedAtom = null;                                 // tell the data the ray isn't touching anything
    }
}




function getMidpoint(arr1, arr2) {
    // both arrays should have coordinates in the form [x, y, z]
    const x = Math.round((arr1[0] + arr2[0]) / 2);
    const y = Math.round((arr1[1] + arr2[1]) / 2);
    const z = Math.round((arr1[2] + arr2[2]) / 2);

    // return array of averages
    return ([x, y, z]);
}




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
















//      -----------------------
//      |    functionality    |
//      -----------------------

function onMouseMove(event) {
    const canvasPosition = renderer.domElement.getBoundingClientRect();

    // position inside the canvas
    const mouseX = event.clientX - canvasPosition.left;
    const mouseY = event.clientY - canvasPosition.top;
    
    // divide my the position so it represents the fraction of the canvas it takes up
    // then multiply by 2 (because the canvas width and height both go from -1 to 1)
    // mouse y needs to be inverted because down is positive
    // add/subtract 1 to centre it since (0,0) is in the middle of the canvas
    mouse.x =  2 * (mouseX / canvasWidth)  - 1;
    mouse.y = -2 * (mouseY / canvasHeight) + 1;
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
    // initialise data
    putBondsInTable();




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
    mouse = new THREE.Vector2();
    mouse.x = -1;   // these lines prevent the ray starting at (0, 0), which would make the
    mouse.y = 1;    // base atom highlighted on startup. btw, (-1, 1) is the top-left corner
    raycaster = new THREE.Raycaster();

    drawAxes();




	sphereGeometry = new THREE.SphereGeometry(atomSize, 32, 32);
	cylinderGeometry = new THREE.CylinderGeometry(connectionSize, connectionSize, connectionLength, 32);




    // materials (mainly colours)
             wireMaterial = new THREE.MeshBasicMaterial(  {color: 0x66ff66, wireframe: true});
         skeletalMaterial = new THREE.LineBasicMaterial(  {color: 0x000000, linewidth: 100});       // doesn't work on windows
            whiteMaterial = new THREE.MeshLambertMaterial({color: 0xbbbbbb});
             greyMaterial = new THREE.MeshLambertMaterial({color: 0x888888});
            blackMaterial = new THREE.MeshPhongMaterial(  {color: 0x222222});
             blooMaterial = new THREE.MeshLambertMaterial({color: 0x1010dd});
              redMaterial = new THREE.MeshLambertMaterial({color: 0xff2222});
            greenMaterial = new THREE.MeshLambertMaterial({color: 0x00ff00});
          darkRedMaterial = new THREE.MeshLambertMaterial({color: 0x851515});
       darkVioletMaterial = new THREE.MeshLambertMaterial({color: 0x6C08B2});
             cyanMaterial = new THREE.MeshLambertMaterial({color: 0x00ffff});
           orangeMaterial = new THREE.MeshLambertMaterial({color: 0xffa500});
           yellowMaterial = new THREE.MeshLambertMaterial({color: 0xffff00});
            peachMaterial = new THREE.MeshLambertMaterial({color: 0xffb7ae});
           violetMaterial = new THREE.MeshLambertMaterial({color: 0x9859C4});
        darkGreenMaterial = new THREE.MeshLambertMaterial({color: 0x008000});
       darkOrangeMaterial = new THREE.MeshLambertMaterial({color: 0xbf7e00});
             pinkMaterial = new THREE.MeshLambertMaterial({color: 0xff90ce});

         whiteAltMaterial = new THREE.MeshLambertMaterial({color: 0xfffdee});
          greyAltMaterial = new THREE.MeshLambertMaterial({color: 0x6f6d6d});
         blackAltMaterial = new THREE.MeshPhongMaterial(  {color: 0x404040});
          blooAltMaterial = new THREE.MeshLambertMaterial({color: 0x5858ff});
           redAltMaterial = new THREE.MeshLambertMaterial({color: 0xff8080});
         greenAltMaterial = new THREE.MeshLambertMaterial({color: 0x8dff8d});
       darkRedAltMaterial = new THREE.MeshLambertMaterial({color: 0xab5555});
    darkVioletAltMaterial = new THREE.MeshLambertMaterial({color: 0x80559f});
          cyanAltMaterial = new THREE.MeshLambertMaterial({color: 0x8dffff});
        orangeAltMaterial = new THREE.MeshLambertMaterial({color: 0xffd994});
        yellowAltMaterial = new THREE.MeshLambertMaterial({color: 0xffffa0});
         peachAltMaterial = new THREE.MeshLambertMaterial({color: 0xffcfc9});
        violetAltMaterial = new THREE.MeshLambertMaterial({color: 0xbc9dd2});
     darkGreenAltMaterial = new THREE.MeshLambertMaterial({color: 0x5f9a5f});
    darkOrangeAltMaterial = new THREE.MeshLambertMaterial({color: 0xdfba74});
          pinkAltMaterial = new THREE.MeshLambertMaterial({color: 0xf9c6e2});

    // create periodic table
    createTable();



    // construct and create the first atom, push it into atomArray
    currentAtom = new Atom(0, 0, 0, "carbon");
    currentAtom.create();
    atomArray = [currentAtom];




	canvas.appendChild(renderer.domElement);
}




function animate() {
    // highlight the atom the mouse hovers over
    highlightSelectedAtom();

    // update Three.js tools
	controls.update();
	renderer.render(scene, camera);

    // recursive loop
    window.requestAnimationFrame(animate);
}




function switchModel(type) {
    // don't run if model isn't changing
    if (type == currentModel) {
        console.log(type + " is already the current model");
        return;
    }




    // remove old model from scene
    if (currentModel === "ball and stick") {
        for (let item of atomArray) {
            item.clearBallAndStick();
        }
    }
    else if (currentModel == "skeletal") {
        for (let item of atomArray) {
            item.clearSkeletal();
        }
    }
    else if (currentModel == "lewis dot") {
        for (let item of atomArray) {
            item.clearLewisDot();
        }
    }




    // draw in new model and set it as the current one
    currentModel = type;
    if (type == "ball and stick") {
        for (let item of atomArray) {
            item.drawBallAndStick();
        }
    }
    else if (type == "skeletal") {
        for (let item of atomArray) {
            item.drawSkeletal();
        }
    }
    else if (type == "lewis dot") {
        for (let item of atomArray) {
            item.drawLewisDot();
        }
    }
}
















//      -----------------
//      |    buttons    |
//      -----------------

function newAtom() {
    if (currentAtom.currentBonds.length < currentAtom.possibleBonds) {
        let x = connectionLength;
        let y = 0;
        let z = 0;
        let xPos = currentAtom.x + currentAtom.radius + x;
        let yPos = currentAtom.y + currentAtom.radius + y;
        let zPos = currentAtom.z + currentAtom.radius + z;
    
        atomArray.push(new Atom(xPos, yPos, zPos, "carbon"));                   // construct the new atom

        previousAtom = currentAtom;                                             // new previousAtom is the old currentAtom
        currentAtom = atomArray[atomArray.length - 1];                          // new currentAtom is last (newest) in array

        previousAtom.currentBonds.push(currentAtom);
        currentAtom.currentBonds.push(previousAtom);
        currentAtom.parentAtom = previousAtom;

        currentAtom.create();                                                   // create the new atom
        currentAtom.connectToParent();
    }
    else {
        alert("Error. This atom cannot bond to any more additional atoms.");
    }
}

function remoovAtom() {
    alert("remoov");
}

function reset() {
    // default to ball-and-stick model
    currentModel = "ball and stick";

    // clear data
    atomArray = [];
    scene.children = [];

    // reset lights and base atom
    drawAxes();
    scene.add(mainLight);
    scene.add(ambientLight);
    currentAtom = new Atom(0, 0, 0, "carbon");
    currentAtom.create();
    atomArray.push(currentAtom);

    // reset camera
    controls.reset();
}
















//      -----------------
//      |    startup    |
//      -----------------

$(document).ready(function() {
    // event listeners
    $(window).resize(resizeCanvas);
    $("#addAtom").on("click", newAtom);
    $("#remoovAtom").on("click", remoovAtom);
    $("#restart").on("click", reset);   // different names because to the user, the PROCESS is restarting, but to us the PROGRAM is NOT restarting
    $("#ballAndStick").on("click", function() {
        switchModel("ball and stick");
    });
    $("#skeletal").on("click", function() {
        switchModel("skeletal");
    });
    $("#lewisDot").on("click", function() {
        switchModel("lewis dot");
    });
    $canvas.on("mousemove", onMouseMove);
    $(document).on("keydown", function(event) {
        if (event.which == 13) {
            atomArray[1].moov(0, 100, 0);
            atomArray[1].connectToParent();
        }
        else if (event.which == 220) {  // backslash
            // atomArray[1].parentConnection.mesh.rotation.z += 0.2;
            rotateAroundWorldAxis(atomArray[1].parentConnection.mesh, xVector, 0.2);
        }
        else if (event.which == 65) {   // a
            atomArray[1].moov(0, 100, 0);
            atomArray[1].connectToParent();
        }
        else if (event.which == 79) {   // o
            atomArray[1].moov(0, -100, 0);
            atomArray[1].connectToParent();
        }
        else if (event.which == 69) {   // e
            atomArray[1].moov(0, 0, 100);
            atomArray[1].connectToParent();
        }
        else if (event.which == 85) {   // u
            atomArray[1].moov(0, 0, -100);
            atomArray[1].connectToParent();
        }
        else if (event.which == 73) {   // i
            atomArray[1].moov(100, 0, 0);
            atomArray[1].connectToParent();
        }
        else if (event.which == 68) {   // d
            atomArray[1].moov(-100, 0, 0);
            atomArray[1].connectToParent();
        }
    });

    // run at start
    resizeCanvas();     // canvas must be sized on start
    initialise();
    animate();
});