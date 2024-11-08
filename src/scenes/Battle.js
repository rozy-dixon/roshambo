class Battle extends Phaser.Scene {
    constructor() {
        super('battleScene')
    }

    init() {
        // UI variables
        this.PADDING = 25;
        this.FONTSIZE = 50;
        this.TEXTSTYLE = { fontSize: this.FONTSIZE, color: '#000000' }

        this.MODES = [ "options", "attack", "bag", "defend", "run" ]
        this.OPTIONS = [ "ATTACK", "BAG", "DEFEND", "RUN" ]
        this.ATTACKOPTIONS = [ "rock", "paper", "scissors" ]

        // will need to take in opponent from overworld scene
    }

    create() {
        // running checks
        console.log('%cBATTLE SCENE :^)', testColor)

        // opponent UI boxes
        this.opponentNameUIBox = this.add.rectangle(
            this.PADDING,
            this.PADDING,
            width/3,
            height/10,
            0xffffff
        ).setOrigin(0);

        // player UI boxes
        this.playerNameUIBox = this.add.rectangle(
            width/2, 
            height/2,
            width/2 - this.PADDING,
            height/10,
            0xffffff
        ).setOrigin(0);
        this.playerOptionsUIBox = this.add.rectangle(
            width/2,
            this.playerNameUIBox.y + this.playerNameUIBox.height + this.PADDING,
            width/2 - this.PADDING,
            height - (this.playerNameUIBox.y + this.playerNameUIBox.height + this.PADDING) - this.PADDING,
            0xffffff
        ).setOrigin(0);

        // player and opponent
        this.opponent = {
            name: "Stalone",
            favors: this.ATTACKOPTIONS[0],
            health: 1,
        }

        this.player = {
            health: 1,
        }

        // -------------------------------------- UI

        this.opponentNamePlate = this.createNamePlate(this.opponentNameUIBox, this.opponent.name, this.opponent.health)
        this.playerNamePlate = this.createNamePlate(this.playerNameUIBox, 'your name...', this.player.health)

        this.attackText = this.createOptionText(this.playerOptionsUIBox, 0)
        this.bagText = this.createOptionText(this.playerOptionsUIBox, 1, false, true)
        this.defendText = this.createOptionText(this.playerOptionsUIBox, 2, true, false)
        this.runText = this.createOptionText(this.playerOptionsUIBox, 3, true, true)
        
        // visuals
        this.playerSprite = this.add.sprite((width - this.playerOptionsUIBox.width) / 2 - 100, height, 'player-battle').setOrigin(.5, 1).setScale(.5)
        this.opponentSprite = this.add.circle((centerX / 2) * 3, this.PADDING, 300, 0xffffff)

        this.arrow = this.add.circle(this.attackText.x - this.attackText.width / 2, this.attackText.y, 25, 0x0000ff).setOrigin(1.5, .5)
        this.arrowPosition = { x: 0, y: 0 }

        this.optionTexts = [
            [this.attackText, this.bagText],
            [this.defendText, this.runText]
        ]        
        this.selectText(this.arrowPosition.x, this.arrowPosition.y)

        // what texts are available?
        this.mode = this.MODES[0]

        // -------------------------------------- MODE UI display
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            if (this.arrowPosition.y > 0) {
                this.arrowPosition.y -= 1
                this.selectText(this.arrowPosition.x, this.arrowPosition.y)
                console.log(`${this.arrowPosition.x}, ${this.arrowPosition.y}`)
            }
        }
        if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
            if (this.arrowPosition.x < 1) {
                this.arrowPosition.x += 1
                this.selectText(this.arrowPosition.x, this.arrowPosition.y)
                console.log(`${this.arrowPosition.x}, ${this.arrowPosition.y}`)
            }
        }
        if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
            if (this.arrowPosition.x > 0) {
                this.arrowPosition.x -= 1
                this.selectText(this.arrowPosition.x, this.arrowPosition.y)
                console.log(`${this.arrowPosition.x}, ${this.arrowPosition.y}`)
            }
        }
        if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
            if (this.arrowPosition.y < 1) {
                this.arrowPosition.y += 1
                this.selectText(this.arrowPosition.x, this.arrowPosition.y)
                console.log(`${this.arrowPosition.x}, ${this.arrowPosition.y}`)
            }
        }
        
        // refactor lol
        if (Phaser.Input.Keyboard.JustDown(enterKey)) {
            if (this.arrowPosition.x == 0 && this.arrowPosition.y == 0) {
                this.changeMode(1)
            }
            if (this.arrowPosition.x == 0 && this.arrowPosition.y == 1) {
                this.changeMode(2)
            }
            if (this.arrowPosition.x == 1 && this.arrowPosition.y == 0) {
                this.changeMode(3)
            }
            if (this.arrowPosition.x == 1 && this.arrowPosition.y == 1) {
                this.changeMode(4)
            }
        }

        if (this.mode == "attack") {
            this.attackText.alpha = this.defendText.alpha = this.bagText.alpha = this.runText.alpha = 0
            this.arrow.alpha = 0
        }
    }

    // ------------------------------------------ HELPER FUNCTIONS

    attachToText(arrow, text) {
        arrow.x = text.x - text.width / 2
        arrow.y = text.y
    }

    selectText(x, y) {
        this.cameras.main.shake(50, 0.002)
        this.attachToText(this.arrow, this.optionTexts[x][y])
    }

    createNamePlate(UIBox, name, health) {
        const nameText = this.add.text(
            UIBox.x + this.PADDING, 
            UIBox.y + UIBox.height / 2, 
            `${name}`, 
            this.TEXTSTYLE
        ).setOrigin(0, 0.5)

        const healthText = this.add.text(
            UIBox.x + UIBox.width - this.PADDING,
            UIBox.y + UIBox.height / 2, 
            `${health}`,
            this.TEXTSTYLE
        ).setOrigin(1, 0.5)

        return { nameText, healthText }
    }

    createOptionText(UIBox, index, xOffset = false, yOffset = false) {
        const text = this.add.text(
            xOffset ? UIBox.x + UIBox.width / 4 * 3 : UIBox.x + UIBox.width / 4,
            yOffset ? UIBox.y + UIBox.height / 4 * 3 : UIBox.y + UIBox.height / 4,
            `${this.OPTIONS[index]}`,
            this.TEXTSTYLE,
        ).setOrigin(.5)

        return text
    }

    changeMode(modeIndex) {
        this.mode = this.MODES[modeIndex]
        console.log(this.mode)
    }


}