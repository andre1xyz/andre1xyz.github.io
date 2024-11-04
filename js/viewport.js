import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.169.0/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://unpkg.com/three@0.169.0/examples/jsm/loaders/OBJLoader.js';
import { EffectComposer } from 'https://unpkg.com/three@0.169.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.169.0/examples/jsm/postprocessing/RenderPass.js';
import { SSAOPass } from 'https://unpkg.com/three@0.169.0/examples/jsm/postprocessing/SSAOPass.js';
import { ShaderPass } from 'https://unpkg.com/three@0.169.0/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'https://unpkg.com/three@0.169.0/examples/jsm/shaders/FXAAShader.js';
import { RGBELoader } from 'https://unpkg.com/three@0.169.0/examples/jsm/loaders/RGBELoader.js';

export async function initializeViewport(modelName) {

  async function loadTextures(modelName, textureType, identifiers) {
    const textures = [];
    const basePath = `models/${modelName}Textures/`;
    const loader = new THREE.TextureLoader();

    const extensions = ['.png', '.jpg', '.jpeg'];

    for (let i = 0; i < identifiers.length; i++) {
      let textureLoaded = false;
      const id = identifiers[i];
      const filename = `${modelName}_${textureType}${id}`;
      for (let ext of extensions) {
        const path = `${basePath}${filename}${ext}`;
        try {
          const texture = await loader.loadAsync(path);

          console.log(`Loaded ${textureType} texture: ${path}`);
          textures.push(texture);
          textureLoaded = true;
          break;
        } catch (err) {
          console.warn(`Failed to load ${path}.`);
        }
      }
      if (!textureLoaded) {
        console.error(`Failed to load ${textureType} texture with identifier ${id}.`);
        textures.push(null);
      }
    }
    return textures;
  }

  // Renderer
  const canvas = document.querySelector('#three-canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    logarithmicDepthBuffer: false
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Output encoding and tone mapping
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  // Scene
  const scene = new THREE.Scene();

  // Load HDRI
  const rgbeLoader = new RGBELoader();
  rgbeLoader.load('models/hdri/belfast_sunset_puresky_2k.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.envMapIntensity = 1;
        child.material.needsUpdate = true;
      }
    });
    scene.background = texture;
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

  const directionalLight = new THREE.DirectionalLight('white', 1);
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

  // Load Identifiers
  const identifiers = ['.1001', '.1002', '.1003', '.1004', '.1005', '.1006'];

  // Load Textures
  let diffuseTextures = await loadTextures(modelName, 'MAT_BaseColor', identifiers);
  let normalTextures = await loadTextures(modelName, 'MAT_Normal', identifiers);
  let roughnessTextures = await loadTextures(modelName, 'MAT_Roughness', identifiers);
  let metallicTextures = await loadTextures(modelName, 'MAT_Metalness', identifiers);
  let aoTextures = await loadTextures(modelName, 'MAT_AO', identifiers);

  // Create an array of materials using loaded textures
  const materials = new Array(identifiers.length).fill(null);
  for (let i = 0; i < identifiers.length; i++) {
    const material = new THREE.MeshStandardMaterial({ envMapIntensity: 1, side: THREE.DoubleSide });
    if (diffuseTextures[i]) {
      material.map = diffuseTextures[i];
    }
    if (normalTextures[i]) {
      material.normalMap = normalTextures[i];
    }
    if (roughnessTextures[i]) {
      material.roughnessMap = roughnessTextures[i];
    }
    if (metallicTextures[i]) {
      material.metalnessMap = metallicTextures[i];
    }
    if (aoTextures[i]) {
      material.aoMap = aoTextures[i];
    }
    material.needsUpdate = true;
    materials[i] = material;
  }

  // Load Model based on modelName
  const loader = new OBJLoader();
  let currentModel = null;

  loader.load(`models/${modelName}.obj`, function (obj) {
    // Apply materials to the object's children
    obj.traverse(function (child) {
      if (child.isMesh) {
        // Assign material to mesh based on index
        const index = obj.children.indexOf(child);
        if (materials[index]) {
          child.material = materials[index];
          console.log(`Assigned material to ${child.name} based on index ${index}`);
        } else {
          console.warn(`No material assigned to ${child.name}. Using default material.`);
          child.material = new THREE.MeshStandardMaterial({ color: 'gray' });
        }
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    // Add the model to the scene
    scene.add(obj);
    currentModel = obj;
  });

  // Create geometry to preview textures (Optional)
  const n = identifiers.length;
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i < n; i++) {
    const x0 = i;
    const x1 = i + 1;
    const y0 = 0;
    const y1 = 1;
    const z = 0;

    positions.push(
      x0, y0, z,
      x0, y1, z,
      x1, y1, z,
      x1, y0, z
    );

    normals.push(
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1
    );

    uvs.push(
      0, 0,
      0, 1,
      1, 1,
      1, 0
    );

    const vbase = i * 4;
    indices.push(
      vbase, vbase + 1, vbase + 2,
      vbase + 2, vbase + 3, vbase
    );
  }

  const previewGeometry = new THREE.BufferGeometry();
  previewGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  previewGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  previewGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  previewGeometry.setIndex(indices);

  for (let i = 0; i < n; i++) {
    previewGeometry.addGroup(i * 6, 6, i);
  }

  const previewMesh = new THREE.Mesh(previewGeometry, materials);
  previewMesh.position.set(-n / 2 + 0.5, -1.5, 0);
  scene.add(previewMesh);

  /// Post-processing
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const ssaoPass = new SSAOPass(scene, camera, window.innerWidth, window.innerHeight);
  ssaoPass.kernelRadius = 16;
  composer.addPass(ssaoPass);

  // FXAA Antialiasing Pass
  const fxaaPass = new ShaderPass(FXAAShader);
  fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * renderer.getPixelRatio());
  fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * renderer.getPixelRatio());
  composer.addPass(fxaaPass);

  // Draw
  function draw() {
    controls.update();
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

  // Initial resize to set sizes correctly
  setSize();
}

console.log('viewport.js loaded successfully');

window.initializeViewport = initializeViewport;
