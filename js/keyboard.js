var Melee = Melee || {};

Melee.keyboard = [];

window.onkeyup = function(e)
{
    Melee.keyboard[e.keyCode] = false;
}

window.onkeydown = function(e)
{
    Melee.keyboard[e.keyCode] = true;
}
