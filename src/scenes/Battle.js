class Battle extends Phaser.Scene {
    constructor() {
        super('battleScene')
    }

    init(data) {
        // UI variables
        this.PADDING = 25
        this.FONTSIZE = 50
        this.TEXTSTYLE = { fontSize: this.FONTSIZE, color: '#000000' }

        this.name = data.NAME;
        this.pref = data.PREF;
        this.MODES = [ "options", "attack", "bag", "defend", "run" ]
        this.OPTIONS = [ "ATTACK", "BAG", "DEFEND", "RUN" ]
        this.ATTACKOPTIONS = [ "rock", "paper", "scissors" ]

        this.PLAYERNAME = data.PLAYERNAME
    }

    create() {
        // running checks
        console.log('%cBATTLE SCENE :^)', testColor)

        // animation here
        this.cameras.main.setBackgroundColor(0xbababa)

        const battleIntroOverlay = this.add.sprite(centerX, centerY, 'battle-intro-overlay').setDepth(1)

        const tempPlayerSprite = this.add.sprite(392.5, height, 'player-fight').setOrigin(.5, 1)
        const tempOpponentSprite = this.add.sprite(width, height, `${this.name}-fight`).setOrigin(1.5, 1)

        battleIntroOverlay.anims.play('battle-intro')

        this.setupFinished = false

        battleIntroOverlay.on('animationcomplete', () => {
            tempPlayerSprite.setAlpha(0)
            tempOpponentSprite.setAlpha(0)

            // opponent UI boxes
            this.opponentNameUIBox = this.add.rectangle(
                this.PADDING,
                this.PADDING,
                width/3,
                height/10,
                0xffffff
            ).setOrigin(0)

            // player UI boxes
            this.playerNameUIBox = this.add.rectangle(
                width/2, 
                height/2,
                width/2 - this.PADDING,
                height/10,
                0xffffff
            ).setOrigin(0)
            this.playerOptionsUIBox = this.add.rectangle(
                width/2,
                this.playerNameUIBox.y + this.playerNameUIBox.height + this.PADDING,
                width/2 - this.PADDING,
                height - (this.playerNameUIBox.y + this.playerNameUIBox.height + this.PADDING) - this.PADDING,
                0xffffff
            ).setOrigin(0)

            // player and opponent
            this.opponent = {
                name: this.name,
                favors: this.pref,
                health: 1,
            }

            this.player = {
                health: 1,
            }

            // -------------------------------------- UI

            this.opponentNamePlate = this.createNamePlate(this.opponentNameUIBox, this.opponent.name, this.opponent.health)
            this.playerNamePlate = this.createNamePlate(this.playerNameUIBox, this.PLAYERNAME, this.player.health)

            this.optionOptionText = {
                attackText: this.createOptionText(this.playerOptionsUIBox, 0),
                bagText: this.createOptionText(this.playerOptionsUIBox, 1, false, true),
                defendText: this.createOptionText(this.playerOptionsUIBox, 2, true, false),
                runText: this.createOptionText(this.playerOptionsUIBox, 3, true, true),
            }
            
            // visuals
            this.playerSprite = this.add.sprite((width - this.playerOptionsUIBox.width) / 2 - 100, height, 'player-fight').setOrigin(.5, 1)
            this.opponentSprite = this.add.image(width, centerY, `${this.opponent.name}-fight`).setDepth(-1).setOrigin(1.5, .6)
            console.log(this.opponentSprite.x, this.opponentSprite.y)

            this.arrow = this.add.circle(this.optionOptionText.attackText.x - this.optionOptionText.attackText.width / 2, this.optionOptionText.attackText.y, 25, 0x0000ff).setOrigin(1.5, .5)
            this.arrowPosition = { x: 0, y: 0 }

            this.optionTexts = [
                [this.optionOptionText.attackText, this.optionOptionText.bagText],
                [this.optionOptionText.defendText, this.optionOptionText.runText]
            ]        
            this.selectText(this.arrowPosition.x, this.arrowPosition.y)

            // what texts are available?
            this.mode = this.MODES[0]

            // -------------------------------------- MODE UI display
            this.attackOptionText = {
                rockText: this.createAttackText(this.playerOptionsUIBox, 0, 1, 2).setAlpha(0),
                paperText: this.createAttackText(this.playerOptionsUIBox, 1, 2, 1).setAlpha(0),
                scissorsText: this.createAttackText(this.playerOptionsUIBox, 2, 3, 2).setAlpha(0),
            }

            this.bagOptionText = {
                bagText: this.createCenteredText(this.playerOptionsUIBox, 'you have no items').setAlpha(0)
            }

            this.defendOptionText = {
                defendText: this.createCenteredText(this.playerOptionsUIBox, 'imagine a little cut\nscene here').setAlpha(0)
            }

            this.setupFinished = true
        })
    }

    update() {
        if (this.setupFinished == false) { return }

        if (this.mode == "options") {
            this.optionOptionText.attackText.alpha = this.optionOptionText.defendText.alpha = this.optionOptionText.bagText.alpha = this.optionOptionText.runText.alpha = 1
            this.attackOptionText.rockText.alpha = this.attackOptionText.paperText.alpha = this.attackOptionText.scissorsText.alpha = 0
            this.bagOptionText.bagText.alpha = 0
            this.defendOptionText.defendText.alpha = 0
            this.arrow.alpha = 1
            if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
                if (this.arrowPosition.y > 0) {
                    this.arrowPosition.y -= 1
                    this.selectText(this.arrowPosition.x, this.arrowPosition.y)
                }
            }
            if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
                if (this.arrowPosition.x < 1) {
                    this.arrowPosition.x += 1
                    this.selectText(this.arrowPosition.x, this.arrowPosition.y)
                }
            }
            if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
                if (this.arrowPosition.x > 0) {
                    this.arrowPosition.x -= 1
                    this.selectText(this.arrowPosition.x, this.arrowPosition.y)
                }
            }
            if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
                if (this.arrowPosition.y < 1) {
                    this.arrowPosition.y += 1
                    this.selectText(this.arrowPosition.x, this.arrowPosition.y)
                }
            }
        }

        if (this.mode == "attack") {
            this.optionOptionText.attackText.alpha = this.optionOptionText.defendText.alpha = this.optionOptionText.bagText.alpha = this.optionOptionText.runText.alpha = 0
            this.attackOptionText.rockText.alpha = this.attackOptionText.paperText.alpha = this.attackOptionText.scissorsText.alpha = 1
            this.bagOptionText.bagText.alpha = 0
            this.defendOptionText.defendText.alpha = 0
            this.arrow.alpha = 0
            console.log(this.opponent.favors)
            if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
                const opChoice = this.weightedAttack(this.opponent.favors)
                if ((opChoice + 1)% 3 == 0){
                    defeated[this.opponent.name] = true;
                    
                    console.log("win");
                } else if( ( 0 + 1 )% 3 == opChoice){
                    console.log("lose")
                    for (let key in defeated){
                        defeated[key] = false;
                    }
                    savedPlayerPos = [10,8]
                } else{
                    console.log("draw")
                }

                this.scene.start('resultsScene', {
                    OPPONENT_ATTACK: this.ATTACKOPTIONS[opChoice],
                    ATTACK: this.ATTACKOPTIONS[0],
                    PLAYERNAME: this.PLAYERNAME,
                })
            }
            if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
                const opChoice = this.weightedAttack(this.opponent.favors)
                if ((opChoice + 1)% 3 == 1){
                    defeated[this.opponent.name]  = true;
                    console.log("win");
                } else if( ( 1 + 1 )% 3 == opChoice){
                    console.log("lose")
                    for (let key in defeated){
                        defeated[key] = false;
                    }
                    savedPlayerPos = [10,8]
                } else{
                    console.log("draw")
                }

                this.scene.start('resultsScene', {
                    OPPONENT_ATTACK: this.ATTACKOPTIONS[opChoice],
                    ATTACK: this.ATTACKOPTIONS[1],
                    PLAYERNAME: this.PLAYERNAME,
                })
            }
            if (Phaser.Input.Keyboard.JustDown(cursors.right)) {


                const opChoice = this.weightedAttack(this.opponent.favors)
                if ((opChoice + 1)% 3 == 2){
                    defeated[this.opponent.name] = true;
                    console.log("win");
                } else if( ( 2 + 1 )% 3 == opChoice){
                    console.log("lose")
                    for (let key in defeated){
                        defeated[key] = false;
                    }
                    savedPlayerPos = [10,8]
                } else{
                    console.log("draw")
                }


                this.scene.start('resultsScene', {
                    OPPONENT_ATTACK: this.ATTACKOPTIONS[opChoice],
                    ATTACK: this.ATTACKOPTIONS[2],
                    PLAYERNAME: this.PLAYERNAME,
                })
            }
            if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
                this.changeMode(0)
            }
        }

        if (this.mode == "defend") {
            this.optionOptionText.attackText.alpha = this.optionOptionText.defendText.alpha = this.optionOptionText.bagText.alpha = this.optionOptionText.runText.alpha = 0
            this.attackOptionText.rockText.alpha = this.attackOptionText.paperText.alpha = this.attackOptionText.scissorsText.alpha = 0
            this.bagOptionText.bagText.alpha = 0
            this.defendOptionText.defendText.alpha = 1
            this.arrow.alpha = 0
            if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
                this.changeMode(0)
            }
        }

        if (this.mode == "run") {
            this.changeMode(0)
        }

        if (this.mode == "bag") {
            this.optionOptionText.attackText.alpha = this.optionOptionText.defendText.alpha = this.optionOptionText.bagText.alpha = this.optionOptionText.runText.alpha = 0
            this.attackOptionText.rockText.alpha = this.attackOptionText.paperText.alpha = this.attackOptionText.scissorsText.alpha = 0
            this.bagOptionText.bagText.alpha = 1
            this.defendOptionText.defendText.alpha = 0
            this.arrow.alpha = 0
            if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
                this.changeMode(0)
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
    }

    // ------------------------------------------ HELPER FUNCTIONS

    weightedAttack(wieghtedIndex, range = 3) {
        const weights = Array.from({ length: range }, (_, i) => (i === wieghtedIndex ? 5 : 1))
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)

        let randomValue = Math.random() * totalWeight
        for (let i = 0; i < range; i++) {
            randomValue -= weights[i]
            if (randomValue < 0) {
            return i
            }
        }
    }

    attachToText(arrow, text) {
        arrow.x = text.x - text.width / 2
        arrow.y = text.y
    }

    selectText(x, y) {
        if (this.mode == "options") {
            this.cameras.main.shake(50, 0.002)
            this.attachToText(this.arrow, this.optionTexts[x][y])
        }
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

    createAttackText(UIBox, index, xPos, yPos) {
        const text = this.add.text(
            UIBox.x + UIBox.width / 4 * xPos,
            UIBox.y + UIBox.height / 3 * yPos,
            `${this.ATTACKOPTIONS[index]}`,
            this.TEXTSTYLE,
        ).setOrigin(.5)

        return text
    }

    createCenteredText(UIBox, string) {
        const text = this.add.text(
            UIBox.x + UIBox.width / 2,
            UIBox.y + UIBox.height / 2,
            string,
            this.TEXTSTYLE,
        ).setOrigin(.5)

        return text
    }

    changeMode(modeIndex) {
        this.mode = this.MODES[modeIndex]
        console.log(this.mode)
    }
}