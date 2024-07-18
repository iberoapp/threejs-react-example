import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import useAssetLoader from '../hooks/useAssetLoader';

function ModelViewer() {
  const containerRef = useRef(null);
  const { gltf, error } = useAssetLoader('/models/LittlestTokyo.glb');
  const mixerRef = useRef(null);

  useEffect(() => {
    if (!gltf) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.background = new THREE.Color(0xbfe3dd);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;

    camera.position.set(5, 2, 8);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.5, 0);
    controls.update();
    controls.enablePan = false;
    controls.enableDamping = true;

    const model = gltf.scene;
    model.position.set(1, 1, 0);
    model.scale.set(0.008, 0.008, 0.008);
    scene.add(model);

    mixerRef.current = new THREE.AnimationMixer(model);
    mixerRef.current.clipAction(gltf.animations[0]).play();

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      mixerRef.current.update(delta);
      controls.update();

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, [gltf]);

  if (error) {
    console.error('Error loading model:', error);
    return <div>Error loading model</div>;
  }

  if (!gltf) {
    return <div>Loading...</div>;
  }

  return <div ref={containerRef} />;
}

export default ModelViewer;