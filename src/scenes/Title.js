class Play extends Phaser.Scene {
    constructor() {
        super('titleScene')
    }

    create() {
        // running checks
        console.log('%cPLAY SCENE :^)', testColor)
        this.scene.start('overworldScene')
    }

    update() {
    }
}