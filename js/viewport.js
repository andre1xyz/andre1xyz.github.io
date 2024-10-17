import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.152.2/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://unpkg.com/three@0.152.2/examples/jsm/loaders/OBJLoader.js';
import { EffectComposer } from 'https://unpkg.com/three@0.152.2/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.152.2/examples/jsm/postprocessing/RenderPass.js';
import { SSAOPass } from 'https://unpkg.com/three@0.152.2/examples/jsm/postprocessing/SSAOPass.js';
import { ShaderPass } from 'https://unpkg.com/three@0.152.2/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'https://unpkg.com/three@0.152.2/examples/jsm/shaders/FXAAShader.js';
import { TextureLoader } from 'three';
import { RGBELoader } from 'https://unpkg.com/three@0.152.2/examples/jsm/loaders/RGBELoader.js';

function initializeViewport() {

  // Renderer
  const canvas = document.querySelector('#three-canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false, // Disable default antialiasing
    logarithmicDepthBuffer: false
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Output encoding and tone mapping
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0; // Adjust as needed

  // Scene
  const scene = new THREE.Scene();


  // Load HDRI
  const rgbeLoader = new RGBELoader();
  rgbeLoader.load('models/hdri/belfast_sunset_puresky_2k.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture; // Optional: Comment out if you don't want the HDRI as the background
  });

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.y = 3;
  camera.position.z = 6;

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight('white', 1.0);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight('white', 2);
  directionalLight.position.set(1, 5, 2);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  // Floor
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshLambertMaterial({
      color: 'burlywood'
    })
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  const textureLoader = new THREE.TextureLoader();
  const diffuseTexture = textureLoader.load('models/dragonsitoTextures/defaultMat_BaseColor.jpg');
  const normalTexture = textureLoader.load('models/dragonsitoTextures/defaultMat_Normal.jpg');
  const roughnessTexture = textureLoader.load('models/dragonsitoTextures/defaultMat_Roughness.jpg');
  // Load other textures as needed
  const material = new THREE.MeshStandardMaterial({
    map: diffuseTexture,
    normalMap: normalTexture,
    roughness: 0.9,
    metalness: 0
  });


  // Load Model
  const loader = new OBJLoader();
  loader.load(
    'models/dragonsito.obj', // Replace with your actual model path
    function (object) {
      object.scale.set(1, 1, 1);
      object.traverse(function (child) {
        if (child.isMesh) {
          child.material = material;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      scene.add(object);
      console.log('Model loaded successfully');
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error('An error happened while loading the model', error);
    }
  );

  /// Post-processing
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const ssaoPass = new SSAOPass(scene, camera, window.innerWidth, window.innerHeight);
  ssaoPass.kernelRadius = 16; // Adjust for desired effect
  composer.addPass(ssaoPass);

  // FXAA Antialiasing Pass
  const fxaaPass = new ShaderPass(FXAAShader);
  fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * renderer.getPixelRatio());
  fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * renderer.getPixelRatio());
  composer.addPass(fxaaPass);

  // Draw
  function draw() {
    // Update controls if needed
    controls.update();

    // Use composer instead of renderer
    composer.render();
  }

  // Start the animation loop
  renderer.setAnimationLoop(draw);

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);

    // Update FXAA resolution
    fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * renderer.getPixelRatio());
    fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * renderer.getPixelRatio());
  }

  // Event
  window.addEventListener('resize', setSize);

  draw();
}

console.log('viewport.js loaded successfully');

initializeViewport();
