class gridObjComponent{
    constructor(parent,position, direction = new Vector2(0,1)){
        this.parent = parent
        this.world= parent.world;
        this.position = position.copy();
        this.direction = direction.copy();
        this.world.popTile(this.position, this.parent)
    }
}

class walkComponent{
    constructor(parent, world, gridPos){
 
        this.parent = parent;
        this.world = world;
        this.gridObj = this.parent.gridObj;
        this.gridTargetPos = this.gridObj.position.copy();
        this.trueTargetPos = new Vector2 (world.tileSize * this.gridObj.position.x, world.tileSize * this.gridObj.position.y);
        this.moving = false;
        this.speed = parent.speed || 10;
    }

    
    update(time,delta){
        if (this.moving) {
            this.moveRoutine(time, delta);
        }
    }

    updateDir(dir){
        if (!this.moving){
            this.gridObj.direction = dir.copy();
        }
        
        // update the sprite appropriately
    }
    moveForward() {
        const tempTarget = this.gridObj.position.add(this.gridObj.direction);
        if (this.moving || !this.world.isTileEnterable(tempTarget)) {
            return (false);
        }
        this.world.popTile(tempTarget, this.parent)
        this.gridTargetPos.match(tempTarget); // Use add to set a new position
        this.trueTargetPos.x = this.gridTargetPos.x * this.world.tileSize;
        this.trueTargetPos.y = this.gridTargetPos.y * this.world.tileSize;
        this.moving = true;
        return (true);
    }


    moveRoutine(time, delta) {
        // Calculate velocities based on direction, speed, and time delta
        const velocityX = this.gridObj.direction.x * this.speed * (delta / 1000) * this.parent.calcSpeedMult();
        const velocityY = this.gridObj.direction.y * this.speed * (delta / 1000) * this.parent.calcSpeedMult();
        // Update position
        
        this.parent.x += velocityX;
        this.parent.y += velocityY;
        // Check if the object has reached or overshot the target position in X or Y directions
        const checkAndCorrectPosition = (axis) => {
            if (this.gridObj.direction[axis] !== 0) {
                const currentPos = this.parent[axis];
                const targetPos = this.trueTargetPos[axis];
    
                if ((this.gridObj.direction[axis] > 0 && currentPos > targetPos) ||
                    (this.gridObj.direction[axis] < 0 && currentPos < targetPos)) {
                    
                    this.parent[axis] = targetPos; // Snap to target position
                    this.world.dePopTile(this.gridObj.position, this.parent)
                    this.gridObj.position = this.gridTargetPos.copy(); // Update grid position
                    this.moving = false; // Stop movement
                    // Thhis is a temp fix. its probably better to emit a signal that this is done. or take a callback function 
                    
                    this.parent.actionComplete()
                }
            }
        };
    
        // Apply position correction for both X and Y axes
        checkAndCorrectPosition('x');
        checkAndCorrectPosition('y');
    }
}

class stateMachine {
    
    constructor(parent){
        this.parent =  parent;
        this.states = {};
        this.currentState = null;
    }
    addState(arg){
        this.states[arg.name] = arg;
    }
    changeState(newState){
        if (!(newState in this.states)){
            console.log("Invalid state!");
            return(false);
        } 
        if (newState == this.currentState){
            console.log("Already in state!");
            return(false);
        } 
        if ( this.states[this.currentState]){     // don't exit a state that doesn't exist!
            this.states[this.currentState].exit();
        }
        this.currentState = newState;
        this.states[this.currentState].enter();
    }
    update(time,delta){
        this.states[this.currentState].update(time,delta);
    }
}

