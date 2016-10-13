var Melee = Melee || {};

Melee.loadAssets = function()
{
    var sprites1_tex = new THREE.TextureLoader().load('tex/sprites1.png');
    sprites1_tex.wrapS = THREE.RepeatWrapping;
    sprites1_tex.wrapT = THREE.RepeatWrapping;

    var sprites1_mat = new THREE.MeshBasicMaterial({map: sprites1_tex, transparent: true});

    Melee.assets = {};

    var small_ship = new Melee.GameObjectModel();
    small_ship.addSprite(sprites1_mat, 0, 0, 48, 60, 24, 40)
    small_ship.mass = 60;
    small_ship.addShapeCircle(0, 4, 24);
    small_ship.rot_speed = 180 / 180 * Math.PI;
    small_ship.thrust = 4000;
    small_ship.max_velocity_by_thrust = 1100;
    small_ship.engine_y = -20;
    small_ship.hp = 12;
    small_ship.batt = 16;
    small_ship.batt_recharge = 0.5;
    small_ship.weapon1 = {
        cooldown: 1/10,
        batt_usage: 1,
        shoot: function(obj, space) {
            var s = Math.sin(obj.angle);
            var c = Math.cos(obj.angle);
            var pos_x = obj.pos.x - s * 50;
            var pos_y = obj.pos.y + c * 50;
            var projectile = new Melee.GameObject(Melee.assets['Bullet'], Melee.scene, pos_x, pos_y, 0);
            var SPEED = 1600;
            projectile.setVelocity(obj.vel.x - s * SPEED, obj.vel.y + c * SPEED);
            space.addGameObject(projectile);
        }
    };
    Melee.assets['Small ship'] = small_ship;

    var neptune = new Melee.GameObjectModel();
    neptune.addSprite(sprites1_mat, 512, 0, 512, 512, 256, 256)
    neptune.mass = 10000;
    neptune.planet = true;
    neptune.addShapeCircle(0, 0, 256);
    Melee.assets['Neptune'] = neptune;

    var fire_dot = new Melee.GameObjectModel();
    fire_dot.addSprite(sprites1_mat, 56, 0, 8, 8, 4, 4);
    fire_dot.sprite_colored = true;
    fire_dot.life_time = 1;
    fire_dot.postRun = function(obj, delta, space)
    {
        obj.age += delta;
        if (obj.age < 0.5) {
            var red = 1;
            var green = 1;
            var blue = Math.max(0, Math.min(1, 1 - obj.age * 2))
        } else if (obj.age < 1) {
            var red = 1;
            var green = Math.max(0, Math.min(1, 1 - (obj.age - 0.5) * 2))
            var blue = 0;
        }
        obj.sprite_color = new THREE.Color(red, green, blue);
    }
    Melee.assets['Fire dot'] = fire_dot;

    var bullet = new Melee.GameObjectModel();
    bullet.addSprite(sprites1_mat, 56, 16, 8, 32, 4, 4)
    bullet.mass = 20;
    bullet.addShapeCircle(0, 0, 8);
    bullet.rotate_by_velocity = true;
    bullet.life_time = 1;
    bullet.dont_bounce = true;
    bullet.onCollision = function(obj1, obj2, space)
    {
        if (obj2.model.hp) {
            -- obj2.hp;
        }
        obj1.alive = false;
    }
    Melee.assets['Bullet'] = bullet;

}
