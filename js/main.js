var Melee = Melee || {};

Melee.setupSceneCameraAndRenderer();

Melee.loadAssets();

var space = new Melee.Space(10000, 10000);

var ship1 = new Melee.GameObject(Melee.assets['Simple ship'], Melee.scene, Math.random() * space.size.x, Math.random() * space.size.y, Math.random() * Math.PI * 2);
var ship2 = new Melee.GameObject(Melee.assets['Simple ship'], Melee.scene, Math.random() * space.size.x, Math.random() * space.size.y, Math.random() * Math.PI * 2);
var planet = new Melee.GameObject(Melee.assets['Neptune'], Melee.scene, space.size.x / 2, space.size.y / 2, 0);

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

    ship1.control(delta, Melee.keyboard[37], Melee.keyboard[39], Melee.keyboard[38]);
    ship2.control(delta, Melee.keyboard[65], Melee.keyboard[68], Melee.keyboard[87]);

    Melee.showGameObjects(Melee.camera, ships, 200);

    space.prepareForRendering();

    Melee.renderer.render(Melee.scene, Melee.camera);
}

Melee.render();

