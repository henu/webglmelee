var Melee = Melee || {};

Melee.GameObject = function(model, scene, x, y, angle)
{
    this.model = model;
    this.scene = scene;

    this.pos = new THREE.Vector2(x, y);
    this.angle = angle;
    this.vel = new THREE.Vector2(0, 0);

    this.mesh = null;
}

Melee.GameObject.prototype.dispose = function()
{
    if (this.mesh) {
        this.scene.remove(this.mesh);
    }
}

Melee.GameObject.prototype.setVelocity = function(x, y)
{
    this.vel.set(x, y);
}

Melee.GameObject.prototype.run = function(delta, space)
{
    if (this.model.planet) {
        return;
    }

    this.pos.x += this.vel.x * delta;
    this.pos.y += this.vel.y * delta;

    for (var planet_i = 0; planet_i < space.planets.length; ++ planet_i) {
        var planet = space.planets[planet_i];

        var diff = space.getDiff(this.pos, planet.pos);
        var diff_len_to_2 = diff.lengthSq();
        diff.normalize();

        var force = 50 * (this.model.mass * planet.model.mass) / diff_len_to_2;

        this.vel.x += diff.x * force * delta;
        this.vel.y += diff.y * force * delta;

    }
}

Melee.GameObject.prototype.prepareForRendering = function()
{
    if (this.mesh == null) {
        this.mesh = this.model.createSpriteMesh();
        if (!this.mesh) return;
        this.scene.add(this.mesh);
    }

    // First make the origin center of sprite
    var origin = this.model.sprite_origin;
    var width = this.model.sprite_size.x;
    var height = this.model.sprite_size.y;
    this.mesh.matrix.makeTranslation(width / 2 - origin.x, -height / 2 + origin.y, 0);

    // Rotate
    var matrix_rotate = new THREE.Matrix4();
    matrix_rotate.makeRotationZ(this.angle);
    this.mesh.matrix.premultiply(matrix_rotate);

    // Move to correct position
    var matrix_translate = new THREE.Matrix4();
    matrix_translate.makeTranslation(this.pos.x, this.pos.y, 0);
    this.mesh.matrix.premultiply(matrix_translate);
}
