class Equipment {
    constructor(inventSprite, attk, mgdef, medef, hb, mb, t, sp, cp) {
        this.inventorySprite = inventSprite;
        this.inventorySprite.parent = this;
        //Bonuses
        this.attackBonus = attk;
        this.mageDefence = mgdef;
        this.meleeDefence = medef;
        this.healthBonus = hb;
        this.manaBonus = mb;
        this.itemType = t;
        this.shopPrice = sp;
        this.characterPrice = cp;

        this.itemPriceText = null;
    }
}

class Weapon {
    constructor(inventSprite, mgdef, medef, npcs, gameScene, isRanged, rangespr, owner, enemies) {
        this.bodySprite = inventSprite;
        this.bodySprite.parent = this;

        this.mageDefence = mgdef;
        this.meleeDefence = medef;

        this.gameScene = gameScene;

        this.ranged = isRanged;
        this.isAttacking = false;
        this.rangeSprite = rangespr;
        this.isRangedAttacking = false;
        this.rangedAttacks = [];
        this.owner = owner;

        let self = this;
        if(npcs != null)
        gameScene.physics.add.collider(this.bodySprite, npcs, function(me, gameObject){self.Attack(me, gameObject)}, null, self);

        this.enemies = enemies;
        if(this.enemies != null)
            gameScene.physics.add.collider(this.bodySprite, this.enemies, function(me, gameObject){self.Attack(me, gameObject)}, null, self);
    }

    Attack(self, gameObject){
        if(self.parent.isAttacking && gameObject.parent.canBeDamaged == true) {

            //Apply damage
            gameObject.parent.TakeDamage(self.damage);
            if(gameObject.parent.health <= 0)
            {
                gameObject.parent.Destruct();
            }else
            {
                gameObject.parent.isDamaged = true;
            }
            self.parent.isAttacking = false;
             }
        }

    Update()
    {
        if(this.isRangedAttacking)
        {
            this.rangedAttacks.push(new RangedAttack(this.gameScene.physics.add.sprite(this.bodySprite.x, this.bodySprite.y, this.rangeSprite), 30, this.owner.moveDirection, 100, 5, this.enemies, this.gameScene));
            this.isRangedAttacking = false;
        }

        for(let i = 0; i < this.rangedAttacks.length; i++)
        {
            if(this.rangedAttacks[i] != null)
                this.rangedAttacks[i].Update();
        }
    }
}

class RangedAttack{
    constructor(spr, speed, dir, dropoff, dmg, enemies, gamescene) {
        this.bodySprite = spr;
        this.bodySprite.parent = this;
        this.speed = speed;
        this.dropOff = dropoff;
        this.damage = dmg;
        this.direction = dir;
        this.originalPosition = [this.bodySprite.x, this.bodySprite.y];
        this.enemies = enemies;
        this.gameScene = gamescene;
        //left-right-up-down
        if(this.direction == 1)
        this.bodySprite.setVelocityX(-speed);
        else if(this.direction == 2)
            this.bodySprite.setVelocityX(speed);
        else if(this.direction == 3)
            this.bodySprite.setVelocityY(-speed);
        else if(this.direction == 4)
            this.bodySprite.setVelocityY(speed);

        let self = this;
        //Assign enemy colliders
        if(this.enemies != null)
            this.gameScene.physics.add.collider(this.bodySprite, this.enemies, function(me, gameObject){self.Collide(me, gameObject)}, null, self);

    }

    Collide(me, gameObject)
    {
        //Inflict damage
        gameObject.parent.TakeDamage(me.parent.damage);
        if(gameObject.parent.health <= 0)
            gameObject.parent.Destruct();
        else
            gameObject.parent.isDamaged = true;
        //Delete
        me.parent.Destruct();
    }

    Destruct()
    {
        this.bodySprite.destroy();
        delete this;
    }

    Update()
    {
        if(this.direction == 1 && this.bodySprite.x < this.originalPosition[0] - this.dropOff) this.Destruct();
        if(this.direction == 2 && this.bodySprite.x > this.originalPosition[0] + this.dropOff) this.Destruct();
        if(this.direction == 3 && this.bodySprite.y < this.originalPosition[1] - this.dropOff) this.Destruct();
        if(this.direction == 4 && this.bodySprite.y > this.originalPosition[1] + this.dropOff) this.Destruct();

    }
}