async function loadJSON() {
    try {
        // Use a relative path to the JSON file
        const response = await fetch('./data.json');
        if (!response.ok) {
            throw new Error("Failed to load JSON file");
        }
        const jsonData = await response.json(); // Parse JSON data
        console.log(jsonData); // Use the JSON data as needed
    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}






class Overworld extends Phaser.Scene {
    constructor() {
        super('overworldScene')
    }

    create() {
        // running checks
        console.log('%cPLAY SCENE :^)', testColor)

        


    }

    update() {
    }
}