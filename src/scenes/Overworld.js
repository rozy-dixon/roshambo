async function loadJSON() {
    try {
        // Use a relative path to the JSON file
        const response = await fetch('./data.json');
        if (!response.ok) {
            throw new Error("Failed to load JSON file");
        }
        const jsonData = await response.json(); // Parse JSON data
        console.log(jsonData); // Use the JSON data as needed
    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}




class Vector2 {
    x = 0;
    y = 0;
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    add(other){
        sum = new Vector2 (0,0);
        sum.x = this.x + other.x;
        sum.y = this.y + other.y;
        return(sum);
    }
}

class worldGrid{
    grid = [[]];
    tileSize = 16;
    keys = {};


    getTile(pos){
        return ( this.grid[ posA.x ][ posA.y ] );
    }

    checkPopulated( pos ){
        return (this.getTile(pos));
    }
    updatePopulated(posA,posB){
        // object moved from posA to posB, so A is no longer populated and B is populated
        this.getTile(posA).unPop() ;
        this.getTile(posB).pop();
    }


    populate(path){
        // uses path to find the json file
        // populates map with the given matrix
        // paints it with the tiles in each position
        // populates each tile given objs
        // uses key to determine what color the tiles are
        

        // Usage
        fetchJSONFile('https://example.com/path/to/file.json').then(jsonData => {
            console.log(jsonData);
        });
        
    }

}


class tile{
    tileSprite = 0;
    populated = false;

    pop(){
        this.populated = true
    }

    unPop(){
        this.populated = false;
    }
}

class mapObjPrefab{
    name = '';
    populates = [Vector2(0)]; // Array of positions this populates relative to starting position
}

class mapObj{
    type; // must be a map obj prefab
    position = new Vector2(0,0);
    move(direction, map){ // returns false if fails
        if (map.checkPopulated){
            return (false);
        }

        oldPosition = this.position;
        this.position = this.position.add(direction);
        updatePopulated(oldPosition,this.position);
        return (true);

        // Add code to actually move the thing in the real game.

    }
}




class Overworld extends Phaser.Scene {
    constructor() {
        super('overworldScene')
    }

    create() {
        // running checks
        console.log('%cPLAY SCENE :^)', testColor)

        


    }

    update() {
    }
}