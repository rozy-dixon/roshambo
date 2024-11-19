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
    obj = null; //pointer to what populates it
    constructor(ts){
        this.tileSprite = ts;
    }
}

class worldGrid{
    constructor(data, scene, onLoadedCallback) {
        this.scene = scene;
        this.grid = []
        const background = data["tilemap"]["layers"]["background"];
        this.tileSize = data["tilemap"]["tileSize"];
        this.gridSize = new Vector2(background[0].length, background.length);
        this.keys = data["key"];
        for (let y = 0; y < this.gridSize.y; y++) {
            for (let x = 0; x < this.gridSize.x; x++) {
                if (this.grid[x] == null) {
                    this.grid[x] = [];
                }
                // maybe change this to have a default tile instead of showing no tile. this works better if there are layers.
                this.grid[x][y] = background[x][y] >= 0? ( new tile(this.scene.add.sprite(x * this.tileSize, y * this.tileSize, 'tileset',  background[x][y]).setOrigin(0)) ): null ;
            }
        }
    }
     // Create the grid from background data
     createGrid(background) {
        return background.map((row, y) => 
            row.map((tileId, x) => 
                new tile(this.scene.add.sprite(x * this.tileSize, y * this.tileSize, 'tileset', tileId).setOrigin(0))
            )
        );
    }



    getTile(pos) {
        return (this.grid[pos.x] && this.grid[pos.x][pos.y]) || null;
    }
    popTile(pos, arg){
        this.getTile(pos).obj = arg;
    }
    dePopTile(pos){
        this.getTile(pos).obj = null;
    }
    interact(pos){
        let temp = this.getTile(pos)
        if (temp != null && temp.obj && temp.obj.interactable == true){
            console.log(temp)
            return(temp.obj.interact());
        }
        return(false);
    }
    isTileEnterable(pos) {
        const tile = this.getTile(pos);
        return tile && !tile.obj;
    }
}
