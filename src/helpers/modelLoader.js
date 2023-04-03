import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function getModel(model_url) {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      model_url,
      (data) => {
        let mult = null;
        data.scene.traverse(child => {
            if(child.isMesh) {
                mult = child.geometry.boundingBox.max.x // x cause box form
            }
        })
        data.scene.scale.set((1/ mult) * 3, (1/ mult) * 3, (1/ mult) * 3)
        // data.scene.scale.set(1, 1, 1);
        resolve(data);
      },
      null,
      reject
    );
  });
}
