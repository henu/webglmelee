var Melee = Melee || {};

Melee.keyboard = [];

window.onkeyup = function(e)
{
    Melee.keyboard[e.keyCode] = false;
}

window.onkeydown = function(e)
{
    Melee.keyboard[e.keyCode] = true;

    // Steal keyboard events, except F5 and F11
    return e.keyCode == 116 || e.keyCode == 122;
}
