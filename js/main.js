var Melee = Melee || {};

Melee.setupSceneCameraAndRenderer();

Melee.loadAssets();

var space = new Melee.Space(5000, 5000);

var ship1 = new Melee.GameObject(Melee.assets['Simple ship'], Melee.scene, Math.random() * space.size.x, Math.random() * space.size.y, Math.random() * Math.PI * 2);
var ship2 = new Melee.GameObject(Melee.assets['Simple ship'], Melee.scene, Math.random() * space.size.x, Math.random() * space.size.y, Math.random() * Math.PI * 2);
var planet = new Melee.GameObject(Melee.assets['Neptune'], Melee.scene, 2500, 2500, 0);

var ships = [ship1, ship2];

space.addGameObject(ship1);
space.addGameObject(ship2);
space.addGameObject(planet);

var clock = new THREE.Clock();

Melee.render = function()
{
    var delta = Math.min(clock.getDelta(), 1 / 10);

    requestAnimationFrame(Melee.render);

    space.run(delta, ships);

    Melee.showGameObjects(Melee.camera, ships, 200);

    space.prepareForRendering();

    Melee.renderer.render(Melee.scene, Melee.camera);
}

Melee.render();

