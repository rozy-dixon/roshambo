class Player extends Character {
    constructor(scene, gridX, gridY) {
        super(scene,gridX, gridY, 200,'smile');
        // When defining states, make a reference to the object it belongs to. 
        // using this in its declaration scope will refer to itself.
        const player = this;
        const states = [
            {
                name: "idle",
                enter(){},
                exit(){},
                update(time, delta) {
                    // Function to handle movement
                    const handleMovement = (direction) => {
                        player.walk.updateDir(direction);
                        if ( player.walk.moveForward()){
                            player.sm.changeState("walk");
                        }
                    };
                
                    // Listen for inputs and move the player
                    if (cursors.left.isDown) {
                        handleMovement(new Vector2(-1, 0));
                    } else if (cursors.down.isDown) {
                        handleMovement(new Vector2(0, 1));
                    } else if (cursors.up.isDown) {
                        handleMovement(new Vector2(0, -1));
                    } else if (cursors.right.isDown) {
                        handleMovement(new Vector2(1, 0));
                     } //else if (cursors.space.isDown) {
                    //     // Perform action when space is pressed
                    //     const tempTarget = player.walk.gridPos.add(player.walk.direction);
                    // }
                }
            },
            {
                name: "walk",
                enter(){},
                exit(){},
                update(time,delta){
                    
                    player.walk.update(time,delta);
                }
            },
            {
                name: "talk",
                enter(){},
                exit(){},
                update(time,delta){
                }
            }
        ]
        this.setUpSM(states);
                    
    }

    update(time, delta) {
        // Listen for movement inputs
        this.sm.update(time,delta);
    }
    actionComplete(){
        this.sm.changeState("idle");
    }
}

class NPC extends Character {
    constructor(scene, gridX, gridY, speed, sprite, name) {
        super(scene, gridX , gridY , speed, sprite);
        this.name = name;   
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
// todo: clean this up and play with the inhertance
class obst {
    constructor(scene, world,position, data) {
        this.world = world;
        this.hitTiles = data.hitbox;

        // check if it can be placed:
        let objPos = new Vector2(position[0], position[1])
        for (let i of this.hitTiles){

            let walker = new Vector2(i[0],i [1])
            let hitboxPos = objPos.add(walker);


            if (!world.isTileEnterable(hitboxPos)){
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