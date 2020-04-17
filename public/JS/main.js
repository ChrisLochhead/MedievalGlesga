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

let player1, player2, cursors, npc1, npc2, npc3;

let npc = [];
let npcs;
let players = [];

let gameScene;
let levelManager;
let playersUI;

let mainCollider = [null, null, null, null, null, null, null, null, null, null];
let doorCollider = [null, null, null, null, null, null, null, null, null, null];
let doorHit = null;

// Quest Checkers
let q_spokeToGando = false;
let q_gotThePotion = false;
let q_returnToGando = false;
let q_killNicklaws = false;

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


    //initialise quests
    let questOne = this.add.text(805, 330, 'Talk to Gando', 1).setInteractive().setVisible(false).setDepth(1).setName('0').setScrollFactor(0).setColor("#ff000");
    let questTwo = this.add.text(805, 360, 'Get The Potion', 1).setInteractive().setVisible(false).setDepth(1).setName('1').setScrollFactor(0).setColor("#ff0000 ");
    let questThree = this.add.text(805, 390, 'The Ny-Claws', 1).setInteractive().setVisible(false).setDepth(1).setName('2').setScrollFactor(0).setColor("#ff0000 ");

    //Arrange into an array for the player
    let questList = [questOne, questTwo, questThree];

    //Setup players
    player1 = new Player(this.physics.add.sprite(5576, 5562, 'gareth').setDepth(1), 100, 100, gameScene,0);
    player1.characterSprite.setCollideWorldBounds(true);
    players.push(player1);

    player2 = new Player(this.physics.add.sprite(5735, 5553, 'dave').setDepth(1), 100, 100, gameScene, 1);
    player2.characterSprite.setCollideWorldBounds(true);
    players.push(player2);

    //Setup UI
    this.playersUI = new UI(players, questList, gameScene);
    this.playersUI.InitialiseHUD();
    this.playersUI.InitialiseInventory();
    this.playersUI.CheckInput();
    players[0].passUI(this.playersUI);
    players[1].passUI(this.playersUI);

    // Initial Level Setup
    levelManager = new LevelManager(gameScene);
    InitMainMap();

    //Set camera boundaries
    this.cameras.main.setBounds(0, 0, 10000, 10000);
    //Set camera to follow the first player
    this.cameras.main.startFollow(player1.characterSprite);

    //enable cursor input
    cursors = this.input.keyboard.createCursorKeys();

}

function HandleMapCollisions()
{
    if(doorHit != null){
        //this.playersUI.ClearCollisionUI();
        switch(doorHit){
            // Enter Cave
            case "cave_indoor":{
                player1.TeleportPlayer(250, 1278);
                player2.TeleportPlayer(322, 1266)
                clearColliders();
    
                levelManager.ChangeMap(gameScene.make.tilemap( {key: 'cave'} ), 'cave');
                levelManager.collisionLayer.setCollisionBetween(1, 10000);
                levelManager.cave_outdoor.setCollisionBetween(1, 10000);
                mainCollider[0] = gameScene.physics.add.collider(player1.characterSprite, levelManager.collisionLayer);
                doorCollider[0] = gameScene.physics.add.collider(player1.characterSprite, levelManager.cave_outdoor, function(){ doorHit = "cave_outdoor"; });
                mainCollider[1] = gameScene.physics.add.collider(player2.characterSprite, levelManager.collisionLayer);
                doorCollider[1] = gameScene.physics.add.collider(player2.characterSprite, levelManager.cave_outdoor, function(){ doorHit = "cave_outdoor"; });
                InitNPC('cave');
                break;
            }

            // Exit Cave
            case "cave_outdoor": {
                player1.TeleportPlayer(8188, 4464);
                player2.TeleportPlayer(8266, 4473)
                InitMainMap();
                break;
            }

            // Enter blacksmith
            case "blacksmith_indoor":{ //520
                player1.TeleportPlayer(580, 256);
                player2.TeleportPlayer(538, 229);
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

                mainCollider[5] = gameScene.physics.add.collider(player2.characterSprite, levelManager.collisionLayer);
                mainCollider[6] = gameScene.physics.add.collider(player2.characterSprite, levelManager.colliderDecolayer1);
                mainCollider[7] = gameScene.physics.add.collider(player2.characterSprite, levelManager.colliderDecolayer2);
                mainCollider[8] = gameScene.physics.add.collider(player2.characterSprite, levelManager.colliderDecolayer3);
                mainCollider[9] = gameScene.physics.add.collider(player2.characterSprite, levelManager.colliderDecolayer4);
                doorCollider[1] = gameScene.physics.add.collider(player2.characterSprite, levelManager.blacksmith_outdoor, function(){ doorHit = "blacksmith_outdoor"; });
                InitNPC('blacksmith');
                break;
            }

            // Exit blacksmith
            case "blacksmith_outdoor":{
                player1.TeleportPlayer(5749, 3795);
                player2.TeleportPlayer(5743, 3868);
                InitMainMap();
                break;
            }

            // Enter merchant
            case "merchant_indoor":{
                player1.TeleportPlayer(251, 325);
                player2.TeleportPlayer(388, 322);
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

                mainCollider[4] = gameScene.physics.add.collider(player2.characterSprite, levelManager.collisionLayer);
                mainCollider[5] = gameScene.physics.add.collider(player2.characterSprite, levelManager.colliderDecolayer1);
                mainCollider[6] = gameScene.physics.add.collider(player2.characterSprite, levelManager.colliderDecolayer2);
                mainCollider[7] = gameScene.physics.add.collider(player2.characterSprite, levelManager.colliderDecolayer3);
                doorCollider[1] = gameScene.physics.add.collider(player2.characterSprite, levelManager.merchant_outdoor, function(){ doorHit = "merchant_outdoor"; });
                InitNPC('generalgoods');
                break;
            }

            // Exit merchant
            case "merchant_outdoor":{
                player1.TeleportPlayer(4843, 1213);
                player2.TeleportPlayer(4951, 1216);
                InitMainMap();
                break;
            }

            // Enter manor
            case "manor_indoor":{
                player1.TeleportPlayer(489, 641);
                player2.TeleportPlayer(612, 641);
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

                mainCollider[3] = gameScene.physics.add.collider(player2.characterSprite, levelManager.collisionLayer);
                mainCollider[4] = gameScene.physics.add.collider(player2.characterSprite, levelManager.colliderDecolayer1);
                mainCollider[5] = gameScene.physics.add.collider(player2.characterSprite, levelManager.colliderDecolayer2);
                doorCollider[1] = gameScene.physics.add.collider(player2.characterSprite, levelManager.manor_outdoor, function(){ doorHit = "manor_outdoor"; });
                InitNPC('manor');
                break;
            }

            // Exit manor
            case "manor_outdoor":{
                player1.TeleportPlayer(1882, 3657);
                player2.TeleportPlayer(2056, 3669);
                InitMainMap();
                break;
            }

            // Enter tower
            case "tower_indoor":{
                player1.TeleportPlayer(509, 483);
                player2.TeleportPlayer(641, 485);
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

                mainCollider[3] = gameScene.physics.add.collider(player2.characterSprite, levelManager.collisionLayer);
                mainCollider[4] = gameScene.physics.add.collider(player2.characterSprite, levelManager.colliderDecolayer1);
                mainCollider[5] = gameScene.physics.add.collider(player2.characterSprite, levelManager.colliderDecolayer2);
                doorCollider[1] = gameScene.physics.add.collider(player2.characterSprite, levelManager.tower_outdoor, function(){ doorHit = "tower_outdoor"; });
                InitNPC('tower');
                break;
            }

            // Exit tower
            case "tower_outdoor":{
                player1.TeleportPlayer(6991, 2143);
                player2.TeleportPlayer(7111, 2155);
                InitMainMap();
                break;
            }
        }

        doorHit = null;
    }
}

function InitMainMap(){
    clearColliders();
    levelManager.ChangeMap(gameScene.make.tilemap( {key: 'mainmap'} ), 'mainmap');
    levelManager.collisionLayer.setCollisionBetween(1, 10000);
    levelManager.cave_indoor.setCollisionBetween(1, 10000);
    levelManager.blacksmith_indoor.setCollisionBetween(1, 10000);
    levelManager.merchant_indoor.setCollisionBetween(1, 10000);
    levelManager.manor_indoor.setCollisionBetween(1, 10000);
    levelManager.tower_indoor.setCollisionBetween(1, 10000);
    mainCollider[0] = gameScene.physics.add.collider(players[0].characterSprite, levelManager.collisionLayer);
    doorCollider[0] = gameScene.physics.add.collider(players[0].characterSprite, levelManager.cave_indoor, function(){ doorHit = "cave_indoor"; });
    doorCollider[1] = gameScene.physics.add.collider(players[0].characterSprite, levelManager.blacksmith_indoor, function(){ doorHit = "blacksmith_indoor"; });
    doorCollider[2] = gameScene.physics.add.collider(players[0].characterSprite, levelManager.merchant_indoor, function(){ doorHit = "merchant_indoor"; });
    doorCollider[3] = gameScene.physics.add.collider(players[0].characterSprite, levelManager.manor_indoor, function(){ doorHit = "manor_indoor"; });
    doorCollider[4] = gameScene.physics.add.collider(players[0].characterSprite, levelManager.tower_indoor, function(){ doorHit = "tower_indoor"; });

    mainCollider[1] = gameScene.physics.add.collider(players[1].characterSprite, levelManager.collisionLayer);
    doorCollider[5] = gameScene.physics.add.collider(players[1].characterSprite, levelManager.cave_indoor, function(){ doorHit = "cave_indoor"; });
    doorCollider[6] = gameScene.physics.add.collider(players[1].characterSprite, levelManager.blacksmith_indoor, function(){ doorHit = "blacksmith_indoor"; });
    doorCollider[7] = gameScene.physics.add.collider(players[1].characterSprite, levelManager.merchant_indoor, function(){ doorHit = "merchant_indoor"; });
    doorCollider[8] = gameScene.physics.add.collider(players[1].characterSprite, levelManager.manor_indoor, function(){ doorHit = "manor_indoor"; });
    doorCollider[9] = gameScene.physics.add.collider(players[1].characterSprite, levelManager.tower_indoor, function(){ doorHit = "tower_indoor"; });
    InitNPC('mainmap');
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
            clearNPCs();
            npcInfo = ['Alright mate, what can I get ya?', 'options-2', 'yes', 'no'];
            npcInfoFork = ['create-shop', 'If yer aint buyin, get out!'];
            npc[0] = new NPC(gameScene.physics.add.image(293,178, 'shopkeeper').setImmovable(true), 90 * (3.14/180), npcInfo, npcInfoFork, gameScene, 'shop1' , false, 0, 0, null, false, false, 0, 0, 0);
            npc[0].characterSprite.body.allowGravity = false;
            gameScene.physics.add.collider(players[0].characterSprite, npc[0].characterSprite, function(){players[0].positionInteractMenu(npc[0])});
            gameScene.physics.add.collider(players[1].characterSprite, npc[0].characterSprite, function(){players[1].positionInteractMenu(npc[0])});
            players[0].npcs = npc;
            players[1].npcs = npc;
            break;
        }
        case 'generalgoods':{
            clearNPCs();
            npcInfo = ['Welcome to ASDA mate, can I help ya?', 'options-2', 'yes', 'no'];
            npcInfoFork = ['create-shop', 'Aight'];
            npc[0] = new NPC(gameScene.physics.add.image(168, 222, 'shopkeeper').setImmovable(true), 180 * (3.14/180), npcInfo, npcInfoFork, gameScene, 'shop2' , false, 0, 0, null, false, false, 0, 0, 0);
            npc[0].characterSprite.body.allowGravity = false;
            gameScene.physics.add.collider(players[0].characterSprite, npc[0].characterSprite, function(){players[0].positionInteractMenu(npc[0])});
            gameScene.physics.add.collider(players[1].characterSprite, npc[0].characterSprite, function(){players[1].positionInteractMenu(npc[0])});
            players[0].npcs = npc;
            players[1].npcs = npc;
            break;
        }
        case 'tower':{
            clearNPCs();
            npcInfo = ['Hey mate, want a potion of sobriety?', 'options-2', 'yes', 'no'];
            npcInfoFork = ['create-shop', 'Aight'];
            npc[0] = new NPC(gameScene.physics.add.image(577, 443, 'shopkeeper').setImmovable(true), 180 * (3.14/180), npcInfo, npcInfoFork, gameScene, 'shop2' , false, 0, 0, null, false, false, 0, 0, 0);
            npc[0].characterSprite.body.allowGravity = false;
            gameScene.physics.add.collider(players[0].characterSprite, npc[0].characterSprite, function(){players[0].positionInteractMenu(npc[0])});
            gameScene.physics.add.collider(players[1].characterSprite, npc[0].characterSprite, function(){players[1].positionInteractMenu(npc[0])});
            players[0].npcs = npc;
            players[1].npcs = npc;
            break;
        }
        case 'manor':{
            clearNPCs();
            npcInfo = ['Cheers mate... but I cannae help you yet. Go slay the Nic-klaws on the bottom right of the map', 'options-2', 'FINE', 'Aw wit'];
            npcInfoFork = ['create-shop', 'Aight'];
            npc[0] = new NPC(gameScene.physics.add.image(544, 1213, 'gando').setImmovable(true), 0, npcInfo, npcInfoFork, gameScene, 'shop1', false, 0, 0, null, false, false, 0, 0, 0);
            npc[0].characterSprite.body.allowGravity = false;
            gameScene.physics.add.collider(players[0].characterSprite, npc[0].characterSprite, function(){players[0].positionInteractMenu(npc[0])});
            gameScene.physics.add.collider(players[1].characterSprite, npc[0].characterSprite, function(){players[1].positionInteractMenu(npc[0])});
            players[0].npcs = npc;
            players[1].npcs = npc;
            break;
        }
        case 'cave':{
            clearNPCs();
            // Nic-klaw
            npcInfo = [''];
            npcInfoFork = [''];
            npc[0] = new NPC(gameScene.physics.add.image(865, 779, 'nicklaw').setImmovable(true), 0, npcInfo, npcInfoFork, gameScene, null, true, 50, 50, players, true, false, 0, 0,500);
            npc[0].characterSprite.body.allowGravity = false;

            let playerColliders = [ player1.characterSprite, player2.characterSprite];
            npc[0].enemies = playerColliders;

            let enemies = [npc[0].characterSprite];
            player1.enemies = enemies;
            player2.enemies = enemies;
            break;
        }

        case 'mainmap':{
            clearNPCs();
            // Enemies
            npcInfo = [''];
            npcInfoFork = [''];
            npc[0] = new NPC(gameScene.physics.add.image(4723, 2213, 'enemy1').setImmovable(true), 180 * (3.14/180), npcInfo, npcInfoFork, gameScene, null, true, 50, 50, players, true, false, 0, 0,50);
            npc[0].characterSprite.body.allowGravity = false;

            npcInfo = [''];
            npcInfoFork = [''];
            npc[1] = new NPC(gameScene.physics.add.image(4597, 2294, 'enemy1').setImmovable(true), 180 * (3.14/180), npcInfo, npcInfoFork, gameScene, null, true, 50, 50, players, true, false, 0, 0,50);
            npc[1].characterSprite.body.allowGravity = false;

            npcInfo = [''];
            npcInfoFork = [''];
            npc[2] = new NPC(gameScene.physics.add.image(4663, 2357, 'enemy1').setImmovable(true), 180 * (3.14/180), npcInfo, npcInfoFork, gameScene, null, true, 50, 50, players, true, false, 0, 0,50);
            npc[2].characterSprite.body.allowGravity = false;

            npcInfo = [''];
            npcInfoFork = [''];
            npc[3] = new NPC(gameScene.physics.add.image(2839, 2207, 'enemy1').setImmovable(true), 180 * (3.14/180), npcInfo, npcInfoFork, gameScene, null, true, 50, 50, players, true, false, 0, 0,50);
            npc[3].characterSprite.body.allowGravity = false;

            npcInfo = [''];
            npcInfoFork = [''];
            npc[4] = new NPC(gameScene.physics.add.image(2815, 2315, 'enemy1').setImmovable(true), 180 * (3.14/180), npcInfo, npcInfoFork, gameScene, null, true, 50, 50, players, true, false, 0, 0,50);
            npc[4].characterSprite.body.allowGravity = false;

            npcInfo = [''];
            npcInfoFork = [''];
            npc[5] = new NPC(gameScene.physics.add.image(2815, 2315, 'enemy1').setImmovable(true), 180 * (3.14/180), npcInfo, npcInfoFork, gameScene, null, true, 50, 50, players, true, false, 0, 0,50);
            npc[5].characterSprite.body.allowGravity = false;

            npcInfo = [''];
            npcInfoFork = [''];
            npc[6] = new NPC(gameScene.physics.add.image(2449, 2861, 'enemy1').setImmovable(true), 180 * (3.14/180), npcInfo, npcInfoFork, gameScene, null, true, 50, 50, players, true, false, 0, 0,50);
            npc[6].characterSprite.body.allowGravity = false;

            npcInfo = [''];
            npcInfoFork = [''];
            npc[7] = new NPC(gameScene.physics.add.image(5221, 1183, 'enemy1').setImmovable(true), 180 * (3.14/180), npcInfo, npcInfoFork, gameScene, null, true, 50, 50, players, true, false, 0, 0,50);
            npc[7].characterSprite.body.allowGravity = false;

            let playerColliders = [ player1.characterSprite, player2.characterSprite];
            npc[0].enemies = playerColliders;
            npc[1].enemies = playerColliders;
            let enemies = [npc[0].characterSprite, npc[1].characterSprite, npc[2].characterSprite, npc[3].characterSprite, npc[4].characterSprite, npc[5].characterSprite, npc[6].characterSprite, npc[7].characterSprite];
            player1.enemies = enemies;
            player2.enemies = enemies;

            // NPCs
            npcInfo = ['Mate, your horse got wrecked', 'options-2', 'Her names Corsa ya twit', 'I can see that'];
            npcInfoFork = ['Shove off lad', 'Maybe ol Gando may help you. Hes in town.'];
            npc[8] = new NPC(gameScene.physics.add.image(5764, 4830, 'shopkeeper').setImmovable(true), 180 * (3.14/180), npcInfo, npcInfoFork, gameScene, 'shop2' , false, 0, 0, null, false, false, 0, 0, 0);
            npc[8].characterSprite.body.allowGravity = false;
            gameScene.physics.add.collider(players[0].characterSprite, npc[8].characterSprite, function(){player1.positionInteractMenu(npc[8])});
            gameScene.physics.add.collider(players[1].characterSprite, npc[8].characterSprite, function(){player1.positionInteractMenu(npc[8])});

            if(this.q_spokeToGando != true){
                npcInfo = ['Am ol Gando the Grey, my mescaline tells me you are trapped here. \n Help me get me a potion of sobriety from the wizard. \n Ill be at my manor in the West.', 'options-2', 'Okay mate', 'Get off me you hunchback'];
                npcInfoFork = ['spokeToGando', 'Gonnae naw be a twit?'];
                npc[9] = new NPC(gameScene.physics.add.image(5538, 3939, 'gando').setImmovable(true), 90 * (3.14/180), npcInfo, npcInfoFork, gameScene, 'shop1' , false, 0, 0, null, false, false, 0, 0, 0);
                npc[9].characterSprite.body.allowGravity = false;
                gameScene.physics.add.collider(players[0].characterSprite, npc[9].characterSprite, function(){players[0].positionInteractMenu(npc[9])});
                gameScene.physics.add.collider(players[1].characterSprite, npc[9].characterSprite, function(){players[1].positionInteractMenu(npc[9])});
            }

            let npcList = [npc[8].characterSprite, npc[9].characterSprite];
            player1.npcs = npcList;
            player2.npcs = npcList;
            break;
        }

    }
}

function clearNPCs(){
    for(let i = 0; i < npc.length; i++){
        if(npc[i] != null){
            npc[i].Destruct();
            npc[i] = null;
        }
    }
}


function update() {
    this.playersUI.UpdateMission(q_spokeToGando,q_gotThePotion,q_returnToGando,q_killNicklaws);

    HandleMapCollisions();
    for(let i = 0; i < players.length; i++){
        players[i].Update(cursors);
    }
    console.log(player1.characterSprite.x + " " + player1.characterSprite.y);
    for(let i = 0; i < npc.length; i++){
        if(npc[i] != null){
            npc[i].Update();
        }
    }
}

function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
}