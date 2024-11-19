class Title extends Phaser.Scene {
    constructor() {
        super('titleScene')
    }

    create() {
        // running checks
        console.log('%cTITLE SCENE :^)', testColor)
        
        this.add.text(centerX, centerY, 'Roshambo RPG', { fontSize: "170px", fontFamily: "Helvetica, system-ui" }).setOrigin(.5, .80)
        this.add.text(centerX, centerY, 'The Adventures of Rock, Paper, and Scissors', { fontSize: "60px", fontFamily: "Helvetica, system-ui" }).setOrigin(.5, -.25)

        this.playerNamePrefix = 'I am '
        this.playerNameText = this.add.text(centerX, height - 150, this.playerNamePrefix, { fontSize: "45px", fontFamily: "Helvetica, system-ui" }).setOrigin(.5, 1)

        this.add.text(centerX, height - 150, 'Input your name and press ENTER to start', { fontSize: "30px", fontFamily: "Helvetica, system-ui" }).setOrigin(.5, -.25)

        this.input.keyboard.on('keydown', event => {
            this.handleKeyInput(event)
        })
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(enterKey)) {
            const playerName = this.playerNameText.text.substring(this.playerNamePrefix.length).trim()
            if (playerName.length > 0) {
                this.scene.start('overworldScene', {
                    PLAYERNAME: playerName
                })
            }
        }
    }

    handleKeyInput(event) {
        // src = https://chat.brace.tools/s/63c315af-8aba-4750-bbe5-02ac43947b6f
        const key = event.key
        const validKeys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,/;'

        let currentName = this.playerNameText.text.substring(this.playerNamePrefix.length)

        if (validKeys.includes(key) && currentName.length < 25) {
            this.playerNameText.setText(this.playerNamePrefix + currentName + key)
        } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.BACKSPACE && currentName.length > 0) {
            this.playerNameText.setText(this.playerNamePrefix + currentName.slice(0, -1))
        }
    }
}