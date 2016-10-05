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

// Important objects are those, that should be kept at the center of the
// space and as close to each others as possible. They are moved closer
// to each others by translating the whole space, so the objects wrap
// from other ends. The maximum number of important objects is two.
Melee.Space.prototype.run = function(delta, important_objs)
{
    for (var obj_i = 0; obj_i < this.objs.length; ++ obj_i) {
        var obj = this.objs[obj_i];
        obj.run(delta);

        if (obj.x < 0) obj.x += this.size.x;
        if (obj.x > this.size.x) obj.x -= this.size.x;
        if (obj.y < 0) obj.y += this.size.y;
        if (obj.y > this.size.y) obj.y -= this.size.y;
    }

    this.moveImportantObjectsCenter(important_objs);
}

Melee.Space.prototype.prepareForRendering = function()
{
    for (var obj_i = 0; obj_i < this.objs.length; ++ obj_i) {
        var obj = this.objs[obj_i];
        obj.prepareForRendering();
    }
}

Melee.Space.prototype.moveImportantObjectsCenter = function(important_objs)
{
    if (important_objs.length == 0) {
        return;
    }

    var transl_x = 0;
    var transl_y = 0;

    // First check if wrapping is needed
    if (important_objs.length > 1) {
        var iobj1 = important_objs[0];
        var iobj2 = important_objs[1];
        var diff_x = Math.abs(iobj1.pos.x - iobj2.pos.x);
        var diff_y = Math.abs(iobj1.pos.y - iobj2.pos.y);
        if (diff_x > this.size.x / 2) {
            transl_x = this.size.x / 2;
        }
        if (diff_y > this.size.y / 2) {
            transl_y = this.size.y / 2;
        }
    }

    // Calculate average position of important objects
    var avg_x = 0;
    var avg_y = 0;
    for (var iobj_i = 0; iobj_i < important_objs.length; ++ iobj_i) {
        var iobj = important_objs[iobj_i];
        avg_x += (iobj.pos.x + transl_x) % this.size.x;
        avg_y += (iobj.pos.y + transl_y) % this.size.y;
    }
    avg_x /= important_objs.length;
    avg_y /= important_objs.length;
    transl_x += this.size.x * 1.5 - avg_x;
    transl_y += this.size.y * 1.5 - avg_y;
    transl_x = (transl_x + this.size.x / 2) % this.size.x - this.size.x / 2;
    transl_y = (transl_y + this.size.y / 2) % this.size.y - this.size.y / 2;

    // Do translation only if it is big enough
    if (Math.abs(transl_x) > 250 || Math.abs(transl_y) > 250) {
        for (var obj_i = 0; obj_i < this.objs.length; ++ obj_i) {
            var obj = this.objs[obj_i];
            obj.pos.x = (this.size.x + obj.pos.x + transl_x) % this.size.x;
            obj.pos.y = (this.size.y + obj.pos.y + transl_y) % this.size.y;
        }
    }
}
