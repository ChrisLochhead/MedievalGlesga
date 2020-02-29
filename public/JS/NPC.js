class NPC{
    constructor(spr, rot, info, infoFork, gamescene, shopType, cbd, xr, yr, players, isranged, givesQuestInfo, questIndex, questPlace) {
        this.characterSprite = spr;
        this.characterSprite.parent = this;

        this.characterSprite.rotation = rot;
        this.information = info;
        this.informationFork = infoFork;
        this.gameScene = gamescene;

        this.shopItems = [];
        this.ShopBackgroundCloseButton = null;

        this.givesQuest = givesQuestInfo;
        this.questIndex = questIndex;
        this.questPlace = questPlace;

        this.canBeDamaged = cbd;
        this.isRanged = isranged;
        this.attackRange = 200;
        this.rangedSpeed = 0.0;
        this.maxRangedSpeed = 4.0;
        this.projectiles = [];
        this.shootDirection = 0;

        this.health = 10;
        this.isDamaged = false;
        this.damageTimer = 0.25;

        this.attackTimer = 10.0;
        this.enemies = null;

        //Movement Range
        this.xRange = xr;
        this.yRange = yr;
        this.originalPosition = [this.characterSprite.x, this.characterSprite.y];

        this.destination = [0,0];
        this.moveDirection = 0;
        this.idleTimer = 0.0;
        this.maxIdleTimer = 15.0;

        this.potentialTargets = players;
        this.target = null;
        this.isAlive = true;

        let self = this;
        if(this.potentialTargets != null) {
            for (let i = 0; i < this.potentialTargets.length; i++)
                this.gameScene.physics.add.collider(this.potentialTargets[i].characterSprite, this.characterSprite, function (me, object) {
                    self.Attack(me, object);
                });
        }
        if(shopType != null)
            this.InitialiseShop(shopType);
    }

    Destruct()
    {
        this.characterSprite.destroy();
        this.isAlive = false;
    }

    InitialiseShop(shopType)
    {
        //Get shop items
        let cache = this.gameScene.cache.text;
        let shop = cache.get(shopType);
        let itemArray = shop.split(',');

        //Initialise UI
        this.ShopBackground = this.gameScene.add.image(385,200, 'shopbackground').setDepth(1).setScrollFactor(0);
        this.ShopBackgroundCloseButton = this.gameScene.add.image(725,40, 'chatboxclosebutton', 1).setDepth(1).setScrollFactor(0).setInteractive();
        this.ShopTitle = this.gameScene.add.text(300, 50, itemArray[0]).setDepth(1).setColor('#00000');
        //Add shop items
        let xpos =  0, ypos = 0;
        for(let i = 1; i < itemArray.length -7; i+=8)
        {
            xpos = ((i-1)/8) % 4;
            ypos = ((i-1)/8) / 4;
            ypos = parseInt(ypos.toString());

            let tempEquipment = new Equipment(this.gameScene.add.image(75 + (xpos * 200), 125 + (ypos * 100), itemArray[i]).setInteractive().setDepth(1).setScrollFactor(0),
                itemArray[i+1],
                itemArray[i+2],
                itemArray[i+3],
                itemArray[i+4],
                itemArray[i+5],
                itemArray[i+6],
                itemArray[i+7], (itemArray[i+7])/2);

            tempEquipment.inventorySprite.name =  itemArray[i];
            tempEquipment.itemPriceText = this.gameScene.add.text(75 + (xpos * 200), 135 + (ypos * 100), itemArray[i+7]).setVisible(false).setColor('#000000').setDepth(3);
            this.shopItems.push(tempEquipment);

        }
        this.ToggleShop(false);
    }

    ToggleShop(isOpen)
    {
        if(isOpen)
        {
            this.ShopBackground.setVisible(true);
            this.ShopBackgroundCloseButton.setVisible(true);
            this.ShopTitle.setVisible(true);

            for(let i = 0; i < this.shopItems.length; i++)
            {
                this.shopItems[i].inventorySprite.setVisible(true);
                this.shopItems[i].itemPriceText.setVisible(true);
            }
        }else
        {
            this.ShopBackground.setVisible(false);
            this.ShopBackgroundCloseButton.setVisible(false);
            this.ShopTitle.setVisible(false);

            for(let i = 0; i < this.shopItems.length; i++)
            {
                this.shopItems[i].inventorySprite.setVisible(false);
                this.shopItems[i].itemPriceText.setVisible(false);
            }
        }

    }

    TakeDamage(amount)
    {
        this.health -= amount;
        this.characterSprite.setTint('0xff0000', '0xff0000', '0xff0000', '0xff0000');
        this.damageTimer = 0.25;
    }

    Between(x, min, max, dir) {
        //if(x >= min && x <= max)
        //    return true;
        //moving left: -x
        if(dir == 1) {
            if (this.characterSprite.x < this.destination[0])
                return true;
        }
        //moving right: x
        if(dir == 2) {
            if (this.characterSprite.x > this.destination[0])
                return true;
        }
        //moving up : -y
        if(dir == 3) {
            if (this.characterSprite.y < this.destination[1])
                return true;
        }
        //moving down : y
        if(dir == 4) {
            if (this.characterSprite.y > this.destination[1])
                return true;
        }
        return false;
    }

    Attack(opponent, self)
    {
        if(self.parent.attackTimer <= 0.0) {
            opponent.parent.TakeDamage(3);
            self.parent.attackTimer = 10.0;
            if(opponent.parent.health < 0.0)
                opponent.parent.health = 0.0;
            if(opponent.parent.health == 0.0)
                opponent.parent.Destruct();
        }
    }

    CheckFacingEnemy()
    {   //left or right
        if(this.shootDirection == 1 || this.shootDirection == 2) {
            if (this.target.characterSprite.y < this.characterSprite.y + 30 && this.target.characterSprite.y > this.characterSprite.y - 30)
                return true;
        }

        //up or down
        if(this.shootDirection == 3 || this.shootDirection == 4) {
            if (this.target.characterSprite.x < this.characterSprite.x + 30 && this.target.characterSprite.x > this.characterSprite.x - 30)
                return true;
        }

        return false;
    }
    Update()
    {
        for(let i = 0; i < this.projectiles.length; i++)
        {
            if(this.projectiles[i] != null)
                this.projectiles[i].Update();
        }
        if(this.isAlive) {
            //Melee attack timer
            if (this.attackTimer != 0.0)
                this.attackTimer -= 0.1;
            if (this.attackTimer < 0.0)
                this.attackTimer = 0.0;

            //Ranged attack timer
            if (this.rangedSpeed != 0.0)
                this.rangedSpeed -= 0.1;
            if (this.rangedSpeed < 0.0)
                this.rangedSpeed = 0.0;

            if (this.canBeDamaged) {
                if (this.isDamaged) {
                    this.damageTimer -= 0.01;
                    this.characterSprite.setTint('0xff0000', '0xff0000', '0xff0000', '0xff0000');
                }

                if (this.damageTimer <= 0.0) {
                    this.damageTimer = 0.25;
                    this.isDamaged = false;
                    this.characterSprite.clearTint();
                }
            }

            //If character can move
            if (this.xRange > 0 || this.yRange > 0) {
                //If a direction and distance hasnt been assigned
                if (this.destination[0] == 0 && this.destination[1] == 0 && this.idleTimer == 0.0) {
                    //randomly pick one of four directions
                    let randNum = Math.random() * 8;
                    let randy = Math.ceil(randNum);
                    if (randy < 2) randy = 1;
                    if (randy >= 2 && randy < 4) randy = 2;
                    if (randy >= 4 && randy < 6) randy = 3;
                    if (randy >= 6) randy = 4;
                    let randDir = parseInt(randy);
                    //Pick a random distance within extents
                    let randMoveAmount = 0;
                    //let posOrNeg = parseInt(Math.ceil(Math.random() * 2));
                    if (randDir == 1 || randDir == 2) {
                        randMoveAmount = Math.random() * this.xRange;
                        //Decide which way to increment the position
                        if (randDir == 2)
                            this.destination[0] = this.originalPosition[0] + randMoveAmount;
                        else
                            this.destination[0] = this.originalPosition[0] - randMoveAmount;
                    } else {
                        randMoveAmount = Math.random() * this.yRange;
                        if (randDir == 4)
                            this.destination[1] = this.originalPosition[1] + randMoveAmount;
                        else
                            this.destination[1] = this.originalPosition[1] - randMoveAmount;
                    }

                    this.moveDirection = randDir;
                    this.idleTimer = Math.random() * this.maxIdleTimer;
                }
                //move to random distance within extents
                //If moving : left
                if (this.moveDirection == 1) {
                    this.characterSprite.rotation = -90 * (3.14 / 180);
                    this.characterSprite.setVelocityX(-30);
                }
                //If moving : right
                if (this.moveDirection == 2) {
                    this.characterSprite.rotation = 90 * (3.14 / 180);
                    this.characterSprite.setVelocityX(30);
                }
                //If moving : up
                if (this.moveDirection == 3) {
                    this.characterSprite.rotation = 0 * (3.14 / 180);
                    this.characterSprite.setVelocityY(-30);
                }
                //If moving : down
                if (this.moveDirection == 4) {
                    this.characterSprite.rotation = 180 * (3.14 / 180);
                    this.characterSprite.setVelocityY(30);
                }
                //Clear target
                this.target = null;
                //Check if player in vicinity
                for (let i = 0; i < this.potentialTargets.length; i++) {
                    if (this.potentialTargets[i].characterSprite.x > this.originalPosition[0] - (this.xRange * 3) && this.potentialTargets[i].characterSprite.x < this.originalPosition[0] + (this.xRange * 3)) {
                        if (this.potentialTargets[i].characterSprite.y > this.originalPosition[1] - (this.yRange * 3) && this.potentialTargets[i].characterSprite.y < this.originalPosition[1] + (this.yRange * 3))
                            this.target = this.potentialTargets[i];
                    }
                }
                if (this.target != null) {
                    this.moveDirection = 6;
                }
                //check if reached goal to reassign
                if (this.moveDirection == 1 || this.moveDirection == 2) {
                    if (this.Between(this.characterSprite.x, this.destination[0] - 3, this.destination[0] + 3, this.moveDirection)) {
                        this.destination[0] = 0;
                        this.characterSprite.setVelocityX(0);
                        this.moveDirection = 5;
                    }
                } else if (this.moveDirection == 3 || this.moveDirection == 4) {
                    if (this.Between(this.characterSprite.y, this.destination[1] - 3, this.destination[1] + 3, this.moveDirection)) {
                        this.destination[1] = 0;
                        this.characterSprite.setVelocityY(0);
                        this.moveDirection = 5;
                    }
                } else if (this.moveDirection == 5) {
                    this.idleTimer -= 0.1;
                    //console.log("idle timer: " + this.idleTimer);
                    if (this.idleTimer < 0.0) {
                        this.idleTimer = 0.0;
                        this.moveDirection = 0;
                    }
                } else if (this.moveDirection == 6) {
                    if (this.target == null) {
                        this.moveDirection = 0;
                    } else {
                        //track found player
                        //follow left
                        if (this.target.characterSprite.x < this.characterSprite.x - 30) {
                            this.characterSprite.setVelocityX(-30);
                            this.characterSprite.rotation = -90 * (3.14 / 180);
                            this.shootDirection = 1;
                        }
                        //follow right
                        else if (this.target.characterSprite.x > this.characterSprite.x + 30) {
                            this.characterSprite.setVelocityX(30);
                            this.characterSprite.rotation = 90 * (3.14 / 180);
                            this.shootDirection = 2;
                        } else
                            //follow straight
                            //this.characterSprite.setVelocityX(0);
                        //follow up
                        if (this.target.characterSprite.y > this.characterSprite.y - 30) {
                            this.characterSprite.setVelocityY(30);
                            this.characterSprite.rotation = 180 * (3.14 / 180);
                            this.shootDirection = 4;
                        }
                        //follow down
                        else if (this.target.characterSprite.y < this.characterSprite.y + 30) {
                            this.characterSprite.setVelocityY(-30);
                            this.characterSprite.rotation = 0 * (3.14 / 180);
                            this.shootDirection = 3;
                        } else
                            //follow straight
                            this.characterSprite.setVelocityY(0);

                        //Check if within range of ranged attacks
                        if(this.isRanged && this.rangedSpeed == 0.0) {
                            if (Phaser.Math.Distance.Between(this.target.characterSprite.x, this.target.characterSprite.y, this.characterSprite.x, this.characterSprite.y) <= this.attackRange) {
                                if(this.CheckFacingEnemy()) {
                                    this.projectiles.push(new RangedAttack(this.gameScene.physics.add.sprite(this.characterSprite.x, this.characterSprite.y, 'fireball'), 150, this.shootDirection, 500, 5, this.enemies, this.gameScene));
                                    this.rangedSpeed = this.maxRangedSpeed;
                                }
                            }
                        }

                    }
                } else if (this.moveDirection == 0) {
                    this.characterSprite.setVelocityX(0);
                    this.characterSprite.setVelocityY(0);
                    this.destination[0] = 0;
                    this.destination[1] = 0;
                    this.idleTimer = 0.0;
                }
            }
        }
    }

}