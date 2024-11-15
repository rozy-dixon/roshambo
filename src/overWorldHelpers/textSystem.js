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

        this.sentenceBuffer = [];      // Array to store sentences in the conversation
        this.currentSentence = '';     // Text currently being displayed
        this.textIndex = 0;            // Index for the typing effect
        this.isTyping = false;         // Flag for typing effect
        this.typingEvent = null;       // Event reference for typing effect
        this.sentenceComplete = true;  // Flag to check if a sentence has been fully displayed

        // Create text box components
        this.createBackground();
        this.createTextObject();
        this.hideTextBox();

        // Set up input for space key
        this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // Start a conversation with an array of sentences
    doConversation(sentences) {
        this.sentenceBuffer = sentences;
        this.sentenceComplete = true;
        this.showNextSentence();
    }

    update() {
        // Check if space is pressed to advance the conversation
        if (this.sentenceComplete && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.showNextSentence();
        }
    }

    showNextSentence() {
        if (this.sentenceBuffer.length > 0) {
            const nextSentence = this.sentenceBuffer.shift();
            this.showText(nextSentence);
        } else {
            this.endConversation();
        }
    }

    showText(sentence) {
        this.currentSentence = sentence;
        this.textIndex = 0;
        this.sentenceComplete = false;
        this.isTyping = true;

        // Show the text box and start typing effect
        this.showTextBox();
        if (this.typingEvent) this.typingEvent.remove();
        this.typingEvent = this.scene.time.addEvent({
            delay: this.options.textSpeed,
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
            this.isTyping = false;
            this.sentenceComplete = true; // Mark sentence as complete to wait for input
        }
    }

    endConversation() {
        this.hideTextBox();
        this.sentenceBuffer = [];
    }

    // Create and manage the text box background
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

    // Create and manage the text object within the text box
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

    // Show and hide functions for the text box
    showTextBox() {
        this.background.setVisible(true);
        this.textObject.setVisible(true);
    }

    hideTextBox() {
        this.background.setVisible(false);
        this.textObject.setVisible(false);
        if (this.typingEvent) this.typingEvent.remove();
        this.isTyping = false;
    }
}
