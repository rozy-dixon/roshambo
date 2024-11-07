class Vector2 {
    x = 0;
    y = 0;
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    constructor(pos){
        this.x = pos[0];
        this.y = pos[1];
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
    gridSize = [0,0]
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

    popTile(pos, arg){
        this.getTile(pos).populated = arg;
    }
    dePopTile(pos){
        this.getTile(pos).populated = null;
    }

    setUp(path){
        // uses path to find the json file
        // populates map with the given matrix
        // paints it with the tiles in each position
        // populates each tile given objs
        // uses key to determine what color the tiles are
        

        fetchJSONFile(path).then(jsonData => {
            console.log(jsonData);
        });
        
    }

}


class tile{
    tileSprite = 0;
    populated = null; //pointer to what populates it
}

class mapObjPrefab{
    name = '';
    populates = [Vector2(0)]; // Array of positions this populates relative to starting position
    speed = 0;
    sprite

    constructor(name, spots, speed, sprite){
        this.name = name;
        this.populates = spots;
        this.speed = speed;
        this.sprite = sprite
    }
}

class mapObj{
    type; // must be a map obj prefab
    pos = new Vector2(0,0);

    constructor(type,pos){
        this.type = type;
        this.pos= pos;
    }

}


class liveObj{
    constructor(phaserObject, speed = 100) {
        this.phaserObject = phaserObject; // Attach any Phaser object
        this.targetPos = new Phaser.Math.Vector2(phaserObject.x, phaserObject.y);
        this.moving = false;
        this.direction = new Phaser.Math.Vector2(0, 0);
        this.speed = speed; // Speed in pixels per second
    }

    // Set a new target position and start moving towards it
    moveTo(x, y) {
        this.targetPos.set(x, y);
        this.moving = true;
    }

    update(delta) {
        if (this.moving) {
            this.moveRoutine(delta);
        }
    }

    moveRoutine(delta) {
        const currentPos = this.phaserObject.getCenter(); // Current position of the Phaser object
        this.direction = this.targetPos.clone().subtract(currentPos).normalize();

        // Calculate velocity based on speed and delta time
        const velocityX = this.direction.x * this.speed * (delta / 1000);
        const velocityY = this.direction.y * this.speed * (delta / 1000);

        // Move the object
        this.phaserObject.x += velocityX;
        this.phaserObject.y += velocityY;

        // Check if we're close to the target position
        if (Phaser.Math.Distance.Between(this.phaserObject.x, this.phaserObject.y, this.targetPos.x, this.targetPos.y) < 5) {
            this.phaserObject.setPosition(this.targetPos.x, this.targetPos.y); // Snap to target
            this.moving = false; // Stop moving
        }
    }

}

export default class Player extends Phaser.Sprite {
    posDetails = new mapObj;
    moveDetails = new liveObj;
    constructor(scene, map, x, y, texture) {

        super(scene, x, y, texture);

        // Add this sprite to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Custom properties
        this.speed = 200;

        // Define animations here, or call an external method for better structure
        this.createAnimations();
    }
}

class player{
    type = 'player';
    objInfo = new mapObj;
    
}
