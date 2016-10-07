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
    simple_ship.addShapeCircle(0, 0, 47);
    simple_ship.rot_speed = 180 / 180 * Math.PI;
    simple_ship.thrust = 4000;
    simple_ship.max_velocity_by_thrust = 1300;
    Melee.assets['Simple ship'] = simple_ship;

    var neptune = new Melee.GameObjectModel();
    neptune.setSprite(sprites1_mat, 512, 0, 512, 512, 256, 256)
    neptune.mass = 10000;
    neptune.planet = true;
    neptune.addShapeCircle(0, 0, 256);
    Melee.assets['Neptune'] = neptune;

    var fire_dot = new Melee.GameObjectModel();
    fire_dot.setSprite(sprites1_mat, 136, 0, 8, 8, 4, 4, true);
    fire_dot.postRun = function(obj, delta, space)
    {
        if (!obj.age) obj.age = 0;
        obj.age += delta;
        if (obj.age < 0.5) {
            var red = 1;
            var green = 1;
            var blue = Math.max(0, Math.min(1, 1 - obj.age * 2))
        } else if (obj.age < 1) {
            var red = 1;
            var green = Math.max(0, Math.min(1, 1 - (obj.age - 0.5) * 2))
            var blue = 0;
        } else {
            return false;
        }
        obj.mesh.material.color = new THREE.Color(red, green, blue);
        return true;
    }
    Melee.assets['Fire dot'] = fire_dot;
}
