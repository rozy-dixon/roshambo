class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    create() {
        // running checks
        console.log('%cPLAY SCENE :^)', testColor)
        // moving through
        this.scene.start('titleScene')
    }

    update() {
        
    }
}