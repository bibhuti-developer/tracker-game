import {BoardScene} from './scenes/BoardScene';
import {LoadScene} from './scenes/LoadScene';

var config = {
	type: Phaser.WEBGL,
	pixelArt: true,
    width: 1200,
    height: 800,
	renderer: Phaser.AUTO,
	scale: {
		scale: 'SHOW_ALL',
		orientation: 'LANDSCAPE'
		// autoCenter: Phaser.Scale.CENTER_BOTH,
	    // mode: Phaser.Scale.FILL
	},
	resolution: window.devicePixelRatio,
	physics: {
		default: 'arcade',
		arcade: {
			debug: false,
			gravity: {
				y: 500
			}
		}
	},
	scene: [LoadScene,BoardScene]
};
// LoadScene, 
var game = new Phaser.Game(config);