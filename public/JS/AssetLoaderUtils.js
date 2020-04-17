function LoadFloor(gameScene)
{
    // Tilesets for the maps
    gameScene.load.image('walls1_trans', 'img/maps/tilesets/walls1_trans.png');
    gameScene.load.image('walls1', 'img/maps/tilesets/walls1.png');
    gameScene.load.image('walls2', 'img/maps/tilesets/walls2.png');
    gameScene.load.image('walls3', 'img/maps/tilesets/walls3.png');
    gameScene.load.image('floor1', 'img/maps/tilesets/floor1.png');
    gameScene.load.image('roofs1', 'img/maps/tilesets/roofs1.png');
    gameScene.load.image('interior1', 'img/maps/tilesets/interior1.png');
    gameScene.load.image('interior2', 'img/maps/tilesets/interior2.png');
    gameScene.load.image('interior4', 'img/maps/tilesets/interior4.png');
    gameScene.load.image('interior5', 'img/maps/tilesets/interior5.png');
    gameScene.load.image('ships2', 'img/maps/tilesets/ships2.png');
    gameScene.load.image('nature1', 'img/maps/tilesets/nature1.png');
    gameScene.load.image('nature2', 'img/maps/tilesets/nature2.png');
    gameScene.load.image('forage2', 'img/maps/tilesets/forage2.png');
    gameScene.load.image('statues1', 'img/maps/tilesets/statues1.png');
    

    // Maps
    gameScene.load.tilemapTiledJSON('mainmap', 'img/maps/mainmap.json');
    gameScene.load.tilemapTiledJSON('blacksmith', 'img/maps/blacksmith.json');
    gameScene.load.tilemapTiledJSON('generalgoods', 'img/maps/generalgoods.json');
    gameScene.load.tilemapTiledJSON('gandomanor', 'img/maps/gandomanor.json');
    gameScene.load.tilemapTiledJSON('cave', 'img/maps/cave.json');
    gameScene.load.tilemapTiledJSON('tower', 'img/maps/tower.json');
}
function LoadGameAssets(gameScene)
{
    //Load sprites for inventory items

    //Load Game Asset sprite sheet


    //Load equip-able items
    gameScene.load.image('default-helmet', "img/assets/helmet1.png");
    gameScene.load.image('second-helmet', "img/assets/helmet2.png");
    gameScene.load.image('default-chestplate', "img/assets/chest1.png");
    gameScene.load.image('default-legs', "img/assets/boots1.png");
    gameScene.load.image('default-weapon', "img/assets/sword1.png");
    gameScene.load.image('default-offhand', "img/assets/shield1.png");

    //load consumable items
    gameScene.load.image('health-potion', "img/assets/healthpotion.png");
    gameScene.load.image('mana-potion', "img/assets/manapotion.png");

    //Load body items
    gameScene.load.image('default-weapon-body', "img/Sword-Body.png");
    gameScene.load.image('default-chestplate-body', "img/Default-Chestplate-Body.png");
    gameScene.load.image('default-offhand-body', "img/Shield-Body.png");
    gameScene.load.image('default-helmet-body', "img/Default-Helmet-Body.png");
    gameScene.load.image('second-helmet-body', "img/Default-Helmet-Body.png");

    //load NPCs
    gameScene.load.image('npc', "img/NPC.png");
    gameScene.load.image('npc2', "img/NPC2.png");
    gameScene.load.image('npc3', "img/NPC3.png");
    gameScene.load.image('shopkeeper', "img/ShopKeeper.png");
    gameScene.load.image('enemy1', "img/Enemy1.png");
    gameScene.load.image('nicklaw', "img/Nicklaws.png");

    //Load shop info
    gameScene.load.image('shopbackground', "img/panel-shop.png");
    gameScene.load.text('shop1', "txt/Shop1.txt");
    gameScene.load.text('shop2', "txt/Shop2.txt");

    //Load
    gameScene.load.image('fireball', "Img/FireBall.png");
}
function LoadPlayerAssets(gameScene)
{
    //load inventory, gear and quests UI
    gameScene.load.image('inventory', "img/panel-inventory.png");
    gameScene.load.image('gear', "img/panel-equipment.png");
    gameScene.load.image('quests', "img/panel-quest.png");

    gameScene.load.image('inventorytoggle', "img/desBtn-inventory.png");
    gameScene.load.image('geartoggle', "img/desBtn-equipment.png");
    gameScene.load.image('gearbutton', "img/GearButton.png");
    gameScene.load.image('questtoggle', "img/desBtn-quests.png");

    gameScene.load.image('player1Select', "img/desBtn_player1Select.png");
    gameScene.load.image('player2Select', "img/desBtn_player2Select.png");
    gameScene.load.image('player1Deselect', "img/desBtn_player1Deselect.png");
    gameScene.load.image('player2Deselect', "img/desBtn_player2Deselect.png");

    //load chatbox and notifications
    gameScene.load.image('chatbox', "img/chatBox-Open.png");
    gameScene.load.image('chatboxclosebutton', "img/chatBox-MinButton.png");
    gameScene.load.image('chatboxclosed', "img/chatBox-Closed.png");

    //For notifications and quest dialogues
    gameScene.load.image('notificationbox', "img/NotificationBox.png");

    //load stat bars
    gameScene.load.image('status-bars', "img/HealthMana-Bars.png");
    gameScene.load.image('health-bar', "img/Health-Bar.png");
    gameScene.load.image('mana-bar', "img/Mana-Bar.png");

    //load our hero
    gameScene.load.image('gareth', 'img/Gareth.png');
    gameScene.load.image('dave', 'img/David.png');
    gameScene.load.image('gando', 'img/Gando.png');
}
