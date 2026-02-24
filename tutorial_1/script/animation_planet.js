var scene;
var renderer;
var container;
var containerPlanet;
var planetMesh;
var ringMesh;

var onRenderFcts = [];
var camera;
var locationName = "";

window.addEventListener('load', function () {

    container = document.getElementById('container');

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(container.offsetWidth, container.offsetHeight); /// window.innerWidth, window.innerHeight



    //alert(container.offsetWidth);
    
    container.appendChild(renderer.domElement);

    //document.body.appendChild(renderer.domElement);
    renderer.shadowMapEnabled = true

  

  



    //////////////////////////////////////////////////////////////////////////////////
    //		add an object and make it move					//
    //////////////////////////////////////////////////////////////////////////////////

    // var datGUI	= new dat.GUI()






    /*
	var geometry	= new THREE.SphereGeometry(0.5, 32, 32)
	var material	= THREEx.createAtmosphereMaterial()
	material.uniforms.glowColor.value.set(0x00b3ff)
	material.uniforms.coeficient.value	= 0.8
	material.uniforms.power.value		= 2.0
	var mesh	= new THREE.Mesh(geometry, material );
	mesh.scale.multiplyScalar(1.01);
	containerEarth.add( mesh );
	// new THREEx.addAtmosphereMaterial2DatGui(material, datGUI)
    */



    //////////////////////////////////////////////////////////////////////////////////
    //		loop runner							//
    //////////////////////////////////////////////////////////////////////////////////
    var lastTimeMsec = null
    requestAnimationFrame(function animate(nowMsec) {
        // keep looping
        requestAnimationFrame(animate);
        // measure time
        lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
        var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
        lastTimeMsec = nowMsec
        // call each update function
        onRenderFcts.forEach(function (onRenderFct) {
            onRenderFct(deltaMsec / 200, nowMsec / 1000) /// deltaMsec/2000 speed
        })
    })
   
});

function createZoom(zoom) {
    camera = new THREE.PerspectiveCamera(zoom, container.offsetWidth / container.offsetHeight, 0.01, 100); // 85 higher \oo mout
}

function removeWorld(level) {

    scene = new THREE.Scene();
    var light = new THREE.AmbientLight(0x222222)
    scene.add(light)

    var light = new THREE.DirectionalLight(0xcccccc, 1)
    light.position.set(5, 5, 5)
    scene.add(light)

    light.castShadow = true
    light.shadowCameraNear = 0.01
    light.shadowCameraFar = 15
    light.shadowCameraFov = 45

    light.shadowCameraLeft = -1
    light.shadowCameraRight = 1
    light.shadowCameraTop = 1
    light.shadowCameraBottom = -1
    //light.shadowCameraVisible	= true

    light.shadowBias = 0.001
    light.shadowDarkness = 0.2

    light.shadowMapWidth = 680;
    light.shadowMapHeight = 908; //todo


    onRenderFcts = []; // or check if it can be cleared.


    //////////////////////////////////////////////////////////////////////////////////
    //		added starfield							//
    //////////////////////////////////////////////////////////////////////////////////

    var starSphere = THREEx.Planets.createStarfield() // background
    scene.add(starSphere)


    containerPlanet = new THREE.Object3D()
    containerPlanet.rotateZ(-23.4 * Math.PI / 180)
    containerPlanet.position.z = 0
    scene.add(containerPlanet);

    ///level = 19;

    switch (level) {
        case 1:
            locationName = "PLUTO";
            planetMesh = THREEx.Planets.createPluto();
            createZoom(120);
            break;
        case 2:
            locationName = "NEPTUNE";
            planetMesh = THREEx.Planets.createNeptune();
            createZoom(75);
            break;
        case 3:
            locationName = "URANUS";
            planetMesh = THREEx.Planets.createUranus();
            ringMesh = THREEx.Planets.createUranusRing();
            createZoom(70);
            break;
        case 4:
            locationName = "SATURN";
            planetMesh = THREEx.Planets.createSaturn();
            ringMesh = THREEx.Planets.createSaturnRing();
            createZoom(55);
            break;
        case 5:
            locationName = "JUPITER";
            planetMesh = THREEx.Planets.createJupiter();
            createZoom(50);
            break;
        case 6:
            locationName = "MARS";
            planetMesh = THREEx.Planets.createMars();
            createZoom(90);
            break;
        case 7:
            locationName = "EARTH";
            planetMesh = THREEx.Planets.createEarth();

            // Create blue glow
            var geometry = new THREE.SphereGeometry(0.5, 32, 32)
            var material = THREEx.createAtmosphereMaterial();

            material.uniforms.glowColor.value.set(0x00b3ff);
            material.uniforms.coeficient.value = 0.8;
            material.uniforms.power.value = 2.0;
            var mesh = new THREE.Mesh(geometry, material);
            mesh.scale.multiplyScalar(1.01);
            containerPlanet.add(mesh);

            // create clouds
            var earthCloud = THREEx.Planets.createEarthCloud()
            earthCloud.receiveShadow = true
            earthCloud.castShadow = true
            containerPlanet.add(earthCloud)
            onRenderFcts.push(function (delta, now) {
                earthCloud.rotation.y += 1 / 64 * delta; // 1/8
            })

            createZoom(85);
            break;
        case 8:
            locationName = "VENUS";
            planetMesh = THREEx.Planets.createVenus();
            createZoom(85);
            break;
        case 9:
            locationName = "MERCURY";
            planetMesh = THREEx.Planets.createMercury();
            createZoom(105);
            break;
        default:
            locationName = "THE SUN";
            planetMesh = THREEx.Planets.createSun();

            var geometry = new THREE.SphereGeometry(0.5, 32, 32)
            var material = THREEx.createAtmosphereMaterial();

            material.uniforms.glowColor.value.set(0xffb700); // fff700
            material.uniforms.coeficient.value = 1.2;
            material.uniforms.power.value = 2.0;

            var mesh = new THREE.Mesh(geometry, material);
            mesh.scale.multiplyScalar(1.01);
            containerPlanet.add(mesh);

            createZoom(45); 
            break;
    }

    camera.position.z = 2;
    
    planetMesh.receiveShadow = true;
    planetMesh.castShadow = true;
    containerPlanet.add(planetMesh);

    onRenderFcts.push(function (delta, now) {
        planetMesh.rotation.y += 1 / 32 * delta;
    })

    //alert(ringMesh);

    if (ringMesh != null) {

        containerPlanet.add(ringMesh);
        ringMesh.receiveShadow = true;
        ringMesh.castShadow = true;
        scene.add(ringMesh);

        onRenderFcts.push(function (delta, now) {
            ringMesh.rotation.y += 1 / 256 * delta; // vary slow rotation
        })
    } 

    //////////////////////////////////////////////////////////////////////////////////
    //		render the scene						//
    //////////////////////////////////////////////////////////////////////////////////
    onRenderFcts.push(function () {
        renderer.render(scene, camera);
    })

   // alert("xx")
}