var Melee = Melee || {};

// Result is measured in multiples of normal
Melee.vectorDepthInsidePlane = function(v_x, v_y, normal_x, normal_y)
{
    var dp_n_n = normal_x*normal_x + normal_y*normal_y;
    var dp_n_v = v_x*normal_x + v_y*normal_y;
    return -dp_n_v / dp_n_n;
}
