class Results extends Phaser.Scene {
    constructor() {
        super('resultsScene')
    }

    init(data) {
        this.OPPONENT_ATTACK = data.OPPONENT_ATTACK
        this.ATTACK = data.ATTACK
    }

    create() {
    }

    update() {
        this.add.image(width / 4, height, `${this.ATTACK}-player`).setOrigin(.5, 1)
        this.add.image((width / 4) * 3, 0, `${this.OPPONENT_ATTACK}-stalone`).setOrigin(.5, 0)
    }
}