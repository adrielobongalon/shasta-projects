/*
       document : atomConstructor.js, for molecules in shasta-projects
     created on : wednesday, february 07, 2018, 15:21 pm
         author : audrey bongalon
    description : class for creating an atom. just look how massive this thing is
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

/* global THREE periodicTable chemistryData threeData currentAtom */


class Atom {
    constructor() {
        this.mesh;                      // the sphere
        this.parentConnection;          // cylinder to connect to parent atom (array of cylinders if end of chain)
        this.lewisDotConnexion;         // it's actually a semicolon text geometry mesh; WATCH_DOGS anyone?
        this.childConnections = [];     // the cylinder(s) that connect to children atoms
        this.skeletalLine;
        this.symbolMesh;
        this.symbolMeshOffset =        {x: 0, y: 0};       // placeholder values
        this.lewisDotConnexionOffset = {x: 0, y: 0};       // ditto
        this.swingAngle = 0;    // in degrees
        this.rotateAngle = 0;   // likewise
        // this.angleX = 0;
        // this.angleY = 0;
        // this.angleZ = 0;
        this.element = "carbon";        // TODO does this need to be initialised?
        this.radius = 0;                // radius of nucleus, is terms of scale to default (carbon)
        this.possibleBonds = 1;         // maximum number of bonds the atom can make
        this.material = threeData.blackMaterial;  // colour of model
        this.highlightMaterial = threeData.blackAltMaterial;
        this.currentBonds = [];         // atoms this is currently bonded to (use this.currentBonds.length)
        this.nextInChain = [];          // same as currentBonds, except without the parent atom
        this.parentAtom;                // if undefined, then is base; if object, part of chain
        this.distanceToParent;          // in Three.js units
        this.typeOfBondToParent = 1;    // integer from 1 to 3, representing a single, double, or triple bond
    }

    setElementData(newElement) {
        this.element = newElement;

        getDataFromPrdcTbl: {
            for (let item of periodicTable) {
                if (item.name == newElement) {
                    // set possible bonds data
                    this.possibleBonds = item.possibleBonds;
    
                    // set radius data and resize
                    this.radius = item.atomicRadius / chemistryData.getCarbonAtomicRadius();
    
                    // set colour data and change colour
                    this.material = item.colour;
                    this.highlightColour = item.highlightColour;
    
                    break getDataFromPrdcTbl;     // dont waste time looping through all elements
                }
            }
            // this will only run if newElement isnt in periodicTable
            console.error("tried to set element to \"" + newElement + "\", which is not defined in the program");
        }

        setDistToParent: {
            if (this.parentAtom) {      // if not the base atom (i.e. has a parent atom)
                this.distanceToParent = threeData.scaleToThreeUnits(chemistryData.getBondLength(this.element, this.parentAtom.element, this.typeOfBondToParent));
            }
        }

        setTxtGeo: {
            for (let item of periodicTable) {
                if (item.name == this.element) {
                    this.symbolMesh = new THREE.Mesh(item.textGeometry, threeData.textMaterial);
                    let boundingBox = new THREE.Box3().setFromObject(this.symbolMesh);
                    // console.log(boundingBox.min, boundingBox.max, boundingBox.getSize());   // useful dimensions of text mesh
                    this.symbolMeshOffset = {x: boundingBox.getSize().x / 2, y: boundingBox.getSize().y / 2};

                    break setTxtGeo;    // dont waste time looping through unnecessary items
                }
            }
        }
    }

    applyElementData() {
        this.mesh.scale.set(this.radius, this.radius, this.radius);     // radius
        this.resizeParentConnection();                                  // bond length
        threeData.updateMaterial(this.mesh, this.material);             // colour
    }

    // only meant for that base atom
    // (i.e. the first one that always shows up by default)
    // NOT meant to be a placeholder for anything connected to it
    createCarbonPlaceholder() {
        setData: {
            this.radius = 1;                    // defaults
            this.parentConnection = null;

            for (let item of periodicTable) {   // gets the data from periodicTable
                if (item.name == "carbon") {
                    this.possibleBonds = item.possibleBonds;
                    this.material = threeData[item.colour + "Material"];
                    this.highlightMaterial = threeData[item.colour + "AltMaterial"];;
                    break setData;              // dont waste time looping through all elements
                }
            }
        }

        this.mesh = new THREE.Mesh(threeData.sphereGeometry, this.material);
        this.mesh.scale.set(this.radius, this.radius, this.radius);
        this.mesh.position.set(0, 0, 0);

        setTxtGeo: {
            for (let item of periodicTable) {
                if (item.name == this.element) {
                    this.symbolMesh = new THREE.Mesh(item.textGeometry, threeData.textMaterial);
                    let boundingBox = new THREE.Box3().setFromObject(this.symbolMesh);
                    // console.log(boundingBox.min, boundingBox.max, boundingBox.getSize());   // useful dimensions of text mesh
                    this.symbolMeshOffset = {x: boundingBox.getSize().x / 2, y: boundingBox.getSize().y / 2};

                    break setTxtGeo;    // dont waste time looping through unnecessary items
                }
            }
        }
        this.symbolMesh.position.set(this.mesh.position.x - this.symbolMeshOffset.x, this.mesh.position.y - this.symbolMeshOffset.y, this.mesh.position.z);
    }

    // meant for all the new atoms that get connected to the base atom
    createNew() {
        this.setElementData("carbon");

        // ball and stick
        this.mesh = new THREE.Mesh(threeData.sphereGeometry, this.material);
        this.mesh.scale.set(this.radius, this.radius, this.radius);
        this.mesh.position.set(this.parentAtom.mesh.position.x + this.distanceToParent, this.parentAtom.mesh.position.y, this.parentAtom.mesh.position.z);

        this.spawnParentConnection();
        this.applyElementData();

        // lewis dot
        setTxtGeo: {
            for (let item of periodicTable) {
                if (item.name == this.element) {
                    this.symbolMesh = new THREE.Mesh(item.textGeometry, threeData.textMaterial);
                    let boundingBox = new THREE.Box3().setFromObject(this.symbolMesh);
                    // console.log(boundingBox.min, boundingBox.max, boundingBox.getSize());   // useful dimensions of text mesh
                    this.symbolMeshOffset = {x: boundingBox.getSize().x / 2, y: boundingBox.getSize().y / 2};

                    break setTxtGeo;    // dont waste time looping through unnecessary items
                }
            }
        }
        this.symbolMesh.position.set(this.mesh.position.x - this.symbolMeshOffset.x, this.mesh.position.y - this.symbolMeshOffset.y, this.mesh.position.z);
    }

    moov(xDir, yDir, zDir) {
        this.mesh.translateX(xDir);
        this.mesh.translateY(yDir);
        this.mesh.translateZ(zDir);
    }

    reposition() {   // repositions atom based on swingInputData and rotateInputData
        if (this.parentAtom) {
            const x = this.parentAtom.mesh.position.x + (this.distanceToParent      * Math.cos(THREE.Math.degToRad(swingInputData)));
            const y = this.parentAtom.mesh.position.y + (this.distanceToParent      * Math.sin(THREE.Math.degToRad(swingInputData))  * Math.cos(THREE.Math.degToRad(rotateInputData)));
            const z = this.parentAtom.mesh.position.z + (this.distanceToParent * -1 * Math.sin(THREE.Math.degToRad(rotateInputData)) * Math.sin(THREE.Math.degToRad(swingInputData)));
            // note that we use -sin for z because from 0-360, the atom starts in the centre, moves back, then fowards, then back to centre

            this.mesh.position.set(x, y, z);
            this.symbolMesh.position.set(this.mesh.position.x - this.symbolMeshOffset.x, this.mesh.position.y - this.symbolMeshOffset.y, this.mesh.position.z);
        }
        else {
            alert("the base atom cannot be repositioned.");
            console.error("the base atom cannot be repositioned.");
        }
    }

    spawnParentConnection() {
        if (this.parentAtom) {

            //      ------------------------
            //      |    ball and stick    |
            //      ------------------------

            this.parentConnection = new THREE.Mesh(threeData.cylinderGeometry, this.material);
    
            // cylinder position
            const midpoint = threeData.getMidpoint([this.mesh.position.x, this.mesh.position.y, this.mesh.position.z],
                                                   [this.parentAtom.mesh.position.x, this.parentAtom.mesh.position.y, this.parentAtom.mesh.position.z]);
            this.parentConnection.position.set(midpoint[0], midpoint[1], midpoint[2]);     // "position" will be halfway in between

            // cylinder rotation
            this.parentConnection.lookAt(this.parentAtom.mesh.position);




            //      ------------------
            //      |    skeletal    |
            //      ------------------

            if (this.element == "carbon" && this.parentAtom.element == "carbon") {          // only draw lines between carbon atoms
                const lineGeometry = new THREE.Geometry();
                lineGeometry.vertices.push(new THREE.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z));
                lineGeometry.vertices.push(new THREE.Vector3(this.parentAtom.mesh.position.x, this.parentAtom.mesh.position.y, this.parentAtom.mesh.position.z));
                this.skeletalLine = new THREE.Line(lineGeometry, threeData.skeletalMaterial);
            }




            //      -------------------
            //      |    lewis dot    |
            //      -------------------

            // // create mesh
            // this.lewisDotConnexion = new THREE.Mesh(lewisDotConnexionGeo, threeData.textMaterial);

            // // text needs to be centred, so calculate offset from centre
            // let boundingBox = new THREE.Box3().setFromObject(this.lewisDotConnexion);
            // // console.log(boundingBox.min, boundingBox.max, boundingBox.getSize());   // useful dimensions of text mesh
            // this.lewisDotConnexionOffset = {x: boundingBox.getSize().x / 2, y: boundingBox.getSize().y / 2};

            // // set position
            // this.lewisDotConnexion.position.set(midpoint[0] - this.lewisDotConnexionOffset.x,
            //                                     midpoint[1] - this.lewisDotConnexionOffset.y,
            //                                     midpoint[2]);

            // // set rotation (on initialise, the geometry is rotated by 90 degrees)
            // this.lewisDotConnexion.lookAt({x: this.parentAtom.mesh.position.x,
            //                               y: this.parentAtom.mesh.position.y - this.lewisDotConnexionOffset.y,
            //                               z: this.parentAtom.mesh.position.z});




            // this.parentConnection.bondLength = getMidpoint([], []);
        }
    }
    moovParentConnection() {
        if (this.parentAtom) {

            //      ------------------------
            //      |    ball and stick    |
            //      ------------------------
    
            // cylinder position
            const midpoint = getMidpoint([this.mesh.position.x, this.mesh.position.y, this.mesh.position.z],
                                         [this.parentAtom.mesh.position.x, this.parentAtom.mesh.position.y, this.parentAtom.mesh.position.z]);
            this.parentConnection.position.set(midpoint[0], midpoint[1], midpoint[2]);     // "position" will be halfway in between

            // cylinder rotation
            this.parentConnection.lookAt(this.parentAtom.mesh.position);




            //      ------------------
            //      |    skeletal    |
            //      ------------------

            // if there's a line (i.e. both atoms are carbon), remove and replace
            if (this.skeletalLine) {
                threeData.scene.remove(this.skeletalLine);
                const lineGeometry = new THREE.Geometry();
                lineGeometry.vertices.push(new THREE.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z));
                lineGeometry.vertices.push(new THREE.Vector3(this.parentAtom.mesh.position.x, this.parentAtom.mesh.position.y, this.parentAtom.mesh.position.z));
                this.skeletalLine = new THREE.Line(lineGeometry, skeletalMaterial);
            }
            // TODO update line vertices instead of removing-and-replacing




            //      -------------------
            //      |    lewis dot    |
            //      -------------------

            this.lewisDotConnexion.position.set(midpoint[0] - this.lewisDotConnexionOffset.x,
                                                midpoint[1] - this.lewisDotConnexionOffset.y,
                                                midpoint[2]);

            // rotation
            this.lewisDotConnexion.lookAt({x: this.parentAtom.mesh.position.x,
                                           y: this.parentAtom.mesh.position.y - this.lewisDotConnexionOffset.y,
                                           z: this.parentAtom.mesh.position.z});
        }
    }
    resizeParentConnection() {
        // TODO
    }

    connectToChildren() {
        // loop
    }
    connectToAll() {
        // clear array; this function might be used after repositioning,
        this.connections = [];
        // TODO remove from scene

        this.spawnParentConnection();     // so the old cylinders will need to go
        this.connectToChildren();
    }

    updateAppearance(currentModel) {
        /* nothing appears to happen by removing a nonexistent mesh, so this
           shouldn't cause any errors */
        threeData.scene.remove(this.mesh);
        threeData.scene.remove(this.parentConnection);
        threeData.scene.remove(this.skeletalLine);
        threeData.scene.remove(this.symbolMesh);
        threeData.scene.remove(this.lewisDotConnexion);




        if (currentModel === "ball and stick") {
            threeData.scene.add(this.mesh);
            if (this.parentAtom) threeData.scene.add(this.parentConnection);
        }
        if (currentModel != "skeletal" && this.skeletalLine) {  // lines only drawn for carbon-carbon bonds
            threeData.scene.add(this.skeletalLine);
        }
        if (currentModel != "lewis dot") {
            threeData.scene.add(this.symbolMesh);
            if (this.parentAtom) threeData.scene.add(this.lewisDotConnexion);
        }
    }
}