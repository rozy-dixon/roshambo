class TextBox {
    constructor(scene, options = {}) {
        this.scene = scene;
        
        // Default options for the textbox
        this.options = {
            width: options.width || scene.scale.width - 40,   // Width of the text box
            height: options.height || 100,                    // Height of the text box
            x: options.x || 0,                               // X position relative to the camera
            y: options.y || 0,         // Y position relative to the camera
            textSpeed: options.textSpeed || 50,               // Speed of the typing effect (ms per character)
            backgroundColor: options.backgroundColor || 0x000000, // Background color of the text box
            textColor: options.textColor || '#ffffff',        // Text color
            fontSize: options.fontSize || '20px',             // Font size
            fontFamily: options.fontFamily || 'Arial',        // Font family
            padding: options.padding || { x: 10, y: 10 },      // Padding within the textbox
            depth: options.depth || 10  // Default depth if not specified
        };

        this.text = '';             // Holds the full text to display
        this.currentText = '';      // Text being progressively displayed
        this.textIndex = 0;         // Index of the current character in the text
        this.isTyping = false;      // Flag to track if typing effect is active
        this.typingEvent = null;    // Event reference for typing effect

        // Create text box background
        this.createBackground();

        // Create text object within the text box
        this.createTextObject();
    }

    createBackground() {
        // Set up background rectangle and ensure it is fixed to the camera
        this.background = this.scene.add.rectangle(
            this.options.x + this.options.width / 2,
            this.options.y + this.options.height / 2,
            this.options.width,
            this.options.height,
            this.options.backgroundColor
        ).setOrigin(0.5);
        this.background.setScrollFactor(0);  // Pins background to camera
        this.background.setDepth(this.options.depth);
    }

    createTextObject() {
        // Create text and ensure it is fixed to the camera
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
        this.textObject.setScrollFactor(0);  // Pins text to camera
        this.textObject.setDepth(this.options.depth);
    }

    showText(text) {
        this.text = text;
        this.currentText = '';
        this.textIndex = 0;
        this.isTyping = true;

        // Start typing effect
        if (this.typingEvent) this.typingEvent.remove();
        this.typingEvent = this.scene.time.addEvent({
            delay: this.options.textSpeed,
            callback: this.typeCharacter,
            callbackScope: this,
            loop: true
        });
    }

    typeCharacter() {
        if (this.textIndex < this.text.length) {
            this.currentText += this.text[this.textIndex];
            this.textObject.setText(this.currentText);
            this.textIndex++;
        } else {
            // Finish typing and stop the event
            this.typingEvent.remove();
            this.isTyping = false;
        }
    }

    hideTextBox() {
        // Hides the text box and clears the text
        this.background.setVisible(false);
        this.textObject.setVisible(false);
        if (this.typingEvent) this.typingEvent.remove();
        this.isTyping = false;
    }

    showTextBox() {
        // Shows the text box without starting any text
        this.background.setVisible(true);
        this.textObject.setVisible(true);
    }
}
