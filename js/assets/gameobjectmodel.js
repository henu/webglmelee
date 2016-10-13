var Melee = Melee || {};

Melee.GameObjectModel = function()
{
    this.mass = 0;
    this.planet = false;

    this.shapes = [];
    this.shapes_bounding_radius = -1;

    this.rot_speed = 0;
    this.thrust = 0;
    this.max_velocity_by_thrust = 1000;

    this.sprites = [];
    this.sprite_geoms = [];
}

Melee.GameObjectModel.SHAPE_CIRCLE = 0;

Melee.GameObjectModel.prototype.addSprite = function(mat, x, y, width, height, origin_x, origin_y, duration)
{
    var sprite = {
        mat: mat,
        pos: new THREE.Vector2(x, y),
        size: new THREE.Vector2(width, height),
        origin: new THREE.Vector2(origin_x, origin_y),
        duration: duration,
    }
    this.sprites.push(sprite);
}

Melee.GameObjectModel.prototype.addShapeCircle = function(x, y, radius)
{
    var new_shape = {
        type: Melee.GameObjectModel.SHAPE_CIRCLE,
        pos: new THREE.Vector2(x, y),
        radius: radius,
    }

    this.shapes.push(new_shape);

    this.shapes_bounding_radius = Math.max(this.shapes_bounding_radius, new_shape.pos.length() + radius);
}

Melee.GameObjectModel.prototype.createSpriteMeshes = function()
{
    if (this.sprite_geoms.length != this.sprites.length) {
        for (var sprite_i = this.sprite_geoms.length; sprite_i < this.sprites.length; ++ sprite_i) {
            var sprite = this.sprites[sprite_i];

            var mat_tex = sprite.mat.map;
            var mat_img = mat_tex.image;
            if (!mat_img) {
                return null;
            }

            var mat_img_w = mat_img.width;
            var mat_img_h = mat_img.height;

            var uv_left = sprite.pos.x / mat_img_w;
            var uv_top = sprite.pos.y / mat_img_h;
            var uv_right = (sprite.pos.x + sprite.size.x) / mat_img_w;
            var uv_bottom = (sprite.pos.y + sprite.size.y) / mat_img_h;

            // Y flip
            uv_top = 1 - uv_top;
            uv_bottom = 1 - uv_bottom;

            var geom = new THREE.Geometry();
            geom.vertices.push(
                new THREE.Vector3(-sprite.size.x/2, -sprite.size.y/2, 0),
                new THREE.Vector3(sprite.size.x/2, -sprite.size.y/2, 0),
                new THREE.Vector3(sprite.size.x/2, sprite.size.y/2, 0),
                new THREE.Vector3(-sprite.size.x/2, sprite.size.y/2, 0)
            );
            var uvs = [
                new THREE.Vector2(uv_left, uv_bottom),
                new THREE.Vector2(uv_right, uv_bottom),
                new THREE.Vector2(uv_right, uv_top),
                new THREE.Vector2(uv_left, uv_top)
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

            this.sprite_geoms.push(geom);
        }
    }

    var meshes = [];
    for (var sprite_i = 0; sprite_i < this.sprites.length; ++ sprite_i) {
        var mat = this.sprites[sprite_i].mat;
        var geom = this.sprite_geoms[sprite_i];
        if (this.sprite_colored) {
            var mesh = new THREE.Mesh(geom, mat.clone());
        } else {
            var mesh = new THREE.Mesh(geom, mat);
        }
        mesh.matrixAutoUpdate = false;
        meshes.push(mesh);
    }

    return meshes;
}
