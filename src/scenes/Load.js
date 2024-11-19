class Load extends Phaser.Scene {
    constructor() {
        super('LoadScene')
    }

    preload() {
        // loading bar
        this.load.json('worldData', 'src/overWorldHelpers/overWorld.json');
        this.load.spritesheet('playerOw', './assets/images/playerOw.png',{
            frameWidth: 32,
            frameHeight: 32
        })
        this.load.image('enemy','./assets/images/placeHolderEnemy.png')
        this.load.image('arrow','./assets/images/arrow.png')
        this.load.spritesheet('tileset', './assets/images/tileMapv2.png',{
            frameWidth: 32,
            frameHeight: 32
        })

        this.load.spritesheet('enemies','./assets/images/rpgEnemyOw.png',{
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

        this.anims.create({
            key:'Stalone',
            frames: this.anims.generateFrameNumbers('enemies', {start:2, end:3}),
            frameRate:5,
            repeat: -1
        })

        this.anims.create({
            key:'animeFan',
            frames: this.anims.generateFrameNumbers('enemies', {start:0, end:1}),
            frameRate:5,
            repeat: -1
        })
        this.anims.create({
            key:'Origami',
            frames: this.anims.generateFrameNumbers('enemies', {start:4, end:5}),
            frameRate:5,
            repeat: -1
        })

        this.anims.create({
            key:'idle',
            frames: this.anims.generateFrameNumbers('playerOw', { start:3, end: 4}),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key:'walk-south',
            frames: this.anims.generateFrameNumbers('playerOw', { start:0, end: 2}),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key:'walk-north',
            frames: this.anims.generateFrameNumbers('playerOw', { start:10, end: 12}),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key:'walk-west',
            frames: this.anims.generateFrameNumbers('playerOw', { start:14, end: 16}),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key:'walk-east',
            frames: this.anims.generateFrameNumbers('playerOw', { start:4, end: 6}),
            frameRate: 10,
            repeat: -1
        })





        this.scene.start('overworldScene')
    }
}