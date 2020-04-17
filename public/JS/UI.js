class UI {
    constructor(players, quests, gameScene){
        this.players = players;
        this.selectedPlayer = this.players[0];
        this.selectedPlayerNum = 0;

        this.questBoxActive = false;
        this.currentFlickBookIndex = 0;

        //Setup Quest List
        this.QuestList = quests;
        this.gameScene = gameScene;

        this.questScripts = [['one', 'two', 'three', 'four', 'five'], ['2one', 'two', 'three', 'four', 'five'],
            ['3one', 'two', 'three', 'four', 'five'], ['4one', 'two', 'three', 'four', 'five']];

        this.questCheckPoints = [5,5,5,5];
        this.questCurrentProgress = [0,0,0,0];

        //For chat loops
        this.chatIndex = 0;
        this.queryText = [];

        this.mission1 = false;
        this.mission2 = false;
        this.mission3 = false;
        this.mission4 = false;

        //Gear button
        this.gearButton = null;
        this.gearStatShowing = false;

        //Money
        this.money = 500;
        this.moneyText = null;
    }

    UpdateCash(amount)
    {
        this.money += amount;
        this.moneyText.text = "Cash: " + this.money.toString();
    }


    InitialiseHUD() {
        //Setup money
        this.moneyText = this.gameScene.add.text(787.5, 225, 'Cash : ' + this.money).setDepth(3).setScrollFactor(0);

        // Setup player deselect (drawn underneath main panel)
        this.player1Deselect = this.gameScene.add.sprite(836, 571, 'player1Deselect').setInteractive().setDepth(1).setScrollFactor(0).setName("player1Deselect");
        this.player2Deselect = this.gameScene.add.sprite(935, 571, 'player2Deselect').setInteractive().setDepth(1).setScrollFactor(0).setName("player2Deselect");

        //setup inventory
        this.inventory = this.gameScene.add.sprite(885, 415, 'inventory').setDepth(1);
        this.inventory.setScrollFactor(0);

        // Setup player select (drawn above main panel)
        this.player1Select = this.gameScene.add.sprite(836, 571, 'player1Select').setDepth(1).setScrollFactor(0);
        this.player2Select = this.gameScene.add.sprite(935, 571, 'player2Select').setDepth(1).setScrollFactor(0);
        this.player2Select.visible = false;

        this.inventoryToggle = this.gameScene.add.sprite(819, 257, 'inventorytoggle', 1).setInteractive().setDepth(1).setScrollFactor(0).setName("inventorytoggle");
        this.gearToggle = this.gameScene.add.sprite(885, 257, 'geartoggle', 1).setInteractive().setDepth(1).setScrollFactor(0).setName("geartoggle");
        this.questToggle = this.gameScene.add.sprite(951, 257, 'questtoggle', 1).setInteractive().setDepth(1).setScrollFactor(0).setName("questtoggle");

        // Health Bars
        this.p1StatusBox = this.gameScene.add.sprite(100,50, 'status-bars').setDepth(1).setScrollFactor(0);
        this.p1HealthBar = this.gameScene.add.sprite(118, 30, 'health-bar').setDepth(1).setScrollFactor(0);
        this.p1ManaBar = this.gameScene.add.sprite(118, 69, 'mana-bar').setDepth(1).setScrollFactor(0);

        this.p2StatusBox = this.gameScene.add.sprite(900,50, 'status-bars').setDepth(1).setScrollFactor(0);
        this.p2HealthBar = this.gameScene.add.sprite(918, 30, 'health-bar').setDepth(1).setScrollFactor(0);
        this.p2ManaBar = this.gameScene.add.sprite(918, 69, 'mana-bar').setDepth(1).setScrollFactor(0);

        //Setup chatbox and notification box
        this.chatbox = this.gameScene.add.sprite(385, 500, 'chatbox').setDepth(1).setScrollFactor(0).setName("chatbox");
        this.chatboxCloseButton = this.gameScene.add.sprite(737, 421, 'chatboxclosebutton', 1).setInteractive().setDepth(1).setScrollFactor(0).setName("chatboxclosebutton");
        this.notificationBox = this.gameScene.add.sprite(385, 200, 'notificationbox', 1).setInteractive().setDepth(2).setScrollFactor(0).setName("notificationbox").setVisible(false);
        this.notificationBoxCloseButton = this.gameScene.add.sprite(600, 105, 'chatboxclosebutton', 1).setInteractive().setScrollFactor(0).setDepth(3).setVisible(false).setName('notificationboxclosebutton');
        this.notificationBoxText = this.gameScene.add.text(100, 100, " ").setVisible(false).setDepth(3).setColor("#00000").setScrollFactor(0);

        this.chatbox

        //Setup chatbox dialogue
        this.chatBoxText = this.gameScene.add.text(50, 450, '', 1).setVisible(false).setScrollFactor(0).setColor('#000000').setDepth(1).setWordWrapWidth(700);
        this.chatBoxContinueButton = this.gameScene.add.text(300, 550, 'click here to continue', 1).setInteractive().setVisible(false).setDepth(1).setScrollFactor(0).setColor('#000000').setName('chatboxcontinuebutton');

        //Gear stats
        this.gearButton = this.gameScene.add.sprite(884.5, 550, 'gearbutton').setName('gearbutton').setDepth(1).setInteractive().setVisible(false);
    }

    InitialiseInventory() {
        this.players[0].AddItemToInventory('default-helmet', 0, 0, 0, 1, 3, 0, 0, 0, 50, 25, true);
        this.players[0].AddItemToInventory('default-chestplate', 2, 0, 0, 6, 2, 0, 0, 1, 125, 67.5, true);
        this.players[0].AddItemToInventory('default-legs', 3, 0, 0, 5, 1, 0, 0, 2, 95, 47.5, true);
        this.players[0].AddItemToInventory('default-weapon', 0, 1, 5, 1, 1, 0, 0, 4, 60, 30, true);
        this.players[0].AddItemToInventory('default-offhand', 1, 1, 16, 0, 3, 0, 0, 3, 80, 40, true);
        this.players[0].AddItemToInventory('health-potion', 2, 1, 0, 20, 0, 0, 0, 5, 20, 10, true);
        this.players[0].AddItemToInventory('mana-potion', 3, 1, 0, 0, 20, 0, 0, 6, 80, 40, true);

        this.players[1].AddItemToInventory('default-helmet', 0, 0, 0, 1, 3, 0, 0, 0, 50, 25, true);
        this.players[1].AddItemToInventory('default-chestplate', 2, 0, 0, 6, 2, 0, 0, 1, 125, 67.5, true);
        this.players[1].AddItemToInventory('default-legs', 3, 0, 0, 5, 1, 0, 0, 2, 95, 47.5, true);
        this.players[1].AddItemToInventory('default-weapon', 0, 1, 5, 1, 1, 0, 0, 4, 60, 30, true);
        this.players[1].AddItemToInventory('default-offhand', 1, 1, 16, 0, 3, 0, 0, 3, 80, 40, true);
        this.players[1].AddItemToInventory('health-potion', 2, 1, 0, 20, 0, 0, 0, 5, 20, 10, true);
        this.players[1].AddItemToInventory('mana-potion', 3, 1, 0, 0, 20, 0, 0, 6, 80, 40, true);
    }

    ChangePlayer(index){
        if(index == 0){
            this.selectedPlayer = players[0];
            this.selectedPlayerNum = 0;
            this.player1Select.visible = true;
            this.player2Select.visible = false;
            this.ToggleFlickBook(this.currentFlickBookIndex, 0);
        } else {
            this.selectedPlayer = players[1];
            this.selectedPlayerNum = 1;
            this.player1Select.visible = false;
            this.player2Select.visible = true;
            this.ToggleFlickBook(this.currentFlickBookIndex, 1);
        }
    }

    ClearCollisionUI() {
        this.notificationBoxText.visible = false;
        this.notificationBoxText.text = ' ';
        this.DeactivateChat();
    }

    ToggleChatBox(isOpen) {
        if (isOpen) {
            this.chatbox.setTexture('chatbox');
            this.chatbox.input.enabled = false;
            this.chatboxCloseButton.input.enabled = true;
            this.chatboxCloseButton.visible = true;
            this.chatbox.y -= 70;
        } else {
            this.chatboxCloseButton.input.enabled = false;
            this.chatboxCloseButton.visible = false;
            this.chatbox.setTexture('chatboxclosed');
            this.chatbox.y += 70;
            this.chatbox.setInteractive();
        }
    }

    UpdateMission(spokeToGando, gotThePotion, returnToGando, killNicKlaws) {
        spokeToGando = this.mission1;
        gotThePotion = this.mission2;
        returnToGando = this.mission3;
        killNicKlaws = this.mission4;
    }



    ActivateChat(dialogue,  index, hasAnswer, answer, ) {
        //This activation corresponds to answering a question
        if (hasAnswer === true) {
            //Remove instances of queries
            for (let i = 0; i < this.queryText.length; i++) {
                this.queryText[i].text = '';
                this.queryText[i] = null;
            }
            if (this.playerCollisionPartner.informationFork[answer] === 'create-shop') {
                this.playerCollisionPartner.ToggleShop(true);
                this.DeactivateChat();

            // }else if(this.playerCollisionPartner.informationFork[answer] === 'talkToGando'){
            //     this.mission1 = true;
            } else {
                this.chatBoxText.text = this.playerCollisionPartner.informationFork[answer];
                //iterate the chat index
                this.chatIndex++;
                this.chatBoxContinueButton.setVisible(true);
            }
        } else if (this.playerCollisionPartner.information.length <= index) {
            if(this.playerCollisionPartner.givesQuest === true)
            {
                this.questCurrentProgress[this.playerCollisionPartner.questIndex] = this.playerCollisionPartner.questPlace;
                if(this.questCurrentProgress[this.playerCollisionPartner.questIndex] === this.questCheckPoints[this.playerCollisionPartner.questIndex]) this.QuestList[this.playerCollisionPartner.questIndex].setColor('#008000');
                else
                    this.QuestList[this.playerCollisionPartner.questIndex].setColor('#FFA500');
            }
            this.DeactivateChat();
            this.playerCollisionPartner = null;
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

    ActivateQuestBox(index) {
        this.notificationBoxText.setVisible(true).setDepth(3);

        if (index === 0) this.notificationBoxText.text = "               One Small Favour \n\n\n\n To begin this quest, speak to Gando \n\n on the high street.";
        if (index === 1) this.notificationBoxText.text = "               Get them Meds \n\n\n\n To begin this quest, speak to Gando \n\n near his house in the south-east. \n\n You must have completed \n\n 'One Small Favour'" + " \n\n to begin this quest";
        if (index === 2) this.notificationBoxText.text = "               The NyClaws \n\n To begin this quest, speak to Gando \n\n near his house. \n\n\ You must have completed 'Get them Meds' \n\n to begin this quest";
        if (index === 3) this.notificationBoxText.text = "               Revenge \n\n To begin this quest, speak to Graham \n\n the villager near the Nyclaws hideout. \n\n You must have completed 'The Nyclaws' \n\n to begin this quest";
        for (let i = 0; i < this.questCurrentProgress[index]; i++)
            this.notificationBoxText.text = this.questScripts[index][i];
    }

    DeactivateChat() {
        this.chatIndex = 0;
        this.chatBoxText.setVisible(false);
        this.chatBoxContinueButton.setVisible(false);
    }


    ToggleFlickBook(index, playerIndex) {
        //Activate inventory
        if (index === 0) {
            this.inventory.setTexture('inventory');
            if (this.currentFlickBookIndex === 1){
                this.ShowGear(false, 0);
                this.ShowGear(false, 1);
                this.gearToggle.setVisible(true);
            }

            else if (this.currentFlickBookIndex === 2){
                this.ShowQuests(false);
                this.questToggle.setVisible(true);
            }

            if(playerIndex == 0){
                this.ShowInventory(true, 0);
                this.ShowInventory(false, 1);
            } else {
                this.ShowInventory(false, 0);
                this.ShowInventory(true, 1);
            }

            this.currentFlickBookIndex = 0;
            this.inventoryToggle.setVisible(false);
        }
        //Activate gear tab
        if (index === 1) {
            this.inventory.setTexture('gear');
            if (this.currentFlickBookIndex == 0){
                this.ShowInventory(false,0);
                this.ShowInventory(false, 1);
                this.inventoryToggle.setVisible(true);
            }
            else if (this.currentFlickBookIndex == 2){
                this.ShowQuests(false);
                this.questToggle.setVisible(true);
            }

            if(playerIndex == 0){
                this.ShowGear(true, 0);
                this.ShowGear(false, 1);
            } else {
                this.ShowGear(false, 0);
                this.ShowGear(true, 1);
            }

            this.gearToggle.setVisible(false);
            this.currentFlickBookIndex = 1;
        }
        //Activate quest tab
        if (index === 2) {
            this.inventory.setTexture('quests');
            if (this.currentFlickBookIndex == 0){
                this.ShowInventory(false, 0);
                this.ShowInventory(false, 1);
                this.inventoryToggle.setVisible(true);
            }
            if (this.currentFlickBookIndex == 1){
                this.ShowGear(false, 0);
                this.ShowGear(false, 1);
                this.gearToggle.setVisible(true);
            }
            this.ShowQuests(true);
            this.questToggle.setVisible(false);
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

    ToggleBonuses(turnOn) {
        // if (turnOn) {
        //     this.attackBonus = 0;
        //     this.mageDefence = 0;
        //     this.meleeDefence = 0;
        //     this.healthBonus = 0;
        //     this.manaBonus = 0;
        //     for (let i = 0; i < this.gearItems.length; i++) {
        //         if (this.gearItems[i] != null) {
        //             this.attackBonus += this.gearItems[i].attackBonus;
        //             this.mageDefence += this.gearItems[i].mageDefence;
        //             this.meleeDefence += this.gearItems[i].meleeDefence;
        //             this.healthBonus += this.gearItems[i].healthBonus;
        //             this.manaBonus += this.gearItems[i].manaBonus;
        //         }
        //     }
        //
        //     this.inventory.setTexture('gearstats');
        //
        //     this.healthBonusText.text = "Health: " + this.healthBonus.toString();
        //     this.manaBonusText.text = "Mana: " + this.manaBonus.toString();
        //     this.attackBonusText.text = "Attack: " + this.attackBonus.toString();
        //     this.mageDefenceText.text = "Mage Def: " + this.mageDefence.toString();
        //     this.meleeDefenceText.text = "Melee Def: " + this.meleeDefence.toString();
        //
        //     this.healthBonusText.setVisible(true);
        //     this.manaBonusText.setVisible(true);
        //     this.attackBonusText.setVisible(true);
        //     this.mageDefenceText.setVisible(true);
        //     this.meleeDefenceText.setVisible(true);
        //
        //     for(let i = 0; i < this.gearItems.length; i++)
        //     {
        //         if(this.gearItems[i] != null){
        //             this.gearItems[i].inventorySprite.setVisible(false);
        //         }
        //     }
        //     this.gearStatShowing = true;
        // }else
        // {
        //     for(let i = 0; i < this.gearItems.length; i++)
        //     {
        //         if(this.gearItems[i]) {
        //             this.gearItems[i].inventorySprite.setVisible(true);
        //
        //         }
        //     }
        //
        //     this.healthBonusText.setVisible(false);
        //     this.manaBonusText.setVisible(false);
        //     this.attackBonusText.setVisible(false);
        //     this.mageDefenceText.setVisible(false);
        //     this.meleeDefenceText.setVisible(false);
        //     this.inventory.setTexture('gear');
        //     this.gearStatShowing = false;
        // }
    }


    ShowInventory(isShowing, playerIndex) {
        for (let i = 0; i < 15; i++) {
            if (this.players[playerIndex].inventoryItems[i] != null)
                this.players[playerIndex].inventoryItems[i].inventorySprite.visible = isShowing;
        }
    }

    ShowGear(isShowing, playerIndex) {
        for (let i = 0; i < this.selectedPlayer.gearItems.length; i++) {
            if (this.players[playerIndex].gearItems[i] != null)
                this.players[playerIndex].gearItems[i].inventorySprite.visible = isShowing;
        }
    }

    ShowQuests(isShowing) {
        for (let i = 0; i < 15; i++) {
            if (this.QuestList[i]) {
                this.QuestList[i].depth = 3;
                this.QuestList[i].visible = isShowing;
            }
        }
    }

    FindEmptyInventorySpace(playerIndex) {
        for (let i = 0; i < 12; i++) {
            if (this.players[playerIndex].inventoryItems[i] === null)
                return i;
        }

        return -1;
    }

    CheckInput() {
        let self = this;
        this.gameScene.input.on('gameobjectdown', function (pointer, button) {
            // Player Select Buttons
            if(button.name === "player1Deselect") self.ChangePlayer(0);
            else if(button.name === "player2Deselect") self.ChangePlayer(1);

            // Chat Box Buttons
            if (button.name === "chatboxclosebutton") self.ToggleChatBox(false);
            else if (button.name === 'chatbox') self.ToggleChatBox(true);
            else if (button.name === 'chatboxcontinuebutton') self.ActivateChat(self.playerCollisionPartner.information, self.chatIndex + 1);

            // Notification Box and Inventory Buttons
            if (button.name === 'notificationboxclosebutton') self.ToggleNotificationBox(false, ' ');
            else if (button.name === "questtoggle") self.ToggleFlickBook(2, self.selectedPlayerNum);
            else if (button.name === "geartoggle") self.ToggleFlickBook(1, self.selectedPlayerNum);
            else if (button.name === "inventorytoggle") self.ToggleFlickBook(0, self.selectedPlayerNum);
            else {
                //All normal buttons accounted for: check the item type
                let tempname = button.name.split('-');
                if (tempname[0] === "dialogue") self.ActivateChat(self.playerCollisionPartner.informationFork, 0, true, tempname[1]);
                if (button.name === "0") self.ToggleNotificationBox(true, 0);
                if (button.name === "gearbutton") {
                    if (!self.gearStatShowing)
                        self.ToggleBonuses(true);
                    else
                        self.ToggleBonuses(false);
                }
            }

            // Check for NPC collisions
            let gearadded = false;
            for(let j = 0; j < players.length; j++) {
                if (players[j].collisionPartner != null) {
                    if (button === players[j].collisionPartner.ShopBackgroundCloseButton) {
                        players[j].collisionPartner.ToggleShop(false);
                        players[j].collisionPartner = null;
                    } else {
                        for (let i = 0; i < players[j].collisionPartner.shopItems.length; i++) {
                            if (button === players[j].collisionPartner.shopItems[i].inventorySprite) {
                                let emptySpace = self.FindEmptyInventorySpace(self.selectedPlayerNum);
                                if (emptySpace !== -1 && gearadded === false && self.money >= self.players[j].collisionPartner.shopItems[i].shopPrice) {
                                    self.selectedPlayer.AddItemToInventory(self.players[j].collisionPartner.shopItems[i].inventorySprite.name, parseInt(emptySpace % 4), parseInt(emptySpace / 4),
                                        self.players[j].collisionPartner.shopItems[i].attackBonus,
                                        self.players[j].collisionPartner.shopItems[i].mageDefence, self.players[j].collisionPartner.shopItems[i].meleeDefence,
                                        self.players[j].collisionPartner.shopItems[i].healthBonus, self.players[j].collisionPartner.shopItems[i].manaBonus,
                                        self.players[j].collisionPartner.shopItems[i].type,
                                        self.players[j].collisionPartner.shopItems[i].shopPrice, self.players[j].collisionPartner.shopItems[i].shopPrice / 2, false);
                                    gearadded = true;
                                    self.money -= self.players[j].collisionPartner.shopItems[i].shopPrice
                                }
                            }
                        }
                    }
                }
            }

            if(gearadded)
                return;
            let tempname = button.name.split('-');
            if (!self.collisionPartner && tempname[0] === "default" || tempname[0] === "second" ||tempname[0] ===  "mana" ||tempname[0] ===  "health") { //
                if (self.currentFlickBookIndex === 0) {
                    //Equip item
                    self.selectedPlayer.AddGear(self.selectedPlayer.GetEquipmentIndex(tempname[1]), button);
                    //Destroy item still in inventory
                    button.destroy();
                } else if (self.currentFlickBookIndex === 1) {
                    //Un-equip item
                    self.selectedPlayer.RemoveGear(self.selectedPlayer.GetEquipmentIndex(tempname[1]), button);
                    //Destroy instance in the gear tab
                    button.destroy();
                } else if (self.currentFlickBookIndex === 2) {
                    //Check if quest buttons pressed
                    self.selectedPlayer.ToggleNotificationBox(true, button.name);
                }
            }
        });
    }
}