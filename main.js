var mainState = {
    preload: function(){ //SECTION_PRELOAD
        game.load.spritesheet('mainC', 'assets/mainChar.png', 36, 56, 8);
		game.load.spritesheet('shopkeeper', 'assets/shopkeeper.png', 36, 56, 2);
		game.load.spritesheet('gMaster', 'assets/guildmaster.png', 36, 56, 2);
		game.load.spritesheet('follower', 'assets/follower.png', 36, 56, 4);
		game.load.spritesheet('bMaster', 'assets/barrackmaster.png', 36, 56, 4);
		game.load.spritesheet('advA', 'assets/adventurerA.png', 36, 56, 4);
		game.load.spritesheet('advB', 'assets/adventurerB.png', 36, 56, 4);
		game.load.spritesheet('strBar', 'assets/StrBar.png', 26,106,51);
		game.load.spritesheet('happy','assets/happy_Icon.png',30,32,10);
		game.load.spritesheet('ham','assets/Ham.png',20,20,3);
		game.load.spritesheet('ice_cream','assets/Ice_Cream.png',20,20,3);
		game.load.spritesheet('sushi','assets/Sushi.png',20,20,3);
		game.load.image('shadeBack', 'assets/shadowFilter.png');
		game.load.image('dialogue', 'assets/dialogue.png');
		game.load.spritesheet('testBack','assets/TestBackB.png', 501, 375, 6);
		game.load.spritesheet('sceneChanger','assets/sceneChanger.png', 20, 11, 6);
		game.load.spritesheet('interacter','assets/interacter.png', 20, 11, 3);
		game.load.spritesheet('spender','assets/spender.png', 20, 11, 3);
		game.load.spritesheet('herbs','assets/herb_items.png', 40, 32, 6);
		game.load.spritesheet('fade','assets/fade.png', 500, 375, 11);
		game.load.image('skillIcon','assets/skill_Icon.png');
		game.load.image('moneyIcon','assets/money_Icon.png');
		game.load.image('counter','assets/counter.png');
		game.load.image('item_ped','assets/item_pedestal.png');
    },
    create: function(){ //SECTION_CREATE
		game.physics.startSystem(Phaser.Physics.ARCADE); 
		this.scene = game.add.sprite(0,0,'testBack');
		this.background_scenery = game.add.group();
		this.interacters = game.add.group();
		this.spenders = game.add.group();
		this.changers = game.add.group();
		this.herbs = game.add.group();
		this.prices = game.add.group();
		
		this.spender = game.add.sprite(100,0,'spender');
		this.pleaseAddPhysics(this.spender);
		this.spender.animations.add("upAndDown", [0,1,2,1],1,true);
		this.spender.animations.play("upAndDown");
		this.spender.kill();
		
		this.player = game.add.sprite(250,282,'mainC');
		this.player.enableBody = true;
		this.scene_guild();
		
		this.strValMax = 100;
		this.strValCur = 100;
		this.strPenalty = 0;
		
		this.moneyVal = 1.0;
		this.moneyGoal = 1;
		this.price_itemA = 0.75;
		this.price_itemB = 0.65;
		this.price_itemC = 1.25;
		this.price_train = 0.90;
		this.profitVal = 0.0;
		this.happyVal = 5.0;
		this.dayNum = 1;
		
		this.sceneChange.animations.add("upAndDown", [0,1,2,1],1,true);
		this.sceneChange.animations.play('upAndDown');
		
		this.strBar = game.add.sprite(0,0,'strBar');
		//STR Bar Test Code
		this.strBar.frame = Math.floor((this.strValCur/this.strValMax)*50);
		
		this.skillLvl = 1;
		this.skillVis = game.add.sprite(120, 335, 'skillIcon');
		this.skillText = game.add.text(132, 344, this.skillLvl, { font: "14px Times New Roman", fill: "#FFFFFF"});
		this.skillLabel = game.add.text(148, 353, 'Herbalist Lvl.', { font: "10px Times New Roman", fill: "#FFFFFF"});
		this.skillExp = 0; //Current Herbalist experience
		this.skillNext = 150; //Amount of EXP until next Herbalist skill level.
		this.lvlCap = 9;
		this.herbChanceTable = [[57, 92, 97, 100, 0, 0, 0],[52, 82, 90, 99, 100, 0, 0],[44, 69, 84, 96, 100, 0, 0],
							   [32, 47, 72, 94, 99, 100, 0],[25, 35, 57, 85, 98, 100, 0],[20, 27, 49, 79, 96, 100, 0],
							   [15, 20, 38, 60, 87, 99, 1], [10, 12, 24, 46, 78, 95, 100], [5, 6, 12, 26, 60, 90, 100]];
		this.herbLootChance = this.herbChanceTable[0]; //Required roll to find: Nothing, F Rank, D Rank, C Rank, B Rank, A Rank, S Rank
		this.moneyVis = game.add.sprite(10, 340, 'moneyIcon');
		this.moneyText = game.add.text(30, 348, this.moneyVal + ' gold', { font: "14px Times New Roman", fill: "#FFFC82" });
		
		this.happyVis = game.add.sprite(23, 0, 'happy');
		this.happyVis.animations.add("v_happy",[0,1],2,true);
		this.happyVis.animations.add("happy",[2,3],2,true);
		this.happyVis.animations.add("neutral",[4,5],2,true);
		this.happyVis.animations.add("sad",[6,7],2,true);
		this.happyVis.animations.add("v_sad",[8,9],2,true);
		
		this.dayText = game.add.text(440, 10, 'Day ' + this.dayNum, { font: "16px Arial", fill: "#FFFFFF" });
		this.alertText = game.add.text(60, 10, '', { font: "16px Arial", fill: "#FF4044" });
		var aniArray = [];
		for(i = 50; i >= 0; i--){
			aniArray[aniArray.length] = i;
		}
		
		this.strBar.animations.add('test',aniArray,9,true);
		
		this.player.animations.add('idleL',[0,1],2,true);
		this.player.animations.add('idleR',[7,6],2,true);
		this.player.animations.add('walkL',[3,0,2,0],8,true);
		this.player.animations.add('walkR',[4,7,5,7],8,true);
		game.world.setBounds(0, 0, 500, 282); //Original Values: 500 x 307
		game.physics.arcade.enable(this.player);
		this.player.body.collideWorldBounds = true;
		this.player.body.gravity.y = 10;
		
		//this.strBar.animations.play('test');
		this.player.animations.play('idleR');
		this.happyVis.animations.play('v_happy');
		
		this.right = game.input.keyboard.addKey(Phaser.Keyboard.D);
		this.left = game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.interact = game.input.keyboard.addKey(Phaser.Keyboard.E);
		this.controlsOn = true;
		
		this.fadeFilter = game.add.sprite(0,0,'fade');
		this.fadeFilter.animations.add('fadeOut',[0,1,2,3,4,5,6,7,8,9,10],11,false);
		this.fadeFilter.animations.add('fadeIn',[10,9,8,7,6,5,4,3,2,1,0],11,false);
		//this.shade = game.add.sprite(0,0,'shadeBack');
		this.shadeText = game.add.text(125, 100, '', { font: "14px Arial", fill: "#FFFFFF" }); //FF0711
		
		this.talkFilter = game.add.sprite(0,0,'dialogue');
		this.talkFilter.kill();
		this.dialogueText = game.add.text(50, 35, '', { font: "16px Arial", fill: "#FFFFFF" });
		this.diaVariant = 0; //This is for multiple unique conversations in a single day.
	},
    update: function(){ //SECTION_UPDATE
		if(this.controlsOn && this.right.isDown && !this.left.isDown){
			this.player.animations.play('walkR');
			this.player.body.velocity.x = 80;
		}else if(this.controlsOn && this.left.isDown && !this.right.isDown){
			this.player.animations.play('walkL');
			this.player.body.velocity.x = -80;
		}else if(this.controlsOn && !this.right.isDown && !this.left.isDown){
			if(this.player.body.velocity.x > 0){
				this.player.animations.play('idleR');
			}else if(this.controlsOn && this.player.body.velocity.x < 0){
				this.player.animations.play('idleL');
			}
			this.player.body.velocity.x = 0;
		}
		this.game.physics.arcade.overlap(this.player, this.changers, this.sceneInteractCheck, null, this);
		this.game.physics.arcade.overlap(this.player, this.herbs, this.herbPickup, null, this);
		this.game.physics.arcade.overlap(this.player, this.interacters, this.interactIDCheck, null, this);
		this.game.physics.arcade.overlap(this.player, this.spenders, this.purchase, null, this);
		if(this.inDialogue && this.game.input.keyboard.downDuration(Phaser.Keyboard.E, 10)){
			this.page += 1;
		}
	},
	autoRound: function(num){ //Used to round floats to the hundreths due to a weird decimal problem.
		return (Math.floor((num * 100)))/100;
	},
	levelTo: function(level){
		if(level <= this.lvlCap){
			console.log("LEVEL UP!");
			if(this.skillExp >= this.skillNext){
				this.skillExp = this.autoRound(this.skillExp - this.skillNext);
			}
			for(i = 0; i < (level - this.skillLvl); i+=1){
				this.skillNext = Math.floor(this.skillNext * 1.55);
			}
			this.skillLvl = level;
			this.skillText.text = level;
			this.herbLootChance = this.herbChanceTable[level - 1];
		}
	},
	interactIDCheck: function(player, interacter){
		if((this.game.input.keyboard.downDuration(Phaser.Keyboard.E, 10)) && !(this.right.isDown || this.left.isDown)){
			if((interacter.numID == 1 || interacter.numID == 2) && !this.inDialogue){
				this.inDialogue = true;
				this.controlsOn = false;
				this.page = 0;
				this.talkFilter.revive();
			}
			if(interacter.numID == 1){
				this.npc_guildmaster();
			}else if(interacter.numID == 2){
				this.npc_barracksmaster();
			}else if(interacter.numID == 3){
				this.bed_newDay();
			}
		}	 
	},
	purchase: function(player, spender){ //SECTION_PURCHASE
		if(this.game.input.keyboard.downDuration(Phaser.Keyboard.E, 10)){
			if(spender.item == "Ham" && ((this.moneyVal - spender.moneyCost) >= 0)){
					this.moneyVal = this.autoRound(this.moneyVal - spender.moneyCost);
					this.updateMoneyVis();
					if(this.strValCur + 30 <= this.strValMax){
						this.strValCur += 30;
					}else{
						this.strValCur = this.strValMax;
					}
					this.strBar.frame = Math.floor((this.strValCur/this.strValMax)*50);
					this.price_itemA = this.autoRound(this.price_itemA * 1.5);
					spender.moneyCost = this.price_itemA;
					this.prices.children[0].text = this.price_itemA;
			}else if(spender.item == "Ice Cream" && ((this.moneyVal - spender.moneyCost) >= 0)){
					this.moneyVal = this.autoRound(this.moneyVal - spender.moneyCost);
					this.updateMoneyVis();
					this.deductHappiness(-1.2);
					this.price_itemB = this.autoRound(this.price_itemB * 1.5);
					spender.moneyCost = this.price_itemB;
					this.prices.children[1].text = this.price_itemB;
			}else if(spender.item == "Sushi" && ((this.moneyVal - spender.moneyCost) >= 0)){
					this.moneyVal = this.autoRound(this.moneyVal - spender.moneyCost);
					this.updateMoneyVis();
					this.strValCur += 25;
					this.strBar.frame = Math.floor((this.strValCur/this.strValMax)*50);
					this.deductHappiness(-1.5);
					this.price_itemC = this.autoRound(this.price_itemC * 1.5);
					spender.moneyCost = this.price_itemC;
					this.prices.children[2].text = this.price_itemC;
			}else if(spender.item == "Training" && ((this.moneyVal - spender.moneyCost) >= 0) && ((this.strValCur - spender.strCost) >= 0)){
					this.moneyVal = this.autoRound(this.moneyVal - spender.moneyCost);
					this.updateMoneyVis();
					this.strValCur -= 45;
					this.strValMax = this.autoRound(this.strValMax + Math.floor((Math.random() * (this.strValMax * 0.15)) + (this.strValMax * 0.1)));
					this.strBar.frame = Math.floor((this.strValCur/this.strValMax)*50);
					this.price_train = this.autoRound(this.price_train * 1.5);
					spender.moneyCost = this.price_train;
					this.fadeFilter.animations.play("fadeOut");
					game.time.events.add(Phaser.Timer.SECOND * 5, this.simplyFadeIn, this);
			}else if(spender.item == "Training" && (((this.moneyVal - spender.moneyCost) < 0) || ((this.strValCur - spender.strCost) < 0))){
				this.alertText.text = "Not enough money or you're too tired!";
				game.time.events.add(Phaser.Timer.SECOND * 5, this.dismissAlert, this);
			}else{
				this.alertText.text = "Not enough money!";
				game.time.events.add(Phaser.Timer.SECOND * 5, this.dismissAlert, this);
			}
		}
	},
	generateHerb: function(xPos, yPos){ //SECTION_HERB_GEN
		this.d100 = Math.floor((Math.random() * 101) + 1);
		if(this.herbLootChance[0] != 0 && this.d100 <= this.herbLootChance[0]){
			//Don't generate anything nor do anything!
		}else if(this.herbLootChance[1] != 0 && (this.d100 > this.herbLootChance[0] && this.d100 <= this.herbLootChance[1])){
			this.herb = game.add.sprite(xPos, yPos, 'herbs');
			this.herb.worth = 0.05;
			this.herb.exp = 10;
			this.herb.frame = 0;
			this.pleaseAddPhysics(this.herb);
			this.herbs.add(this.herb);
		}else if(this.herbLootChance[2] != 0 && (this.d100 > this.herbLootChance[1] && this.d100 <= this.herbLootChance[2])){
			this.herb = game.add.sprite(xPos, yPos, 'herbs');
			this.herb.worth = 0.10;
			this.herb.exp = 15;
			this.herb.frame = 1;
			this.pleaseAddPhysics(this.herb);
			this.herbs.add(this.herb);
		}else if(this.herbLootChance[3] != 0 && (this.d100 > this.herbLootChance[2] && this.d100 <= this.herbLootChance[3])){
			this.herb = game.add.sprite(xPos, yPos, 'herbs');
			this.herb.worth = 0.25;
			this.herb.exp = 25;
			this.herb.frame = 2;
			this.pleaseAddPhysics(this.herb);
			this.herbs.add(this.herb);
		}else if(this.herbLootChance[4] != 0 && (this.d100 > this.herbLootChance[3] && this.d100 <= this.herbLootChance[4])){
			this.herb = game.add.sprite(xPos, yPos, 'herbs');
			this.herb.worth = 0.35;
			this.herb.exp = 40;
			this.herb.frame = 3;
			this.pleaseAddPhysics(this.herb);
			this.herbs.add(this.herb);
		}else if(this.herbLootChance[5] != 0 && (this.d100 > this.herbLootChance[4] && this.d100 <= this.herbLootChance[5])){
			this.herb = game.add.sprite(xPos, yPos, 'herbs');
			this.herb.worth = 0.60;
			this.herb.exp = 75;
			this.herb.frame = 4;
			this.pleaseAddPhysics(this.herb);
			this.herbs.add(this.herb);
		}else if(this.herbLootChance[6] != 0 && (this.d100 > this.herbLootChance[5] && this.d100 <= this.herbLootChance[6])){
			this.herb = game.add.sprite(xPos, yPos, 'herbs');
			this.herb.worth = 1.20;
			this.herb.exp = 95;
			this.herb.frame = 5;
			this.pleaseAddPhysics(this.herb);
			this.herbs.add(this.herb);
		}
	},
	herbPickup: function(player, herb){
		if(this.game.input.keyboard.downDuration(Phaser.Keyboard.E, 10)){
			this.profitVal = this.autoRound(this.profitVal + herb.worth);
			if(this.skillLvl < this.lvlCap){
				this.skillExp += herb.exp;
				if(this.skillExp >= this.skillNext){
					this.levelTo(this.skillLvl + 1);   
				}
			}
			herb.destroy();
			console.log("EXP: " + this.skillExp + " / " + this.skillNext + '\t' + "Profit: " + this.profitVal);
		}
	},
	entranceAnimate: function(){
		this.player.animations.play('idleR');
	},
	sceneInteractCheck: function(player, sceneChanger){
		if(this.game.input.keyboard.downDuration(Phaser.Keyboard.E, 10)){
			if(sceneChanger.scene == "guild"){
				this.scene_guild();
			}else if(sceneChanger.scene == "home"){
				this.scene_home();
			}else if(sceneChanger.scene == "forest"){
				if((this.strValCur - sceneChanger.strCost) >= 0){
					this.strValCur -= sceneChanger.strCost;
					this.strBar.frame = Math.floor((this.strValCur/this.strValMax)*50);
					this.scene_forest();
				}else{
					this.alertText.text = "You're too exhausted."
					game.time.events.add(Phaser.Timer.SECOND * 5, this.dismissAlert, this);
				}
			}else if(sceneChanger.scene == "market"){
				this.scene_market();
			}else if(sceneChanger.scene == "barracks"){
				this.scene_barracks();
			}else if(sceneChanger.scene == "town"){
				this.scene_town();
			}
			console.log(sceneChanger.scene);
		}
	},
	scene_town:function(){ //SECTION_SCENES
		this.scene.frame = 0;
		this.removeAllElements(this.changers);
		this.removeAllElements(this.interacters);
		this.removeAllElements(this.spenders);
		this.removeAllElements(this.background_scenery);
		this.removeAllElements(this.herbs);
		this.removeAllElements(this.prices);
		if(this.player.body != null){
			this.player.body.x = 250;
		}
		for(i = 25; i < 500; i=i+100){
			this.sceneChange = game.add.sprite(i, 276, 'sceneChanger');
			this.pleaseAddPhysics(this.sceneChange);
			if(i == 25){
				this.sceneChange.scene = "guild";
				this.sceneChange.strCost = 0;
				this.animateButton(this.sceneChange, 0);
			}else if(i == 125){
				this.sceneChange.scene = "home"; 
				this.sceneChange.strCost = 0;
				this.animateButton(this.sceneChange, 0);
			}else if(i == 225){
				this.sceneChange.scene = "forest";
				this.sceneChange.strCost = 15;
				this.sceneChange.frame = 3;
				this.animateButton(this.sceneChange, 1);
			}else if(i == 325){
				this.sceneChange.scene = "market";
				this.sceneChange.strCost = 0;
				this.animateButton(this.sceneChange, 0);
			}else{
				this.sceneChange.scene = "barracks"; 
				this.sceneChange.strCost = 0;
				this.animateButton(this.sceneChange, 0);
			}
			this.changers.add(this.sceneChange);
		}
	},
	
	pleaseAddPhysics: function(object){
		this.game.physics.arcade.enable(object);
		object.enableBody = true;
		object.body.immovable = true;
	},
	
	removeAllElements: function(group){
		while(group.children.length > 0){
			group.children[0].destroy();
		}
	},
	
	animateButton: function(button, variant){
		if(variant == 0){
			button.animations.add("upAndDown", [0,1,2,1],1,true);
			button.animations.play("upAndDown");
		}else if(variant == 1){
			button.animations.add("upAndDown", [3,4,5,4],1,true);
			button.animations.play("upAndDown");
		}
	},
	animateNPC:function(npc){
		npc.animations.add("idleL", [0,1],2,true);
		npc.animations.play("idleL");
		npc.body.collideWorldBounds = true;
	},
	scene_forest: function(){
		this.scene.frame = 2;
		this.deductHappiness(0.4);
		console.log(this.happyVal);
		if(this.player.body != null){
			this.player.body.x = 65;
		}
		this.entranceAnimate();
		this.removeAllElements(this.changers);
		this.removeAllElements(this.interacters);
		this.removeAllElements(this.spenders);
		this.removeAllElements(this.herbs);
		this.sceneChange = game.add.sprite(45, 276, 'sceneChanger');
		this.pleaseAddPhysics(this.sceneChange);
		this.sceneChange.scene = "town";
		this.animateButton(this.sceneChange, 0);
		this.changers.add(this.sceneChange);
		for(i = 103; i < 415; i+=40){
			this.generateHerb(i,249);
		}
		this.sceneChange = game.add.sprite(450, 276, 'sceneChanger');
		this.sceneChange.frame = 3;
		this.pleaseAddPhysics(this.sceneChange);
		this.sceneChange.scene = "forest";
		this.animateButton(this.sceneChange, 1);
		this.sceneChange.strCost = 15;
		this.changers.add(this.sceneChange);
	},
	
	scene_guild: function(){
		this.removeAllElements(this.changers);
		this.removeAllElements(this.interacters);
		this.removeAllElements(this.spenders);
		this.scene.frame = 3;
		if(this.player.body != null){
			this.player.body.x = 65;
		}
		this.entranceAnimate();
		this.sceneChange = game.add.sprite(45, 276, 'sceneChanger');
		this.pleaseAddPhysics(this.sceneChange);
		this.sceneChange.scene = "town";
		this.animateButton(this.sceneChange, 0);
		this.changers.add(this.sceneChange);
		this.interacter = game.add.sprite(375, 276, 'interacter');
		this.pleaseAddPhysics(this.interacter);
		this.animateButton(this.interacter, 0);
		this.interacter.numID = 1;
		this.interacters.add(this.interacter);
		this.npc = game.add.sprite(190, 185, 'follower');
		this.pleaseAddPhysics(this.npc);
		this.animateNPC(this.npc);
		this.background_scenery.add(this.npc);
		this.npc = game.add.sprite(275, 185, 'follower');
		this.pleaseAddPhysics(this.npc);
		this.npc.animations.add('idleR',[2,3],2,true);
		this.npc.animations.play('idleR');
		this.background_scenery.add(this.npc);
		this.npc = game.add.sprite(400, 250, 'gMaster');
		this.pleaseAddPhysics(this.npc);
		this.animateNPC(this.npc);
		this.background_scenery.add(this.npc);
	},
	
	scene_home: function(){
		this.scene.frame = 1;
		if(this.player.body != null){
			this.player.body.x = 65;
		}
		this.entranceAnimate();
		this.removeAllElements(this.changers);
		this.removeAllElements(this.interacters);
		this.removeAllElements(this.spenders);
		this.sceneChange = game.add.sprite(45, 276, 'sceneChanger');
		this.pleaseAddPhysics(this.sceneChange);
		this.sceneChange.scene = "town";
		this.animateButton(this.sceneChange, 0);
		this.changers.add(this.sceneChange);
		this.interacter = game.add.sprite(375, 276, 'interacter');
		this.interacter.numID = 3;
		this.pleaseAddPhysics(this.interacter);
		this.animateButton(this.interacter, 0);
		this.interacters.add(this.interacter);
	},
	
	scene_market: function(){
		this.scene.frame = 4;
		if(this.player.body != null){
			this.player.body.x = 65;
		}
		this.entranceAnimate();
		this.removeAllElements(this.changers);
		this.removeAllElements(this.interacters);
		this.removeAllElements(this.spenders);
		this.sceneChange = game.add.sprite(45, 276, 'sceneChanger');
		this.pleaseAddPhysics(this.sceneChange);
		this.sceneChange.scene = "town";
		this.animateButton(this.sceneChange, 0);
		this.changers.add(this.sceneChange);
		for(i = 125; i < 306; i=i+90){
			this.pedestal = game.add.sprite(i, 240, 'item_ped');
			this.background_scenery.add(this.pedestal);
			this.spender = game.add.sprite(i + 5, 276, 'spender');
			this.pleaseAddPhysics(this.spender);
			this.animateButton(this.spender, 0);
			if(i == 125){
				this.spender.item = "Ham";
				this.spender.moneyCost = this.price_itemA;
				this.spender.strCost = 0;
				this.price = game.add.text(i, 210, this.spender.moneyCost, { font: "10px Arial", fill: "#FFFFFF" });
				this.shopItem = game.add.sprite(i + 3, 224, "ham");
				this.pleaseAddPhysics(this.shopItem);
				this.shopItem.body.immovable = true;
				this.shopItem.animations.add("idle",[0,1,2,1],2,true);
				this.shopItem.animations.play("idle");
				this.background_scenery.add(this.shopItem)
			}else if(i == 215){
				this.spender.item = "Ice Cream";
				this.spender.moneyCost = this.price_itemB;
				this.spender.strCost = 0;
				this.price = game.add.text(i, 210, this.spender.moneyCost, { font: "10px Arial", fill: "#FFFFFF" });
				this.shopItem = game.add.sprite(i + 3, 224, "ice_cream");
				this.pleaseAddPhysics(this.shopItem);
				this.shopItem.body.immovable = true;
				this.shopItem.animations.add("idle",[0,1,2,1],2,true);
				this.shopItem.animations.play("idle");
				this.background_scenery.add(this.shopItem);
			}else if(i == 305){
				this.spender.item = "Sushi";
				this.spender.moneyCost = this.price_itemC;
				this.spender.strCost = 0;
				this.price = game.add.text(i, 210, this.spender.moneyCost, { font: "10px Arial", fill: "#FFFFFF" });
				this.shopItem = game.add.sprite(i + 3, 224, "sushi");
				this.pleaseAddPhysics(this.shopItem);
				this.shopItem.body.immovable = true;
				this.shopItem.animations.add("idle",[0,1,2,1],2,true);
				this.shopItem.animations.play("idle");
				this.background_scenery.add(this.shopItem);
			}
			this.prices.add(this.price);
			this.spenders.add(this.spender);
		}
		this.npc = game.add.sprite(415, 210, 'shopkeeper');
		this.pleaseAddPhysics(this.npc);
		this.animateNPC(this.npc);
		this.background_scenery.add(this.npc);
		this.background_scenery.add(game.add.sprite(397, 220, 'counter'));
	},
	updateMoneyVis: function(){
		if(this.moneyVal >= 0){
			this.moneyText.fill = "#FFFC82";
		}else{
			this.moneyText.fill = "#FF4044";
		}
		this.moneyText.text = this.moneyVal + " gold";
	},
	scene_barracks: function(){
		this.scene.frame = 5;
		if(this.player.body != null){
			this.player.body.x = 65;
		}
		this.entranceAnimate();
		this.removeAllElements(this.changers);
		this.removeAllElements(this.interacters);
		this.removeAllElements(this.spenders);
		this.sceneChange = game.add.sprite(45, 276, 'sceneChanger');
		this.pleaseAddPhysics(this.sceneChange);
		this.sceneChange.scene = "town";
		this.animateButton(this.sceneChange, 0);
		this.changers.add(this.sceneChange);
		this.interacter = game.add.sprite(375, 276, 'interacter');
		this.pleaseAddPhysics(this.interacter);
		this.animateButton(this.interacter, 0);
		this.interacter.numID = 2;
		this.interacters.add(this.interacter);
		this.spender = game.add.sprite(210, 276, 'spender');
		this.pleaseAddPhysics(this.spender);
		this.animateButton(this.spender, 0);
		this.spender.item = "Training";
		this.spender.moneyCost = this.price_train;
		this.spender.strCost = 20;
		this.spenders.add(this.spender);
		this.npc = game.add.sprite(400, 250, 'bMaster');
		this.pleaseAddPhysics(this.npc);
		this.animateNPC(this.npc);
		this.background_scenery.add(this.npc);
		this.npc = game.add.sprite(325, 200, 'advB');
		this.pleaseAddPhysics(this.npc);
		this.animateNPC(this.npc);
		this.background_scenery.add(this.npc);
		this.npc = game.add.sprite(125, 200, 'advA');
		this.pleaseAddPhysics(this.npc);
		this.npc.animations.add('idleR',[2,3],2,true);
		this.npc.animations.play('idleR');
		this.background_scenery.add(this.npc);
	},
	npc_guildmaster:function(){ //SECTION_DIALOGUE
		if(this.dayNum == 1 && this.diaVariant == 0){	
			if(this.page == 0){
				this.dialogueText.text = "'Ello tiny apprentice! You're actually on time for work!" 
					+ '\n' + "Your job is to head into the forest and bring us herbs.";
			}else if(this.page == 1){
				this.dialogueText.text = "The higher the quality, the more you get paid. But don't think"
				+ '\n' + "  it's easy to earn income by simply bringing us herbs!" 
				+ '\n' + "After all, there's a quota you must meet each day!";
			}else if(this.page == 2){
				this.dialogueText.text = "Fail to meet it, or slack off, we'll take it from your "
				+ '\n' + "personal finances. So you best stay focused" 
				+ '\n' + "on your job, and don't fail!";
			}else if(this.page == 3){
				this.dialogueText.text = "Today's quota is " + this.moneyGoal + " gold. Keep searching the forest " +
					'\n' + " until you're exhausted. It builds money and brings character-";
			}else if(this.page == 4){
				this.dialogueText.text = "I mean it builds character and brings you... more... experience!"
					+ '\n' + " Yes. You want to be a master herbalist? Then get yourself out"
					+ '\n' + "there and bring us some herbs!";
			}else if(this.page == 5){
				this.inDialogue = false;
				this.dialogueText.text = "";
				this.controlsOn = true;
				this.talkFilter.kill();
				this.diaVariant = 1;
			}
		}else if(this.diaVariant == 1 && this.dayNum != 9){
			if(this.page == 0){
				this.dialogueText.text = "'Ello again tiny apprentice. Did you bring something?";
			}else if(this.page == 1){
				this.dialogueText.text = "I'll take any herbs you brought back and let me see...";
			}else if(this.page == 2){
				if((this.moneyGoal - this.profitVal) >= 0){
					this.moneyGoal = this.autoRound(this.moneyGoal - this.profitVal);
				 }else{
					 this.moneyVal = this.autoRound(this.moneyVal + (this.profitVal - this.moneyGoal));
					 this.moneyGoal = 0;
				 }
				this.profitVal = 0;
				this.updateMoneyVis();
				this.dialogueText.text = "You owe " + this.moneyGoal + " gold for today's quota.";
				if(this.moneyGoal <= 0){
					this.dialogueText.text += '\n' + "You're done for the day. Good job, now go home."
				}else{
					this.dialogueText.text += '\n' + "Keep searching. No going home until"
						+ '\n' + " you've brought back enough!"
				}
			}else if(this.page == 3){
				this.inDialogue = false;
				this.dialogueText.text = "";
				this.controlsOn = true;
				this.talkFilter.kill();
				this.moneyVal = this.autoRound(this.moneyVal + this.profitVal);
				this.updateMoneyVis();
				this.profitVal = 0;
				this.diaVariant = 1;
			}
		}else if(this.diaVariant == 1 && this.dayNum == 9){
			if(this.page == 0){
				this.dialogueText.text = "...Did you bring something?";
			}else if(this.page == 1){
				this.dialogueText.text = "...";
			}else if(this.page == 2){
				if((this.moneyGoal - this.profitVal) >= 0){
					this.moneyGoal = this.autoRound(this.moneyGoal - this.profitVal);
				 }else{
					 this.moneyVal = this.autoRound(this.moneyVal + (this.profitVal - this.moneyGoal));
					 this.moneyGoal = 0;
				 }
				this.profitVal = 0;
				this.updateMoneyVis();
				this.dialogueText.text = "You owe " + this.moneyGoal + " gold.";
				if(this.moneyGoal <= 0){
					this.dialogueText.text += '\n' + "Great. Go home."
				}else{
					this.dialogueText.text += '\n' + "Keep searching."
				}
			}else if(this.page == 3){
				this.inDialogue = false;
				this.dialogueText.text = "";
				this.controlsOn = true;
				this.talkFilter.kill();
				this.moneyVal = this.autoRound(this.moneyVal + this.profitVal);
				this.updateMoneyVis();
				this.profitVal = 0;
				this.diaVariant = 1;
			}
		}else if(this.dayNum == 2){
			if(this.page == 0){
				this.dialogueText.text = "Well, well, well. Welcome back to work!";
			}else if(this.page == 1){
				this.dialogueText.text = "You look like you've improved a bit.";
			}else if(this.page == 2){
				this.dialogueText.text = "Today we need to earn " + this.moneyGoal + " gold." + '\n' + "Don't keep our clients waitin'!";
			}else if(this.page == 3){
				this.dialogueText.text = "Now get to it!";
			}else if(this.page == 4){
				this.inDialogue = false;
				this.dialogueText.text = "";
				this.controlsOn = true;
				this.talkFilter.kill();
				this.diaVariant = 1;
			}
		}else if(this.dayNum == 3){
			if(this.page == 0){
				this.dialogueText.text = "Alright, you know the drill by now."
					+ '\n' + "You don't need me telling you how to do your job!";
			}else if(this.page == 1){
				this.dialogueText.text = "Today we need to earn " + this.moneyGoal + " gold." + '\n' + "Get to it and don't dilly-dally!" 
					+ '\n' + "Do your job and go home. That's all you should ever do." + '\n' + "Now get workin'!";
			}else if(this.page == 2){
				this.inDialogue = false;
				this.dialogueText.text = "";
				this.controlsOn = true;
				this.talkFilter.kill();
				this.diaVariant = 1;
			}
		}else if(this.dayNum == 4){
			if(this.page == 0){
				this.dialogueText.text = "Yeah... 'ello! Nice to see you too. Time for work!"
					+ '\n' + "We can't afford to waste any time!";
			}else if(this.page == 1){
				this.dialogueText.text = "Today we need " + this.moneyGoal + " gold's worth of herbs." + '\n' + "We need more and more!" 
					+ '\n' + "We've got alchemists, citizens, and shady types" + '\n' + " as clients. And we've only more coming!";
			}else if(this.page == 2){
				this.dialogueText.text = "I'm raising the daily quota too quickly?" + '\n' + "Well you're getting better!" 
					+ '\n' + "I can't pay a high income to a skilled herbalist" + '\n' + " who's simply gathering grass!";
			}else if(this.page == 3){
				this.dialogueText.text = "Besides, what's keeping you busy?" + '\n' + "This work is your life now." 
					+ '\n' + "Nothing else out there matters." + '\n' + "Now quit wasting my time. Go!";
			}else if(this.page == 4){
				this.inDialogue = false;
				this.dialogueText.text = "";
				this.controlsOn = true;
				this.talkFilter.kill();
				this.diaVariant = 1;
			}
		}else if(this.dayNum == 5){
			if(this.page == 0){
				this.dialogueText.text = "Today we need " + this.moneyGoal + " gold in herbs." + '\n' + "We've got an infirmary and a church asking for plenty." 
					+ '\n' + "One's for healing, and the other for..." + '\n' + " spiritual stuff? I wouldn't know.";
			}else if(this.page == 1){
				this.dialogueText.text = "The point is that's the order for today." 
					+ '\n' + "Now that I've told you it," + '\n' + " there's no reason for you to stand there!";
			}else if(this.page == 2){
				this.dialogueText.text = "Excuse me? I'M JUST STANDING HERE?" + '\n' + "How dare you! I help prepare " 
					+ '\n' + "tinctures and potions!" + '\n' + "My skills are far more useful in here.";
			}else if(this.page == 3){
				this.dialogueText.text = "Huh? I've got assistants doing everything?" + '\n' + "Well of course! They're... er... " 
					+ '\n' + "assisting me. Besides I have to pass on my " + '\n' + "exquisite knowledge of herbalism.";
			}else if(this.page == 4){
				this.dialogueText.text = "You on the other hand have much to learn," + '\n' + "and all you're doing right now is " 
					+ '\n' + "standing around and complaining!" + '\n' + "Just go and do your job!";
			}else if(this.page == 5){
				this.inDialogue = false;
				this.dialogueText.text = "";
				this.controlsOn = true;
				this.talkFilter.kill();
				this.diaVariant = 1;
			}
		}else if(this.dayNum == 6){
			if(this.page == 0){
				this.dialogueText.text = this.moneyGoal + " golds worth." + '\n' + "Now to the forest you go!" 
					+ '\n' + "The world spins like the coin this guild lives on";
			}else if(this.page == 1){
				this.dialogueText.text = "Huh? You came here to ask about weekends?" 
					+ '\n' + "What about them exactly?";
			}else if(this.page == 2){
				this.dialogueText.text = "YOU want a weekend?" + '\n' + "From what? You've just been gathering herbs!" 
					+ '\n' + "Nothing a nights worth of sleep can't heal." + '\n' + "Now go on! Run along.";
			}else if(this.page == 3){
				this.inDialogue = false;
				this.dialogueText.text = "";
				this.controlsOn = true;
				this.talkFilter.kill();
				this.diaVariant = 1;
			}
		}else if(this.dayNum == 7){
			if(this.page == 0){
				this.dialogueText.text = this.moneyGoal + " golds worth. It's only getting tougher.";
				if(this.happyVal > 2.5){
					this.dialogueText.text += '\n' + "You're rather lively today. You must be " 
						+ '\n' + "excited to gather more plants and herbs!" 
						+ '\n' +"The more energy, the better!";
				}else if(this.happyVal <= 2.5){
					this.dialogueText.text += '\n' + "You look rather glum. " 
						+ '\n' + "Nothing a little herb hunting can't help!" 
						+ '\n' +"There's nothing to be sad about now. Is there?";
				}
			}else if(this.page == 1){
				this.dialogueText.text = "What? What's this about weekends?" 
					+ '\n' + "They don't exist! Weekends are a myth!";
			}else if(this.page == 2){
				this.dialogueText.text = "Huh? This is unjust?" + '\n' + "As far as I know, the developer didn't " 
					+ '\n' + "do any worldbuilding, so I'm certain " + '\n' + "there aren't really any laws or morals here.";
			}else if(this.page == 3){
				this.dialogueText.text = "That said, I'm being awfully generous by" + '\n' + "actually paying you for your work!" 
					+ '\n' + "So what if the work  gets harder each day? " + '\n' + "You don't have another source of income!";
			}else if(this.page == 4){
				this.dialogueText.text = "Speaking of which," + '\n' + " aren't you supposed to be doing" 
					+ '\n' + "what I'm specifically paying you for? " + '\n' + "Now skedaddle to forest with you!";
			}else if(this.page == 5){
				this.inDialogue = false;
				this.dialogueText.text = "";
				this.controlsOn = true;
				this.talkFilter.kill();
				this.diaVariant = 1;
			}
		}else if(this.dayNum == 8){
			if(this.page == 0){
				this.dialogueText.text = this.moneyGoal + " gold. That's it.";
			}else if(this.page == 1){
				this.dialogueText.text = "Nothing else for me to say.";
			}else if(this.page == 2){
				this.dialogueText.text = "...";
			}else if(this.page == 3){
				this.inDialogue = false;
				this.dialogueText.text = "";
				this.controlsOn = true;
				this.talkFilter.kill();
				this.diaVariant = 1;
			}
		}else if(this.dayNum == 9){
			if(this.page == 0){
				this.dialogueText.text = this.moneyGoal + " gold.";
			}else if(this.page == 1){
				this.dialogueText.text = "Is there something you want?" + '\n' + "You know how this all works now.";
			}else if(this.page == 2){
				this.dialogueText.text = "You wanted to become an herbalist." + '\n' + "A good one at that!";
				if(this.skillLvl <= 3){
					this.dialogueText.text += '\n' + "Although you're still a novice, with my help" + '\n' + " you'll come through!";
				}else if(this.skillLvl > 3 && this.skillLvl < 7){
					this.dialogueText.text += '\n' + "You're coming long as one!" + '\n' + "My guidance has some worth after all.";
				}else if(this.skillLvl >= 7 && this.skillLvl < 9){
					this.dialogueText.text += '\n' + "Look at far you've come in the past week!" + '\n' + "All because of me.";
				}else if(this.skillLvl == 9){
					this.dialogueText.text += '\n' + "You're pretty much a master by now!" + '\n' + "And you have me to thank for that!";
				}
			}else if(this.page == 3){
				this.dialogueText.text = "Of course, you work hard I suppose." 
					+ '\n' + " But as I am guildmaster, you will "
					+ '\n' + "do as I say. Even if you must put aside"
					+ '\n' + "  your dreams and personal happiness!";
			}else if(this.page == 4){
				this.dialogueText.text = "I've had it with this conversation." 
					+ '\n' + " We've been through this multiple times."
					+ '\n' + " Just go get herbs. It's your only purpose now."
					+ '\n' + " Now get out.";
			}else if(this.page == 5){
				this.inDialogue = false;
				this.dialogueText.text = "";
				this.controlsOn = true;
				this.talkFilter.kill();
				this.diaVariant = 1;
				this.scene_town();
			}
		}else if(this.dayNum >= 10){
			if(this.strValMax > 300 && this.moneyVal >= 0){
				this.end_adventurer();
			}else if(this.moneyVal < 0){
				this.end_debt();
			}else if(this.happyVal >= 4.0 && this.moneyVal >= 0 && this.skillLvl == 9){
				this.end_happiness();
			}else{
				this.end_neutral();
			}
		}
	},
	
	npc_barracksmaster:function(){ //SECTION_DIALOGUE
		if(this.strValMax >= 100 && this.strValMax < 150){
			if(this.page == 0){
				this.dialogueText.text = "Oi! Ye look a bit thin around the arms there." + '\n' + "Perhaps we can interest you in a lil' trainin'?";
			}else if(this.page == 1){
				this.dialogueText.text = "Maybe gettin' a bit fit will help ye work. " + '\n' + "Hard work made easier as I see it!";
			}else if(this.page == 2){
				this.dialogueText.text = "Now don't be shy! Trainin' will cost ye " + this.spenders.children[0].moneyCost + " gold!";
			}else if(this.page == 3){
				this.dialogueText.text = "Just step over to the sparrin' area, and we can start. " + '\n' + "Make sure ye got the strength and cash to get started!";
			}else if(this.page == 4){
				this.inDialogue = false;
				this.dialogueText.text = "";
				this.controlsOn = true;
				this.talkFilter.kill();
			}
		}else if(this.strValMax >= 150 && this.strValMax < 200){
			if(this.page == 0){
				this.dialogueText.text = "Oi! Ye grew a little bit there!" + '\n' + "With more trainin' you can take on anythin'!";
			}else if(this.page == 1){
				this.dialogueText.text = "But, of course, it's up to you. " + '\n' + "Though I'm sure your job will be made easier.";
			}else if(this.page == 2){
				this.dialogueText.text = "Now don't be shy! Trainin' will cost ye " + this.spenders.children[0].moneyCost + " gold!";
			}else if(this.page == 3){
				this.dialogueText.text = "Just step over to the sparrin' area, and we can start. " + '\n' + "Make sure ye got the strength and cash to get started!";
			}else if(this.page == 4){
				this.inDialogue = false;
				this.dialogueText.text = "";
				this.controlsOn = true;
				this.talkFilter.kill();
			}
		}else if(this.strValMax >= 200 && this.strValMax < 300){
			if(this.page == 0){
				this.dialogueText.text = "Oi! Ye growin' some muscle there!" + '\n' + "Ye shapin' up to be quite a strong one!";
			}else if(this.page == 1){
				this.dialogueText.text = "Things can only go up from here. " + '\n' + "Ye job will be a breeze!";
			}else if(this.page == 2){
				this.dialogueText.text = "Now keep goin'! Trainin' will cost ye " + this.spenders.children[0].moneyCost + " gold!";
			}else if(this.page == 3){
				this.dialogueText.text = "Just step over there, ye know how it works." + '\n' + "Make sure ye not tired nor too poor!";
			}else if(this.page == 4){
				this.inDialogue = false;
				this.dialogueText.text = "";
				this.controlsOn = true;
				this.talkFilter.kill();
			}
		}else if(this.strValMax >= 300){
			if(this.page == 0){
				this.dialogueText.text = "Oi! Yer quite strong now!" + '\n' + "Ye ought to be an adventurer!";
			}else if(this.page == 1){
				this.dialogueText.text = "Yer pretty much halfway there with " + '\n' + "ye job explorin' the woods and all.";
			}else if(this.page == 2){
				this.dialogueText.text = "If ye want more strength, trainin' will cost ye " + '\n' + this.spenders.children[0].moneyCost + " gold!";
			}else if(this.page == 3){
				this.dialogueText.text = "Just step over there, ye know how it works." + '\n' + "Make sure ye not tired nor too poor!";
			}else if(this.page == 4){
				this.inDialogue = false;
				this.dialogueText.text = "";
				this.controlsOn = true;
				this.talkFilter.kill();
			}
		}
	},
	bed_newDay: function(){
		this.fadeFilter.animations.play("fadeOut");
		this.dayNum += 1;
		game.time.events.add(Phaser.Timer.SECOND * 5, this.wakeUp, this);
		this.diaVariant = 0;
	},
	wakeUp:function(){
		this.fadeFilter.animations.play("fadeIn");
		this.dayText.text = "Day " + this.dayNum;
		this.strValCur = (this.strValMax - this.strPenalty);
		this.strBar.frame = Math.floor((this.strValCur/this.strValMax)*50);
		this.moneyVal = this.autoRound(this.moneyVal - this.moneyGoal);
		if(this.moneyGoal != 0){
		   this.deductHappiness(0.5);
		}
		if(this.moneyVal < 0){
			this.deductHappiness(1.0);
		}
		this.updateMoneyVis();
		this.price_itemA = 0.75;
		this.price_itemB = 0.65;
		this.price_itemC = 1.25;
		this.price_train = 0.90;
		this.moneyGoal = 1.2;
		for(i = 0; i < this.dayNum - 1; i++){
			this.price_itemA = this.autoRound(this.price_itemA * 1.25);
			this.price_itemB = this.autoRound(this.price_itemB * 1.25);
			this.price_itemC = this.autoRound(this.price_itemC * 1.25);
			this.price_train = this.autoRound(this.price_train * 1.5);
			this.moneyGoal = this.autoRound(this.moneyGoal * 1.50);
		}
	},
	simplyFadeIn: function(){
		this.fadeFilter.animations.play("fadeIn");
	},
	dismissAlert: function(){
		this.alertText.text = '';
	},
	updateHappiness: function(){
		if(this.happyVal > 4.0 && this.happyVal <= 5.0){
			this.happyVis.animations.play("v_happy");
			this.strPenalty = 0;
		}else if(this.happyVal > 3.0 && this.happyVal <= 4.0){
			this.happyVis.animations.play("happy");
			this.strPenalty = (this.strValMax * 0.15);
		}else if(this.happyVal > 2.0 && this.happyVal <= 3.0){
			this.happyVis.animations.play("neutral");
			this.strPenalty = (this.strValMax * 0.25)
		}else if(this.happyVal > 1.0 && this.happyVal <= 2.0){
			this.happyVis.animations.play("sad");
			this.strPenalty = (this.strValMax * 0.35)
		}else if(this.happyVal >= 0.0 && this.happyVal <= 1.0){
			this.happyVis.animations.play("v_sad");
			this.strPenalty = (this.strValMax * 0.50)
		}
	},
	deductHappiness: function(amount){
		if((amount > 0) && (this.happyVal - amount) >= 0){
			this.happyVal = this.autoRound(this.happyVal - amount);
		}else if((amount < 0) && (this.happyVal - amount) <= 5.0){
			this.happyVal = this.autoRound(this.happyVal - amount);
		}else if((amount < 0) && (this.happyVal - amount) > 5.0){
			this.happyVal = 5.0;
		}else if((amount > 0) && (this.happyVal - amount) < 0){
			this.happyVal = 0;
		}
		this.updateHappiness();
	},
	end_adventurer: function(){
		if(this.page == 0){
				this.dialogueText.text = this.moneyGoal + " gold.";
			}else if(this.page == 1){
				this.dialogueText.text = "What!? You're quitting? Excuse me?"
					+ '\n' + "Have you lost your mind?"
					+ '\n' + "Since when have you gained such a"
					+ '\n' + "lack of judgement?";
			}else if(this.page == 2){
				this.dialogueText.text = "You wanted to be an herbalist I thought!" 
					+ '\n' + "Not some bloody reckless adventurer!"
					+ '\n' + "No... Screw your dreams and happiness I am-";
			}else if(this.page == 3){
				this.player.animations.play("idleL");
				this.dialogueText.text = "Hey wait! Where the hell do you think"
					+ '\n' + "you're going! DON'T YOU DARE LEAVE!"
					+ '\n' + "There's nothing for you out there!";
			}else if(this.page == 4){
				this.dialogueText.text = "LISTEN TO ME!";
			}else if(this.page == 5){
				this.inDialogue = false;
				this.dialogueText.text = "";
				this.talkFilter.kill();
				this.diaVariant = 1;
				if(this.player.body.x >= 150){
					this.player.body.velocity.x = -80;
					this.player.animations.play("walkL");
				}else{
					this.player.body.velocity.x = 0;
					this.player.animations.play("idleL");
				}
				this.fadeFilter.animations.play("fadeOut");
				this.shadeText.text = "[A]dventurer Ending"
			}
	},
	end_debt:function(){
		if(this.page == 0){
				this.dialogueText.text = this.moneyGoal + " gold.";
			}else if(this.page == 1){
				this.dialogueText.text = "...What? You're quitting?"
					+ '\n' + "Did I hear that correctly?"
					+ '\n' + "I'm not going crazy, right?"
					+ '\n' + "I think there must be a mistake here.";
			}else if(this.page == 2){
				this.dialogueText.text = "YOU wanted to be an herbalist!" 
					+ '\n' + "You signed up for this. You only have yourself"
					+ '\n' + "to blame for that choice and joining this guild.";
			}else if(this.page == 3){
				this.player.animations.play("idleL");
				this.dialogueText.text = "Hahaha. You're leaving? Are you sure about that?"
					+ '\n' + "Or perhaps I ought to remind you about the "
					+ '\n' + "the monetary debt you owe me and this guild.";
					this.npc = game.add.sprite(65, 262, 'advB');
					this.pleaseAddPhysics(this.npc);
					this.npc.body.collideWorldBounds = true;
					this.npc.animations.add('idleR',[2,3],2,true);
					this.npc.animations.play('idleR');
					this.background_scenery.add(this.npc);
			}else if(this.page == 4){
				this.player.animations.play("idleR");
				this.dialogueText.text = "You will work for me for however long I require"
				+ '\n' + " and with zero complaints if you value your life.";
			}else if(this.page == 5){
				this.dialogueText.text = "Now get back to work... as always.";
			}if(this.page == 6){
				this.dialogueText.text = "And as it shall be for as long as I live.";
			}else if(this.page == 7){
				this.inDialogue = false;
				this.dialogueText.text = "";
				this.talkFilter.kill();
				this.diaVariant = 1;
				this.animateNPC(this.npc);
				if(this.player.body.x >= 150){
					this.player.body.velocity.x = -80;
					this.player.animations.play("walkL");
				}else{
					this.player.body.velocity.x = 0;
					this.player.animations.play("idleL");
				}
				this.fadeFilter.animations.play("fadeOut");
				this.shadeText.text = "[D]ebt Ending";
			}
	},
	end_happiness:function(){
		if(this.page == 0){
				this.dialogueText.text = this.moneyGoal + " gold.";
			}else if(this.page == 1){
				this.dialogueText.text = "...Huh?"
					+ '\n' + "You're what...?"
					+ '\n' + "I'm sorry but I don't quite understand.";
			}else if(this.page == 2){
				this.dialogueText.text = "You're leaving...?" 
					+ '\n' + "And what exactly are you planning to do?"
					+ '\n' + "Traveling? Discovering your purpose in life!?"
					+ '\n' + "What kind of nonsense are you blabbering?";
			}else if(this.page == 3){
				this.player.animations.play("idleL");
				this.dialogueText.text = "Hey! I'm talking to you!"
					+ '\n' + "As guildmaster, I demand you explain yourself!"
					+ '\n' + "What about everything that you've worked for!?";
					+ '\n' + "Turn around this instant!";
			}else if(this.page == 4){
				this.dialogueText.text = "What will you do with your skills?" 
					+ '\n' + "With your life? Here you have a purpose.";
			}else if(this.page == 5){
				this.player.animations.play('idleR');
				this.dialogueText.text = "Wait what? You're starting your own guild?" 
					+ '\n' + "Th-that's not-";
			}else if(this.page == 6){
				this.player.animations.play('idleL');
				this.dialogueText.text = "HEY WAIT!";
			}else if(this.page == 7){
				this.inDialogue = false;
				this.dialogueText.text = "";
				this.talkFilter.kill();
				this.diaVariant = 1;
				if(this.player.body.x >= 150){
					this.player.body.velocity.x = -80;
					this.player.animations.play("walkL");
				}else{
					this.player.body.velocity.x = 0;
					this.player.animations.play("idleL");
				}
				this.fadeFilter.animations.play("fadeOut");
				this.shadeText.text = "[C]heerful Ending"
			}
	},
	end_neutral: function(){
		if(this.page == 0){
				this.dialogueText.text = this.moneyGoal + " gold.";
			}else if(this.page == 1){
				this.dialogueText.text = "Hmm... you're rather quiet today."
					+ '\n' + "You sick or something?"
					+ '\n' + "I may not offer vacation days, but I"
					+ '\n' + "certainly give a few sick days.";
			}else if(this.page == 2){
				this.dialogueText.text = "I don't need my followers dying of" 
					+ '\n' + "sickness on me. Besides, you're shaping up to be a"
					+ '\n' + "decent herbalist. Though stick with me and"
					+ '\n' + "you can only get better and better!";
			}else if(this.page == 3){
				this.dialogueText.text = "Maybe someday you'll run this guild even."
					+ '\n' + "Haha, though don't get your hopes up. You have much "
					+ '\n' + "to study up on and practice.";
			}else if(this.page == 4){
				this.dialogueText.text = "...";
			}else if(this.page == 5){
				this.dialogueText.text = "You're way too silent today." + '\n' + "Are you sure everything is...";
			}else if(this.page == 6){
				this.player.animations.play('idleL');
				this.dialogueText.text = "Oh!? Eager to get out there today?" 
					+ '\n' + "Hahaha... and here I'd been wondering"
					+ '\n' + " when you'd get started for today.";
			}else if(this.page == 7){
				this.player.animations.play('idleL');
				this.dialogueText.text = "Well don't let me keep you waiting!" 
					+ '\n' + "Back to work!";
			}else if(this.page == 8){
				this.inDialogue = false;
				this.dialogueText.text = "";
				this.talkFilter.kill();
				this.diaVariant = 1;
				if(this.player.body.x >= 150){
					this.player.body.velocity.x = -80;
					this.player.animations.play("walkL");
				}else{
					this.player.body.velocity.x = 0;
					this.player.animations.play("idleL");
				}
				this.fadeFilter.animations.play("fadeOut");
				this.shadeText.text = "[B]ack to Work Ending"
			}
	}
}
// Start Phaser, set the game size.
var game = new Phaser.Game(500, 375);

// There's a mainstate called "main".
game.state.add('main', mainState);

//Let's make sure the game actually starts.
game.state.start('main');