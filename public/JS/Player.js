
class Player {
    constructor(spr, healthspr, neghealth, healthtxt, manaspr, negmana, manatxt, quests, gameScene) {

        this.questBoxActive = false;

        //bonuses
        this.attackBonus = 0;
        this.meleeDefence = 0;
        this.mageDefence = 0;
        this.healthBonus = 0;
        this.manaBonus = 0;

        this.inventoryItems = [null, null, null,
            null, null, null,
            null, null, null,
            null, null, null];

        this.gearItems = [null, null, null, null, null];
        this.currentFlickBookIndex = 0;

        this.characterSprite = spr;
        this.characterSprite.parent = this;

        this.spawnPoint = [this.characterSprite.x, this.characterSprite.y];

        //Setup health bar HUD sprites
        this.healthbar = healthspr;
        this.healthbarText = healthtxt;
        this.healthbarNegative = neghealth;

        //Setup Mana HUD sprites
        this.manabar = manaspr;
        this.manabartext = manatxt;
        this.mana = parseInt(manatxt._text);
        this.manabarNegative = negmana;

        //Apply stats to sprites
        this.UpdateStats(parseInt(healthtxt._text), parseInt(manatxt._text));

        this.damageTimer = 0.0;

        //Setup Quest List
        this.QuestList = quests;
        this.gameScene = gameScene;

        this.questScripts = [['one', 'two', 'three', 'four', 'five'], ['2one', 'two', 'three', 'four', 'five'],
            ['3one', 'two', 'three', 'four', 'five'], ['4one', 'two', 'three', 'four', 'five']];

        this.questCheckPoints = [5,5,5,5];
        this.questCurrentProgress = [0,0,0,0];

        //For collision detection
        this.collisionPartner = null;

        //For chat loops
        this.chatIndex = 0;
        this.queryText = [];

        //Setup armour
        this.helmet = null;
        this.chestplate = null;
        this.shield = null;

        //Setup weaponry
        this.mainWeapon = null;
        this.weaponSpeed = 0.25;
        this.currentWeaponSpeed = 0.0;
        this.offhandWeaponSpeed = 0.5;
        this.currentOffhandWeaponSpeed = 0.0;
        this.moveDirection = 3;

        //Keyboard input
        this.spaceKey = this.gameScene.input.keyboard.addKey('SPACE');
        this.cKey = this.gameScene.input.keyboard.addKey('C');

        //Get npcs
        this.npcs = null;
        this.enemies = null;

        //Gear button
        this.gearButton = null;
        this.gearStatShowing = false;

        //Money
        this.money = 500;
        this.moneyText = null;

        //initialise collision reactions
        this.gameScene.input.keyboard.on('keydown_X', this.interact, this);
    }

    UpdateStats(h, m)
    {
        this.health = h;
        this.mana = m;
        this.healthbarText.text = this.health.toString();
        this.manabartext.text = this.mana.toString();
        this.healthbarNegative.setCrop(0, 0, ((100 - this.health) / 100) * 200, 32);
        this.manabarNegative.setCrop(0, 0, ((100 - this.mana) / 100) * 200, 32);
    }

    InitialiseHUD() {

        //Setup money
        this.moneyText = this.gameScene.add.text(787.5, 225, 'Cash : ' + this.money).setDepth(3).setScrollFactor(0);

        //setup inventory
        this.inventory = this.gameScene.add.sprite(885, 415, 'inventory');
        this.inventory.setScrollFactor(0);

        //Test save button
        this.gameScene.add.text(300, 400, 'save game').setInteractive().setDepth(3).setName('save').setScrollFactor(0);
        this.gameScene.add.text(500, 400, 'load button').setInteractive().setDepth(3).setName('load').setScrollFactor(0);

        this.gameScene.add.sprite(818, 256, 'inventorytoggle', 1).setInteractive().setDepth(1).setScrollFactor(0).setName("inventorytoggle");
        this.gameScene.add.sprite(884, 256, 'geartoggle', 1).setInteractive().setDepth(1).setScrollFactor(0).setName("geartoggle");
        this.gameScene.add.sprite(951, 256, 'questtoggle', 1).setInteractive().setDepth(1).setScrollFactor(0).setName("questtoggle");

        //Setup chatbox and notification box
        this.chatbox = this.gameScene.add.sprite(385, 500, 'chatbox').setDepth(1).setScrollFactor(0).setName("chatbox");
        this.chatboxCloseButton = this.gameScene.add.sprite(732, 432, 'chatboxclosebutton', 1).setInteractive().setDepth(1).setScrollFactor(0).setName("chatboxclosebutton");
        this.notificationBox = this.gameScene.add.sprite(385, 200, 'notificationbox', 1).setInteractive().setDepth(2).setScrollFactor(0).setName("notificationbox").setVisible(false);
        this.notificationBoxCloseButton = this.gameScene.add.sprite(600, 105, 'chatboxclosebutton', 1).setInteractive().setScrollFactor(0).setDepth(3).setVisible(false).setName('notificationboxclosebutton');
        this.notificationBoxText = this.gameScene.add.text(100, 100, " ").setVisible(false).setDepth(3).setColor("#00000").setScrollFactor(0);

        //Setup chatbox dialogue
        this.chatBoxText = this.gameScene.add.text(50, 450, '', 1).setVisible(false).setScrollFactor(0).setColor('#000000').setDepth(1).setWordWrapWidth(700);
        this.chatBoxContinueButton = this.gameScene.add.text(300, 550, 'click here to continue', 1).setInteractive().setVisible(false).setDepth(1).setScrollFactor(0).setColor('#000000').setName('chatboxcontinuebutton');

        //Gear stats
        this.gearButton = this.gameScene.add.sprite(884.5, 550, 'gearbutton').setName('gearbutton').setDepth(1).setInteractive().setVisible(false);

        this.attackBonusText = this.gameScene.add.text(810, 360, "Attack: " + this.attackBonus.toString()).setVisible(false).setDepth(3).setScrollFactor(0).setColor('#000000');
        this.meleeDefenceText = this.gameScene.add.text(810, 390, "Melee Def: " + this.meleeDefence.toString()).setVisible(false).setDepth(3).setScrollFactor(0).setColor('#000000');
        this.mageDefenceText = this.gameScene.add.text(810, 420, "Magic Def: " + this.mageDefence.toString()).setVisible(false).setDepth(3).setScrollFactor(0).setColor('#000000');
        this.healthBonusText = this.gameScene.add.text(810, 450, "Health: " + this.healthBonus.toString()).setVisible(false).setDepth(3).setScrollFactor(0).setColor('#000000');
        this.manaBonusText = this.gameScene.add.text(810, 480, "Mana: " + this.manaBonus.toString()).setVisible(false).setDepth(3).setScrollFactor(0).setColor('#000000');

        this.gameScene.input.keyboard.on('keydown_X', this.interact, this);
    }

    InitialiseInventory() {
        //default inventory
        this.AddItemToInventory('default-helmet', 0, 0, 0, 1, 3, 0, 0, 0, 50, 25,true);
        this.AddItemToInventory('second-helmet', 1, 0, 0, 2, 6, 3, 0, 0, 100, 50, true);
        this.AddItemToInventory('default-chestplate', 2, 0, 0, 6, 2, 0, 0, 1, 125, 67.5, true);
        this.AddItemToInventory('default-legs', 0, 1, 0, 5, 1, 0, 0, 2, 95, 47.5, true);
        this.AddItemToInventory('default-weapon', 1, 1, 10, 1, 1, 0, 0, 4, 60, 30, true);
        this.AddItemToInventory('default-offhand', 2, 1, 16, 0, 3, 0, 0, 3, 80, 40, true);
        this.AddItemToInventory('health-potion', 0, 2, 0, 20, 0, 0, 0, 5, 20 , 10, true);
        this.AddItemToInventory('mana-potion', 1, 2, 0, 0, 20, 0, 0, 6, 80, 40, true);
    }

    UpdateCash(amount)
    {
        this.money += amount;
        this.moneyText.text = "Cash: " + this.money.toString();
    }

    AddItemToInventory(item, indexX, indexY, attk, mageDef, melDef, hb, mb, equipType, shopPrice, itemPrice, initial) {
        //Setup new item by its sprite
        let tmpSprite = gameScene.add.sprite(825 + (indexX * 60), 335 + (indexY * 65), item, 1).setInteractive().setScrollFactor(0).setName(item.toString() + '-' + (indexX + (indexY * 3)));
        this.inventoryItems[indexX + (indexY * 3)] = new Equipment(tmpSprite, attk, mageDef, melDef, hb, mb, equipType, shopPrice, itemPrice);
        if(initial === false) this.UpdateCash(-shopPrice);
    }

    ToggleChatBox(isOpen) {
        if (isOpen) {
            this.chatbox.setTexture('chatbox');
            this.chatbox.input.enabled = false;
            this.chatboxCloseButton.input.enabled = true;
            this.chatboxCloseButton.visible = true;
            this.chatbox.y -= 79;
        } else {
            this.chatboxCloseButton.input.enabled = false;
            this.chatboxCloseButton.visible = false;
            this.chatbox.setTexture('chatboxclosed');
            this.chatbox.y += 79;
            this.chatbox.setInteractive();
        }
    }

    ToggleFlickBook(index) {
        //Activate inventory
        if (index === 0) {
            this.inventory.setTexture('inventory');
            if (this.currentFlickBookIndex === 1) this.ShowGear(false);
            else if (this.currentFlickBookIndex === 2) this.ShowQuests(false);

            this.ShowInventory(true);
            this.currentFlickBookIndex = 0;
        }
        //Activate gear tab
        if (index === 1) {
            this.inventory.setTexture('gear');
            if (this.currentFlickBookIndex === 0) this.ShowInventory(false);
            else if (this.currentFlickBookIndex === 2) this.ShowQuests(false);

            this.ShowGear(true);
            this.currentFlickBookIndex = 1;
        }
        //Activate quest tab
        if (index === 2) {
            this.inventory.setTexture('quests');
            if (this.currentFlickBookIndex === 0) this.ShowInventory(false);
            else if (this.currentFlickBookIndex === 1) this.ShowGear(false);

            this.ShowQuests(true);
            this.currentFlickBookIndex = 2;
        }
    }

    ToggleNotificationBox(isOpen, notificationText) {
        if (isOpen) {
            this.notificationBox.setVisible(true);
            this.ActivateQuestBox(notificationText);
            this.notificationBoxCloseButton.setVisible(true);
            this.questBoxActive = true;
        } else {
            this.notificationBox.setVisible(false);
            this.notificationBoxText.text = ' ';
            this.notificationBoxCloseButton.setVisible(false);
            this.questBoxActive = false;
        }
    }

    ShowInventory(isShowing) {
        for (let i = 0; i < 15; i++) {
            if (this.inventoryItems[i] != null)
                    this.inventoryItems[i].inventorySprite.visible = isShowing;
        }
    }

    ShowQuests(isShowing) {
        for (let i = 0; i < 15; i++) {
            if (this.QuestList[i])
                this.QuestList[i].visible = isShowing;
        }
    }

    ShowGear(isShowing) {
        for (let i = 0; i < this.gearItems.length; i++) {
            if (this.gearItems[i] != null)
                    this.gearItems[i].inventorySprite.visible = isShowing;
        }
        this.gearButton.setVisible(isShowing);
        this.attackBonusText.setVisible(false);
        this.meleeDefenceText.setVisible(false);
        this.mageDefenceText.setVisible(false);
        this.healthBonusText.setVisible(false);
        this.manaBonusText.setVisible(false);
    }

    DestroyGear(index)
    {
        if(index === 0){ this.helmet.bodySprite.destroy(); delete this.helmet; }
        if(index === 1){ this.chestplate.bodySprite.destroy(); delete this.chestplate; }
        if(index === 3){ this.shield.bodySprite.destroy(); delete this.shield; }
        if(index === 4){ this.mainWeapon.bodySprite.destroy(); delete this.mainWeapon; }
    }
    UpdateBonuses(attk, mgdef, meldef, hb, mb)
    {
        this.attackBonus += attk;
        this.mageDefence += mgdef;
        this.meleeDefence += meldef;
        this.healthBonus += hb;
        this.manaBonus += mb;

        this.healthBonusText.text = "Health: " + this.healthBonus.toString();
        this.manaBonusText.text = "Mana: " + this.manaBonus.toString();
        this.attackBonusText.text = "Attack: " + this.attackBonus.toString();
        this.mageDefenceText.text = "Mage Def: " + this.mageDefence.toString();
        this.meleeDefenceText.text = "Melee Def: " + this.meleeDefence.toString();

    }
    AddGear(index, item) {

        let isReplaced = false;
        let indexPosition;
        indexPosition = item.name.split('-');
        let intIndexPosition = parseInt(indexPosition[2].toString());
        let e = item.parent;

        //Check if its a consumable that has been selected
        if (this.inventoryItems[intIndexPosition].itemType > 4) {
            this.TakeConsumable(this.inventoryItems[intIndexPosition], intIndexPosition);
        } else {
            //if there is already a equip item of the same index equipped
            if (this.gearItems[index] != null) {
                    let xPos = intIndexPosition % 3;
                    let yPos = intIndexPosition / 3;
                    yPos = parseInt(yPos.toString());

                    let existingGearNameArray = this.gearItems[index].inventorySprite.name.split('-');
                    let existingGearName = existingGearNameArray[0] + '-' + existingGearNameArray[1];
                    //replace in position
                    let tmpSprite = this.gameScene.add.sprite(825 + (xPos * 60), 335 + (yPos * 65), existingGearName, 1).setInteractive();
                    tmpSprite.setScrollFactor(0);
                    tmpSprite.name = existingGearName + '-' + intIndexPosition;

                    this.inventoryItems[intIndexPosition] = null;
                    this.inventoryItems[intIndexPosition] = new Equipment(tmpSprite, e.attackBonus, e.mageDefence, e.meleeDefence, e.healthBonus, e.manaBonus, e.itemType, e.shopPrice, e.characterPrice);;
                    this.UpdateBonuses(e.attackBonus, e.mageDefence, e.meleeDefence, e.healthBonus, e.manaBonus);
                    this.inventoryItems[intIndexPosition].characterSprite = tmpSprite;

                    if(index !== 2) this.DestroyGear(index);
                    isReplaced = true;
            }
            let equipNameArray = item.name.split('-');
            let equipName = equipNameArray[0] + '-' + equipNameArray[1];

            //Find gear index
            let gearIndex = this.GetGearIndex(index);
            let tmpSprite = this.gameScene.add.sprite(gearIndex[0], gearIndex[1], equipName, 1).setInteractive();

            tmpSprite.setScrollFactor(0);
            tmpSprite.name = equipName.toString() + '-' + index;

            this.gearItems[index] = new Equipment(tmpSprite, e.attackBonus, e.mageDefence, e.meleeDefence, e.healthBonus, e.manaBonus, e.itemType, e.shopPrice, e.characterPrice);
            this.UpdateBonuses(e.attackBonus, e.mageDefence, e.meleeDefence, e.healthBonus, e.manaBonus);
            this.gearItems[index].inventorySprite.name = item.name + '-' + index;
            this.gearItems[index].inventorySprite.setScrollFactor(0);
            this.gearItems[index].inventorySprite.visible = false;

            //If this is a main handed weapon
            if(index === 0)
            {
                let helmBody = this.gameScene.physics.add.sprite(this.characterSprite.x, this.characterSprite.y, equipName + "-body").setDepth(1).setName(equipName + "-body");
                helmBody.rotation = this.characterSprite.rotation;
                this.helmet = new Weapon(helmBody, e.mageDefence,e.meleeDefence, this.npcs, this.gameScene, false, null, this, this.enemies);
            }
            if(index === 1)
            {
                let chestBody = this.gameScene.physics.add.sprite(this.characterSprite.x, this.characterSprite.y, equipName + "-body").setDepth(1).setName(equipName + "-body");
                chestBody.rotation = this.characterSprite.rotation;
                this.chestplate = new Weapon(chestBody, e.mageDefence,e.meleeDefence, this.npcs, this.gameScene, false, null, this, this.enemies);
            }
            if(index === 3)
            {
                let shieldBody = this.gameScene.physics.add.sprite(this.characterSprite.x, this.characterSprite.y, equipName + "-body").setDepth(1).setName(equipName + "-body");
                shieldBody.rotation = this.characterSprite.rotation;
                this.shield = new Weapon(shieldBody, e.mageDefence,e.meleeDefence, this.npcs, this.gameScene, true, 'fireball', this, this.enemies);
            }
            if(index === 4)
            {
                let weaponBody = this.gameScene.physics.add.sprite(this.characterSprite.x, this.characterSprite.y, equipName + "-body").setName(equipName + "-body");
                weaponBody.rotation = this.characterSprite.rotation;
                this.mainWeapon = new Weapon(weaponBody, e.mageDefence,e.meleeDefence, this.npcs, this.gameScene, false, null, this, this.enemies);
            }

            if (!isReplaced) {
                this.inventoryItems[intIndexPosition].inventorySprite.destroy();
                delete this.inventoryItems[intIndexPosition];
            }
        }
    }

    RemoveGear(index, item) {
        let successfullyRemoved = false;
        let e = item.parent;
        for (let i = 0; i < this.inventoryItems.length; i++) {
            if (this.inventoryItems[i] == null) {

                let xPos = i % 3;
                let yPos = i / 3;
                yPos = parseInt(yPos);
                let itemNameArray = item.name.split('-');
                let itemNameCombined = itemNameArray[0] + '-' + itemNameArray[1];

                let tmpSprite = this.gameScene.add.sprite(825 + (xPos * 60), 335 + (yPos * 65), itemNameCombined, 1).setInteractive();
                tmpSprite.setScrollFactor(0);
                tmpSprite.name = itemNameCombined.toString() + '-' + i;

                this.inventoryItems[i] = new Equipment(tmpSprite, e.attackBonus, e.mageDefence, e.meleeDefence, e.healthBonus, e.manaBonus, e.itemType, e.shopPrice, e.characterPrice);;
                this.UpdateBonuses(-e.attackBonus, -e.mageDefence, -e.meleeDefence, -e.healthBonus, -e.manaBonus);
                this.inventoryItems[i].inventorySprite.visible = false;

                this.gearItems[index].inventorySprite.name = 'null';
                delete this.gearItems[index];
                successfullyRemoved = true;

                if(index !== 2) {
                    this.DestroyGear(index);
                }
                break;
            }
        }
        return successfullyRemoved;
    }

    ActivateQuestBox(index) {
        this.notificationBoxText.setVisible(true);

        if (index === 0) this.notificationBoxText.text = "               One Small Favour \n\n\n\n To begin this quest, speak to Gando \n\n on the high street.";
        if (index === 1) this.notificationBoxText.text = "               Get them Meds \n\n\n\n To begin this quest, speak to Gando \n\n near his house in the south-east. \n\n You must have completed \n\n 'One Small Favour'" + " \n\n to begin this quest";
        if (index === 2) this.notificationBoxText.text = "               The NyClaws \n\n To begin this quest, speak to Gando \n\n near his house. \n\n\ You must have completed 'Get them Meds' \n\n to begin this quest";
        if (index === 3) this.notificationBoxText.text = "               Revenge \n\n To begin this quest, speak to Graham \n\n the villager near the Nyclaws hideout. \n\n You must have completed 'The Nyclaws' \n\n to begin this quest";
        for (let i = 0; i < this.questCurrentProgress[index]; i++)
            this.notificationBoxText.text = this.questScripts[index][i];
    }

    Save()
    {
        let saveObject = {
            //Stats
            health: this.health,
            mana: this.mana,
            //Position
            posX: this.characterSprite.x,
            posY: this.characterSprite.y,
            //Quest progress
            questProgress: this.questCurrentProgress,
            //Inventory
            inventory: this.inventoryItems,
            //Gear tab
            gear: this.gearItems,
            //Cash
            money: this.money,
            //Gear body sprites
            head: this.helmet.bodySprite.name,
            body: this.chestplate.bodySprite.name,
            weapon: this.mainWeapon.bodySprite.name,
            offhand: this.shield.bodySprite.name,
        };
        window.localStorage.setItem('gamesave', JSON.stringify(saveObject));
    }
    LoadNewSprite(index, loadInfo)
    {
        let temp = this.gameScene.physics.add.sprite(this.characterSprite.x, this.characterSprite.y, loadInfo).setDepth(1).setName(loadInfo);
        temp.rotation = this.characterSprite.rotation;
        if(index === 0) this.helmet = new Weapon(temp, this.gearItems[index].mageDefence, this.gearItems[index].meleeDefence, this.npcs, this.gameScene, false, null, this, this.enemies);
        if(index === 1) this.chestplate = new Weapon(temp, this.gearItems[index].mageDefence, this.gearItems[index].meleeDefence, this.npcs, this.gameScene, false, null, this, this.enemies);
        if(index === 3) this.shield = new Weapon(temp, this.gearItems[index].mageDefence, this.gearItems[index].meleeDefence, this.npcs, this.gameScene, false, null, this, this.enemies);
        if(index === 4) this.mainWeapon = new Weapon(temp, this.gearItems[index].mageDefence, this.gearItems[index].meleeDefence, this.npcs, this.gameScene, false, null, this, this.enemies);

    }
    Load()
    {
        let m = JSON.parse(window.localStorage.getItem('gamesave'));

        //Re-assign new health and mana values
        this.UpdateStats(m.health, m.mana);

        //Assign character position
        this.characterSprite.x = m.posX;
        this.characterSprite.y = m.posY;

        //Apply quest progress
        this.questCurrentProgress = m.questProgress;

        for(let i = 0; i < this.questCheckPoints.length; i++) {
            if (this.questCurrentProgress[i] > 0) this.QuestList[i].setColor('#FFA500');
            if (this.questCurrentProgress[i] === this.questCheckPoints[i]) this.QuestList[i].setColor('#008000');
        }

        //Inventory and gear reallocation
        for(let i = 0; i < this.inventoryItems.length; i++)
            if(this.inventoryItems[i] != null) {this.inventoryItems[i].inventorySprite.destroy(); delete this.inventoryItems[i];}
        for(let i = 0; i < this.gearItems.length; i++)
            if(this.gearItems[i] != null) {this.gearItems[i].inventorySprite.destroy(); delete this.gearItems[i];}

        this.inventoryItems = m.inventory;
        this.gearItems = m.gear;

        for(let i = 0; i < this.inventoryItems.length; i++)
        {
            if(this.inventoryItems[i] != null)
            {
                let name = this.inventoryItems[i].inventorySprite.name.split('-');
                let temp = this.gameScene.add.sprite(this.inventoryItems[i].inventorySprite.x, this.inventoryItems[i].inventorySprite.y, name[0] + '-' + name[1],
                    1).setInteractive().setDepth(1).setScrollFactor(0).setName(this.inventoryItems[i].inventorySprite.name);
                temp.parent = this.inventoryItems[i];
                this.inventoryItems[i].inventorySprite = temp;
            }
        }

        for(let i = 0; i < this.gearItems.length; i++)
        {
            if(this.gearItems[i] != null)
            {
                let name = this.gearItems[i].inventorySprite.name.split('-');
                let temp = this.gameScene.add.sprite(this.gearItems[i].inventorySprite.x, this.gearItems[i].inventorySprite.y, name[0] + '-' + name[1],
                    1).setInteractive().setDepth(1).setScrollFactor(0).setName(this.gearItems[i].inventorySprite.name);
                temp.parent = this.gearItems[i];
                this.gearItems[i].inventorySprite = temp;
                if(i === 0) {
                    if(this.helmet != null){ this.helmet.bodySprite.destroy(); delete this.helmet;}
                    this.LoadNewSprite(i, m.head);
                }
                if(i === 1) {
                    if(this.chestplate != null){  this.chestplate.bodySprite.destroy(); delete this.chestplate; }
                    this.LoadNewSprite(i, m.body);
                }
                if(i === 3) {
                    if(this.shield != null){ this.shield.bodySprite.destroy(); delete this.shield; }
                    this.LoadNewSprite(i, m.offhand);
                }
                if(i === 4) {
                    if(this.mainWeapon != null){ this.mainWeapon.bodySprite.destroy(); delete this.mainWeapon; }
                    this.LoadNewSprite(i, m.weapon); }
            }
        }
        if(this.currentFlickBookIndex !== 1)
            this.ShowGear(false);
        else
            this.ShowGear(true);
        if(this.currentFlickBookIndex !== 0)
            this.ShowInventory(false);
        else
            this.ShowInventory(true);

        //Money
        this.money = m.money;
        this.moneyText.text = "Cash: " + this.money;

        //Activate gear bonuses
        for (let i = 0; i < this.gearItems.length; i++) {
            if (this.gearItems[i] != null) {
                this.attackBonus += this.gearItems[i].attackBonus;
                this.mageDefence += this.gearItems[i].mageDefence;
                this.meleeDefence += this.gearItems[i].meleeDefence;
                this.healthBonus += this.gearItems[i].healthBonus;
                this.manaBonus += this.gearItems[i].manaBonus;
            }
        }
    }

    GetEquipmentIndex(itemName){
        if (itemName === 'helmet') return 0;
        if (itemName === 'chestplate') return 1;
        if (itemName === "legs") return 2;
        if (itemName === 'offhand') return 3;
        if (itemName === 'weapon') return 4;
    }

    GetGearIndex(index) {
        if (index === 0) return [887.5, 350];
        if (index === 1) return [887.5, 416];
        if (index === 2) return [887.5, 480];
        if (index === 3) return [945, 416];
        if (index === 4) return [828, 416];
        return [0, 0];
    }

    TakeConsumable(consumable, index) {
        //Magedef accounts for health, MelDef accounts for mana
        this.health += consumable.mageDefence;
        if (this.health > 100) this.health = 100;
        this.mana += consumable.meleeDefence;
        if (this.mana > 100) this.mana = 100;

        this.UpdateStats(this.health, this.mana);

        //Remove the element from inventory
        this.inventoryItems[index].inventorySprite.destroy();
        delete this.inventoryItems[index];
    }

    ClearCollisionUI() {
        this.notificationBoxText.visible = false;
        this.notificationBoxText.text = ' ';
        this.DeactivateChat();
    }

    ActivateChat(dialogue, index, hasAnswer, answer) {
        //This activation corresponds to answering a question
        if (hasAnswer === true) {
            //Remove instances of queries
            for (let i = 0; i < this.queryText.length; i++) {
                this.queryText[i].text = '';
                this.queryText[i] = null;
            }
            if (this.collisionPartner.informationFork[answer] === 'create-shop') {
                this.collisionPartner.ToggleShop(true);
                this.DeactivateChat();
            } else {
                this.chatBoxText.text = this.collisionPartner.informationFork[answer];
                //iterate the chat index
                this.chatIndex++;
                this.chatBoxContinueButton.setVisible(true);
            }
        } else if (this.collisionPartner.information.length <= index) {
            if(this.collisionPartner.givesQuest === true)
            {
                this.questCurrentProgress[this.collisionPartner.questIndex] = this.collisionPartner.questPlace;
                if(this.questCurrentProgress[this.collisionPartner.questIndex] === this.questCheckPoints[this.collisionPartner.questIndex]) this.QuestList[this.collisionPartner.questIndex].setColor('#008000');
                else
                    this.QuestList[this.collisionPartner.questIndex].setColor('#FFA500');
            }
            this.DeactivateChat();
            this.collisionPartner = null;
        }
        else {
            let tmpString = dialogue[index].split('-');

            //Then the next is optional dialogue
            if (tmpString.length > 1) {
                let numAnswers = parseInt(tmpString[1]);
                for (let i = index + 1; i < index + numAnswers + 1; i++) {
                    this.queryText[i - index - 1] = this.gameScene.add.text(350, 450 + ((i - index - 1) * 40), dialogue[i] + '\n\n', 1).setInteractive().setDepth(1).setColor('#00000');
                    this.queryText[i - index - 1].name = 'dialogue-' + (i - index - 1);
                }
                this.chatIndex = index + numAnswers;
                this.chatBoxText.text = '';
                this.chatBoxContinueButton.setVisible(false);
            } else {
                this.chatIndex = index;
                this.notificationBoxText.visible = false;
                this.chatBoxText.setVisible(true);
                this.chatBoxText.text = dialogue[index];
                this.chatBoxContinueButton.setVisible(true);
            }
        }
    }

    DeactivateChat() {
        this.chatIndex = 0;
        this.chatBoxText.setVisible(false);
        this.chatBoxContinueButton.setVisible(false);
    }

    ToggleBonuses(turnOn) {
        if (turnOn) {
            this.attackBonus = 0;
            this.mageDefence = 0;
            this.meleeDefence = 0;
            this.healthBonus = 0;
            this.manaBonus = 0;
            for (let i = 0; i < this.gearItems.length; i++) {
                if (this.gearItems[i] != null) {
                        this.attackBonus += this.gearItems[i].attackBonus;
                        this.mageDefence += this.gearItems[i].mageDefence;
                        this.meleeDefence += this.gearItems[i].meleeDefence;
                        this.healthBonus += this.gearItems[i].healthBonus;
                        this.manaBonus += this.gearItems[i].manaBonus;
                }
            }

            this.inventory.setTexture('gearstats');

            this.healthBonusText.text = "Health: " + this.healthBonus.toString();
            this.manaBonusText.text = "Mana: " + this.manaBonus.toString();
            this.attackBonusText.text = "Attack: " + this.attackBonus.toString();
            this.mageDefenceText.text = "Mage Def: " + this.mageDefence.toString();
            this.meleeDefenceText.text = "Melee Def: " + this.meleeDefence.toString();

            this.healthBonusText.setVisible(true);
            this.manaBonusText.setVisible(true);
            this.attackBonusText.setVisible(true);
            this.mageDefenceText.setVisible(true);
            this.meleeDefenceText.setVisible(true);

            for(let i = 0; i < this.gearItems.length; i++)
            {
                if(this.gearItems[i] != null){
                        this.gearItems[i].inventorySprite.setVisible(false);
                }
            }
            this.gearStatShowing = true;
        }else
        {
            for(let i = 0; i < this.gearItems.length; i++)
            {
                if(this.gearItems[i]) {
                    this.gearItems[i].inventorySprite.setVisible(true);

                }
            }

            this.healthBonusText.setVisible(false);
            this.manaBonusText.setVisible(false);
            this.attackBonusText.setVisible(false);
            this.mageDefenceText.setVisible(false);
            this.meleeDefenceText.setVisible(false);
            this.inventory.setTexture('gear');
            this.gearStatShowing = false;
        }
    }

    FindEmptyInventorySpace() {
        for (let i = 0; i < 12; i++) {
            if (this.inventoryItems[i] === null)
                return i;
            if (this.inventoryItems[i].inventorySprite.name === "null")
                return i;
        }

        return -1;
    }

    CheckInput() {

        let self = this;
        this.gameScene.input.on('gameobjectdown', function (pointer, button) {
            if (button.name === "chatboxclosebutton") self.ToggleChatBox(false);
            else if (button.name === 'chatbox') self.ToggleChatBox(true);
            else if (button.name === 'chatboxcontinuebutton') self.ActivateChat(self.collisionPartner.information, self.chatIndex + 1);
            if (button.name === 'notificationboxclosebutton') self.ToggleNotificationBox(false, ' ');
            else if (button.name === "questtoggle") self.ToggleFlickBook(2);
            else if (button.name === "geartoggle") self.ToggleFlickBook(1);
            else if (button.name === "inventorytoggle") self.ToggleFlickBook(0);
            else {
                //All normal buttons accounted for: check the item type
                let tempname = button.name.split('-');
                if (tempname[0] === "dialogue") self.ActivateChat(self.collisionPartner.informationFork, 0, true, tempname[1]);
                if (button.name === "0") self.ToggleNotificationBox(true, 0);
                if (button.name === "save") self.Save();
                if (button.name === "load") self.Load();
                if (button.name === "gearbutton") {
                    if (!self.gearStatShowing)
                        self.ToggleBonuses(true);
                    else
                        self.ToggleBonuses(false);
                }
            }

        let gearadded = false;
        if (self.collisionPartner != null) {
            if (button === self.collisionPartner.ShopBackgroundCloseButton) {
                self.collisionPartner.ToggleShop(false);
                self.collisionPartner = null;
            } else {
                for (let i = 0; i < self.collisionPartner.shopItems.length; i++) {
                    if (button === self.collisionPartner.shopItems[i].inventorySprite) {
                        let emptySpace = this.FindEmptyInventorySpace();
                        if (emptySpace !== -1 && gearadded === false && self.money >= self.collisionPartner.shopItems[i].shopPrice) {
                            self.AddItemToInventory(self.collisionPartner.shopItems[i].inventorySprite.name, parseInt(emptySpace % 3), parseInt(emptySpace / 3),
                                self.collisionPartner.shopItems[i].attackBonus,
                                self.collisionPartner.shopItems[i].mageDefence, self.collisionPartner.shopItems[i].meleeDefence,
                                self.collisionPartner.shopItems[i].healthBonus, self.collisionPartner.shopItems[i].manaBonus,
                                self.collisionPartner.shopItems[i].type,
                                self.collisionPartner.shopItems[i].shopPrice, self.collisionPartner.shopItems[i].shopPrice/2, false);
                            gearadded = true;
                        }
                    }
                }
            }
        }

        if(gearadded)
            return;
        let tempname = button.name.split('-');
        if (!self.collisionPartner && tempname[0] === "default" || tempname[0] === "second" ||tempname[0] ===  "mana" ||tempname[0] ===  "health") {
            if (self.currentFlickBookIndex === 0) {
                //Equip item
                self.AddGear(self.GetEquipmentIndex(tempname[1]), button);
                //Destroy item still in inventory
                button.destroy();
            } else if (self.currentFlickBookIndex === 1) {
                //Un-equip item
                self.RemoveGear(self.GetEquipmentIndex(tempname[1]), button);
                //Destroy instance in the gear tab
                button.destroy();
            } else if (self.currentFlickBookIndex === 2) {
                //Check if quest buttons pressed
                self.ToggleNotificationBox(true, button.name);
            }
        }
        });
    }

    CheckCombat(self)
    {
        if(self.currentWeaponSpeed === 0.0) {
            self.currentWeaponSpeed = self.weaponSpeed;
            self.mainWeapon.isAttacking = true;
        }
    }

    CheckRanged(self)
    {
        if(self.currentOffhandWeaponSpeed === 0.0) {
            self.currentOffhandWeaponSpeed = self.offhandWeaponSpeed;
            self.shield.isRangedAttacking = true;
        }
    }
    MovePlayer(velocityX, velocityY, Rotation, moveDir)
    {
        this.moveDirection = moveDir;
        this.characterSprite.setVelocityX(velocityX);
        this.characterSprite.setVelocityY(velocityY);
        this.characterSprite.rotation = Rotation;
        this.SetGearVelocity(this.mainWeapon, velocityX, velocityY, Rotation);
        this.SetGearVelocity(this.shield, velocityX, velocityY, Rotation);
        this.SetGearVelocity(this.chestplate, velocityX, velocityY, Rotation);
        this.SetGearVelocity(this.helmet, velocityX, velocityY, Rotation);

        if(this.characterSprite.body.touching.none) {
            this.chatIndex = 0;
            this.chatBoxText.setVisible(false);
            this.chatBoxContinueButton.setVisible(false);
            this.collisionPartner = null;
        }
    }

    TakeDamage(amount)
    {
        this.health -= (amount - this.meleeDefence);
        this.healthbarText.text = this.health;
        this.healthbarNegative.setCrop(0, 0, ((100 - this.health) / 100) * 200, 32);
        this.characterSprite.setTint('0xff0000', '0xff0000', '0xff0000', '0xff0000');
        this.damageTimer = 0.25;
    }
    Destruct()
    {
        this.health = 100;
        this.healthbarText.text = this.health;
        this.healthbarNegative.setCrop(0, 0, ((100 - this.health) / 100) * 200, 32);
        this.mana = 100;
        this.manabartext.text = this.health.toString();
        this.manabarNegative.setCrop(0, 0, ((100 - this.mana) / 100) * 200, 32);

        this.characterSprite.x = this.spawnPoint[0];
        this.characterSprite.y = this.spawnPoint[1];

        this.MoveGear(this.helmet);
        this.MoveGear(this.chestplate);
        this.MoveGear(this.mainWeapon);
        this.MoveGear(this.shield);
    }

    MoveGear(gearItem)
    {
        if(gearItem) {
            gearItem.bodySprite.x = this.characterSprite.x;
            gearItem.bodySprite.y = this.characterSprite.y;
            gearItem.bodySprite.rotation = this.characterSprite.rotation;
        }
    }
    SetGearVelocity(gearItem, x, y, rot)
    {
        if(gearItem) {
            gearItem.bodySprite.setVelocityX(x);
            gearItem.bodySprite.setVelocityY(y);
            if(rot !== -1) gearItem.bodySprite.rotation = rot;
        }
    }
    interact()
    {
        if(player1.collisionPartner != null) {
            player1.notificationBoxText.visible = true;
            player1.ActivateChat(player1.collisionPartner.information, 0, false, 0);
        }
    }

    positionInteractMenu(collisionPartner)
    {
        player1.notificationBoxText.x = Math.floor(player1.characterSprite.x + player1.characterSprite.width / 2);//player1.characterSprite.x;
        player1.notificationBoxText.y = Math.floor(player1.characterSprite.y + player1.characterSprite.height / 2);
        player1.notificationBoxText.text = "press x to interact";
        player1.notificationBoxText.visible = true;
        player1.collisionPartner = collisionPartner;
    }
    Update(cursors){

        //Check for input from buttons
        let self = this;

        if (cursors.left.isDown) this.MovePlayer(-180, 0, -90 * radianConverter, 1);
        else
        if (cursors.right.isDown) this.MovePlayer(180, 0, 90 * radianConverter, 2);
        else
        if (cursors.up.isDown) this.MovePlayer(0, -180, 0, 3);
        else
        if (cursors.down.isDown) this.MovePlayer(0, 180, 180 * radianConverter, 4);
        else
        {
            this.characterSprite.setVelocityX(0);
            this.characterSprite.setVelocityY(0);
            this.SetGearVelocity(this.mainWeapon, 0, 0, -1);
            this.SetGearVelocity(this.shield, 0, 0, -1);
            this.SetGearVelocity(this.chestplate, 0, 0, -1);
            this.SetGearVelocity(this.helmet, 0, 0, -1);
        }

        //Check for combat - melee
        if(this.currentWeaponSpeed === 0.0 && this.mainWeapon) {
            this.spaceKey.on('down', function(){self.CheckCombat(self)});
        }else
        {
            if(this.currentWeaponSpeed > 0.0) this.currentWeaponSpeed -= 0.01;
            if(this.currentWeaponSpeed < 0.0) this.currentWeaponSpeed = 0.0;
        }

        //Check for combat - ranged
        if(this.currentOffhandWeaponSpeed === 0.0 && this.shield) this.cKey.on('down', function(){self.CheckRanged(self)});
        else
        {
            if(this.currentOffhandWeaponSpeed > 0.0) this.currentOffhandWeaponSpeed -= 0.01;
            if(this.currentOffhandWeaponSpeed < 0.0) this.currentOffhandWeaponSpeed = 0.0;
        }

        if(this.damageTimer !== 0.0) this.damageTimer -= 0.1;
        if(this.damageTimer < 0.0) {
            this.damageTimer = 0.0;
            this.characterSprite.clearTint();
        }

        if(this.shield != null) this.shield.Update();

        if(this.collisionPartner == null && this.questBoxActive === false) this.ClearCollisionUI();
    }
}
