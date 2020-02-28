function LoadGameAssets(gameScene)
{
    //load sprites for inventory items
    //Load equip-able items
    gameScene.load.image('default-helmet', "img/Hat-Inventory.png");
    gameScene.load.image('second-helmet', "img/Hat-Inventory-Alternate.png");
    gameScene.load.image('default-chestplate', "img/Shirt-Inventory.png");
    gameScene.load.image('default-legs', "img/Legs-Inventory.png");
    gameScene.load.image('default-weapon', "img/Sword-Inventory.png");
    gameScene.load.image('default-offhand', "img/Shield-Inventory.png");

    //load consumable items
    gameScene.load.image('health-potion', "img/HealthPotion.png");
    gameScene.load.image('mana-potion', "img/ManaPotion.png");

    //Load body items
    gameScene.load.image('default-weapon-body', "img/Sword-Body.png");
    gameScene.load.image('default-chestplate-body', "img/Default-Chestplate-Body.png");
    gameScene.load.image('default-offhand-body', "img/Shield-Body.png");
    gameScene.load.image('default-helmet-body', "img/Default-Helmet-Body.png");

    //load NPCs
    gameScene.load.image('npc', "img/NPC.png")
    gameScene.load.image('shopkeeper', "img/ShopKeeper.png");
    gameScene.load.image('enemy1', "img/Enemy1.png")

    //Load shop info
    gameScene.load.image('shopbackground', "img/ShopBox.png");
    gameScene.load.text('shop1', "txt/Shop1.txt");

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
    gameScene.load.image('questtoggle', "img/desBtn-quests.png");

    //load chatbox and notifications
    gameScene.load.image('chatbox', "img/ChatBox.png");
    gameScene.load.image('chatboxclosebutton', "img/ChatBox-CloseButton.png");
    gameScene.load.image('chatboxclosed', "img/ChatBox-Closed.png");

    //For notifications and quest dialogues
    gameScene.load.image('notificationbox', "img/NotificationBox.png");

    //load stat bars
    gameScene.load.image('health', "img/health.png");
    gameScene.load.image('health-negative', "img/health-negative.png");
    gameScene.load.image('mana', "img/mana.png");
    gameScene.load.image('mana-negative', "img/mana-negative.png");

    //load our hero
    gameScene.load.image('gareth', 'img/Gareth.png');
}
function LoadFloor(gameScene)
{
    gameScene.load.image('grass1', 'img/GrassTile01.png');
    gameScene.load.image('grass2', 'img/GrassTile02.png');
    gameScene.load.image('grass3', 'img/GrassTile03.png');
    gameScene.load.image('grass4', 'img/GrassTile04.png');
}