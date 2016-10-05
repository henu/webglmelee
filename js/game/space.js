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

Melee.Space.prototype.prepareForRendering = function()
{
    for (var obj_i = 0; obj_i < this.objs.length; ++ obj_i) {
        var obj = this.objs[obj_i];
        obj.prepareForRendering();
    }
}
