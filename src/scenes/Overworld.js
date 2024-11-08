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
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    add(other){
        let sum = new Vector2 (this.x + other.x,this.y + other.y);
        return(sum);
    }
} 

class worldGrid{
    gridSize = [0,0]
    tileSize = 16;
    keys = {};
    constructor(path){
        loadJSON(path, (data) => {
            this.grid = data["tilemap"]["matrix"];
            this.gridSize = data["tilemap"]["size"];
            this.keys = data["keys"];
            console.table(this.grid);
        });
        
        

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
}

class tile{
    tileSprite = 0;
    populated = null; //pointer to what populates it

}





class moveableObj{
    

}


class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, grid, gridX, gridY) {
        
        
        super(scene, gridX * grid.tileSize,gridY * grid.tileSize, 'smile');
        this.grid = grid
        this.gridPos = new Vector2 (gridX, gridY);
        
        
        this.gridTargetPos = this.gridPos;
        this.trueTargetPos = this.truePos
        ;
        this.moving = false;
        this.direction = new Phaser.Math.Vector2(0, 0);
        this.speed = 32; // Speed in pixels per second


        // Add this sprite to the scene
        this.scene.add.existing(this).setOrigin(0,0);
        this.grid = grid
        this.cursors = scene.input.keyboard.createCursorKeys(); 
    }
    update(time,delta){
        
        // Listen for movement inputs
        if (this.cursors.left.isDown) {
            this.moveIn(new Vector2(-1,0));
        }
        if (this.cursors.down.isDown) {
            this.moveIn(new Vector2(0,1));
        }
        if ( this.cursors.up.isDown) {
            this.moveIn(new Vector2(0,-1));
        }
        if (this.cursors.right.isDown) {
            this.moveIn(new Vector2(1,0));
            console.log(this.gridPos);
        }

        if (this.moving) {
            this.moveRoutine(time,delta);
        }
    }

    

    // Set a new target position and start moving towards it
    moveIn(dir) {
        if (!this.moving){
            this.direction = dir;
            this.gridtargetPos = this.gridPos.add(dir);
            this.trueTargetPos.x = this.gridtargetPos.x * this.grid.tileSize;
            this.trueTargetPos.y = this.gridtargetPos.y * this.grid.tileSize;
            this.moving = true;
        }
        
    }

    moveRoutine(time,delta) {
        
        // Calculate velocity based on speed and delta time
        console.log()
        const velocityX = this.direction.x * this.speed * (delta / 1000);
        const velocityY = this.direction.y * this.speed * (delta / 1000);

        // Move the object
        this.x += velocityX;
        this.y += velocityY;

        console.log(velocityX);
        // Check if we're close to the target position
        if (Phaser.Math.Distance.Between(this.x, this.y, this.trueTargetPos.x, this.trueTargetPos.y) < 2) {
            this.x = this.trueTargetPos.x
            this.y = this.trueTargetPos.y; // Snap to target
            this.gridPos
            this.moving = false; // Stop moving
        }
    }
}



class Overworld extends Phaser.Scene {

    constructor() {
        super('overworldScene')
    }

    create() {
        // running checks
        console.log('%cPLAY SCENE :^)', testColor)
        console.log(window.location.href);
        this.grid = new worldGrid('./assets/tilemaps/overWorld.json')
        this.player = new Player(this, this.grid, 0, 0, 'playerTexture');


    }

    update(time,delta) {
        this.player.update(time,delta);
    }
}