var Melee = Melee || {};

Melee.Space = function(width, height)
{
    this.size = new THREE.Vector2(width, height);

    this.objs = [];
    this.planets = [];
}

Melee.Space.prototype.addGameObject = function(obj)
{
    this.objs.push(obj);
    if (obj.model.planet) {
        this.planets.push(obj);
    }
}

// Important objects are those, that should be kept at the center of the
// space and as close to each others as possible. They are moved closer
// to each others by translating the whole space, so the objects wrap
// from other ends. The maximum number of important objects is two.
Melee.Space.prototype.run = function(delta, important_objs, background)
{
    for (var obj_i = 0; obj_i < this.objs.length;) {
        var obj = this.objs[obj_i];
        obj.run(delta, this);

        if (!obj.alive || (obj.model.hp && obj.hp <= 0)) {
            obj.dispose();
            this.objs.splice(obj_i, 1);
            this.removeFromImportantObjects(obj, important_objs);
            continue;
        }

        if (obj.pos.x < 0) obj.pos.x += this.size.x;
        if (obj.pos.x > this.size.x) obj.pos.x -= this.size.x;
        if (obj.pos.y < 0) obj.pos.y += this.size.y;
        if (obj.pos.y > this.size.y) obj.pos.y -= this.size.y;

        ++ obj_i;
    }

    // Handle collisions between all objects
    colls = {};
    for (var obj1_i = 0; obj1_i < this.objs.length; ++ obj1_i) {
        var obj1 = this.objs[obj1_i];
        if (obj1.alive && obj1.hasShape()) {
            for (var obj2_i = obj1_i + 1; obj2_i < this.objs.length && obj1.alive; ++ obj2_i) {
                var obj2 = this.objs[obj2_i];
                if (obj2.alive && obj2.hasShape()) {
                    if (obj1.addCollisionsWith(obj2, obj1_i, obj2_i, colls)) {
                        // Call collision callbacks
                        if (obj1.model.onCollision) {
                            obj1.model.onCollision(obj1, obj2, this);
                        }
                        if (obj2.model.onCollision) {
                            obj2.model.onCollision(obj2, obj1, this);
                        }
                    }
                }
            }
        }
    }

    // Resolve collisions and clean died objects
    for (var obj_i = 0; obj_i < this.objs.length;) {
        var obj = this.objs[obj_i];

        if (!obj.alive || (obj.model.hp && obj.hp <= 0)) {
            obj.dispose();
            this.objs.splice(obj_i, 1);
            this.removeFromImportantObjects(obj, important_objs);
            continue;
        }

        obj.resolveCollisions();

        ++ obj_i;
    }

    this.moveImportantObjectsCenter(important_objs, background);
}

Melee.Space.prototype.prepareForRendering = function(delta)
{
    for (var obj_i = 0; obj_i < this.objs.length; ++ obj_i) {
        var obj = this.objs[obj_i];
        obj.prepareForRendering(delta);
    }
}

Melee.Space.prototype.moveImportantObjectsCenter = function(important_objs, background)
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
        background.panorate(transl_x, transl_y);
    }
}

Melee.Space.prototype.getDiff = function(origin, to)
{
    var diff_x = to.x - origin.x;
    var diff_y = to.y - origin.y;
    if (diff_x > this.size.x / 2) diff_x -= this.size.x;
    if (diff_x < -this.size.x / 2) diff_x += this.size.x;
    if (diff_y > this.size.y / 2) diff_y -= this.size.y;
    if (diff_y < -this.size.y / 2) diff_y += this.size.y;

    Melee.Space.getDiffResult.set(diff_x, diff_y);
    return Melee.Space.getDiffResult;
}
Melee.Space.getDiffResult = new THREE.Vector2();

Melee.Space.prototype.removeFromImportantObjects = function(obj, important_objs)
{
    var obj_i = important_objs.indexOf(obj);
    if (obj_i > -1) {
        important_objs.splice(obj_i, 1);
    }
}
