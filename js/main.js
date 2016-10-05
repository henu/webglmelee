var Melee = Melee || {};

Melee.setupSceneCameraAndRenderer();

Melee.loadAssets();

var space = new Melee.Space(2000, 2000);

var clock = new THREE.Clock();

Melee.render = function()
{
    var delta = Math.min(clock.getDelta(), 1 / 10);

    requestAnimationFrame(Melee.render);

    space.run(delta);

    space.prepareForRendering();

    Melee.renderer.render(Melee.scene, Melee.camera);
}

Melee.render();

