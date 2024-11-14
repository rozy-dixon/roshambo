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
    direction = new Vector2(0, 1);
    speed = 0;

    constructor(parent, world, gridPos){
        // make sure pos isnt populated
        if (!world.checkEnterable(gridPos)){
            console.error('Obj cannot be placed here');
        }

        world.popTile(gridPos, parent)
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


    updateDir(dir){
        if (!this.moving){
            this.direction = dir.copy();
        }
        
        // update the sprite appropriately
    }
    
    moveForward() {
        const tempTarget = this.gridPos.add(this.direction);
        if (this.moving || !this.parent.objDetection.checkIfEnterable(tempTarget)) {
            return;
        }
        this.parent.state = "mv"
        
        this.gridTargetPos.match(tempTarget); // Use add to set a new position
        this.world.popTile(this.gridTargetPos, this.parent);
        this.trueTargetPos.x = this.gridTargetPos.x * this.world.tileSize;
        this.trueTargetPos.y = this.gridTargetPos.y * this.world.tileSize;
        this.moving = true;
    }
    moveRoutine(time, delta) {
        // Calculate velocities based on direction, speed, and time delta
        const velocityX = this.direction.x * this.speed * (delta / 1000);
        const velocityY = this.direction.y * this.speed * (delta / 1000);
    
        // Update position
        this.parent.x += velocityX;
        this.parent.y += velocityY;
    
        // Check if the object has reached or overshot the target position in X or Y directions
        const checkAndCorrectPosition = (axis) => {
            if (this.direction[axis] !== 0) {
                const currentPos = this.parent[axis];
                const targetPos = this.trueTargetPos[axis];
    
                if ((this.direction[axis] > 0 && currentPos > targetPos) ||
                    (this.direction[axis] < 0 && currentPos < targetPos)) {
                    
                    this.parent[axis] = targetPos; // Snap to target position
                    this.world.dePopTile(this.gridPos); // Update world grid
                    this.gridPos = this.gridTargetPos.copy(); // Update grid position
                    this.moving = false; // Stop movement
                }
            }
        };
    
        // Apply position correction for both X and Y axes
        checkAndCorrectPosition('x');
        checkAndCorrectPosition('y');
    }
    
}


class Player extends Phaser.GameObjects.Sprite {
    states = ["idle", "walk", "talk"]
    currentState = "idle";
    constructor(scene, world, gridX, gridY) {
        super(scene, gridX * world.tileSize, gridY * world.tileSize, 'smile');

        this.world = world;
        this.speed = 200; // Speed in pixels per second
        
        this.objDetection = new objDetectionComponent(world);
        this.movement = new movementComponent(this, world, new Vector2(gridX,gridY));
        
        // Add this sprite to the scene
        this.scene.add.existing(this).setOrigin(0, 0);
        this.cursors = scene.input.keyboard.createCursorKeys();
    }


    
    updateStateMachine(){
        if (this.currentState == "idle"){
            // listen for inputs
            
        }
    }

    update(time, delta) {
        this.updateStateMachine();
        // Listen for movement inputs
        if (this.cursors.left.isDown) {
            this.movement.updateDir( new Vector2 (-1,0))
            this.movement.moveForward();
        }
        if (this.cursors.down.isDown) {
            this.movement.updateDir(new Vector2(0, 1))
            this.movement.moveForward();
        }
        if (this.cursors.up.isDown) {
            this.movement.updateDir(new Vector2(0, -1))
            this.movement.moveForward();
        }
        if (this.cursors.right.isDown) {
            this.movement.updateDir(new Vector2(1, 0))
            this.movement.moveForward();
        }
        if (this.cursors.space.isDown){
            const tempTarget = this.movement.gridPos.add(this.movement.direction)
        }
        this.movement.update(time,delta);
    }
}

class NPC extends Phaser.GameObjects.Sprite {
    constructor(scene, world, gridX, gridY, name) {
        super(scene, gridX * world.tileSize, gridY * world.tileSize, 'enemy');
        this.scene = scene
        this.name = name;
        this.world = world;
        this.speed = 32; // Speed in pixels per second
        
        this.objDetection = new objDetectionComponent(world);
        this.movement = new movementComponent(this, world, new Vector2(gridX,gridY));
        
        // Add this sprite to the scene
        this.scene.add.existing(this).setOrigin(0, 0);
        this.cursors = scene.input.keyboard.createCursorKeys();

        this.interactable = true;
    }

    interact(){

        // text? dialogue?
        this.scene.scene.start('battleScene');
        return true;
    }

    update(time, delta) {
        this.movement.update(time,delta);
    }
}

class obst {
    constructor(scene, world,position, data) {
        this.world = world;

        this.hitTiles = data["hitbox"]

        // check if it can be placed:
        let objPos = new Vector2(position[0], position[1])
        for (let i of this.hitTiles){

            let walker = new Vector2(i[0],i [1])
            let hitboxPos = objPos.add(walker);


            if (!world.checkEnterable(hitboxPos)){
                throw new Error("Overlapping objects on tile map");
            }
        }

        
        // add hitbox to tilemap 
        for (let i of data["hitbox"]){
            let walker = new Vector2(i[0],i [1])
            world.popTile(objPos.add(walker), this)
        }
        this.images= []
        // Add this images to the scene
        for (let i of data["images"]){
            let walker = new Vector2(i[1],i [2])
            let imagePos = objPos.add(walker);
            this.images.push(scene.add.sprite(imagePos.x * world.tileSize, imagePos.y * world.tileSize, 'tileset', i[0]).setOrigin(0,0))
        }


        this.cursors = scene.input.keyboard.createCursorKeys();
    }
}