var Melee = Melee || {};

Melee.GameObject = function(model, scene, x, y, angle)
{
    this.model = model;
    this.scene = scene;

    this.pos = new THREE.Vector2(x, y);
    this.angle = angle;
    this.vel = new THREE.Vector2(0, 0);

    this.mesh = null;

    this.colls = [];
}

Melee.GameObject.prototype.dispose = function()
{
    if (this.mesh) {
        this.scene.remove(this.mesh);
    }
}

Melee.GameObject.prototype.hasShape = function()
{
    return this.model.shapes_bounding_radius > 0;
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

Melee.GameObject.prototype.addCollisionsWith = function(obj, this_i, obj_i)
{
    var EXTRA_MARGIN = 0;

    var tmp_pos1 = Melee.GameObject.tmp_v2_1;
    var tmp_pos2 = Melee.GameObject.tmp_v2_2;

    // First check if bounding spheres touch
    var diff_x = (obj.pos.x - this.pos.x);
    var diff_y = (obj.pos.y - this.pos.y);
    var dst_to_2 = diff_x*diff_x + diff_y*diff_y;
    var bs_r_total = EXTRA_MARGIN + this.model.shapes_bounding_radius + obj.model.shapes_bounding_radius;
    if (dst_to_2 > bs_r_total * bs_r_total) {
        return;
    }

    // Go all collision shapes through, and get collisions that are inside extra margin
    for (var shape1_i = 0; shape1_i < this.model.shapes.length; ++ shape1_i) {
        var shape1 = this.model.shapes[shape1_i];
        for (var shape2_i = 0; shape2_i < obj.model.shapes.length; ++ shape2_i) {
            var shape2 = obj.model.shapes[shape2_i];

            // Circle and circle
            if (shape1.type == Melee.GameObjectModel.SHAPE_CIRCLE && shape2.type == Melee.GameObjectModel.SHAPE_CIRCLE) {
                this.getRelativePositionInWorldSpace(tmp_pos1, shape1.pos);
                obj.getRelativePositionInWorldSpace(tmp_pos2, shape2.pos);

                var s_diff_x = tmp_pos2.x - tmp_pos1.x;
                var s_diff_y = tmp_pos2.y - tmp_pos1.y;
                var s_dst = Math.sqrt(s_diff_x*s_diff_x + s_diff_y*s_diff_y);
                if (s_dst < shape1.radius + shape2.radius + EXTRA_MARGIN) {
                    var total_depth = shape1.radius + shape2.radius - s_dst;
                    // Normalize collision vector
                    s_diff_x /= s_dst;
                    s_diff_y /= s_dst;

                    // Calculate collision velocities
                    if (this.model.planet) {
                        var vel2 = 2 * Melee.vectorDepthInsidePlane(obj.vel.x, obj.vel.y, s_diff_x, s_diff_y);
                    } else if (obj.model.planet) {
                        var vel1 = 2 * Melee.vectorDepthInsidePlane(this.vel.x, this.vel.y, -s_diff_x, -s_diff_y);
                    } else {
                        var mass_ratio = this.model.mass / obj.model.mass;
                        var total_vel_x = this.vel.x - obj.vel.x;
                        var total_vel_y = this.vel.y - obj.vel.y;
                        var vel = Melee.vectorDepthInsidePlane(total_vel_x, total_vel_y, -s_diff_x, -s_diff_y);
                        var vel1 = vel / mass_ratio;
                        var vel2 = vel * mass_ratio;
                    }

                    if (!this.model.planet) {
                        this.addCollision({
                            depth: total_depth,
                            normal_x: -s_diff_x,
                            normal_y: -s_diff_y,
                            velocity: vel1
                        });
                    }
                    if (!obj.model.planet) {
                        obj.addCollision({
                            depth: total_depth,
                            normal_x: s_diff_x,
                            normal_y: s_diff_y,
                            velocity: vel2
                        });
                    }
                }
            }
        }
    }
}

Melee.GameObject.prototype.addCollision = function(new_coll)
{
    this.colls.push(new_coll);
};

Melee.GameObject.prototype.resolveCollisions = function()
{
// TODO: Improve collision resolving!
    if (this.colls.length > 0) {
        for (var coll_i = 0; coll_i < this.colls.length; ++ coll_i) {
            var coll = this.colls[coll_i];
            if (coll.depth > 0) {
// TODO: This push object out from object it collides with, but it might also push it inside another object. Fix this!
                this.pos.x += coll.normal_x * coll.depth;
                this.pos.y += coll.normal_y * coll.depth;
                this.vel.x += coll.normal_x * coll.velocity;
                this.vel.y += coll.normal_y * coll.velocity;
            }
        }
        this.colls = [];
    }
}

Melee.GameObject.prototype.getRelativePositionInWorldSpace = function(result, pos)
{
    var s = Math.sin(this.angle);
    var c = Math.cos(this.angle);
    result.x = this.pos.x + c * pos.x - s * pos.y;
    result.y = this.pos.y + c * pos.y + s * pos.x;
}

Melee.GameObject.tmp_v2_1 = new THREE.Vector2();
Melee.GameObject.tmp_v2_2 = new THREE.Vector2();
