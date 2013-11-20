////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// standard global variables
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var container, scene, camera, renderer, controls, stats, floor;
var clock = new THREE.Clock();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// custom global variablesss
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var pinwheel;

// animation code
var animOffset = 0,   // starting frame of animation
    walking = false,
    duration = 5900, // milliseconds to complete animation
    keyframes = 39,   // total number of animation frames
    interpolation = duration / keyframes, // milliseconds per frame
    lastKeyframe = 0,    // previous keyframe
    currentKeyframe = 0;

// initialize and animate
$(document).ready(function() {
    init();
    animate();
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function init() {
    // Create the scene
    scene = new THREE.Scene();

    // Create the camera
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45,
        ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
        NEAR = 0.1,
        FAR = 20000;
    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    // add the camera to the screen
    scene.add(camera);
    // set camera position
    camera.position.set(0,300,100);


    // Create renderer
    if ( Detector.webgl ) {
        renderer = new THREE.WebGLRenderer( {antialias:true} );
    }
    else {
        renderer = new THREE.CanvasRenderer();
    }
    renderer.setSize(960, 540);
    container = document.getElementById("container");
    container.appendChild( renderer.domElement );

    // must enable shadows on the renderer
    renderer.shadowMapEnabled = true;

    // CONTROLS
    controls = new THREE.OrbitControls( camera, renderer.domElement );

    // LIGHT
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-100,200,100);
    scene.add(light);

    // Floor
    var floorTexture = new THREE.ImageUtils.loadTexture( 'img/grass-512.jpg' );
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set( 10, 10 );
    var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
    var floorGeometry = new THREE.PlaneGeometry(500, 500, 10, 10);
    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

    // Skybox
    var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
    var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
    var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
    // scene.add(skyBox);
    scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
    scene.add(skyBox);

    // init jsonLoader and load the model
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load( "js/models/Windrad.js", addModelToScene );
    jsonLoader.load( "js/models/Dieselgenerator.js", addGeneratorModelToScene );
    jsonLoader.load( "js/models/Kleines_Wohnhaus.js", addSmallHouseModelToScene );

    // add light
    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);
}

function addGeneratorModelToScene(geometry, materials) {
     var material = new THREE.MeshFaceMaterial( materials );
    generator = new THREE.Mesh( geometry, material );
    generator.scale.set(5, 5, 5);
    generator.position.set(0, 0, 20);
    scene.add(generator);
}

function addSmallHouseModelToScene(geometry, materials) {
    var material = new THREE.MeshFaceMaterial( materials );
    SmallHouse = new THREE.Mesh( geometry, material );
    SmallHouse.scale.set(5, 5, 5);
    SmallHouse.position.set(30, 0, 20);
    scene.add(SmallHouse);
}

function addModelToScene(geometry, materials )
{
    // for preparing animation
    for (var i = 0; i < materials.length; i++)
        materials[i].morphTargets = true;

    var material = new THREE.MeshFaceMaterial( materials );
    pinwheel = new THREE.Mesh( geometry, material );
    pinwheel.scale.set(7, 7, 7);
    //pinwheel.position.set(-100, 50, 0);
    scene.add( pinwheel );
}

function animate()
{
    requestAnimationFrame(animate);
    render();
    update();
}

function update()
{
    controls.update();
}

function render()
{
    if (pinwheel) // exists / is loaded
    {
        // Alternate morph targets
        time = new Date().getTime() % duration;
        keyframe = Math.floor( time / interpolation ) + animOffset;
        if ( keyframe != currentKeyframe )
        {
            pinwheel.morphTargetInfluences[ lastKeyframe ] = 0;
            pinwheel.morphTargetInfluences[ currentKeyframe ] = 1;
            pinwheel.morphTargetInfluences[ keyframe ] = 0;
            lastKeyframe = currentKeyframe;
            currentKeyframe = keyframe;
        }
        pinwheel.morphTargetInfluences[ keyframe ] =
            ( time % interpolation ) / interpolation;
        pinwheel.morphTargetInfluences[ lastKeyframe ] =
            1 - pinwheel.morphTargetInfluences[ keyframe ];
    }

    renderer.render( scene, camera );
}