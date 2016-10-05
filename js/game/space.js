var Melee = Melee || {};

Melee.Space = function(width, height)
{
    this.size = new THREE.Vector2(width, height);

    this.objs = [];
}

Melee.Space.prototype.addGameObject = function(obj)
{
    this.objs.push(obj);
}

Melee.Space.prototype.run = function(delta)
{
    for (var obj_i = 0; obj_i < this.objs.length; ++ obj_i) {
        var obj = this.objs[obj_i];
        obj.run(delta);

        if (obj.x < 0) obj.x += this.size.x;
        if (obj.x > this.size.x) obj.x -= this.size.x;
        if (obj.y < 0) obj.y += this.size.y;
        if (obj.y > this.size.y) obj.y -= this.size.y;
    }
}

Melee.Space.prototype.prepareForRendering = function()
{
    for (var obj_i = 0; obj_i < this.objs.length; ++ obj_i) {
        var obj = this.objs[obj_i];
        obj.prepareForRendering();
    }
}
