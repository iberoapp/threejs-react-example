import { useState, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

function useAssetLoader(url) {
  const [gltf, setGltf] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    
    // Configurar DRACO
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      url,
      (gltf) => setGltf(gltf),
      undefined,
      (error) => setError(error)
    );

    return () => {
      dracoLoader.dispose();
    };
  }, [url]);

  return { gltf, error };
}

export default useAssetLoader;