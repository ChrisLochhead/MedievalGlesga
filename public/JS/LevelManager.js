class LevelManager{
    constructor(){
        //this.collisionLayer;
    }

    ChangeMap(mapfile, mapname, players){
        if(this.map != null){
            this.map.removeAllLayers();
            this.map.destroy();
        }
        this.map = mapfile;
        
        this.InitialiseFiles();
        
        // Generic map tile layers
        this.layer = this.map.createDynamicLayer('Base', this.tilesets, 0, 0).setScale(2);
        this.collisionLayer = this.map.createDynamicLayer('Collider', this.tilesets, 0, 0).setScale(2);
        
        // Map specific tile layers
        switch(mapname){
            case("gandomanor"):{
                this.manor_outdoor = this.map.createDynamicLayer('Door', this.tilesets, 0, 0).setScale(2);
                this.colliderDecolayer1 = this.map.createDynamicLayer('ColliderDeco', this.tilesets, 0, 0).setScale(2);
                this.colliderDecolayer2 = this.map.createDynamicLayer('ColliderDeco2', this.tilesets, 0, 0).setScale(2);
                break;
            }
            case('mainmap'):{
                this.colliderDecolayer = this.map.createDynamicLayer('ColliderDeco', this.tilesets, 0, 0).setScale(2);

                this.manor_indoor = this.map.createDynamicLayer('Manor_Door', this.tilesets, 0, 0).setScale(2);
                this.blacksmith_indoor = this.map.createDynamicLayer('Blacksmith_Door', this.tilesets, 0, 0).setScale(2);
                this.barn_indoor = this.map.createDynamicLayer('Barn_Door', this.tilesets, 0, 0).setScale(2);
                this.tower_indoor = this.map.createDynamicLayer('Tower_Door', this.tilesets, 0, 0).setScale(2);
                this.merchant_indoor = this.map.createDynamicLayer('Merchant_Door', this.tilesets, 0, 0).setScale(2);
                this.cave_indoor = this.map.createDynamicLayer('Cave_Door', this.tilesets, 0, 0).setScale(2);
                break;
            }
            case('cave'):{
                this.colliderDecolayer1 = this.map.createDynamicLayer('ColliderDeco', this.tilesets, 0, 0).setScale(2);
                this.cave_outdoor = this.map.createDynamicLayer('Door', this.tilesets, 0, 0).setScale(2);
                break;
            }
            case('blacksmith'):{
                this.blacksmith_outdoor = this.map.createDynamicLayer('Doorway', this.tilesets, 0, 0).setScale(2);
                this.colliderDecolayer1 = this.map.createDynamicLayer('ColliderDeco', this.tilesets, 0, 0).setScale(2);
                this.colliderDecolayer2 = this.map.createDynamicLayer('ColliderDeco2', this.tilesets, 0, 0).setScale(2);
                this.colliderDecolayer3 = this.map.createDynamicLayer('ColliderDeco3', this.tilesets, 0, 0).setScale(2);
                this.colliderDecolayer4 = this.map.createDynamicLayer('ColliderDeco4', this.tilesets, 0, 0).setScale(2);
                break;
            }
            case('generalgoods'):{
                this.colliderDecolayer1 = this.map.createDynamicLayer('ColliderDeco', this.tilesets, 0, 0).setScale(2);
                this.merchant_outdoor = this.map.createDynamicLayer('Doorway', this.tilesets, 0, 0).setScale(2);
                this.colliderDecolayer2 = this.map.createDynamicLayer('ColliderDeco2', this.tilesets, 0, 0).setScale(2);
                this.colliderDecolayer3 = this.map.createDynamicLayer('ColliderDeco3', this.tilesets, 0, 0).setScale(2);
                break;
            }
            case('tower'):{
                this.colliderDecolayer1 = this.map.createDynamicLayer('ColliderDeco', this.tilesets, 0, 0).setScale(2);
                this.tower_outdoor = this.map.createDynamicLayer('Door', this.tilesets, 0, 0).setScale(2);
                this.colliderDecolayer2 = this.map.createDynamicLayer('ColliderDeco2', this.tilesets, 0, 0).setScale(2);
                break;
            }
        }
    }


    InitialiseFiles(){
        var tiles1 = this.map.addTilesetImage('nature2', 'nature2', 16, 16);
        var tiles2 = this.map.addTilesetImage('walls1_trans', 'walls1_trans', 16, 16);
        var tiles3 = this.map.addTilesetImage('walls2', 'walls2', 16, 16);
        var tiles4 = this.map.addTilesetImage('interior4', 'interior4', 16, 16);
        var tiles5 = this.map.addTilesetImage('ships2', 'ships2', 16, 16);
        var tiles6 = this.map.addTilesetImage('forage2', 'forage2', 16, 16);
        var tiles7 = this.map.addTilesetImage('nature1', 'nature1', 16, 16);
        var tiles8 = this.map.addTilesetImage('roofs1', 'roofs1', 16, 16);
        var tiles9 = this.map.addTilesetImage('statues1', 'statues1', 16, 16);
        var tiles10 = this.map.addTilesetImage('interior5', 'interior5', 16, 16);
        var tiles11 = this.map.addTilesetImage('floor1', 'floor1',16, 16);
        var tiles12 = this.map.addTilesetImage('interior2', 'interior2', 16, 16);
        var tiles13 = this.map.addTilesetImage('walls1', 'walls1', 16, 16);
        var tiles14 = this.map.addTilesetImage('walls3', 'walls3', 16, 16);
        var tiles15 = this.map.addTilesetImage('interior1', 'interior1', 16, 16);

        this.tilesets = [tiles1, tiles2, tiles3, tiles4, tiles5, tiles6, 
                        tiles7, tiles8, tiles9, tiles10, tiles11, tiles12,
                        tiles13, tiles14, tiles15];
    }
}