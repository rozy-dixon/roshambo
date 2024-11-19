class Results extends Phaser.Scene {
    constructor() {
        super('resultsScene')
    }

    init(data) {
        this.OPPONENT_ATTACK = data.OPPONENT_ATTACK
        this.ATTACK = data.ATTACK

        this.PLAYERNAME = data.PLAYERNAME
    }

    create() {
        
        setTimeout(() => {
            for (let key in defeated){
                if ( defeated[key] == false){
                    this.scene.start('overworldScene')
                    return;
                }
            }
            this.scene.start('victoryScene')
        }, 1000)
    }

    update() {
        this.add.image(width / 4, height, `${this.ATTACK}-player`).setOrigin(.5, 1)
        this.add.image((width / 4) * 3, 0, `${this.OPPONENT_ATTACK}-stalone`).setOrigin(.5, 0)
    }
}