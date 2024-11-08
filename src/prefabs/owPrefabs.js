async function loadJSON() {
    try {
        // Use a relative path to the JSON file
        const response = await fetch('./data.json');
        if (!response.ok) {
            throw new Error("Failed to load JSON file");
        }
        const jsonData = await response.json(); // Parse JSON data
        return (jsonData);
    } catch (error) {
        console.error("Error loading JSON:", error);
        return null;
    }
}

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

export class worldGrid{
    grid = [[]];
    gridSize = [0,0]
    tileSize = 16;
    keys = {};
    constructor(path){
        this.setUp(loadJSON(path));
    }

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
    setUp(data){
        // populates map with the given overworld info
        // paints it with the tiles in each position
        // populates each tile given objs
        // uses key to determine what color the tiles are
        this.grid = data.overworld.matrix;
        this.gridSize = data.overworld.size;
        this.keys = data.keys;
    }
}

class tile{
    tileSprite = 0;
    populated = null; //pointer to what populates it

}





class moveableObj{
    constructor(phaserObject, speed = 100) {
        this.phaserObject = phaserObject; // Attach any Phaser object
        this.targetPos = new Phaser.Math.Vector2(phaserObject.x, phaserObject.y);
        this.moving = false;
        this.direction = new Phaser.Math.Vector2(0, 0);
        this.speed = speed; // Speed in pixels per second
    }

    // Set a new target position and start moving towards it
    moveTo(x, y) {
        if (!this.moving){
            this.targetPos.set(x, y);
            this.moving = true;
        }
        
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


class Player extends Phaser.Sprite {
    speed = 32;
    constructor(scene, grid, gridX, gridY) {
        this.pos = Vector2 [gridX, gridY];
        this.moveDetails = new moveableObj (this, this.speed);
        x = gridX * grid.tileSize;
        y = gridY * grid.tileSize;
        super(scene, x,y, 'path to player sprite');

        // Add this sprite to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
    update(){
        // Listen for movement inputs
        if (Phaser.cursors.IsDown(cursors.left)) {
            moveTo(this.position.add(-1,0));
        }
        if (Phaser.Input.Keyboard.IsDown(cursors.down) ) {
            moveTo(this.position.add(1,0));
        }
        if (Phaser.Input.Keyboard.IsDown(cursors.left) ) {
            moveTo(this.position.add(0,-1));
        }
        if (this.cursors.down.IsDown(cursors.right)) {
            moveTo(this.position.add(0,1));
        }

        // Listen for interact buttons
    }
}

