class Overworld extends Phaser.Scene {
    constructor() {
        super('overworldScene')
    }

    create() {
        // running checks
        console.log('%cPLAY SCENE :^)', testColor)
        
        const grid = new worldGrid('././tilemaps/overworld.json')
        const player = new Player(this, grid, 0, 0, 'playerTexture');


    }

    update() {
    }
}