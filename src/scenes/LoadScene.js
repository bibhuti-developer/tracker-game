/** @type {Import("../typings/Phaser")} */

import { CONST } from "../config/constant";

export class LoadScene extends Phaser.Scene {
  constructor() {
    super({
      key: CONST.SCENES.LOAD
    });
  }

  preload() {
    this.load.script("webfont", "assets/script/webfont-1.6.26.js");
    
    var loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xffffff
      }
    });

    // actors :jack, knight, fzombie, mzombie, robot
    this.actorName = "jack";

    // loading sound
    this.load.audio("actorJump", "assets/audio/actor-jump.wav");
    this.load.audio("collectLession", "assets/audio/take-coin.wav");

    // Game Platform
    this.load.image("bg", "assets/image/bg/bg_3.png");
    this.load.image("ladder", "assets/image/ladder/ld_1.png");
    this.load.image("ground", "assets/image/ground32x32.png");
    this.load.image("treasure", "assets/image/treasure.png");

    this.load.atlas(
      "actorSprite",
      "assets/sprite/actor/" + this.actorName + "/spritesheet.png",
      "assets/sprite/actor/" + this.actorName + "/spritesheet.json"
    );

    // lession sprite
    this.load.atlasXML(
      "lessionSprite",
      "assets/sprite/collect/lession-sprites.png",
      "assets/sprite/collect/lession-sprites.xml"
    );

    // badge sprite
    // this.load.atlas("badgeSprite", "assets/sprite/badge/spritesheet.png","assets/sprite/badge/spritesheet.json");
    this.load.spritesheet("badgeSprite", "assets/sprite/badge/spritesheet.png",{
      frameWidth: 128,
      frameHeight: 128
    });

    // message box resources
    this.load.image("boxBack", "assets/image/msg_background.png");
    this.load.image("okButton", "assets/image/ok_button.png");

    this.load.image("video", "assets/image/video.png");
    this.load.image("quiz", "assets/image/course/quiz.png");
    this.load.image("questionnaire", "assets/image/course/questionnaire.png");
    this.load.image("forum", "assets/image/course/forum.png");
    this.load.image("label", "assets/image/course/label.png");
    this.load.image("complete", "assets/image/course/complete.png");

    this.load.on("progress", percent => {
      loadingBar.fillRect(0, 600, 1200 * percent, 10);
    });

    this.load.on("complete", () => {
	    console.log("loading complete");
	    // this.scene.start(CONST.SCENES.BOARD, { actor: this.actorName });
    });

    this.load.on("fileprogress", (file) => {
      console.log("loading - " + file.src);
    });
  }

  create() {
    
    this.make.text({
          x: 850,
          y: 700,
          text: "Press Spacebar To Continue . . . ",
          style: {
            fontSize: "20px",
            fontFamily: "Arial",
            color: "#ffffff",
            align: "center",
            backgroundColor: "#000000",
            shadow: {
              color: "#000000",
              fill: true,
              offsetX: 2,
              offsetY: 2,
              blur: 2
            }
          }
    });
	  
    var add = this.add;
    // var input = this.input;
    let message =
      "Welcome Back!\n\n SPEND 15mins Today WATCHING THE VIDEOS OR COMPLETE \n AN ASSIGNMENT TO MOVE CLOSER TO THE LADDER.";
    WebFont.load({
      google: {
        families: ["Fredericka the Great"]
      },
      active: function() {
        add
          .text(350, 150, `Carrier Ladder`, {
            fontFamily: "Fredericka the Great",
            fontSize: 60,
            color: "#ffffff"
          })
          .setShadow(1, 1, "#333333", 1, false, true);

        add
          .text(580, 220, `Game Engine`, {
            fontFamily: "Arial",
            fontSize: 30,
            color: "#ffffff"
          })
          .setShadow(0, 0, "#333333", 3, false, true);

        add
          .text(80, 400, message, {
            fontFamily: "Comic Sans MS",
            fontSize: 30,
            color: "#ffffff"
          })
          .setShadow(0, 0, "#333333", 3, false, true);
      }
    });

    this.keys = this.input.keyboard.addKeys("SPACE");
  }

  update(delta) {
    if (this.keys.SPACE.isDown) {
      this.scene.start(CONST.SCENES.BOARD, { 
        actor: this.actorName,
        studentId: this.urlParam('id')
      });
    }
  }

  urlParam(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)')
                      .exec(window.location.href);
    if (results == null) {
         return 0;
    }
    return results[1] || 0;
  }
}
