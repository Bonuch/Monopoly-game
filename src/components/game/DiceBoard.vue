<template>
    <div>
        <Dice2dRender ref="dice2Render" :class="{'started': dice2animated}"/>
        <div id="canvas">
            <canvas ref="boardCanvas" width="654" height="654">
            </canvas>
        </div>
    </div>
</template>

<script>
import * as TEAL from '@/helpers/teal';
import * as CANNON from 'cannon';
import {dicePlugin} from '@/helpers/dice';
import {mapGetters} from 'vuex';
import {Dice} from '@/helpers/DiceModel.js';
import {Board} from '@/helpers/Board.js';
import {getModel} from '@/helpers/modelLoader.js';
import Dice2dRender from "./Dice2dRender";


export default {
    name: 'DiceBoard',
    components: { Dice2dRender },
    data() {
        return {
            playerQueue: [],
            models: {},
            images: {},
            board: null,
            dice2animated: false,
            // Временное поле потом нужно удалить
            modelsUrls: ['/design/DiceModels/premiumDices/scene.gltf', '/design/DiceModels/dice/untitled.glb'],
        }
    },
    computed: {
        ...mapGetters([
            'gameDice',
            'gamePlayers',
            'gameStore',
            'getThrowParam',
        ]),
    },
    watch: {
        // Возвращается массив рандомных чисел
        gameDice(val) {
            // this.diceStart(val);
            this.throwDice(val);
        },
    },
    methods: {
        createWorld() {
            const floorBodyMaterial = new CANNON.Material();
            const barrierBodyMaterial = new CANNON.Material();
            const world = new CANNON.World()
            world.gravity.set(0, 0, -9.82 * 50);
            world.broadphase = new CANNON.NaiveBroadphase();
            world.solver.iterations = 16;
            world.allowSleep = true

            let floorBody = new CANNON.Body({
                mass: 0,
                shape: new CANNON.Plane(),
                material: Board.floorBodyMaterial,
            });
            floorBody.STATIC = 10
            world.add(floorBody);

            // добавить стены
            let barrier;
            barrier = new CANNON.Body({
                mass: 0,
                shape: new CANNON.Plane(),
                material: barrierBodyMaterial,
            });
            barrier.quaternion.setFromAxisAngle(
                new CANNON.Vec3(1, 0, 0),
                Math.PI / 2
            );
            barrier.position.set(0, 40, 0);
            world.add(barrier);

            barrier = new CANNON.Body({
                mass: 0,
                shape: new CANNON.Plane(),
                material: barrierBodyMaterial,
            });
            barrier.quaternion.setFromAxisAngle(
                new CANNON.Vec3(1, 0, 0),
                -Math.PI / 2
            );
            barrier.position.set(0, -40, 0);
            world.add(barrier);

            barrier = new CANNON.Body({
                mass: 0,
                shape: new CANNON.Plane(),
                material: barrierBodyMaterial,
            });
            barrier.quaternion.setFromAxisAngle(
                new CANNON.Vec3(0, 1, 0),
                -Math.PI / 2
            );
            barrier.position.set(40, 0, 0);
            world.add(barrier);

            barrier = new CANNON.Body({
                mass: 0,
                shape: new CANNON.Plane(),
                material: barrierBodyMaterial,
            });
            barrier.quaternion.setFromAxisAngle(
                new CANNON.Vec3(0, 1, 0),
                Math.PI / 2
            );
            barrier.position.set(-40, 0, 0);
            world.add(barrier);

            const diceBodyMaterial = new CANNON.Material()
            world.addContactMaterial(
                new CANNON.ContactMaterial(floorBodyMaterial, diceBodyMaterial, {
                    friction: 0,
                    restitution: 0.5,
                })
            );
            world.addContactMaterial(
                new CANNON.ContactMaterial(barrierBodyMaterial, diceBodyMaterial, {
                    friction: 0.1,
                    restitution: 1.0,
                })
            );
            world.addContactMaterial(
                new CANNON.ContactMaterial(diceBodyMaterial, diceBodyMaterial, {
                    friction: 0.1,
                    restitution: 0.5,
                })
            );
            return world
        },

        throwDice(val) {
            // TODO исправить баг
            try {
                let canvas = document.querySelector('#canvas');
                this.$emit('animationStart')
                const currentPlayerDice = this.models[this.gameStore.userTurn]
                if (Array.isArray(currentPlayerDice) && Object.keys(currentPlayerDice.length)) {
                    canvas.style.opacity = '1';
                    canvas.style.visibility = 'visible';
                    this.board.randomDiceThrow(this.getThrowParam, currentPlayerDice)
                } else {
                    this.dice2animated = true
                    this.$refs.dice2Render.rollDices(currentPlayerDice.model_url, val[0], val[1], () => {
                        this.dice2animated = false
                    })
                }
                let audio = new Audio('/samples/dice_throw.ogg');
                audio.play();
                setTimeout(() => {
                    // canvas.innerHTML = "";
                    canvas.style.opacity = '0';
                    canvas.style.visibility = 'hidden';
                    this.dice2animated = false
                    this.$emit('animationEnd')
                }, 2000);
            } catch (e) {
                console.log(e)
            }
        },

        initBoard() {
            // const canvas = document.querySelector('#canvas')
            this.board = new Board(this.$refs.boardCanvas)
            this.board.setWorld(this.createWorld())
            this.board.animate()
        },

        /**
         * Нужно составить таблицу игрок: модель
         * - *Игрок*, uuid из стейта this.gamePlayers
         * - *Модель*, загруженный экземпляр костей url для загрузки взять из стейта this.gamePlayers
         * */
        async createModelMap() {
            let cntr = 0
            for (const item of this.gamePlayers) {
                // Заглушка что бы проверить разные модели после настройки магазина нужно удалить
                // const playerModelUrl = Math.floor(Math.random() * this.modelsUrls.length) // Заглушка
                if (item.dice && item.dice.render_type === 0) {
                    this.models[item.uuid] = [
                        new Dice(await getModel(item.dice.model_url)),
                        new Dice(await getModel(item.dice.model_url))
                    ]
                } else {
                    this.models[item.uuid] = item.dice
                }
                cntr++;
            }
        },

        setCanvasSize() {
            this.$refs.boardCanvas.innerWidth = document.querySelector("#canvas").innerWidth
            this.$refs.boardCanvas.innerHeight = document.querySelector("#canvas").innerHeight
        }
    },
    mounted() {
        this.setCanvasSize()
        this.initBoard()
        this.createModelMap()
    },
    beforeDestroy() {
        // добавить очистку сцены и удаление моделей
        this.board.clearBodies()
    }
}
</script>
<style lang="scss" scoped>
#canvas {
    position: absolute;
    z-index: 9999;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
    visibility: hidden;
    background-color: rgba(38, 44, 47, 0.5);
    transition: 300ms;
}
.started {
    z-index: 9999;
    background-color: rgba(38, 44, 47, 0.5);
}
</style>
