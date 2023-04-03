import * as CANNON from "cannon";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const _ = require('lodash')


/**
 * #Board
 * Board - служит для манипуляции костями.
 * - Реализованы методы броска
 * - Очистка сцены.
 * */
export class Board {

    /**
     * Экземпляр Board
     *
     * Свойства:
     * - scene - сцена threejs
     * - random - текущие рандомные числа
     *
     * @constructor
     * @param {HTMLElement} canvas
     * */
    constructor(canvas) {
        this.scene = new THREE.Scene()
        this.initRender(canvas)
        this.world = null
        this.fixedTimeSteps = 1.0 / 60.0
        this.dices = []
        this.random = [0, 0]
        this.bodyStack = []
        this.modelSceneStack = []
    }

    setRandomValues(arr) {
        this.random = arr
    }

    /**
     * setWorld устанавливает мир для класса
     * @params {CANNON.World} world
     * */
    setWorld(world) {
        this.world = world
    }

    /**
     * Добавляет объект в мир
     * @param {CANNON.Body} body
     * */
    addWorldBody(body) {
        if (!this.world) {
            throw new Error("initialize CANNON.World first")
        }
        this.world.add(body)
    }

    /**
     * Проверка на остановку движения кубиков
     * кубики остановленны если их угловая скорость и ускорение равно нулю
     * @return {boolean}
     * */
    isDicesStop() {
        let counter = 0;
        for (let item of this.dices) {
            if (item.isFinished()) counter++;
        }
        return counter > 1 ? true : false;
    }

    /**
     * Инициализация рендера
     * @param {HTMLElement} canvas - канвас в котором будет отрисован рендер
     * */
    initRender(canvas) {
        this.camera = new THREE.PerspectiveCamera(
            25,
            canvas.offsetWidth / canvas.offsetHeight,
            2,
            5000
        );

        this.camera.position.set(0, 0, 200);
        this.light = new THREE.DirectionalLight(0xe6e398, 2);
        this.light.position.set(10, -10, 20);
        this.light2 = new THREE.PointLight(0xe6e398, 2);
        this.light2.position.set(10, 10, -20);
        this.renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true});
        this.renderer.setClearColor(0x3d3d3d, 0);
        this.scene.add(this.camera, this.light, this.light2);
    }


    /**
     * ##clearBoard
     * clearBoard - очищает со сцены и мира добавленные экземпляры
     * */
    clearBoard() {
        for (const item of this.dices) {
            this.scene.remove(
                this.scene.getObjectByProperty("uuid", item.model.scene.uuid)
            );
            this.world.remove(item.body)
            this.dispatchModels(item.model.scene)
        }
    }

    /**
     * Очищает физические тела с мира
     * */
    clearBodies() {
        if (this.bodyStack && this.bodyStack.length < 1) {
            return
        }
        this.world.remove(this.bodyStack.pop())
        return this.clearBodies()
    }

    /**
     * Убирает модели со сцены, но не очищает с WebGL
     * */
    clearScene() {
        if (this.modelSceneStack.length < 1) {
            return;
        }
        this.scene.remove(
            this.scene.getObjectByProperty("uuid", this.modelSceneStack.pop().uuid)
        );
        return this.clearScene();
    }

    /**
     * Инициализирует модели и добавляет их на сцену
     * */
    initModels() {
    }

    _sleepCallback(item) {
        this.diceSleep += 1;
        this.updatePhysics()
        // console.log("BODY SLEEP WITH VAL", e, "VAL", item.getSide());
        this.dicesSides = this.getDicesSide()
        console.log("DICES SIDES", this.dicesSides)
        console.log("WORLD BODIES", this.world.bodies)
    }

    /**
     * Добавление модели на сцену
     * */
    addModels() {
        for (const item of this.dices) {
            const mesh = item.getSceneMesh();
            this.scene.add(item.model.scene);
            this.world.add(item.body);
            // this.scene.add(item.arrowHelper2, item.arrowHelper3);
            // item.body.addEventListener("sleep", this._sleepCallback(item))
        }
    }

    /**
     * Цикл анимации
     * */
    animate() {
        this.currentAnimation = requestAnimationFrame(this.animate.bind(this));
        this.updatePhysics();
        this.render();
    }

    stopAnimation() {
        cancelAnimationFrame(this.currentAnimation)
    }

    /**
     * Обновление координат модели в зависимости от физического тела
     * */
    updatePhysics() {
        this.world.step(this.fixedTimeSteps);
        for (const item of this.dices) {
            item.model.scene.position.copy(item.body.position)
            item.model.scene.rotation.set(item.body.rotation)
            item.model.scene.quaternion.copy(item.body.quaternion)
        }
    }

    /**
     * Обновление сцены
     * */
    updateScene() {
        this.updatePhysics()
        this.render()
    }

    /**
     * Возврщает массив с текущими сторонами двух кубиков
     * @returns {Array}
     * */
    getDicesSide() {
        let sides = [];
        for (const item of this.dices) {
            sides.push(item.getSide())
        }
        console.log("DICES SIDES", sides)
        return sides;
    }

    /**
     * Рендер
     * */
    render() {
        this.renderer.render(this.scene, this.camera)
    }

    /**
     * Возвращает натуральное число от 0 до n
     * */
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max))
    }

    /**
     * Загружает параметры броска исходя из рандомного числа
     * @param {Array} rand
     * */
    async fetchThrowParam(rand) {
        return await fetch('http://localhost:3000/position?' + new URLSearchParams({
            v1: rand[0],
            v2: rand[1]
        })).then(res => res.json())
    }

    setDices(dices) {
        if (dices) {
            if (dices instanceof Array) {
                this.dices = dices
            } else {
                throw new Error("dices must be an instance of Array")
            }
        } else {
            throw new Error("dices are undefined")
        }
    }

    /**
     * ##randomDiceThrow
     * randomDiceThrow - метод принимает в себя два параметра
     * параметр броска и массив экземпляров костей.
     * Логика броска в следующем мы получаем параметры броска и копируем в нашу модель
     * Далее синхронизирум физ. тело с моделью
     * * После копирования параметров мы будим тело, так как после приземление
     * тело находиться в покое
     * @param {Object} throwParam - содержит в себе парметры броска такие как
     * угловая скорость, ускорение, кватернион, позиция.
     * @param {Array.<Dice>} dice - массив экземпляров Dice, при каждом ходе
     * можно загружать наш массив с другими моделями, если мы этого не сделаем то
     * по умолчанию будут загружены предыдущие модели. если this.dices == undefined
     * сделает исключение
     * */
    randomDiceThrow(throwParam, dice = this.dices) {
        if (dice) this.clearBoard();
        this.setDices(dice)
        this.updatePhysics();
        this.addModels()
        for (let i = 0; i < dice.length; i++) {
            dice[i].model.scene.position.x = throwParam.modelPos[i].x;
            dice[i].model.scene.position.y = throwParam.modelPos[i].y;
            dice[i].model.scene.position.z = throwParam.modelPos[i].z;
            dice[i].model.scene.quaternion.x = throwParam.quaternion[i]._x
            dice[i].model.scene.quaternion.z = throwParam.quaternion[i]._z
            dice[i].model.scene.quaternion.y = throwParam.quaternion[i]._y
            dice[i].model.scene.quaternion.w = throwParam.quaternion[i]._w
            dice[i].updateBodyFromMesh();
            dice[i].body.velocity.set(
                throwParam.velocity[i].x,
                throwParam.velocity[i].y,
                throwParam.velocity[i].z
            );
            dice[i].body.angularVelocity.set(
                throwParam.angularVelocity[i].x,
                throwParam.angularVelocity[i].y,
                throwParam.angularVelocity[i].z,
            );
            dice[i].body.wakeUp()
        }
    }

    /**
     * Удаляет модели из WebGL и таким образом очищает память
     * Использовать при уничтожении доски
     *
     * @param {Object} scene - модель кости
     * */
    dispatchModels(scene) {
        while (scene.children.length > 0) {
            if (scene.children.length == 0) {
                this.disposeModel(scene)
            }
            return this.dispatchModels(scene.children[0])
        }
    }

    disposeModel(scene) {
        if (scene instanceof THREE.Mesh) {
            scene.geometry.dispose()
            scene.geometry = null
            scene.material.dispose()
            scene.material = null
            scene.dispose()
            scene = null
        }
    }
}

export class BoardModelSaver extends Board {
    constructor(canvas) {
        super(canvas);
    }

    randomDiceThrow(throwParam = {}, dice = this.dices) {
        this.throwOpt = {
            modelPos: [],
            velocity: [],
            angularVelocity: [],
            quaternion: [],
        };
        this.random = [];
        this.updatePhysics();
        this.clearBodies()
        this.clearScene()
        this.addModels()
        console.log("INNER DICE", dice)
        let diceValues = [];
        // Общ множитель
        let throwPower = -this.getRandomInt(30)
        for (let i = 0; i < dice.length; i++) {
            let yRand = Math.random() * 20
            dice[i].model.scene.position.x = 30 - (i % 3) * 1.5
            dice[i].model.scene.position.y = -30 + (i % 3) * 6
            dice[i].model.scene.position.z = 80 + (i % 3) * 6
            dice[i].model.scene.quaternion.x =
                ((Math.random() * 90 - 45) * Math.PI) / 180;
            dice[i].model.scene.quaternion.z =
                ((Math.random() * 90 - 45) * Math.PI) / 180;
            dice[i].updateBodyFromMesh()
            // let rand = -Math.random() * yRand;
            dice[i].body.velocity.set(
                -25 + throwPower,
                40 + yRand,
                15 + throwPower
            );
            dice[i].body.angularVelocity.set(
                this.getRandomInt(100) * Math.random() - 10,
                this.getRandomInt(100) * Math.random() - 10,
                this.getRandomInt(100) * Math.random() - 10
            );

            dice[i].body.wakeUp();

            this.throwOpt.quaternion.push(_.clone(dice[i].model.scene.quaternion));
            this.throwOpt.modelPos.push(_.clone(dice[i].model.scene.position));
            this.throwOpt.velocity.push(_.clone(dice[i].body.velocity));
            this.throwOpt.angularVelocity.push(
                _.clone(dice[i].body.angularVelocity)
            );

            let randInt = Math.floor(Math.random() * 6 + 1);
            this.random.push(randInt);
        }
    }
}
