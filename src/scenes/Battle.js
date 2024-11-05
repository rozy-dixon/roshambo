class Battle extends Phaser.Scene {
    constructor() {
        super('battleScene')
    }

    init() {
        // UI variables
        this.PADDING = 25;
        this.FONTSIZE = 50;
        this.TEXTSTYLE = { fontSize: this.FONTSIZE, color: '#000000' }

        this.OPTIONS = [ "ATTACK", "BAG", "RUN", "DEFEND" ]
        this.ATTACKOPTIONS = [ "rock", "paper", "scissors" ]

        // will need to take in opponent from overworld scene
    }

    create() {
        // running checks
        console.log('%cBATTLE SCENE :^)', testColor)

        // create boxes
        this.opponentNameUIBox = this.add.rectangle(this.PADDING, this.PADDING, width/3, height/10, 0xffffff).setOrigin(0);
        this.playerNameUIBox = this.add.rectangle(width/2, height/2, width/2 - this.PADDING, height/10, 0xffffff).setOrigin(0);
        this.playerOptionsUIBox = this.add.rectangle(width/2, this.playerNameUIBox.y + this.playerNameUIBox.height + this.PADDING, width/2 - this.PADDING, height - (this.playerNameUIBox.y + this.playerNameUIBox.height + this.PADDING) - this.PADDING, 0xffffff).setOrigin(0);

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
        // opponent static text
        this.add.text(
            this.opponentNameUIBox.x + this.PADDING, 
            this.opponentNameUIBox.y + this.opponentNameUIBox.height / 2, 
            `${this.opponent.name}`, 
            this.TEXTSTYLE
        ).setOrigin(0, 0.5)

        this.opponentHealth = this.add.text(
            this.opponentNameUIBox.x + this.opponentNameUIBox.width - this.PADDING,
            this.opponentNameUIBox.y + this.opponentNameUIBox.height / 2, 
            `${this.opponent.health}`,
            this.TEXTSTYLE
        ).setOrigin(1, 0.5)

        // player static text
        this.add.text(
            this.playerNameUIBox.x + this.PADDING, 
            this.playerNameUIBox.y + this.playerNameUIBox.height / 2, 
            'your name...', 
            this.TEXTSTYLE
        ).setOrigin(0, 0.5)

        this.opponentHealth = this.add.text(
            this.playerNameUIBox.x + this.playerNameUIBox.width - this.PADDING,
            this.playerNameUIBox.y + this.playerNameUIBox.height / 2, 
            `${this.player.health}`,
            this.TEXTSTYLE
        ).setOrigin(1, 0.5)

        // player option select text
        this.attackText = this.add.text(
            this.playerOptionsUIBox.x + this.playerOptionsUIBox.width/4,
            this.playerOptionsUIBox.y + this.playerOptionsUIBox.height/4,
            `${this.OPTIONS[0]}`,
            this.TEXTSTYLE,
        ).setOrigin(.5)

        this.bagText = this.add.text(
            this.playerOptionsUIBox.x + this.playerOptionsUIBox.width/4,
            this.playerOptionsUIBox.y + this.playerOptionsUIBox.height - (this.playerOptionsUIBox.height/4),
            `${this.OPTIONS[1]}`,
            this.TEXTSTYLE,
        ).setOrigin(.5)

        this.runText = this.add.text(
            this.playerOptionsUIBox.x + this.playerOptionsUIBox.width - (this.playerOptionsUIBox.width/4),
            this.playerOptionsUIBox.y + this.playerOptionsUIBox.height/4,
            `${this.OPTIONS[2]}`,
            this.TEXTSTYLE,
        ).setOrigin(.5)

        this.defendText = this.add.text(
            this.playerOptionsUIBox.x + this.playerOptionsUIBox.width - (this.playerOptionsUIBox.width/4),
            this.playerOptionsUIBox.y + this.playerOptionsUIBox.height - (this.playerOptionsUIBox.height/4),
            `${this.OPTIONS[3]}`,
            this.TEXTSTYLE,
        ).setOrigin(.5)

        // visuals
        this.playerSprite = this.add.sprite((width - this.playerOptionsUIBox.width) / 2 - 100, height, 'player-battle').setOrigin(.5, 1).setScale(.5)
        this.opponentSprite = this.add.circle((centerX / 2) * 3, this.PADDING, 300, 0xffffff)

        this.arrow = this.add.circle(this.attackText.x - this.attackText.width / 2, this.attackText.y, 25, 0x0000ff).setOrigin(1.5, .5)

        this.optionTexts = [ this.attackText, this.bagText, this.runText, this.defendText ]
    }

    update() {
        // selection navigation
        if (cursors.up.isDown) {
            console.log('poopoo')
        }
    }

    attatchToText( arrow, text ) {
        arrow.x = text.x - text.width / 2
        arrow.y = text.y
    }
}