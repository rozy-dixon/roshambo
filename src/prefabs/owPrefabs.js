class Character extends Phaser.GameObjects.Sprite{
    constructor(scene, gridX, gridY, speed, sprite) {

        super(scene, gridX * scene.world.tileSize, gridY * scene.world.tileSize, sprite);
        
        this.world = scene.world
        this.speed = speed || 200; // Speed in pixels per second
        
        this.gridObj = new gridObjComponent(this, new Vector2(gridX, gridY), new Vector2(0,1))
        this.walk = new walkComponent( this, this.world, new Vector2(gridX, gridY));
        
        // Add this sprite to the scene
        this.scene.add.existing(this).setOrigin(0, 0);
        this.sm = new stateMachine();
    }

    Init(data){

    }

    setUpSM(states){
        //adding states.
        for ( let i of states){
            this.sm.addState(i);
        }
        this.sm.changeState("idle");
    }

    update(time, delta) {
        // Listen for movement inputs
        this.sm.update(time,delta);
        this.walk.update(time,delta);
    }
    actionComplete(){}
    calcSpeedMult(){
        return(1)
    }
}

class Player extends Character {
    constructor(scene, gridX, gridY) {
        super(scene,gridX, gridY, 200,'playerOw');
        // When defining states, make a reference to the object it belongs to. 
        // using this in its declaration scope will refer to itself.
        const player = this;
        const states = [
            {
                name: "idle",
                enter(){
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
                     } else if (Phaser.Input.Keyboard.JustDown(enterKey)) {
                        const playerPosition = player.gridObj.position;
                        const playerDirection = player.gridObj.direction;
                        const lookPosition = playerPosition.add(playerDirection);

                        player.world.interact(lookPosition);
                    } else{
                        player.play("idle")
                    }
                },
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
                     } else if (Phaser.Input.Keyboard.JustDown(enterKey)) {
                        const playerPosition = player.gridObj.position;
                        const playerDirection = player.gridObj.direction;
                        const lookPosition = playerPosition.add(playerDirection);

                        player.world.interact(lookPosition);
                    }
                }
            },
            {
                name: "walk",
                enter(){
                    if (player.gridObj.direction.x == 1 && player.anims.currentAnim?.key != 'walk-west'){
                        player.play('walk-west')
                    }
                    if (player.gridObj.direction.x == -1 && player.anims.currentAnim?.key !== 'walk-east'){
                        player.play('walk-east')
                    }
                    if (player.gridObj.direction.y == 1 && player.anims.currentAnim?.key !== 'walk-south'){
                        player.play('walk-south')
                    }
                    if (player.gridObj.direction.y == -1 && player.anims.currentAnim?.key !== 'walk-north'){
                        player.play('walk-north')
                    }
                },
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
    calcSpeedMult(){
        return(spaceKey.isDown? 2: 1 )
    }
}

class NPC extends Character {
    constructor(scene, gridX, gridY, speed, sprite, name, dialogue = null, preference) {
        super(scene, gridX , gridY , speed, sprite);
        this.name = name;   
        this.dialogue = dialogue
        this.interactable = (dialogue != null);
        this.preference = preference;
        this.play(name)
    }

    

    interact(){
        console.log(defeated)
        const textSystem = this.scene.textBox;
        if (textSystem && this.dialogue){
            if (defeated[this.name] == false){
                textSystem.addParagraph(this.dialogue.slice(), () => {
                    this.scene.save()
                    this.scene.scene.start('battleScene', {
                        PLAYERNAME: this.scene.PLAYERNAME,
                        NAME: this.name,
                        PREF: this.preference
                    });
                })
            } else {
                textSystem.addParagraph([" I can't believe I lost!"], () => {
                    return;
                })
            }
            

            
        }
        
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