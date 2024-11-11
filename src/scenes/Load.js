class Load extends Phaser.Scene {
    constructor() {
        super('LoadScene')
    }

    preload() {
        // loading bar
        this.load.json('worldData', 'src/overWorldHelpers/overWorld.json');
        this.load.image('smile','./assets/images/placeHolderPlayer.png')
        this.load.spritesheet('tileset', './assets/images/tileMapv2.png',{
            frameWidth: 32,
            frameHeight: 32
        })
    }

    create() {
        // running checks
        console.log('%cLOAD SCENE :^)', testColor)
        // moving through
        this.scene.start('titleScene')
    }
}