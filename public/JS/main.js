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

let npcs;
let players = [];

let gameScene;

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

    //draw a floor
    for(let i = 0; i < 63; i++){
        for(let j = 0; j < 63; j++){
            let temp = Math.floor(Math.random() * 4) + 1;
            this.add.image(16 + (i*32), 16 + (j*32), 'grass' + temp);
        }
    }
    //game.world.setBounds(0, 0, 2000, 2000);
    //initialise quests
    let questOne = this.add.text(805, 330, 'One Small Flavour', 1).setInteractive().setVisible(false).setDepth(1).setName('0').setScrollFactor(0).setColor("#ff0000 ");
    let questTwo = this.add.text(805, 360, 'Get Them Meds', 1).setInteractive().setVisible(false).setDepth(1).setName('1').setScrollFactor(0).setColor("#ff0000 ");
    let questThree = this.add.text(805, 390, 'The Ny-Claws', 1).setInteractive().setVisible(false).setDepth(1).setName('2').setScrollFactor(0).setColor("#ff0000 ");
    let questFour = this.add.text(805, 420, 'Revenge', 1).setInteractive().setVisible(false).setDepth(1).setName('3').setScrollFactor(0).setColor("#ff0000 ");

    //Arrange into an array for the player
    let questList = [questOne, questTwo, questThree, questFour];

    //Setup player
    player1 = new Player(this.physics.add.sprite(400, 300, 'gareth').setDepth(1),
        this.add.image(885, 20, 'health').setScrollFactor(0), this.add.image(885, 20, 'health-negative').setScrollFactor(0),
        this.add.text(955, 12.5, '10').setScrollFactor(0),
        this.add.image(885, 60, 'mana').setScrollFactor(0), this.add.image(885, 60, 'mana-negative').setScrollFactor(0),
        this.add.text(955, 52.5, '70').setScrollFactor(0),
        questList, gameScene);
    player1.characterSprite.setCollideWorldBounds(true);
    player1.InitialiseHUD();
    player1.InitialiseInventory();
    players.push(player1);
    //Setup NPC
    let npcInfo = ['my nama jeff', 'whats your nama sama', 'I have a big banana',
        'you want to sampa?', 'options-2', 'yes', 'no', 'ai-Ok'];
    let npcInfoFork = ['great! ill see you later my hombre', 'that sucks brother rest in peace'];
    npc1 = new NPC(this.physics.add.image(200,100, 'npc').setImmovable(true), 180 * (3.14/180), npcInfo, npcInfoFork, this, null, false, 0, 0, null, false, true, 0, 5, 0);
    npc1.characterSprite.body.allowGravity = false;
    this.physics.add.collider(player1.characterSprite, npc1.characterSprite, function(){player1.positionInteractMenu(npc1)});

    npcInfo = ['would you like to puruse my wares?', 'options-2', 'yes', 'no'];
    npcInfoFork = ['create-shop', 'alright fuck you too then'];
    npc2 = new NPC(this.physics.add.image(400,100, 'shopkeeper').setImmovable(true), 180 * (3.14/180), npcInfo, npcInfoFork, this, 'shop1' , false, 0, 0, null, false, false, 0, 0, 0);
    npc2.characterSprite.body.allowGravity = false;
    this.physics.add.collider(player1.characterSprite, npc2.characterSprite, function(){player1.positionInteractMenu(npc2)});


    //Enemy
    npcInfo = [''];
    npcInfoFork = [''];
    npc3 = new NPC(this.physics.add.image(600,100, 'enemy1').setImmovable(true), 180 * (3.14/180), npcInfo, npcInfoFork, this, null, true, 50, 50, players, true, false, 0, 0,50);
    npc3.characterSprite.body.allowGravity = false;
    this.physics.add.collider(player1.characterSprite, npc3.characterSprite, function(){player1.positionInteractMenu(npc3)});
    let playerColliders = [ player1.characterSprite ];
    npc3.enemies = playerColliders;

    npcs = [npc1.characterSprite, npc2.characterSprite];
    let enemies = [npc3.characterSprite];
    player1.npcs = npcs;
    player1.enemies = enemies;

    //Set camera boundaries
    this.cameras.main.setBounds(0, 0, 2000, 2000);
    //Set camera to follow the first player
    this.cameras.main.startFollow(player1.characterSprite);

    player1.CheckInput();

    //enable cursor input
    cursors = this.input.keyboard.createCursorKeys();

}


function update() {

    player1.Update(cursors);
    npc1.Update();
    npc2.Update();
    npc3.Update();
}

function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
}