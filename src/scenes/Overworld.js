
class Overworld extends Phaser.Scene {
    constructor() {
        super('overworldScene')
        
    }

    create() {
        console.log('%cOVERWORLD SCENE :^)', testColor)
        window.localStorage ? console.log('%cLocal storage supported by this cat! (^･･^=)~', goodColor) : console.log('%cLocal storage not supported by this cat ~(=^･･^)', badColor)


        // Instantiate the TextBox class
        this.textBox = new TextBox(this, {
            width: 400,
            height: 100,
            x: 650,
            y: 650,
            textSpeed: 50,
            backgroundColor: 0x000000,
            textColor: '#ffffff',
            fontSize: '18px',
            fontFamily: 'Arial',
            padding: { x: 20, y: 20 }
        });

        
         this.talk(["haihaihelolol","eeeeee", "wASasdasdasdasdw"])
        
        // Optionally, you can use events or player actions to trigger more text
        

        // Load the data once and then pass it along
        const worldData = this.cache.json.get('worldData');
        this.world = new worldGrid(worldData, this);

        // After grid is created, we can initialize the player and other objects
        this.player = new Player(this, this.world, 0, 0, 'smile');
        this.player.setDepth(1);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(3);

        this.enemies = []
        
        const stalone = new NPC(this, this.world, 10, 10, "Stalone", )
        this.enemies.push(stalone)

        // set up obstacles in the scene
        this.addObstacles(worldData);
    }

    update(time,delta) {
        if (this.player){
            this.player.update(time,delta);
        }   
    }
    
    addObstacles(worldData){
        this.obstacles = []
        // Get the list of obstacles needed
        const obstacleData = worldData["tilemap"]["layers"]["obstacles"]
        for (let obstacle of obstacleData){
            // Given the name and the position, add the obstacle
            const current = worldData["objInfo"][obstacle["type"]]
            this.obstacles.push(new obst(this,this.world, obstacle["pos"], current))
        }
    }
    talk(wordPacks){
        // enter talk mode, so world stops,

        // 
        

    }
}