var Melee = Melee || {};

Melee.GUI = function(ship1, ship2)
{
    this.ship1 = ship1;
    this.ship2 = ship2;

    this.scene = new THREE.Scene();

    this.ship1_hp_tex = new THREE.TextureLoader().load('tex/bars.png');
    this.ship1_hp_tex.magFilter = THREE.NearestFilter;
    this.ship1_hp_tex.wrapS = THREE.RepeatWrapping;
    this.ship1_hp_tex.wrapT = THREE.RepeatWrapping;
    this.ship1_batt_tex = new THREE.TextureLoader().load('tex/bars.png');
    this.ship1_batt_tex.magFilter = THREE.NearestFilter;
    this.ship1_batt_tex.wrapS = THREE.RepeatWrapping;
    this.ship1_batt_tex.wrapT = THREE.RepeatWrapping;
    this.ship2_hp_tex = new THREE.TextureLoader().load('tex/bars.png');
    this.ship2_hp_tex.magFilter = THREE.NearestFilter;
    this.ship2_hp_tex.wrapS = THREE.RepeatWrapping;
    this.ship2_hp_tex.wrapT = THREE.RepeatWrapping;
    this.ship2_batt_tex = new THREE.TextureLoader().load('tex/bars.png');
    this.ship2_batt_tex.magFilter = THREE.NearestFilter;
    this.ship2_batt_tex.wrapS = THREE.RepeatWrapping;
    this.ship2_batt_tex.wrapT = THREE.RepeatWrapping;

    this.ship1_hp_mesh = this.createBar('RIGHT', 'HP', ship1.model.hp, this.ship1_hp_tex);
    this.ship1_batt_mesh = this.createBar('RIGHT', 'BATTERY', ship1.model.batt, this.ship1_batt_tex);
    this.ship2_hp_mesh = this.createBar('LEFT', 'HP', ship2.model.hp, this.ship2_hp_tex);
    this.ship2_batt_mesh = this.createBar('LEFT', 'BATTERY', ship2.model.batt, this.ship2_batt_tex);

    this.updateCamera();

    var gui = this;
    window.addEventListener('resize', function() {
        gui.updateCamera();
    }, false);
}

Melee.GUI.prototype.updateCamera = function()
{
    this.camera = new THREE.OrthographicCamera(
        -window.innerWidth / 2,
        window.innerWidth / 2,
        window.innerHeight / 2,
        -window.innerHeight / 2, -1, 1
    );

    this.ship1_hp_mesh.position.set(window.innerWidth / 2, window.innerHeight / 2, 0);
    this.ship1_batt_mesh.position.set(window.innerWidth / 2, window.innerHeight / 2 - 16, 0);
    this.ship2_hp_mesh.position.set(-window.innerWidth / 2, window.innerHeight / 2, 0);
    this.ship2_batt_mesh.position.set(-window.innerWidth / 2, window.innerHeight / 2 - 16, 0);
}

Melee.GUI.prototype.render = function(renderer)
{
    renderer.render(this.scene, this.camera);

    this.updateBar('RIGHT', this.ship1_hp_tex, ship1.hp, ship1.model.hp);
    this.updateBar('RIGHT', this.ship1_batt_tex, ship1.batt, ship1.model.batt);
    this.updateBar('LEFT', this.ship2_hp_tex, ship2.hp, ship2.model.hp);
    this.updateBar('LEFT', this.ship2_batt_tex, ship2.batt, ship2.model.batt);
}

Melee.GUI.prototype.createBar = function(side, type, max_val, tex)
{
    var geom = new THREE.Geometry();
    if (side == 'LEFT') {
        geom.vertices.push(
            new THREE.Vector3(0, -16, 0),
            new THREE.Vector3(8 * max_val, -16, 0),
            new THREE.Vector3(8 * max_val, 0, 0),
            new THREE.Vector3(0, 0, 0)
        );
    } else {
        geom.vertices.push(
            new THREE.Vector3(-8 * max_val, -16, 0),
            new THREE.Vector3(0, -16, 0),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(-8 * max_val, 0, 0)
        );
    }
    if (type == 'HP') {
        var uv_up = 1;
        var uv_down = 0.5;
    } else {
        var uv_up = 0.5;
        var uv_down = 0;
    }
    var uv_width = max_val / 64;
    if (side == 'LEFT') {
        var uvs = [
            new THREE.Vector2(0.5 - uv_width, uv_down),
            new THREE.Vector2(0.5, uv_down),
            new THREE.Vector2(0.5, uv_up),
            new THREE.Vector2(0.5 - uv_width, uv_up)
        ];
    } else {
        var uvs = [
            new THREE.Vector2(0, uv_down),
            new THREE.Vector2(uv_width, uv_down),
            new THREE.Vector2(uv_width, uv_up),
            new THREE.Vector2(0, uv_up)
        ];
    }
    geom.faceVertexUvs[0] = [];
    geom.faceVertexUvs[0].push(
        [uvs[0], uvs[1], uvs[2]],
        [uvs[0], uvs[2], uvs[3]]
    );
    geom.faces.push(
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(0, 2, 3)
    );

    var mat = new THREE.MeshBasicMaterial({map: tex, transparent: true});
    var mesh = new THREE.Mesh(geom, mat);
    this.scene.add(mesh);

    return mesh;
}

Melee.GUI.prototype.updateBar = function(side, tex, val, max)
{
    var reduced = max - val;
    if (side == 'LEFT') {
        tex.offset.x = reduced / 64;
    } else {
        tex.offset.x = -reduced / 64;
    }
}