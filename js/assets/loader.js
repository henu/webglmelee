var Melee = Melee || {};

Melee.loadAssets = function()
{
    var sprites1_tex = new THREE.TextureLoader().load('tex/sprites1.png');
    sprites1_tex.wrapS = THREE.RepeatWrapping;
    sprites1_tex.wrapT = THREE.RepeatWrapping;

    var sprites1_mat = new THREE.MeshBasicMaterial({map: sprites1_tex, transparent: true});

    Melee.assets = {};

    var simple_ship = new Melee.GameObjectModel();
    simple_ship.setSprite(sprites1_mat, 0, 0, 128, 128, 64, 64)
    simple_ship.mass = 100;
    Melee.assets['Simple ship'] = simple_ship;

    var neptune = new Melee.GameObjectModel();
    neptune.setSprite(sprites1_mat, 512, 0, 512, 512, 256, 256)
    neptune.mass = 10000;
    neptune.planet = true;
    Melee.assets['Neptune'] = neptune;

}
