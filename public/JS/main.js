var config = {
    type: Phaser.WEBGL,
    width: 1000,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        render: render
    }
};

let game = new Phaser.Game(config);

const radianConverter = (3.14/180);

let player1, cursors, npc1, npc2, npc3;

let npc = [];
let npcs;
let players = [];

let gameScene;
let levelManager;

let mainCollider = [null, null, null, null, null, null];
let doorCollider = [null, null, null, null, null, null];
let doorHit = null;

function preload ()
{
    //Load floor tiles
    gameScene = this;

    //Load the placeholder map
    LoadFloor(this);
    //Load player-specific assets
    LoadPlayerAssets(this);
    //Load in-game assets
    LoadGameAssets(this);

}

function create ()
{
    gameScene.physics.world.bounds.x = 0;
    gameScene.physics.world.bounds.y = 0;
    gameScene.physics.world.bounds.width = 10000;
    gameScene.physics.world.bounds.height = 10000;

    levelManager = new LevelManager(gameScene);
    //levelManager.ChangeMap(this.make.tilemap( {key: 'mainmap'} ), 'mainmap');
 
    //initialise quests
    let questOne = this.add.text(805, 330, 'One Small Flavour', 1).setInteractive().setVisible(false).setDepth(1).setName('0').setScrollFactor(0).setColor("#ff000");
    let questTwo = this.add.text(805, 360, 'Get Them Meds', 1).setInteractive().setVisible(false).setDepth(1).setName('1').setScrollFactor(0).setColor("#ff0000 ");
    let questThree = this.add.text(805, 390, 'The Ny-Claws', 1).setInteractive().setVisible(false).setDepth(1).setName('2').setScrollFactor(0).setColor("#ff0000 ");
    let questFour = this.add.text(805, 420, 'Revenge', 1).setInteractive().setVisible(false).setDepth(1).setName('3').setScrollFactor(0).setColor("#ff0000 ");

    //Arrange into an array for the player
    let questList = [questOne, questTwo, questThree, questFour];

    //Setup player 5674, 5322 // 8230 4632 //5749, 3852
    player1 = new Player(this.physics.add.sprite(5749, 3852, 'gareth'), this.add.image(885, 60, 'status-bars'), this.add.image(885, 20, 'health-negative'),
        this.add.text(955, 12.5, '10'), this.add.image(885, 60, 'mana'), this.add.image(885, 60, 'mana-negative'), this.add.text(955, 52.5, '70'),
        questList, gameScene);
    player1.characterSprite.setCollideWorldBounds(true);
    player1.InitialiseHUD();
    player1.InitialiseInventory();
    players.push(player1);

    

    //Setup NPC
    let npcInfo = ['my nama jeff', 'whats your nama sama', 'I have a big banana',
        'you want to sampa?', 'options-2', 'yes', 'no', 'ai-Ok'];
    let npcInfoFork = ['great! ill see you later my hombre', 'that sucks brother rest in peace'];
    npc1 = new NPC(this.physics.add.image(200,100, 'npc').setImmovable(true).setDepth(1), 180 * (3.14/180), npcInfo, npcInfoFork, this, null, false, 0, 0, null, false, true, 0, 5);
    npc1.characterSprite.body.allowGravity = false;
    this.physics.add.collider(player1.characterSprite, npc1.characterSprite, function(){callfunc(npc1)});

    npcInfo = ['would you like to puruse my wares?', 'options-2', 'yes', 'no'];
    npcInfoFork = ['create-shop', 'alright fuck you too then'];
    npc2 = new NPC(this.physics.add.image(400,100, 'shopkeeper').setImmovable(true).setDepth(1), 180 * (3.14/180), npcInfo, npcInfoFork, this, 'shop1' , false, 0, 0, null);
    npc2.characterSprite.body.allowGravity = false;
    this.physics.add.collider(player1.characterSprite, npc2.characterSprite, function(){callfunc(npc2)});

    // Initial Level Setup
    InitMainMap();

    //Enemy
    npcInfo = [''];
    npcInfoFork = [''];
    npc3 = new NPC(this.physics.add.image(600,100, 'enemy1').setImmovable(true).setDepth(1), 180 * (3.14/180), npcInfo, npcInfoFork, this, null, true, 50, 50, players, true);
    npc3.characterSprite.body.allowGravity = false;
    this.physics.add.collider(player1.characterSprite, npc3.characterSprite, function(){callfunc(npc3)});
    let playerColliders = [ player1.characterSprite ];
    npc3.enemies = playerColliders;

    npcs = [npc1.characterSprite, npc2.characterSprite];
    let enemies = [npc3.characterSprite];
    player1.npcs = npcs;
    player1.enemies = enemies;

    //Set camera boundaries
    this.cameras.main.setBounds(0, 0, 10000, 10000);
    //Set camera to follow the first player
    this.cameras.main.startFollow(player1.characterSprite);


    this.input.keyboard.on('keydown_X', interact, this);
    this.input.on('gameobjectdown', function (pointer, button)
    {
        if(button.name == "chatboxclosebutton")
            player1.ToggleChatBox(false);
        else
            if(button.name == 'chatbox')
                player1.ToggleChatBox(true);
        else
            if(button.name == 'chatboxcontinuebutton')
            {
                player1.ActivateChat(player1.collisionPartner.information, player1.chatIndex + 1)
            }
            if(button.name == 'notificationboxclosebutton')
                player1.ToggleNotificationBox(false, ' ');
        else
            if(button.name == "questtoggle")
                player1.ToggleFlickBook(2);
        else
            if(button.name == "geartoggle")
                player1.ToggleFlickBook(1);
        else
            if(button.name == "inventorytoggle")
                player1.ToggleFlickBook(0);
        else {
                //All normal buttons accounted for: check the item type
                let tempname = button.name.split('-');

                if (tempname[0] == "dialogue") {
                    player1.ActivateChat(player1.collisionPartner.informationFork, 0, true, tempname[1]);
                }

                if(button.name == "0")
                {
                    player1.ToggleNotificationBox(true, 0);
                }

                player1.CheckInput(pointer, button);

            }
    });

    //enable cursor input
    cursors = this.input.keyboard.createCursorKeys();

}
function interact()
{
    if(player1.collisionPartner != null) {
        player1.notificationBoxText.visible = true;
        player1.ActivateChat(player1.collisionPartner.information, 0, false, 0);
    }
}

function callfunc(collisionPartner)
{
    player1.notificationBoxText.x = Math.floor(player1.characterSprite.x + player1.characterSprite.width / 2);//player1.characterSprite.x;
    player1.notificationBoxText.y = Math.floor(player1.characterSprite.y + player1.characterSprite.height / 2);
    player1.notificationBoxText.text = "press x to interact";
    player1.notificationBoxText.visible = true;
    player1.collisionPartner = collisionPartner;
}


function HandleMapCollisions()
{
    if(doorHit != null){
        
        switch(doorHit){
            // Enter Cave
            case "cave_indoor":{
                player1.TeleportPlayer(250, 1278);
                clearColliders();
    
                levelManager.ChangeMap(gameScene.make.tilemap( {key: 'cave'} ), 'cave');
                levelManager.collisionLayer.setCollisionBetween(1, 10000);
                levelManager.cave_outdoor.setCollisionBetween(1, 10000);
                mainCollider[0] = gameScene.physics.add.collider(player1.characterSprite, levelManager.collisionLayer);
                doorCollider[0] = gameScene.physics.add.collider(player1.characterSprite, levelManager.cave_outdoor, function(){ doorHit = "cave_outdoor"; });
                
                break;
            }

            // Exit Cave
            case "cave_outdoor": {
                player1.TeleportPlayer(8230, 4467);
                InitMainMap();
                break;
            }

            // Enter blacksmith
            case "blacksmith_indoor":{ //520
                player1.TeleportPlayer(580, 256);
                clearColliders();

                levelManager.ChangeMap(gameScene.make.tilemap( {key: 'blacksmith'} ), 'blacksmith');
                levelManager.collisionLayer.setCollisionBetween(1, 10000);
                levelManager.colliderDecolayer1.setCollisionBetween(1, 10000);
                levelManager.colliderDecolayer2.setCollisionBetween(1, 10000);
                levelManager.colliderDecolayer3.setCollisionBetween(1, 10000);
                levelManager.colliderDecolayer4.setCollisionBetween(1, 10000);
                levelManager.blacksmith_outdoor.setCollisionBetween(1, 10000);
                mainCollider[0] = gameScene.physics.add.collider(player1.characterSprite, levelManager.collisionLayer);
                mainCollider[1] = gameScene.physics.add.collider(player1.characterSprite, levelManager.colliderDecolayer1);
                mainCollider[2] = gameScene.physics.add.collider(player1.characterSprite, levelManager.colliderDecolayer2);
                mainCollider[3] = gameScene.physics.add.collider(player1.characterSprite, levelManager.colliderDecolayer3);
                mainCollider[4] = gameScene.physics.add.collider(player1.characterSprite, levelManager.colliderDecolayer4);
                doorCollider[0] = gameScene.physics.add.collider(player1.characterSprite, levelManager.blacksmith_outdoor, function(){ doorHit = "blacksmith_outdoor"; });
                InitNPC('blacksmith');
                break;
            }

            // Exit blacksmith
            case "blacksmith_outdoor":{
                player1.TeleportPlayer(5749, 3852);
                InitMainMap();
                break;
            }

            // Enter merchant
            case "merchant_indoor":{
                player1.TeleportPlayer(306, 350);
                clearColliders();

                levelManager.ChangeMap(gameScene.make.tilemap( {key: 'generalgoods'} ), 'generalgoods');
                levelManager.collisionLayer.setCollisionBetween(1, 10000);
                levelManager.colliderDecolayer1.setCollisionBetween(1, 10000);
                levelManager.colliderDecolayer2.setCollisionBetween(1, 10000);
                levelManager.colliderDecolayer3.setCollisionBetween(1, 10000);
                levelManager.merchant_outdoor.setCollisionBetween(1, 10000);
                mainCollider[0] = gameScene.physics.add.collider(player1.characterSprite, levelManager.collisionLayer);
                mainCollider[1] = gameScene.physics.add.collider(player1.characterSprite, levelManager.colliderDecolayer1);
                mainCollider[2] = gameScene.physics.add.collider(player1.characterSprite, levelManager.colliderDecolayer2);
                mainCollider[3] = gameScene.physics.add.collider(player1.characterSprite, levelManager.colliderDecolayer3);
                doorCollider[0] = gameScene.physics.add.collider(player1.characterSprite, levelManager.merchant_outdoor, function(){ doorHit = "merchant_outdoor"; });
                break;
            }

            // Exit merchant
            case "merchant_outdoor":{
                player1.TeleportPlayer(4894, 1212);
                InitMainMap();
                break;
            }

            // Enter merchant
            case "manor_indoor":{
                player1.TeleportPlayer(501, 635);
                clearColliders();

                levelManager.ChangeMap(gameScene.make.tilemap( {key: 'gandomanor'} ), 'gandomanor');
                levelManager.collisionLayer.setCollisionBetween(1, 10000);
                levelManager.colliderDecolayer1.setCollisionBetween(1, 10000);
                levelManager.colliderDecolayer2.setCollisionBetween(1, 10000);
                levelManager.manor_outdoor.setCollisionBetween(1, 10000);
                mainCollider[0] = gameScene.physics.add.collider(player1.characterSprite, levelManager.collisionLayer);
                mainCollider[1] = gameScene.physics.add.collider(player1.characterSprite, levelManager.colliderDecolayer1);
                mainCollider[2] = gameScene.physics.add.collider(player1.characterSprite, levelManager.colliderDecolayer2);
                doorCollider[0] = gameScene.physics.add.collider(player1.characterSprite, levelManager.manor_outdoor, function(){ doorHit = "manor_outdoor"; });
                break;
            }

            // Exit merchant
            case "manor_outdoor":{
                player1.TeleportPlayer(1936, 3650);
                InitMainMap();
                break;
            }

            // Enter merchant
            case "tower_indoor":{
                player1.TeleportPlayer(572, 500);
                clearColliders();

                levelManager.ChangeMap(gameScene.make.tilemap( {key: 'tower'} ), 'tower');
                levelManager.collisionLayer.setCollisionBetween(1, 10000);
                levelManager.colliderDecolayer1.setCollisionBetween(1, 10000);
                levelManager.colliderDecolayer2.setCollisionBetween(1, 10000);
                levelManager.tower_outdoor.setCollisionBetween(1, 10000);
                mainCollider[0] = gameScene.physics.add.collider(player1.characterSprite, levelManager.collisionLayer);
                mainCollider[1] = gameScene.physics.add.collider(player1.characterSprite, levelManager.colliderDecolayer1);
                mainCollider[2] = gameScene.physics.add.collider(player1.characterSprite, levelManager.colliderDecolayer2);
                doorCollider[0] = gameScene.physics.add.collider(player1.characterSprite, levelManager.tower_outdoor, function(){ doorHit = "tower_outdoor"; });
                break;
            }

            // Exit merchant
            case "tower_outdoor":{
                player1.TeleportPlayer(7057, 2145);
                InitMainMap();
                break;
            }
        }

        doorHit = null;
    }
}

function InitMainMap(){
    //if(mainCollider != null) mainCollider.destroy();
    clearColliders();
    levelManager.ChangeMap(gameScene.make.tilemap( {key: 'mainmap'} ), 'mainmap');
    levelManager.collisionLayer.setCollisionBetween(1, 10000);
    levelManager.cave_indoor.setCollisionBetween(1, 10000);
    levelManager.blacksmith_indoor.setCollisionBetween(1, 10000);
    levelManager.merchant_indoor.setCollisionBetween(1, 10000);
    levelManager.manor_indoor.setCollisionBetween(1, 10000);
    levelManager.tower_indoor.setCollisionBetween(1, 10000);
    mainCollider[0] = gameScene.physics.add.collider(player1.characterSprite, levelManager.collisionLayer);
    doorCollider[0] = gameScene.physics.add.collider(player1.characterSprite, levelManager.cave_indoor, function(){ doorHit = "cave_indoor"; });
    doorCollider[1] = gameScene.physics.add.collider(player1.characterSprite, levelManager.blacksmith_indoor, function(){ doorHit = "blacksmith_indoor"; });
    doorCollider[2] = gameScene.physics.add.collider(player1.characterSprite, levelManager.merchant_indoor, function(){ doorHit = "merchant_indoor"; });
    doorCollider[3] = gameScene.physics.add.collider(player1.characterSprite, levelManager.manor_indoor, function(){ doorHit = "manor_indoor"; });
    doorCollider[4] = gameScene.physics.add.collider(player1.characterSprite, levelManager.tower_indoor, function(){ doorHit = "tower_indoor"; });
}

function clearColliders(){
    for(let i = 0; i < mainCollider.length; i++){
        if(mainCollider[i] != null){
            mainCollider[i].destroy();
            mainCollider[i] = null;
        }
    }
    for(let i = 0; i < doorCollider.length; i++){
        if(doorCollider[i] != null){
            doorCollider[i].destroy();
            doorCollider[i] = null;
        }
    }
}

function InitNPC(map){
    switch(map){
        case 'blacksmith':{
            npcInfo = ['Alright mate, what can I get ya?', 'options-2', 'yes', 'no'];
            npcInfoFork = ['create-shop', 'If yer aint buyin, get out!'];
            npc[0] = new NPC(gameScene.physics.add.image(293,178, 'shopkeeper').setImmovable(true).setDepth(1), 90 * (3.14/180), npcInfo, npcInfoFork, gameScene, 'shop1' , false, 0, 0, null);
            npc[0].characterSprite.body.allowGravity = false;
            gameScene.physics.add.collider(player1.characterSprite, npc[0].characterSprite, function(){callfunc(npc[0])});
            player1.npcs = npc;
            break;
        }

    }
}

function clearNPCs(){
    for(let i = 0; i < npc.length; i++){
        if(npc[i] != null){
            npc[i].destroy();
            npc[i] = null;
        }
    }
}


function update() {
    HandleMapCollisions();
    player1.Update(cursors);
    console.log(player1.characterSprite.x + " " + player1.characterSprite.y);
    for(let i = 0; i < npc.length; i++){
        if(npc[i] != null){
            npc[i].Update();
        }
    }
    //npc1.Update();
    //npc2.Update();
    //npc3.Update();
}

function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
}