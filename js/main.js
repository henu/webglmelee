var Melee = Melee || {};

Melee.setupSceneCameraAndRenderer();

Melee.loadAssets();

var space = new Melee.Space(2000, 2000);

Melee.render = function()
{
    requestAnimationFrame(Melee.render);

    space.prepareForRendering();

    Melee.renderer.render(Melee.scene, Melee.camera);
}

Melee.render();

