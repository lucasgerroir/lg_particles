

    	
    	
    	var scene, camera, renderer, composer, cube, controls, velocity;
    	var object, light, cursor, loader, texture;
    	var pos = new THREE.Vector3(0,0,0);
        var targetPositions = [];
        
    	init();
    	update();
   
	
		
	function init() {
		//renderer
		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, (window.innerHeight - 30) );
		renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));

		var container = $('#interact');
		container.append( renderer.domElement );
		//set up camera
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		camera.position.z = 5;
		//setup scene
		scene = new THREE.Scene();
		//scene.fog = new THREE.Fog( 0x33FFCC, 3, 10);

		var dirLight = new THREE.DirectionalLight(0x000000, 1);
	    dirLight.position.set(0, 0, 6);
	    scene.add(dirLight);

		Start();
		postProcessing();
		window.addEventListener( 'resize', onWindowResize, false );
	}

	function background(){
		// instantiate a loader
		loader = new THREE.TextureLoader();

		// load a resource
		texture = loader.load( 'textures/texture.jpg' );
	}

	function createCursor(){
		cursor = new THREE.SpotLight(0x000000, 2, 200, Math.PI/2);
		scene.add( cursor );
	}

	function postProcessing(){
		// postprocessing
		composer = new THREE.EffectComposer( renderer );
		composer.addPass( new THREE.RenderPass( scene, camera ) );

		var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
		effect.uniforms[ 'amount' ].value = 0.003;
		effect.renderToScreen = true;
		composer.addPass( effect );
	}

	function Start(){
		cube = [];
		velocity = 1;
		var material = new THREE.MeshBasicMaterial( { color: 0x435e73} );

		for (var i = 0; i < 50; i++) {
			
			CreateParticle(material);

			var targetPosition = new THREE.Vector3(); 
			targetPosition = generateRandomTargetPosition();
			targetPositions[i] = targetPosition;
		}
		createCursor();	
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );

	}
	
	function generateRandomTargetPosition() {

  		var randomPosition = new THREE.Vector3();

		randomPosition.x = getRandomArbitrary(-7.0, 7.0);
		randomPosition.y = getRandomArbitrary(-7.0, 7.0);
		randomPosition.z = getRandomArbitrary(-1.0, 1.0);

		return randomPosition;
    }
 

	function CreateParticle(material) {
		// set up the sphere vars
		var radius = getRandomArbitrary(0.1, 0.2),
		    segments = getRandomArbitrary(5, 20),
		    rings =  getRandomArbitrary(1, 20);

		var sphere = new THREE.Mesh(
		  new THREE.SphereGeometry(
		    radius,
		    segments,
		    rings),

		  material);

		var spherePosition = new THREE.Vector3(); 
		spherePosition = generateRandomTargetPosition();
	
		sphere.position.x = spherePosition.x;
		sphere.position.y = spherePosition.y;
		sphere.position.z = spherePosition.z;

		scene.add( sphere );
		cube.push(sphere);
	}	

	function getRandomArbitrary(min, max) {
	    return Math.random() * (max - min) + min;
	}

	$(document).mousemove(function(event) {
		var vector = new THREE.Vector3();
		vector.set(
		    ( event.clientX / window.innerWidth ) * 2 - 1,
		    - ( event.clientY / window.innerHeight ) * 2 + 1,
		    0.5 );
		vector.unproject( camera );
		var dir = vector.sub( camera.position ).normalize();
		var distance = - camera.position.z / dir.z;
		pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
		
	});

	function Lights() {
	   
	}


  function distance(item){
  	
	var dx = item.position.x - pos.x;
	var dy = item.position.y - pos.y;
	var dz = item.position.z - pos.z;

	var d = Math.sqrt(dx*dx+dy*dy+dz*dz);

	return d;
  }


	function update() {
		
		requestAnimationFrame( update );
		renderer.render( scene, camera );
		composer.render();
		TWEEN.update();

		var i = 0;
		cube.forEach( function(item) {
			
			if (item.position.x == targetPositions[i].x && item.position.y == targetPositions[i].y && item.position.z == targetPositions[i].z) {
				var targetPosition = new THREE.Vector3(); 
				targetPosition = generateRandomTargetPosition();
				targetPositions[i] = targetPosition;
			}

			var mouseTween = new TWEEN.Tween(item.position).to(pos, 1000) // destination, duration 
			var targetTween = new TWEEN.Tween(item.position).to(targetPositions[i], 3000) // destination, duration
	    	var d = distance(item);

			if (d  < 2.0) {
				targetTween.stop();
				mouseTween.start();
			 	//item.material.color.setHex(0x33ee34);
			} else {
		 		mouseTween.stop();
		 		targetTween.start();
			 	//item.material.color.setHex(0x0000ff);
			}
			// make each item look at the postion
			item.lookAt(pos);
		 	i++;
		});



		 cursor.position.x = pos.x;
		 cursor.position.y = pos.y;
		 cursor.position.z = pos.z;

		
	}
	


