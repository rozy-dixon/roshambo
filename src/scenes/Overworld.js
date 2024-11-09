function loadJSON(path, callback) {
    fetch(path)
        .then((response) => response.json())
        .then((data) => {
            callback(data); // Call the provided callback with the loaded data
        })
        .catch((error) => console.error('Error loading JSON:', error));
}


class Vector2 {
    x = 0;
    y = 0;
    constructor(x = 0 ,y = 0){
        this.x = x;
        this.y = y;
    }
    add(other){
        let sum = new Vector2 (this.x + other.x,this.y + other.y);
        return(sum);
    }
    copy(){
        return (new Vector2(this.x, this.y))
    }
    match(other){
        this.x = other.x;
        this.y = other.y;
    }
    set(x,y){
        this.x = x;
        this.y = y;
    }
} 

class tile{
    tileSprite;
    populated = null; //pointer to what populates it
    constructor(ts){
        this.tileSprite = ts;
    }
}

class worldGrid{
    grid = []
    gridSize = [0,0]
    tileSize = 16;
    keys = {};
    constructor(path){
        loadJSON(path, (data) => {
            this.gridSize = data["tilemap"]["size"];
            for (let y = 0; y < this.gridSize[1]; y++){
                this.grid[y] = [];
                for (let x = 0; x < this.gridSize[0]; x++){
                    this.grid[y][x] = new tile(data["tilemap"]["matrix"][y][x]);
                }
            }
            this.keys = data["keys"];

            console.table(this.grid);
        });
    }

    getTile(pos){
        let row = this.grid[pos.x]
        if (row){
            return ( this.grid[ pos.x ][ pos.y ] );
        }
        return null;
    }
    checkPopulated( pos ){
        return (this.getTile(pos).populated);
    }
    popTile(pos, arg){
        this.getTile(pos).populated = arg;
    }
    dePopTile(pos){
        this.getTile(pos).populated = null;
    }
}


class objDetectionComponent{
    world;
    constructor(world){
        this.world = world;
    }
    checkForTag(tag, pos, offsets){
        // itterates through given tile locations offset from base tile pos
        // checks for obj with tag at those locations
        // returns first tile that finds that tag

        for (let i = 0; i < tiles.length; i++){

        }
    }

    checkIfEnterable(pos){
        console.log(pos);
        // checks if a tile exists and if it does exist, it checks if it has something populating it.
        if ((pos.x < 0 || pos.y < 0) || this.world.getTile(pos) == null || this.world.checkPopulated(pos)){
            return (false); // not enterable because it does not exist or is popualted
        }
        return (true); // enterable because it exists and is not popualted.
    }
}

class movementComponent{
    parent;
    world;

    objDetection;
    gridPos = new Vector2(0,0);
    gridTargetPos = new Vector2(0,0);
    trueTargetPos = new Vector2(0,0);

    moving = false;
    direction = new Vector2(0,0);
    speed = 0;

    constructor(parent, world, gridPos){
        this.parent = parent;
        this.world = world;

        this.gridPos.match(gridPos);
        this.gridTargetPos.match(gridPos);
        this.trueTargetPos.set(world.tileSize * gridPos.x, world.tileSize * gridPos.y);

        this.speed = parent.speed;
    }

    update(time,delta){
        if (this.moving) {
            this.moveRoutine(time, delta);
        }
    }


    moveIn(dir) {
        const tempTarget = this.gridPos.add(dir);
        if (this.moving || !this.parent.objDetection.checkIfEnterable(tempTarget)) {
            return;
        }
        
        this.direction = dir;
        this.gridTargetPos.match(tempTarget); // Use add to set a new position
        this.world.popTile(this.gridTargetPos, this.parent);
        this.trueTargetPos.x = this.gridTargetPos.x * this.world.tileSize;
        this.trueTargetPos.y = this.gridTargetPos.y * this.world.tileSize;
        this.moving = true;
        console.log("Target position:", this.gridTargetPos);
    }

    moveRoutine(time, delta) {
        const velocityX = this.direction.x * this.speed * (delta / 1000);
        const velocityY = this.direction.y * this.speed * (delta / 1000);

        this.parent.x += velocityX;
        this.parent.y += velocityY;

        if (Phaser.Math.Distance.Between(this.parent.x, this.parent.y, this.trueTargetPos.x, this.trueTargetPos.y) < 2) {
            this.parent.x = this.trueTargetPos.x;
            this.parent.y = this.trueTargetPos.y; // Snap to target
            
            this.world.dePopTile(this.gridPos);
            this.gridPos = this.gridTargetPos.copy(); // Update the grid position
            this.moving = false; // Stop moving
            
        }
    }
    
}

class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, world, gridX, gridY) {
        super(scene, gridX * world.tileSize, gridY * world.tileSize, 'smile');

        this.world = world;
        this.speed = 64; // Speed in pixels per second
        
        this.objDetection = new objDetectionComponent(world);
        this.movement = new movementComponent(this, world, new Vector2(gridX,gridY));
        
        // Add this sprite to the scene
        this.scene.add.existing(this).setOrigin(0, 0);
        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    update(time, delta) {
        // Listen for movement inputs
        if (this.cursors.left.isDown) {
            this.movement.moveIn(new Vector2(-1, 0));
        }
        if (this.cursors.down.isDown) {
            this.movement.moveIn(new Vector2(0, 1));
        }
        if (this.cursors.up.isDown) {
            this.movement.moveIn(new Vector2(0, -1));
        }
        if (this.cursors.right.isDown) {
            this.movement.moveIn(new Vector2(1, 0));
        }

        this.movement.update(time,delta);
    }
}




class Overworld extends Phaser.Scene {

    constructor() {
        super('overworldScene')
    }

    create() {
        // running checks
        console.log('%OVERWORLD SCENE :^)', testColor)
        console.log(window.location.href);


        this.grid = new worldGrid('./assets/tilemaps/overWorld.json')
        this.player = new Player(this, this.grid, 0, 0, 'playerTexture');


    }

    update(time,delta) {
        this.player.update(time,delta);
    }
}