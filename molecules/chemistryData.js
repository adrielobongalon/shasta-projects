/*
                                                                                                          88
                                                                                                          88
                                                                                                          88
       document : chemistryData.js, for molecules in shasta-projects    ,adPPYYba,  88       88   ,adPPYb,88  8b,dPPYba,   ,adPPYba,  8b       d8
     created on : wednesday, february 07, 2018, 15:09 pm                ""     `Y8  88       88  a8"    `Y88  88P'   "Y8  a8P,,,,,88  `8b     d8'
         author : audrey bongalon, helen so, christopher lim            ,adPPPPP88  88       88  8b      :88  88          8PP"""""""   `8b   d8'
    description : chemistry-related data. based on actual science       88,    ,88  "8a,   ,a88  "8a,   ,d88  88          "8b,   ,aa    `8b,d8'
                  mainly constants                                      `"8bbdP"Y8   `"YbbdP'Y8   `"8bbdP"Y8  88           `"Ybbd8"'      Y88'
                  originally from main.js (formerly modellingMain.js)                                                                     d8'
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


const bondLengths = new Map();
bondLengths.set("hydrogen", {
    hydrogen:   [74],   // bond lengths should be in the form [single, double, triple]
    fluorine:   [92],   // units are in picometres
    chlorine:   [127],
    bromine:    [141],
    iodine:     [161],
    oxygen:     [96],
    silicon:    [148],
    carbon:     [109],
    nitrogen:   [101],
    phosphorus: [142],
    sulfur:     [134]
});
bondLengths.set("oxygen", {
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
});      
bondLengths.set("silicon", {
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
});
bondLengths.set("carbon", {
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
});
bondLengths.set("nitrogen", {
    hydrogen:   [101],
    nitrogen:   [146, 122, 110],
    phosphorus: [177],
    oxygen:     [144, 120, 106],
    fluorine:   [139],
    chlorine:   [191],
    bromine:    [214],
    iodine:     [222],
    carbon:     [147, 127, 115]
});
bondLengths.set("phosphorus", {
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
});
bondLengths.set("sulfur", {
    hydrogen: [134],
    sulfur:   [204],
    fluorine: [158],
    chlorine: [201],
    bromine:  [225],
    iodine:   [234],
    oxygen:   [151],
    silicon:  [210],
    carbon:   [181]
});
bondLengths.set("fluorine", {
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
});
bondLengths.set("chlorine", {
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
});
bondLengths.set("bromine", {
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
});
bondLengths.set("iodine", {
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
});








const periodicTable = new Map();

(function() {
    function PrdcElmt(symbol, name, bonds, bondLengths, radius, electrons, colour) {
        this.symbol = symbol;
        this.name = name;
        this.possibleBonds = bonds;
        this.bondLengths = bondLengths;
        this.atomicRadius = radius;
        this.valenceElectrons = electrons;
        this.colour = colour;
    }
    
    const periodicTableArray = [
        // radius data is in picometres (pm)
        // radius data from http://periodictable.com/Properties/A/AtomicRadius.v.html
        // finished first column for radius as of 5:08 may 31
        
        // elements 1-10
        new PrdcElmt("H",  "hydrogen",  1, null, 53,   1, "white"),
        new PrdcElmt("He", "helium",    0, null, 31,   2, "cyan"),
        new PrdcElmt("Li", "lithium",   1, null, 167,  1, "violet"),
        new PrdcElmt("Be", "beryllium", 2, null, 112,  2, "dark green"),
        new PrdcElmt("B",  "boron",     3, null, 87,   3, "peach"),
        new PrdcElmt("C",  "carbon",    4, null, 67,   4, "black"),
        new PrdcElmt("N",  "nitrogen",  3, null, 56,   5, "bloo"),
        new PrdcElmt("O",  "oxygen",    2, null, 48,   6, "red"),
        new PrdcElmt("F",  "fluorine",  1, null, 42,   7, "green"),
        new PrdcElmt("Ne", "neon",      0, null, 38,   8, "cyan"),
        
        // elements 11-20
        new PrdcElmt("Na", "sodium",        1, null, 227,  1, "violet"),
        new PrdcElmt("Mg", "magnesium",     2, null, 145,  2, "dark green"),
        new PrdcElmt("Al", "aluminium",     3, null, 118,  3, "pink"),
        new PrdcElmt("Si", "silicon",       4, null, 111,  4, "pink"),
        new PrdcElmt("P",  "phosphorus",    3, null, 98,   5, "orange"),
        new PrdcElmt("S",  "sulfur",        2, null, 88,   6, "yellow"),
        new PrdcElmt("Cl", "chlorine",      1, null, 79,   7, "green"),
        new PrdcElmt("Ar", "argon",         1, null, 71,   8, "cyan"),
        new PrdcElmt("K",  "potassium",     1, null, 243,  1, "violet"),
        new PrdcElmt("Ca", "calcium",       2, null, 194,  2, "dark green"),
        
        // elements 21-39
        // new PrdcElmt("scandium", 2, null, 5),
        // new PrdcElmt("titanium", 2, null, 5),
        // new PrdcElmt("vanadium", 2, null, 5),
        // new PrdcElmt("chromium", 2, null, 5),
        // new PrdcElmt("manganese", 2, null, 5),
        // new PrdcElmt("iron", 2, null, 5),
        // new PrdcElmt("cobalt", 2, null, 5),
        // new PrdcElmt("nickel", 2, null, 5),
        // new PrdcElmt("copper", 2, null, 5),
        
        
        // elements 30-40
        new PrdcElmt("Zn", "zinc",      2, null, 142,  2, "peach"),
        new PrdcElmt("Ga", "gallium",   3, null, 136,  3, "pink"),
        new PrdcElmt("Ge", "germanium", 4, null, 125,  4, "pink"),
        new PrdcElmt("As", "arsenic",   3, null, 114,  5, "pink"),
        new PrdcElmt("Se", "selenium",  2, null, 103,  6, "pink"),
        new PrdcElmt("Br", "bromine",   1, null, 94,   7, "pink"),
        new PrdcElmt("Kr", "krypton",   0, null, 88,   8, "pink"),
        new PrdcElmt("Rb", "rubidium",  1, null, 265,  1, "pink"),
        new PrdcElmt("Sr", "strontium", 2, null, 219,  2, "pink"),
        
        // elements 39-47
        // new PrdcElmt("yttrium", 2, null, 5),
        // new PrdcElmt("zirconium", 2, null, 5),
        // new PrdcElmt("niobium", 2, null, 5),
        // new PrdcElmt("molybdenum", 2, null, 5),
        // new PrdcElmt("technetium", 2, null, 5),
        // new PrdcElmt("ruthenium", 2, null, 5),
        // new PrdcElmt("rhodium", 2, null, 5),
        // new PrdcElmt("palladium", 2, null, 5),
        // new PrdcElmt("silver", 2, null, 5),
        
        // element 48-56
        new PrdcElmt("Cd", "cadmium",   2, null, 161, 2, "peach"),
        new PrdcElmt("In", "indium",    3, null, 156, 3, "pink"),
        new PrdcElmt("Sn", "tin",       4, null, 145, 4, "pink"),
        new PrdcElmt("Sb", "antimony",  3, null, 133, 5, "pink"),
        new PrdcElmt("Te", "tellurium", 2, null, 123, 6, "pink"),
        new PrdcElmt("I",  "iodine",    1, null, 115, 7, "dark violet"),
        new PrdcElmt("Xe", "xenon",     0, null, 108, 8, "cyan"),
        new PrdcElmt("Cs", "caesium",   1, null, 300, 1, "violet"),
        new PrdcElmt("Ba", "barium",    2, null, 253, 2, "dark green"),
        
        // elements 57-71
        // new PrdcElmt("lanthanum", 2, null, 5),
        // new PrdcElmt("cerium", 2, null, 5),
        // new PrdcElmt("praseodymium", 2, null, 5),
        // new PrdcElmt("neodymium", 2, null, 5),
        // new PrdcElmt("promethium", 2, null, 5),
        // new PrdcElmt("samarium", 2, null, 5),
        // new PrdcElmt("europium", 2, null, 5),
        // new PrdcElmt("gadolinium", 2, null, 5),
        // new PrdcElmt("terbium", 2, null, 5),
        // new PrdcElmt("dysprosium", 2, null, 5),
        // new PrdcElmt("holmium", 2, null, 5),
        // new PrdcElmt("erbium", 2, null, 5),
        // new PrdcElmt("thulium", 2, null, 5),
        // new PrdcElmt("ytterbium", 2, null, 5),
        // new PrdcElmt("lutetium", 2, null, 5),
        
        // elements 72-79
        // new PrdcElmt("hafnium", 2, null, 5),
        // new PrdcElmt("tantalum", 2, null, 5),
        // new PrdcElmt("tungsten", 2, null, 5),
        // new PrdcElmt("rhenium", 2, null, 5),
        // new PrdcElmt("osmium", 2, null, 5),
        // new PrdcElmt("iridium", 2, null, 5),
        // new PrdcElmt("platinum", 2, null, 5),
        // new PrdcElmt("gold", 2, null, 5),
        
        // elements 80-88
        new PrdcElmt("Hg", "mercury",   2, null, 171, 2, "peach"),
        new PrdcElmt("Tl", "thallium",  3, null, 156, 3, "pink"),
        new PrdcElmt("Pb", "lead",      4, null, 154, 4, "pink"),
        new PrdcElmt("Bi", "bismuth",   3, null, 143, 5, "pink"),
        new PrdcElmt("Po", "polonium",  2, null, 135, 6, "pink"),
        new PrdcElmt("At", "astatine",  1, null, 127, 7, "pink"),
        new PrdcElmt("Rn", "radon",     0, null, 120, 8, "pink")
        
        // bottom row -> molecules by collision
        // new PrdcElmt("francium", 1, null, 5),
        // new PrdcElmt("radium", 2, null, 5),
        
        // elements 89-103
        // new PrdcElmt("actinium", 2, null, 5),
        // new PrdcElmt("thorium", 2, null, 5),
        // new PrdcElmt("protactinium", 2, null, 5),
        // new PrdcElmt("uranium", 2, null, 5),
        // new PrdcElmt("neptunium", 2, null, 5),
        // new PrdcElmt("plutonium", 2, null, 5),
        // new PrdcElmt("americium", 2, null, 5),
        // new PrdcElmt("curium", 2, null, 5),
        // new PrdcElmt("berkelium", 2, null, 5),
        // new PrdcElmt("californium", 2, null, 5),
        // new PrdcElmt("einsteinium", 2, null, 5),
        // new PrdcElmt("fermium", 2, null, 5),
        // new PrdcElmt("mendelevium", 2, null, 5),
        // new PrdcElmt("nobelium", 2, null, 5),
        // new PrdcElmt("lawrencium", 2, null, 5),
        
        // elements 104-111
        // new PrdcElmt("rutherfordum", 2, null, 5),
        // new PrdcElmt("dubnium", 2, null, 5),
        // new PrdcElmt("seaborgium", 2, null, 5),
        // new PrdcElmt("bohrium", 2, null, 5),
        // new PrdcElmt("hassium", 2, null, 5),
        // new PrdcElmt("meitnerium", 2, null, 5),
        // new PrdcElmt("darmstadtium", 2, null, 5),
        // new PrdcElmt("roentgenium", 2, null, 5)
    ];

    // put pond lengths in periodicTableArray
    for (let i = 0; i < periodicTableArray.length; i++) {    // value is being modified, so we can't use a for-of loop
        periodicTableArray[i].bondLengths = bondLengths.get(periodicTableArray[i].name);
    }




    for (let item of periodicTableArray) {
        periodicTable.set(item.name, {
            symbol: item.symbol,
            possibleBonds: item.possibleBonds,
            bondLengths: bondLengths,
            atomicRadius: item.atomicRadius,
            valenceElectrons: item.valenceElectrons,
            colour: item.colour
        });
    }
})();

console.group();
console.log("periodic table:");
console.log(periodicTable);
console.groupEnd();
















const chemistryData = {
    getBondLength(element, bondingTo, type) {   // type is an integer representing a single, double, or triple bond
        let elementData = bondLengths.get(element);
        if (elementData) {
            let bond = elementData[bondingTo];
            if (bond) {
                let length = bond[type - 1];
                if (length) return length;
                console.error("there is no data on those elements sharing that many bonds");
                return undefined;
            }
            console.error("there is no data on " + element + " bonding to \"" + bondingTo + "\"");
            return undefined;
        }
        console.error("there is no data on \"" + element + "\"");
        return undefined;
    },

    // TODO: FIX!
    getMaxBonds(element, bondingTo) {
        for (let item of bondLengths) {
            if (item.name == element) {
                if (item[bondingTo]) {                  // check if the second element exists in the object of the first element
                    return item[bondingTo].length;      // if so, return the max number of bonds it can make to that element
                }
                else {
                    console.error("there is no data on " + element + " bonding to " + bondingTo);
                    return false;
                }
            }
        }
        console.error("nah bwuh das cwusti. theh's no data on " + element);
        return false;
    },

    getCarbonSingleBondLength() {
        let result = bondLengths.get("carbon").carbon[0];

        if (result) return result;  // returns 154
        console.error("the bond length of a carbon-carbon single bond could not be found in the bondLengths array");
    }
};