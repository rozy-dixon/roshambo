// making myself not miserable
'use strict'

const dimensions = { width: 1920, height: 1080 }

// game config
let config = {
    parent: 'GAME TITLE',
    type: Phaser.AUTO,
    render: {
        pixelArt: true
    },
    width: dimensions.width,
    height: dimensions.height,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    zoom: Math.min((window.innerHeight/dimensions.height)-.01, (window.innerWidth/dimensions.width)-.01),
    scene: [ Load, Play, Keys ]
}

// game variables
const game = new Phaser.Game(config)
// convenience variables
const centerX = game.config.width/2
const centerY = game.config.height/2
// log variables
const testColor = "color: #91aa86;"
const goodColor = "color: #cfd1af;"
const badColor = "color: #c088ae;"
// key variables
let cursors