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
    tileSize = 16;
    keys = {};
    scene;
    
    constructor(data, scene, onLoadedCallback) {
        this.scene = scene;
        const background = data["tilemap"]["layers"]["background"];
        this.tileSize = data["tilemap"]["tileSize"];
        this.gridSize = new Vector2(background[0].length, background.length);
        for (let y = 0; y < this.gridSize.y; y++) {
            for (let x = 0; x < this.gridSize.x; x++) {
                if (this.grid[x] == null) {
                    this.grid[x] = [];
                }
                this.grid[x][y] = new tile(this.scene.add.sprite(x * this.tileSize, y * this.tileSize, 'tileset', 1).setOrigin(0));
            }
        }
        this.keys = data["keys"];
        if (onLoadedCallback) {
            onLoadedCallback(); // Call the callback when loading is complete
        }
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

    checkEnterable(pos){
        let row = this.grid[pos.x]
        if (row == null || row[pos.y] == null || row[pos.y].populated){
            return (false);
        }
        return (true);
    }
}
