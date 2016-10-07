var Melee = Melee || {};

Melee.showGameObjects = function(camera, objs, margin, background)
{
    if (objs.length == 0) {
        return;
    }

    // Get boundingbox where objects are
    var bb_min_x = objs[0].pos.x;
    var bb_max_x = objs[0].pos.x;
    var bb_min_y = objs[0].pos.y;
    var bb_max_y = objs[0].pos.y;
    for (var obj_i = 1; obj_i < objs.length; ++ obj_i) {
        var obj = objs[obj_i];
        bb_min_x = Math.min(bb_min_x, obj.pos.x);
        bb_max_x = Math.max(bb_max_x, obj.pos.x);
        bb_min_y = Math.min(bb_min_y, obj.pos.y);
        bb_max_y = Math.max(bb_max_y, obj.pos.y);
    }
    if (margin) {
        bb_min_x -= margin;
        bb_min_y -= margin;
        bb_max_x += margin;
        bb_max_y += margin;
    }
    var bb_width = bb_max_x - bb_min_x;
    var bb_height = bb_max_y - bb_min_y;

    // Pan to center of boundingbox
    var pan_x = (bb_min_x + bb_max_x) / 2 - camera.position.x;
    var pan_y = (bb_min_y + bb_max_y) / 2 - camera.position.y;
    camera.position.x += pan_x;
    camera.position.y += pan_y;
    background.panorate(-pan_x, -pan_y);

    // Calculate scaling that will show all the objects
    // Limit scaling, so it doesn't get too close
    var scaling_x = (bb_width / window.innerWidth);
    var scaling_y = (bb_height / window.innerHeight);
    var scaling = Math.max(1, scaling_x, scaling_y);
    background.setScaling(scaling);

    // Apply sclaing
    camera.left = -window.innerWidth / 2 * scaling;
    camera.right = window.innerWidth / 2 * scaling;
    camera.top = window.innerHeight / 2 * scaling;
    camera.bottom = -window.innerHeight / 2 * scaling;
    camera.updateProjectionMatrix();
}
