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
    player1 = new Player(this.physics.add.sprite(400, 300, 'gareth'), this.add.image(885, 20, 'health'), this.add.image(885, 20, 'health-negative'),
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
    npc1 = new NPC(this.physics.add.image(200,100, 'npc').setImmovable(true), 180 * (3.14/180), npcInfo, npcInfoFork, this, null, false, 0, 0, null, false, true, 0, 5);
    npc1.characterSprite.body.allowGravity = false;
    this.physics.add.collider(player1.characterSprite, npc1.characterSprite, function(){callfunc(npc1)});

    npcInfo = ['would you like to puruse my wares?', 'options-2', 'yes', 'no'];
    npcInfoFork = ['create-shop', 'alright fuck you too then'];
    npc2 = new NPC(this.physics.add.image(400,100, 'shopkeeper').setImmovable(true), 180 * (3.14/180), npcInfo, npcInfoFork, this, 'shop1' , false, 0, 0, null);
    npc2.characterSprite.body.allowGravity = false;
    this.physics.add.collider(player1.characterSprite, npc2.characterSprite, function(){callfunc(npc2)});


    //Enemy
    npcInfo = [''];
    npcInfoFork = [''];
    npc3 = new NPC(this.physics.add.image(600,100, 'enemy1').setImmovable(true), 180 * (3.14/180), npcInfo, npcInfoFork, this, null, true, 50, 50, players, true);
    npc3.characterSprite.body.allowGravity = false;
    this.physics.add.collider(player1.characterSprite, npc3.characterSprite, function(){callfunc(npc3)});
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
                    player1.ShowQuestDialogue(4);
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

function update() {

    player1.Update(cursors);
    npc1.Update();
    npc2.Update();
    npc3.Update();
}

function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
}