import { CONST } from "../config/constant";

export class BoardScene extends Phaser.Scene {
  constructor() {
    super({
      key: CONST.SCENES.BOARD
    });
  }

  init(data){
    this.actorName = data.actor;
  }

  preload() {
    console.log(this.actorName);
    // REST call : load student course details
		this.serviceResponse = this.service();
    // console.log(JSON.stringify(this.cache.json.get('data')));

    // basic configuration
    this.tileBlock = 32;
    this.courseCount = 4;
    this.studentId = 23;
    this.layerGap = 5;
    // this.couserModulesCount = 15;
    this.actorModule = 0;
    // this.actorLevel = 0;
    this.actorFlag = true;

    this.gameWidth = this.cameras.main.width;
    this.gameHeight = this.cameras.main.height;
    this.blockX = this.gameWidth / this.tileBlock;
    this.blockY = this.gameHeight / this.tileBlock;

    // video icon
    // this.load.image("video", "assets/image/video.png");
    // this.load.image("quiz", "assets/image/course/quiz.png");
    // this.load.image("questionnaire", "assets/image/course/questionnaire.png");
    // this.load.image("forum", "assets/image/course/forum.png");

    // executing external script
    // this.load.script('gray', 'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/Gray.js');
  }

  create() {
    // this.showMessageBox("Hello Arun", 600, 300);
    // let service = JSON.stringify(this.cache.json.get('data'));
    this.service = this.cache.json.get('data');
    // while(typeof service == 'undefined'){
    //   console.log("waiting ...");
    // }
    // console.log(JSON.parse(service).modules[0]);
    this.courseCount = this.service.courses.length;

    // var wintext = this.add.text(400,300,'you win!').setOrigin(0.5).setDepth(4);
    // var ui_camera = this.cameras.add().setScroll(0,1000);
    // this.cameras.main.ignore(wintext);

    // ACTOR
    this.actor = this.physics.add.sprite(64, (this.gameHeight-32) - 128, "actorSprite");
    this.actor.body.setSize(50, 100, true);
    this.actor.setScale(0.9, 0.9).setDepth(3);
    
    let actoridleFrames = [
      { key: "actorSprite", frame: "idle_1" },
      { key: "actorSprite", frame: "idle_2" },
      { key: "actorSprite", frame: "idle_3" },
      { key: "actorSprite", frame: "idle_4" },
      { key: "actorSprite", frame: "idle_5" },
      { key: "actorSprite", frame: "idle_6" },
      { key: "actorSprite", frame: "idle_7" },
      { key: "actorSprite", frame: "idle_8" },
      { key: "actorSprite", frame: "idle_9" },
      { key: "actorSprite", frame: "idle_10" }       
    ];
    
    if(this.actorName.endsWith("zombie")) {
      actoridleFrames.push({ key: "actorSprite", frame: "idle_11" });
      actoridleFrames.push({ key: "actorSprite", frame: "idle_12" });
      actoridleFrames.push({ key: "actorSprite", frame: "idle_13" });
      actoridleFrames.push({ key: "actorSprite", frame: "idle_14" });
      actoridleFrames.push({ key: "actorSprite", frame: "idle_15" });      
    }

    const actorwalkFrames = [
      { key: "actorSprite", frame: "walk_1" },
      { key: "actorSprite", frame: "walk_2" },
      { key: "actorSprite", frame: "walk_3" },
      { key: "actorSprite", frame: "walk_4" },
      { key: "actorSprite", frame: "walk_5" },
      { key: "actorSprite", frame: "walk_6" },
      { key: "actorSprite", frame: "walk_7" },
      { key: "actorSprite", frame: "walk_8" },
      { key: "actorSprite", frame: "walk_9" },
      { key: "actorSprite", frame: "walk_10" }
    ];
    
    // PLATFORM
    this.add.tileSprite(0, 0, this.cameras.main.width * 2, this.cameras.main.height * 2, "bg");
    this.platforms = this.physics.add.staticGroup();
    

    for (let layer = 0; layer < this.blockY; layer = layer + this.layerGap) {
      this.drawPlatform(this.blockY, layer, this.layerGap);
    }

    this.physics.add.collider(this.actor, this.platforms);
    this.anims.create({
      key: "actoridle",
      frames: actoridleFrames,
      frameRate: 10,
      repeat: -1
    });
    
    this.anims.create({
      key: "actorwalk",
      frames: actorwalkFrames,
      frameRate: 10,
      repeat: -1
    });

    // lession
    const lessionFrames = [
      { key: "lessionSprite", frame: "coin_01" },
      { key: "lessionSprite", frame: "coin_02" },
      { key: "lessionSprite", frame: "coin_03" },
      { key: "lessionSprite", frame: "coin_04" },
      { key: "lessionSprite", frame: "coin_05" },
      { key: "lessionSprite", frame: "coin_06" }
    ];

    this.anims.create({ key: "lessionRotate", frames: lessionFrames, frameRate: 6,  repeat: -1 });

    for(let course = 1; course <= this.courseCount; course++) {
      this.addModules(course);
    }
    
    // KEYS
    this.leftKey = this.input.keyboard.addKey("LEFT");
    this.rightKey = this.input.keyboard.addKey("RIGHT");
    this.spacebarKey = this.input.keyboard.addKey("SPACE");
    this.esckey = this.input.keyboard.addKeys("ESC");
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    // CAMERA
    // this.cameras.main.startFollow(this.actor);
    // this.cameras.main.startFollow(this.actor,true,1,this.actor.y);
  }

  update(time, delta) {
    if (this.leftKey.isDown) {
      this.actor.flipX = true;
      this.actor.setVelocityX(-200);
      if (this.actor.body.onFloor()) {
        this.actor.anims.play("actorwalk", true);
      }
    } else if (this.rightKey.isDown) {
      this.actor.flipX = false;
      this.actor.setVelocityX(200);
      if (this.actor.body.onFloor()) {
        this.actor.anims.play("actorwalk", true);
      }
    } else {
      this.actor.setVelocityX(0);
      if (this.actor.body.onFloor()) {
        this.actor.anims.play("actoridle", true);
      }
    }

    if (this.spacebarKey.isDown && this.actor.body.onFloor()) {
      console.log("jump");
      this.sound.play('actorJump');
      this.actor.anims.play("actorjump", true);
      this.actor.setVelocityY(-350);
      this.actor.setY(this.actor.y - 50);
    }

    if (this.esckey.ESC.isDown) {
      this.scene.start(CONST.SCENES.END);
    }

  }

  // add modules to platform
  addModules(platformIndex){
    let courseModule = this.service.courses[platformIndex-1].modules;
    
    // if(platformIndex%2 == 0){ courseModule = courseModule.reverse();  }

    // this.actorModule = 0;
    
    for(let count = 1; count < courseModule.length + 1; count++){
      let moduleInfo =  this.service.courses[platformIndex-1].modules;
      let moduleInfoSplit = moduleInfo[count - 1].split(":");
      let moduleType = moduleInfoSplit[0];
      let moduleStatus = moduleInfoSplit[1];
      
      console.log(moduleStatus);
      
      if(moduleStatus == 0){
        this.actorFlag = false;
      } else if(this.actorFlag) {
        this.actorModule++;
      }
      
      let module;

      if(moduleStatus == 0){
        if(moduleType == "forum"){
          if(platformIndex%2 == 0){
            module = this.physics.add.sprite(120 + (16-count) * 64, (this.gameHeight-32) - platformIndex*128, "forum").setScale(0.8, 0.8);
          } else {
            module = this.physics.add.sprite(120 + count * 64, (this.gameHeight-32) - platformIndex*128, "forum").setScale(0.8, 0.8);
          }
          
        // module.anims.play("lessionRotate", true);
        } else if(moduleType == "questionnaire"){
          if(platformIndex%2 == 0){
            module = this.physics.add.sprite(120 + (16-count) * 64, (this.gameHeight-32) - platformIndex*128, "questionnaire").setScale(0.8, 0.8);
          } else {
            module = this.physics.add.sprite(120 + count * 64, (this.gameHeight-32) - platformIndex*128, "questionnaire").setScale(0.8, 0.8);
          }
          
          //module.anims.play("lessionRotate", true);
        } else if(moduleType == "quiz") {
          if(platformIndex%2 == 0){
            module = this.physics.add.sprite(120 + (16-count) * 64, (this.gameHeight-32) - platformIndex*128, "quiz").setScale(0.8, 0.8);
          } else {
            module = this.physics.add.sprite(120 + count * 64, (this.gameHeight-32) - platformIndex*128, "quiz").setScale(0.8, 0.8);  
          }
          
        // module.anims.play("lessionRotate", true);
        }else if(moduleType == "label") {
          if(platformIndex%2 == 0){
            module = this.physics.add.sprite(120 + (16-count) * 64, (this.gameHeight-32) - platformIndex*128, "label").setScale(0.8, 0.8);
          } else {
            module = this.physics.add.sprite(120 + count * 64, (this.gameHeight-32) - platformIndex*128, "label").setScale(0.8, 0.8);
          }
          
        // module.anims.play("lessionRotate", true);
        } else {
          if(platformIndex%2 == 0){
            module = this.physics.add.sprite(120 + (16 - count) * 64, (this.gameHeight-32) - platformIndex*128, "lessionSprite").setScale(0.8, 0.8);
          } else {
            module = this.physics.add.sprite(120 + count * 64, (this.gameHeight-32) - platformIndex*128, "lessionSprite").setScale(0.8, 0.8);   
          }
         
          module.anims.play("lessionRotate", true);
        }


        
        this.physics.add.overlap(this.actor, module, () => {
            module.setActive(false).setVisible(false);
            module.disableBody(true, true);
            
            if(moduleType == "lesson"){
              this.add.image(module.x, module.y, "video").setScale(0.8,0.8);
            } else {
              this.add.image(module.x, module.y, "complete").setScale(0.8,0.8);
            }
            
            this.sound.play('collectLession');
         });        
      } else {
        if(moduleType == "lesson"){
          if(platformIndex%2 == 0){
            module = this.physics.add.sprite(120 + (16 - count) * 64, (this.gameHeight-32) - platformIndex*128, "video").setScale(0.8, 0.8);
          } else {
            module = this.physics.add.sprite(120 + count * 64, (this.gameHeight-32) - platformIndex*128, "video").setScale(0.8, 0.8);
          }
          
        } else {
          if(platformIndex%2 == 0){
            module = this.physics.add.sprite(120 + (16 - count) * 64, (this.gameHeight-32) - platformIndex*128, "complete").setScale(0.8, 0.8);
          } else {
            module = this.physics.add.sprite(120 + count * 64, (this.gameHeight-32) - platformIndex*128, "complete").setScale(0.8, 0.8);  
          }
          
        }

        if(this.actorFlag){
          console.log(">>> " + platformIndex);
          this.actor.x = module.x + 10;
          this.actor.y = module.y;  
        }
      }

      this.physics.add.collider(module, this.platforms);
    }
  }

  drawPlatform(bY, layer, layerGap) {
    let y = bY - layer;
    for (let x = 1; x <= this.blockX + 1; x++) {
      this.platforms.create(x * this.tileBlock - this.tileBlock / 2, y * this.tileBlock - this.tileBlock / 2, "ground");
      this.platforms.setDepth(1);
    }

    if(layer%2 == 0) {
      this.add.image(this.blockX * this.tileBlock - this.tileBlock , y * this.tileBlock - this.tileBlock*4, "ladder")
          .setScale(0.12+layerGap*0.03, 0.12+layerGap*0.03).setDepth(2);
      this.add.image(this.blockX * this.tileBlock - this.tileBlock -32 , y * this.tileBlock - this.tileBlock*1, "treasure")
          .setScale(0.2+layerGap*0.05, 0.2+layerGap*0.03).setDepth(2);
    } else {
      this.add.image(this.tileBlock, y * this.tileBlock - this.tileBlock*4, "ladder")
          .setScale(0.12+layerGap*0.03, 0.12+layerGap*0.03).setDepth(2);
      this.add.image(this.tileBlock + 32, y * this.tileBlock - this.tileBlock*1, "treasure")
          .setScale(0.2+layerGap*0.05, 0.2+layerGap*0.03).setDepth(2);
    }
    
  }

  showMessageBox(msg, x, y) {
    var msgBox = this.add.group();
    var back = this.add.sprite(0, 0, "boxBack");
    var okButton = this.add.sprite(0, 0, "okButton");
    var message = this.add.text(0, 0, msg, { fill: '#0f0' });
    message.wordWrap = true;

    back.x = x;
    back.y = y;
    
    message.x = back.x / 2 - message.x / 2;
    message.y = back.y / 2 - message.y / 2;
    
    msgBox.x = x/2 - msgBox.x/2;
    msgBox.y = y/2 - msgBox.y/2;

    okButton.x = back.x / 2 + 100;
    okButton.y = back.y - okButton.y;
    
    okButton.setInteractive();

    msgBox.add(back);
    msgBox.add(okButton);
    msgBox.add(message);

    this.msgBox = msgBox;
    this.msgBox.setDepth(4);

    // okButton.on('pointerover', () => {});
    // okButton.on('pointerout', () => {});
    okButton.on('pointerdown', () => { 
       this.msgBox.clear(true); // Remove all Children.
    });
  }

  service(){
		// this.load.crossOrigin = 'anonymous';
		this.load.json('data', 'http://localhost:3001/game/studentinfo');
		// return JSON.stringify(this.cache.json.get('data'));
	}

}
