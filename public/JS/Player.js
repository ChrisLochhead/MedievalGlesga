class Player {
    constructor(spr, health, mana, gameScene, controlType) {

        //bonuses
        this.attackBonus = 0;
        this.meleeDefence = 0;
        this.mageDefence = 0;
        this.healthBonus = 0;
        this.manaBonus = 0;

        this.inventoryItems = [null, null, null, ///
            null, null, null,
            null, null, null,
            null, null, null];

        this.gearItems = [null, null, null, null, null]; ///
        this.characterSprite = spr;
        this.characterSprite.parent = this;
        this.spawnPoint = [this.characterSprite.x, this.characterSprite.y];

        this.mana = mana;
        this.health = health;
        this.damageTimer = 0.0;
        this.controlType = controlType;

        //Setup Quest List  ///
        this.gameScene = gameScene;

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
        // Player One
        this.spaceKey = this.gameScene.input.keyboard.addKey('SPACE');
        this.cKey = this.gameScene.input.keyboard.addKey('C');
        // Player Two
        this.qKey = this.gameScene.input.keyboard.addKey('Q');
        this.eKey = this.gameScene.input.keyboard.addKey('E');
        this.movementKeys = this.gameScene.input.keyboard.addKeys('W,A,S,D');

        //Get npcs
        this.npcs = null;
        this.enemies = null;

        //initialise collision reactions
        this.gameScene.input.keyboard.on('keydown_X', this.interact, this);
    }

    AddItemToInventory(item, indexX, indexY, attk, mageDef, melDef, hb, mb, equipType, shopPrice, itemPrice, initial) {
        //Setup new item by its sprite
        let tmpSprite = gameScene.add.sprite(819 + (indexX * 44), 336 + (indexY * 45), item, 1).setInteractive().setScrollFactor(0).setName(item.toString() + '-' + (indexX + (indexY * 4))).setDepth(2);
        this.inventoryItems[indexX + (indexY * 4)] = new Equipment(tmpSprite, attk, mageDef, melDef, hb, mb, equipType, shopPrice, itemPrice);
        if(initial === false) this.UI.UpdateCash(-shopPrice);
    }

    GetEquipmentIndex(itemName){
        if (itemName === 'helmet') return 0;
        if (itemName === 'chestplate') return 1;
        if (itemName === "legs") return 2;
        if (itemName === 'offhand') return 3;
        if (itemName === 'weapon') return 4;
    }

    GetGearIndex(index) {
        if (index == 0) return [885, 336];
        if (index == 1) return [885, 382];
        if (index == 2) return [885, 428];
        if (index == 3) return [930, 382];
        if (index == 4) return [838, 382];

        return [0, 0];
    }

    UpdateBonuses(attk, mgdef, meldef, hb, mb)
    {
        this.attackBonus += attk;
        this.mageDefence += mgdef;
        this.meleeDefence += meldef;
        this.healthBonus += hb;
        this.manaBonus += mb;

        // this.healthBonusText.text = "Health: " + this.healthBonus.toString();
        // this.manaBonusText.text = "Mana: " + this.manaBonus.toString();
        // this.attackBonusText.text = "Attack: " + this.attackBonus.toString();
        // this.mageDefenceText.text = "Mage Def: " + this.mageDefence.toString();
        // this.meleeDefenceText.text = "Melee Def: " + this.meleeDefence.toString();

    }

    UpdateStats()
    {
        if(this.controlType == 0) {
            this.UI.p1HealthBar.setCrop(0, 0, ((this.health) / 100) * 125, 26);
            this.UI.p1ManaBar.setCrop(0, 0, ((this.mana) / 100) * 125, 26);
        } else {
            this.UI.p2HealthBar.setCrop(0, 0, ((this.health) / 100) * 125, 26);
            this.UI.p2ManaBar.setCrop(0, 0, ((this.mana) / 100) * 125, 26);
        }
    }

    DestroyGear(index)
    {
        if(index === 0){ this.helmet.bodySprite.destroy(); delete this.helmet; }
        if(index === 1){ this.chestplate.bodySprite.destroy(); delete this.chestplate; }
        if(index === 3){ this.shield.bodySprite.destroy(); delete this.shield; }
        if(index === 4){ this.mainWeapon.bodySprite.destroy(); delete this.mainWeapon; }
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
                let xPos = intIndexPosition % 4;
                let yPos = intIndexPosition / 4;
                yPos = parseInt(yPos.toString());

                let existingGearNameArray = this.gearItems[index].inventorySprite.name.split('-');
                let existingGearName = existingGearNameArray[0] + '-' + existingGearNameArray[1];
                //replace in position
                let tmpSprite = this.gameScene.add.sprite(819 + (xPos * 44), 336 + (yPos * 45), existingGearName, 1).setInteractive().setDepth(2);
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
            let tmpSprite = this.gameScene.add.sprite(gearIndex[0], gearIndex[1], equipName, 1).setInteractive().setDepth(2);

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
                helmBody.visible = false;
                helmBody.rotation = this.characterSprite.rotation;
                this.helmet = new Weapon(helmBody, e.mageDefence,e.meleeDefence, this.npcs, this.gameScene, false, null, this, this.enemies);
            }
            if(index === 1)
            {
                let chestBody = this.gameScene.physics.add.sprite(this.characterSprite.x, this.characterSprite.y, equipName + "-body").setDepth(1).setName(equipName + "-body");
                chestBody.visible = false;
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

    TakeConsumable(consumable, index) {
        //Magedef accounts for health, MelDef accounts for mana
        this.health += consumable.mageDefence;
        if (this.health > 100) this.health = 100;
        this.mana += consumable.meleeDefence;
        if (this.mana > 100) this.mana = 100;

        //this.UpdateStats(this.health, this.mana);

        //Remove the element from inventory
        this.inventoryItems[index].inventorySprite.destroy();
        delete this.inventoryItems[index];
    }

    RemoveGear(index, item) {
        let successfullyRemoved = false;
        let e = item.parent;
        for (let i = 0; i < this.inventoryItems.length; i++) {
            if (this.inventoryItems[i] == null) {

                let xPos = i % 4;
                let yPos = i / 4;
                yPos = parseInt(yPos);
                let itemNameArray = item.name.split('-');
                let itemNameCombined = itemNameArray[0] + '-' + itemNameArray[1];
                let tmpSprite = this.gameScene.add.sprite(819 + (xPos * 44), 336 + (yPos * 44), itemNameCombined, 1).setInteractive().setDepth(2);
                tmpSprite.setScrollFactor(0);
                tmpSprite.name = itemNameCombined.toString() + '-' + i;

                this.inventoryItems[i] = new Equipment(tmpSprite, e.attackBonus, e.mageDefence, e.meleeDefence, e.healthBonus, e.manaBonus, e.itemType, e.shopPrice, e.characterPrice);
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

    TeleportPlayer(posX, posY)
    {
        this.characterSprite.x = posX;
        this.characterSprite.y = posY;
        if(this.mainWeapon){
            this.mainWeapon.bodySprite.x = posX;
            this.mainWeapon.bodySprite.y = posY;
        }
        if(this.shield){
            this.shield.bodySprite.x = posX;
            this.shield.bodySprite.y = posY;
        }
        if(this.chestplate){
            this.chestplate.bodySprite.x = posX;
            this.chestplate.bodySprite.y = posY;
        }
        if(this.helmet){
            this.helmet.bodySprite.x = posX;
            this.helmet.bodySprite.y = posY;
        }
    }

    MovePlayer(velocityX, velocityY, Rotation, moveDir)
    {
        this.moveDirection = moveDir;
        this.characterSprite.setVelocityX(velocityX);
        this.characterSprite.setVelocityY(velocityY);
        this.characterSprite.rotation = Rotation;
        this.MoveGear(this.mainWeapon);
        this.MoveGear(this.shield);

        if(this.characterSprite.body.touching.none) {
            this.chatIndex = 0;
            this.UI.chatBoxText.setVisible(false);
            this.UI.chatBoxContinueButton.setVisible(false);
            this.collisionPartner = null;
        }
    }

    UpdateUIMoney(amount){
        this.UI.UpdateCash(amount);
    }

    TakeDamage(amount)
    {
        this.health -= (amount - this.meleeDefence);
        this.characterSprite.setTint('0xff0000', '0xff0000', '0xff0000', '0xff0000');
        this.damageTimer = 0.25;
    }
    Destruct()
    {
        this.health = 100;
        this.mana = 100;
        this.characterSprite.x = this.spawnPoint[0];
        this.characterSprite.y = this.spawnPoint[1];

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
        if(this.collisionPartner != null) {
            this.UI.notificationBoxText.visible = true;
            this.UI.ActivateChat(this.collisionPartner.information, 0, false, 0, );
        }
    }

    passUI(UI){
        this.UI = UI;
    }

    positionInteractMenu(collisionPartner)
    {
        this.UI.notificationBoxText.x = Math.floor(this.characterSprite.x + this.characterSprite.width / 2);
        this.UI.notificationBoxText.y = Math.floor(this.characterSprite.y + this.characterSprite.height / 2);
        this.UI.notificationBoxText.text = "press x to interact";
        this.UI.notificationBoxText.visible = true;
        this.collisionPartner = collisionPartner;
        this.UI.playerCollisionPartner = collisionPartner;
    }

    Update(cursors){

        //Check for input from buttons
        let self = this;

        switch(this.controlType){
            // Player 1 Controls
            case 0:{
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
                    //this.SetGearVelocity(this.chestplate, 0, 0, -1);
                    //this.SetGearVelocity(this.helmet, 0, 0, -1);
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
                break;
            }

            case 1:{
                if (this.movementKeys.A.isDown) this.MovePlayer(-180, 0, -90 * radianConverter, 1);
                else
                if (this.movementKeys.D.isDown) this.MovePlayer(180, 0, 90 * radianConverter, 2);
                else
                if (this.movementKeys.W.isDown) this.MovePlayer(0, -180, 0, 3);
                else
                if (this.movementKeys.S.isDown) this.MovePlayer(0, 180, 180 * radianConverter, 4);
                else
                {
                    this.characterSprite.setVelocityX(0);
                    this.characterSprite.setVelocityY(0);
                    this.SetGearVelocity(this.mainWeapon, 0, 0, -1);
                    this.SetGearVelocity(this.shield, 0, 0, -1);
                    //this.SetGearVelocity(this.chestplate, 0, 0, -1);
                    //this.SetGearVelocity(this.helmet, 0, 0, -1);
                }

                //Check for combat - melee
                if(this.currentWeaponSpeed === 0.0 && this.mainWeapon) {
                    this.qKey.on('down', function(){self.CheckCombat(self)});
                }else
                {
                    if(this.currentWeaponSpeed > 0.0) this.currentWeaponSpeed -= 0.01;
                    if(this.currentWeaponSpeed < 0.0) this.currentWeaponSpeed = 0.0;
                }

                //Check for combat - ranged
                if(this.currentOffhandWeaponSpeed === 0.0 && this.shield) this.eKey.on('down', function(){self.CheckRanged(self)});
                else
                {
                    if(this.currentOffhandWeaponSpeed > 0.0) this.currentOffhandWeaponSpeed -= 0.01;
                    if(this.currentOffhandWeaponSpeed < 0.0) this.currentOffhandWeaponSpeed = 0.0;
                }
                break;
            }
        }


        if(this.damageTimer !== 0.0) this.damageTimer -= 0.1;
        if(this.damageTimer < 0.0) {
            this.damageTimer = 0.0;
            this.characterSprite.clearTint();
        }

        if(this.shield != null) this.shield.Update();

        this.MoveGear(this.mainWeapon);
        this.MoveGear(this.shield);
        this.UpdateStats();
        //if(this.collisionPartner == null && this.UI.questBoxActive === false) this.UI.ClearCollisionUI();
    }
}
