var Melee = Melee || {};

Melee.setupSceneCameraAndRenderer();

Melee.render = function()
{
    requestAnimationFrame(Melee.render);

    Melee.renderer.render(Melee.scene, Melee.camera);
}

Melee.render();

