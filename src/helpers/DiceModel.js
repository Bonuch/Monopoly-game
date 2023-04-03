import { Body, Material, Box, Vec3 } from 'cannon';
import { threeToCannon } from 'three-to-cannon';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Board } from './Board';
import { v4 } from 'uuid';
import { getModel } from './modelLoader';


/**
 * #DiceBody
 * DiceBody - тело кости, в объеке задается его масса и внутренние параметры, в качестве физики тела используется CANNON.JS
 * @see {@link https://schteppe.github.io/cannon.js/|CANNON.JS}
 * */
class DiceBody {
    constructor(model, mass) {
        this.mass = mass;
        this.body = new Body({
            mass: this.mass,
            shape: new Box(new Vec3(3, 3, 3)), // Привели тело к одному размеру
            material: new Material(), //Board.diceBodyMaterial
        });
        this.body.allowSleep = true
        this.body.sleepSpeedLimit = 0.1
        this.body.sleepTimeLimit = 1
    }

    set position(coords) {
        this.body.position.x = coords.x;
        this.body.position.y = coords.y;
        this.body.position.z = coords.z;
    }

    get position() {
        return this.body.position;
    }
}

/**
 * #Dice
 * Dice - содержит в себе методы для определения координат и хранения модели
 * */
export class Dice extends DiceBody {
    constructor(
        model,
        playerId = null,
        gravity = 9.8,
        shape = 'box',
        mass = 500,

    ) {
        super(model, mass);
        this.playerId = playerId;
        // добавил child[0]
        this.model = model;
        this.simulationRunning = false;
        this.faces = [1, 2, 3, 4, 5, 6];
        this.rotationTableX = { 1: [0, 0, 0] }
        this.rotationAngleFace = new WeakMap
        // Стартовое расположение кубика при камере направленной на ось Z (пол)
        this.faces_y = [5, 3, 2, 4];
        this.faces_x = [6, 3, 4, 1];
        this.tab = 0.1;
        this.perc = null;
        this.innerMesh = this.getSceneMesh()
        this.arrowHelper1 = new THREE.ArrowHelper(
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 0, 0),
            25,
            0xffffff
        );
        this.arrowHelper2 = new THREE.ArrowHelper(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, 0, 0),
            25,
            0xffffff
        );
        this.arrowHelper3 = new THREE.ArrowHelper(
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 0),
            25,
            0xffffff
        );
        this.af = Math.PI / 4;
        this.chamfer = 0.96;
        this.vertices = [
            [-1, -1, -1],
            [1, -1, -1],
            [1, 1, -1],
            [-1, 1, -1],
            [-1, -1, 1],
            [1, -1, 1],
            [1, 1, 1],
            [-1, 1, 1],
        ];
        this.faces = [
            [0, 3, 2, 1, 1],
            [1, 2, 6, 5, 2],
            [0, 1, 5, 4, 3],
            [3, 7, 6, 2, 4],
            [0, 4, 7, 3, 5],
            [4, 5, 6, 7, 6],
        ];
        // this.uniqueModel()
    }

    // works with deg
    setRotationTable() {

    }

    shiftUpperValue(toValue) {
        let geometry = this.getSceneMesh()

        let fromValue = this.getSide()


        for (let i = 0, face = this.faces.length; i < face; ++i) {
            let materialIndex = face[i];
            if (materialIndex === 0) continue;

            materialIndex += toValue - fromValue - 1;
            while (materialIndex > this.values) materialIndex -= this.values;
            while (materialIndex < 1) materialIndex += this.values;

            geometry.faces[i].materialIndex = materialIndex + 1;
        }
    }

    /**
     * @param left bool
     * */
    rotateFaceX(left) {
        if (left) {
            this.faces_x.unshift(this.faces_x.pop());
        } else {
            this.faces_x.push(this.faces_x.shift());
        }
    }

    rotateFaceY(top) {
        if (top) {
            this.faces_y.push(this.faces_y.shift());
        } else {
            this.faces_y.unshift(this.faces_y.pop());
        }
    }

    rollTo(val) {
        let res
        let pos = this.model.scene.position
        this.perc = pos.z + 0.01
        let pointer = new THREE.Vector3(0, 0, 100)
        let v1 = new THREE.Vector3(pos.x + 100, 0, 0);
        let v2 = new THREE.Vector3(0, pos.y + 100, 0);
        let v3 = new THREE.Vector3(0, 0, pos.z + 100);


        v1.applyMatrix4(this.model.scene.matrixWorld);
        this.arrowHelper1.setDirection(v1);

        v2.applyMatrix4(this.model.scene.matrixWorld);
        this.arrowHelper2.setDirection(v2);

        v3.applyMatrix4(this.model.scene.matrixWorld);
        this.arrowHelper3.setDirection(v3);


        if (v1.z > this.perc) {
            res = 2
        } else if (v1.z < -this.perc) {
            res = 5
        } else if (v2.z > this.perc) {
            res = 1
        } else if (v2.z < -this.perc) {
            res = 6
        } else if (v3.z > this.perc) {
            res = 3
        } else if (v3.z < -this.perc) {
            res = 4
        }

    }

    /**
     * @description getSide - метод служит для определения текущего значения по оси Z
     * */
    getSide() {
        let res
        let pos = this.model.scene.position
        this.perc = pos.z + 0.01
        let v1 = new THREE.Vector3(pos.x + 100, 0, 0);
        let v2 = new THREE.Vector3(0, pos.y + 100, 0);
        let v3 = new THREE.Vector3(0, 0, pos.z + 100);


        v1.applyMatrix4(this.model.scene.matrixWorld);
        this.arrowHelper1.setDirection(v1);

        v2.applyMatrix4(this.model.scene.matrixWorld);
        this.arrowHelper2.setDirection(v2);

        v3.applyMatrix4(this.model.scene.matrixWorld);
        this.arrowHelper3.setDirection(v3);

        if (v1.z > this.perc) {
            res = 2
        } else if (v1.z < -this.perc) {
            res = 5
        } else if (v2.z > this.perc) {
            res = 1
        } else if (v2.z < -this.perc) {
            res = 6
        } else if (v3.z > this.perc) {
            res = 3
        } else if (v3.z < -this.perc) {
            res = 4
        }
        return res
    }

    getObject() {
        return this.model;
    }



    uniqueModel() {
        this.model.scene.uuid = v4().toUpperCase();
        console.log('MODEL UUID', this.model.scene.uuid);
    }

    updateMeshFromBody() {
        if (!this.simulationRunning) {
            this.model.position.copy(this.body.position);
            this.model.quaternion.copy(this.body.quaternion);
        }
    }

    rotateTo(opt = {}) {
        if (Object.keys(opt).length() > 0) {
            this.body.quaternion.setFromEuler(opt.x, opt.y, opt.z);
        }
    }


    getSceneMesh(scene = this.model.scene) {
        if (scene.children.length == 0) {
            return scene
        }
        for (let child of scene.children) {
            if (child instanceof THREE.Mesh) {
                return child
            }
            return this.getSceneMesh(child)
        }
    }

    getUpsideValue() {
        let vector = new THREE.Vector3(0, this.invertUpside ? -1 : 1);
        let closest_face;
        let closest_angle = Math.PI * 2;
        let sceneMesh = this.getSceneMesh()
        console.log("SCENE MESH", sceneMesh, this.body)
        for (let i = 0; i < sceneMesh.geometry.faces.length; ++i) {
            let face = sceneMesh.geometry.faces[i];
            if (face.materialIndex === 0) continue;

            let angle = face.normal
                .clone()
                .applyQuaternion(this.body.quaternion)
                .angleTo(vector);
            if (angle < closest_angle) {
                closest_angle = angle;
                closest_face = face;
            }
        }
        return closest_face.materialIndex - 1;
    }
    /**
     * Проверка на остановку объекта
     */
    isFinished() {
        let threshold = 1;

        let angularVelocity = this.body.angularVelocity;
        let velocity = this.body.velocity;

        return (
            Math.abs(angularVelocity.x) < threshold &&
            Math.abs(angularVelocity.y) < threshold &&
            Math.abs(angularVelocity.z) < threshold &&
            Math.abs(velocity.x) < threshold &&
            Math.abs(velocity.y) < threshold &&
            Math.abs(velocity.z) < threshold
        );
    }

    getCurrentVectors() {
        return {
            position: this.body.position.clone(),
            quaternion: this.body.quaternion.clone(),
            velocity: this.body.velocity.clone(),
            angularVelocity: this.body.angularVelocity.clone(),
        };
    }

    setVectors(vectors) {
        this.body.position = vectors.position;
        this.body.quaternion = vectors.quaternion;
        this.body.velocity = vectors.velocity;
        this.body.angularVelocity = vectors.angularVelocity;
    }

    updateBodyFromMesh() {
        this.body.position.copy(this.model.scene.position);
        this.body.quaternion.copy(this.model.scene.quaternion);
    }

    rollObject(newValues = []) {
        this.model.rotation(...newValues);
    }

    moveObject(newValues = {}) {
        if (this.model) {
            this.model.scene.position.x = newValues.x;
            this.model.scene.position.y = newValues.y;
            this.model.scene.position.z = newValues.z;
        }
    }

    calcVector() {
        return 0;
    }
}

export class DicesGroup {
    constructor() {
        this.objects = [];
        this.queue = [];
    }

    async addGroup(
        model_url,
        playerId = null,
        gravity = 9.8,
        shape = 'box',
        mass = 500
    ) {
        const obj = {};
        obj['playerId'] = playerId;
        // METHOD getModel load twice!!!
        obj['dices'] = [
            new Dice(await getModel(model_url), playerId, gravity, shape, mass),
            new Dice(await getModel(model_url), playerId, gravity, shape, mass),
        ];
        this.queue.push(playerId.toString());
        this.objects.push(obj);
    }
}
