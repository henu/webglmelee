var Melee = Melee || {};

Melee.Background = function()
{
    this.pan_x = 0;
    this.pan_y = 0;
    this.scaling = 1;

    this.tex = new THREE.TextureLoader().load('tex/space.png');
    this.tex.wrapS = THREE.RepeatWrapping;
    this.tex.wrapT = THREE.RepeatWrapping;

    var mat = new THREE.MeshBasicMaterial({map: this.tex, transparent: true});

    var geom = new THREE.Geometry();
    geom.vertices.push(
        new THREE.Vector3(-1, -1, 0),
        new THREE.Vector3(1, -1, 0),
        new THREE.Vector3(1, 1, 0),
        new THREE.Vector3(-1, 1, 0)
    );
    var uvs = [
        new THREE.Vector2(-1, -1),
        new THREE.Vector2(1, -1),
        new THREE.Vector2(1, 1),
        new THREE.Vector2(-1, 1)
    ];
    geom.faceVertexUvs[0] = [];
    geom.faceVertexUvs[0].push(
        [uvs[0], uvs[1], uvs[2]],
        [uvs[0], uvs[2], uvs[3]]
    );
    geom.faces.push(
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(0, 2, 3)
    );

    this.mesh = new THREE.Mesh(geom, mat);

    this.scene = new THREE.Scene();

    this.scene.add(this.mesh);

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
}

Melee.Background.SCALING = 4000;

Melee.Background.prototype.render = function(renderer)
{
    var r_x = window.innerWidth / Melee.Background.SCALING * this.scaling;
    var r_y = window.innerHeight / Melee.Background.SCALING * this.scaling;
    this.tex.repeat.x = r_x;
    this.tex.repeat.y = r_y;

    this.tex.offset.x = -this.pan_x / Melee.Background.SCALING * 2;
    this.tex.offset.y = -this.pan_y / Melee.Background.SCALING * 2;

    renderer.render(this.scene, this.camera);
}

Melee.Background.prototype.panorate = function(x, y)
{
    this.pan_x += x;
    this.pan_y += y;

    var PANORATE_LIMIT = Melee.Background.SCALING / 2;

    if (this.pan_x < 0) this.pan_x += PANORATE_LIMIT;
    if (this.pan_x > PANORATE_LIMIT) this.pan_x -= PANORATE_LIMIT;
    if (this.pan_y < 0) this.pan_y += PANORATE_LIMIT;
    if (this.pan_y > PANORATE_LIMIT) this.pan_y -= PANORATE_LIMIT;
}

Melee.Background.prototype.setScaling = function(scaling)
{
    this.scaling = scaling;
}