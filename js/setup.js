var Melee = Melee || {};

Melee.updateViewportSize = function()
{
    Melee.camera = new THREE.OrthographicCamera(
        -window.innerWidth / 2,
        window.innerWidth / 2,
        window.innerHeight / 2,
        -window.innerHeight / 2, -1, 1
    );

    if (!Melee.renderer) {
        Melee.renderer = new THREE.WebGLRenderer();
        Melee.renderer.setClearColor(0x000000);
    }
    Melee.renderer.setSize(window.innerWidth, window.innerHeight);
}

Melee.setupSceneCameraAndRenderer = function()
{
    Melee.scene = new THREE.Scene();

    Melee.updateViewportSize();

    document.body.appendChild(Melee.renderer.domElement);

    window.addEventListener('resize', Melee.updateViewportSize, false);
}
