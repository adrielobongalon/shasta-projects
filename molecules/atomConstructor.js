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


const defaultElement = "carbon";

class Atom {
    constructor() {
        this.mesh;                      // the sphere
        this.parentConnection;          // cylinder to connect to parent atom (array of cylinders if end of chain)
        this.lewisDotConnexion;         // it's actually a semicolon text geometry mesh; WATCH_DOGS anyone?
        this.skeletalLine;
        this.symbolMesh;
        this.symbolMeshOffset =        {x: 0, y: 0};       // placeholder values
        this.lewisDotConnexionOffset = {x: 0, y: 0};       // ditto
        this.swingAngle = 0;    // in degrees
        this.rotateAngle = 0;   // likewise
        // this.angleX = 0;
        // this.angleY = 0;
        // this.angleZ = 0;

        this.element;
        this.radius = 0;                // radius of nucleus, is terms of scale to default (carbon)
        this.possibleBonds = 1;         // maximum number of bonds the atom can make

        this.material = threeData.blackMaterial;  // colour of model
        this.highlightMaterial = threeData.blackAltMaterial;

        this.parentAtom;                // if null, then is base; if object, part of chain
        this.children = [];             // same as currentBonds, except without the parent atom
        this.currentBonds = [];         // atoms this is currently bonded to (use this.currentBonds.length)
        this.distanceToParent;          // in Three.js units
        this.typeOfBondToParent = 1;    // integer from 1 to 3, representing a single, double, or triple bond
    }

    setElementData(newElement) {
        if (!periodicTable.has(newElement)) {
            console.error("tried to set element to \"" + newElement + "\", which is not defined in the program");
            return;
        }
        this.element = newElement;

        // get data from periodic table
        this.possibleBonds = periodicTable.get(newElement).possibleBonds;
        this.radius = periodicTable.get(newElement).atomicRadius / periodicTable.get("carbon").atomicRadius;
        this.material = threeData.materials.get(periodicTable.get(newElement).colour);
        this.highlightMaterial = threeData.altMaterials.get(periodicTable.get(newElement).colour);

        // set distance to parent
        if (this.parentAtom) {      // if not the base atom (i.e. has a parent atom)
            this.distanceToParent = threeData.scaleToThreeUnits(chemistryData.getBondLength(this.element, this.parentAtom.element, this.typeOfBondToParent));
        }
    }

    setMeshData(newElement) {
        // set mesh geometries
        this.mesh = new THREE.Mesh(threeData.sphereGeometry, this.material);
        this.mesh.scale.set(this.radius, this.radius, this.radius);

        // set text geometries
        // TODO update (it's a map now, not an array), make it so that it only generates a text geometry if it hasnt been used yet
        // for (let item of periodicTable) {
        //     if (item.name == this.element) {
        //         this.symbolMesh = new THREE.Mesh(item.textGeometry, threeData.textMaterial);
        //         let boundingBox = new THREE.Box3().setFromObject(this.symbolMesh);
        //         // console.log(boundingBox.min, boundingBox.max, boundingBox.getSize());   // useful dimensions of text mesh
        //         this.symbolMeshOffset = {x: boundingBox.getSize().x / 2, y: boundingBox.getSize().y / 2};
        //         break
        //     }
        // }
    }

    setParentConnectionMeshData() {
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

    setPosition(x, y, z) {
        this.mesh.position.set(x, y, z);
        // this.symbolMesh.position.set(x - this.symbolMeshOffset.x, y - this.symbolMeshOffset.y, z);
    }

    // TODO remove & replace
    applyElementData() {
        this.mesh.scale.set(this.radius, this.radius, this.radius);     // radius
        this.resizeParentConnection();                                  // bond length
        threeData.updateMaterial(this.mesh, this.material);             // colour
    }

    createBaseAtom() {
        this.parentAtom = null;
        this.parentConnection = null;
        this.setElementData(defaultElement);
        this.setMeshData(defaultElement);
        this.setPosition(0, 0, 0);
    }

    // meant for all the new atoms that get connected to the base atom
    createAsChildOf(parent) {
        this.parentAtom = parent;
        // this.parentConnection = ?
        this.setElementData(defaultElement);
        this.setMeshData(defaultElement);
        this.setPosition(this.parentAtom.mesh.position.x + this.distanceToParent, this.parentAtom.mesh.position.y, this.parentAtom.mesh.position.z);
        this.setParentConnectionMeshData();
    }

    changeToElement(newElement) {
        
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
        if (currentModel === "skeletal" && this.skeletalLine) {  // lines only drawn for carbon-carbon bonds
            threeData.scene.add(this.skeletalLine);
        }
        if (currentModel === "lewis dot") {
            threeData.scene.add(this.symbolMesh);
            if (this.parentAtom) threeData.scene.add(this.lewisDotConnexion);
        }
    }
}