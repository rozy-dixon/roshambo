class TextBox {
    constructor(scene, options = {}) {
        this.scene = scene;

        // Default options for the text box
        this.options = {
            width: options.width || scene.scale.width - 40,
            height: options.height || 100,
            x: options.x || 0,
            y: options.y || 0,
            textSpeed: options.textSpeed || 50,
            backgroundColor: options.backgroundColor || 0x000000,
            textColor: options.textColor || '#ffffff',
            fontSize: options.fontSize || '20px',
            fontFamily: options.fontFamily || 'Arial',
            padding: options.padding || { x: 10, y: 10 },
            depth: options.depth || 10
        };

        this.callback = null;
        this.sentenceBuffer = [];
        this.textIndex = 0;
        this.typingEvent = null;

        // Create text box components
        this.createBackground();
        this.createTextObject();
        this.hideTextBox();

        // Initialize state machine and set up states
        this.sm = new stateMachine(this);
        this.setUpSM();
        this.sm.changeState("ready");
    }

    // Public methods
    addParagraph(paragraph, callback = null) {
        if (this.sm.currentState === "ready") {
            this.sentenceBuffer = paragraph;
            this.callback = callback;
            return true;
        }
        return false;
    }

    update(time, delta) {
        this.sm.update(time, delta);
    }

    // Private methods
    setUpSM() {
        const box = this;
        const states = [
            {
                name: "ready",
                enter() {},
                exit() {},
                update() {
                    if (box.sentenceBuffer.length > 0) {
                        box.sm.changeState("writing");
                    }
                }
            },
            {
                name: "writing",
                enter() {
                    box.printSentence();
                },
                exit() {},
                update() {}
            },
            {
                name: "displaying",
                enter() {},
                exit() {},
                update() {
                    if (Phaser.Input.Keyboard.JustDown(enterKey)) {
                        if (box.sentenceBuffer.length > 0) {
                            box.sm.changeState("writing");
                        } else {
                            box.endDialogue();
                            if (box.callback) {
                                box.callback();
                            }
                            box.sm.changeState("ready");
                        }
                    }
                }
            }
        ];
        states.forEach(state => box.sm.addState(state));
    }

    printSentence() {
        this.currentSentence = this.sentenceBuffer.shift();
        this.textIndex = 0;

        // Show the text box and start typing effect
        this.showTextBox();
        if (this.typingEvent) this.typingEvent.remove();
        this.typingEvent = this.scene.time.addEvent({
            delay: enterKey.isDown ? this.options.textSpeed / 2 : this.options.textSpeed,
            callback: this.typeCharacter,
            callbackScope: this,
            loop: true
        });
    }

    typeCharacter() {
        if (this.textIndex < this.currentSentence.length) {
            this.textObject.setText(this.currentSentence.slice(0, ++this.textIndex));
        } else {
            this.typingEvent.remove();
            this.sm.changeState("displaying");
        }
    }

    endDialogue() {
        this.hideTextBox();
        this.textObject.setText('');
    }

    showTextBox() {
        this.background.setVisible(true);
        this.textObject.setVisible(true);
    }

    hideTextBox() {
        this.background.setVisible(false);
        this.textObject.setVisible(false);
        if (this.typingEvent) this.typingEvent.remove();
    }

    createBackground() {
        this.background = this.scene.add.rectangle(
            this.options.x + this.options.width / 2,
            this.options.y + this.options.height / 2,
            this.options.width,
            this.options.height,
            this.options.backgroundColor
        ).setOrigin(0.5);
        this.background.setScrollFactor(0);
        this.background.setDepth(this.options.depth);
    }

    createTextObject() {
        this.textObject = this.scene.add.text(
            this.options.x + this.options.padding.x,
            this.options.y + this.options.padding.y,
            '',
            {
                fontSize: this.options.fontSize,
                fontFamily: this.options.fontFamily,
                color: this.options.textColor,
                wordWrap: { width: this.options.width - this.options.padding.x * 2 }
            }
        );
        this.textObject.setScrollFactor(0);
        this.textObject.setDepth(this.options.depth);
    }
}
