class Load extends Phaser.Scene {
    constructor() {
        super('LoadScene')
    }

    preload() {
        // loading bar
        this.load.json('worldData', 'src/overWorldHelpers/overWorld.json');
        this.load.image('smile','./assets/images/placeHolderPlayer.png');
        this.load.image('enemy','./assets/images/placeHolderEnemy.png')
        this.load.image('arrow','./assets/images/arrow.png')
        this.load.spritesheet('tileset', './assets/images/tileMapv2.png',{
            frameWidth: 32,
            frameHeight: 32
        })

        // load sprites
        this.load.image('player-battle', './assets/images/player-battle.png')

        this.load.image('rock-player', './assets/images/rock-player.png')
        this.load.image('paper-player', './assets/images/paper-player.png')
        this.load.image('scissors-player', './assets/images/scissors-player.png')

        this.load.image('rock-stalone', './assets/images/rock-stalone.png')
        this.load.image('paper-stalone', './assets/images/paper-stalone.png')
        this.load.image('scissors-stalone', './assets/images/scissors-stalone.png')
    }

    create() {
        // running checks
        console.log('%cLOAD SCENE :^)', testColor)
        // moving through
        this.scene.start('overworldScene')
    }
}