class Victory extends Phaser.Scene {
    constructor() {
        super('victoryScene')
    }

    create() {
        // running checks
        console.log('%cVICTORY SCENE :^)', testColor)
        // moving through
        console.log("you win")
        console.log("go you")

        this.add.text(centerX, centerY, 'You are the rock paper scissors champion!\n(and no one got hurt)', { fontSize: "80px", fontFamily: "Helvetica, system-ui" }).setOrigin(.5)
    }

    update() {
        
    }
}