var Melee = Melee || {};

Melee.GameObjectModel = function()
{
    this.mass = 0;
    this.planet = false;
    this.shapes = [];
    this.shapes_bounding_radius = -1;
}

Melee.GameObjectModel.SHAPE_CIRCLE = 0;

Melee.GameObjectModel.prototype.setSprite = function(mat, x, y, width, height, origin_x, origin_y)
{
    this.sprite_mat = mat;
    this.sprite_pos = new THREE.Vector2(x, y);
    this.sprite_size = new THREE.Vector2(width, height);
    this.sprite_origin = new THREE.Vector2(origin_x, origin_y);

    this.geom = null;
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

Melee.GameObjectModel.prototype.createSpriteMesh = function()
{
    if (!this.geom) {
        var mat_tex = this.sprite_mat.map;
        var mat_img = mat_tex.image;
        if (!mat_img) {
            return null;
        }

        var mat_img_w = mat_img.width;
        var mat_img_h = mat_img.height;

        var uv_left = this.sprite_pos.x / mat_img_w;
        var uv_top = this.sprite_pos.y / mat_img_h;
        var uv_right = (this.sprite_pos.x + this.sprite_size.x) / mat_img_w;
        var uv_bottom = (this.sprite_pos.y + this.sprite_size.y) / mat_img_h;

        // Y flip
        uv_top = 1 - uv_top;
        uv_bottom = 1 - uv_bottom;

        this.sprite_geom = new THREE.Geometry();
        this.sprite_geom.vertices.push(
            new THREE.Vector3(-this.sprite_size.x/2, -this.sprite_size.y/2, 0),
            new THREE.Vector3(this.sprite_size.x/2, -this.sprite_size.y/2, 0),
            new THREE.Vector3(this.sprite_size.x/2, this.sprite_size.y/2, 0),
            new THREE.Vector3(-this.sprite_size.x/2, this.sprite_size.y/2, 0)
        );
        var uvs = [
            new THREE.Vector2(uv_left, uv_bottom),
            new THREE.Vector2(uv_right, uv_bottom),
            new THREE.Vector2(uv_right, uv_top),
            new THREE.Vector2(uv_left, uv_top)
        ];
        this.sprite_geom.faceVertexUvs[0] = [];
        this.sprite_geom.faceVertexUvs[0].push(
            [uvs[0], uvs[1], uvs[2]],
            [uvs[0], uvs[2], uvs[3]]
        );
        this.sprite_geom.faces.push(
            new THREE.Face3(0, 1, 2),
            new THREE.Face3(0, 2, 3)
        );
    }

    var mesh = new THREE.Mesh(this.sprite_geom, this.sprite_mat);
    mesh.matrixAutoUpdate = false;

    return mesh;
}
