
class Overworld extends Phaser.Scene {
    constructor() {
        super('overworldScene')
    }

    init(data) {
        this.PLAYERNAME = data.PLAYERNAME
    }

    create() {
        console.log('%cOVERWORLD SCENE :^)', testColor)

        console.log(this.PLAYERNAME)

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


        // Load the data once and then pass it along
        const worldData = this.cache.json.get('worldData');
        this.world = new worldGrid(worldData, this);

        // After grid is created, we can initialize the player and other objects
        this.player = new Player(this, savedPlayerPos[0],savedPlayerPos[1], 'smile');
        this.player.setDepth(1);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(3);



        this.enemies = []
        const stalone = new NPC(this, 30,  15,5, "enemy", "Stalone", ["I love the taste of rocks!!", "do you like rocks?", "I'm gonna throw a rock", "(70% of the time)"],0)
        this.enemies.push(stalone)


        const origami = new NPC(this, 17, 12,5, "enemy", "Origami", ["Wow!", "Lets fight!!!", "Im gonna give you a paper cut!!"], 1)
        this.enemies.push(origami)

        const animeFan = new NPC(this, 13, 40,5, "enemy", "animeFan", ["I love anime!!", "we should really watch some anime after we play rock paper scizzors!", "My favorite anime character is naruto!"], 2)
        this.enemies.push(animeFan)

        



        // set up obstacles in the scene
        this.addObstacles(worldData);
    }


    save(){
        savedPlayerPos = [this.player.gridObj.position.x,this.player.gridObj.position.y]
        
    }


    update(time,delta) {
        if (this.textBox.sm.currentState == "ready")
        if (this.player){
            this.player.update(time,delta);
        }   
        this.textBox.update(time,delta)
    }
    
    addObstacles(worldData){
        this.obstacles = []
        // Get the list of obstacles needed
        const obstacleData = worldData["tilemap"]["layers"]["obstacles"]
        for (let i = 0; i < obstacleData.length; i++){
            for ( let j = 0; j < obstacleData[i].length; j ++){
                const current =(obstacleData[i][j])
                if (current){
                    console.log(worldData['objInfo'][current])
                    this.obstacles.push(new obst(this,this.world, [j,i], worldData["objInfo"][current]))
                }
            }   
            // Given the name and the position, add the obstacle
            
        }
    }
}