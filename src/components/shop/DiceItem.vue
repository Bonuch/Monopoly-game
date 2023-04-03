<template>
    <div class="box-item">
        <div class="item-content">
            <canvas ref="diceShop" width="260" height="200"></canvas>
        </div>
<!--        <div><a class="load-dice" @click.prevent="loadDiceModel(item)">Просмотреть</a></div>-->
        <div class="item-actions">
            <button class="dollar"
                    v-if="item.price_bucks && !item.was_bought"
                    @click="askBuyItem(item, 'bucks')"
            >
                {{ item.price_bucks }}<img src="/design/icons/currencies/black21.png" alt="#">
            </button>
            <!--        <button class="bitcoin"-->
            <!--                v-if="item.price_crypto && !item.was_bought"-->
            <!--                @click="askBuyItem(item, 'crypto')"-->
            <!--        >-->
            <!--            {{ item.price_crypto }}B-->
            <!--        </button>-->
            <div class="label" v-if="item.was_bought">
                {{ $t('SHOP.Куплено') }}
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex/dist/vuex.esm.browser";
import {getModel} from '@/helpers/modelLoader.js';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import {
    AmbientLight,
    DirectionalLight, DoubleSide,
    Mesh,
    PerspectiveCamera,
    PlaneGeometry,
    Scene,
    ShadowMaterial,
    WebGLRenderer,
} from "three";

export default {
    name: "DiceItem",
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            modelData: null,
            scene: null,
            renderer: null,
            camera: null,
        }
    },
    async mounted() {
        await this.fetchDiceModel()
    },
    computed: {
        model() {
            return this.modelData.model_url
        }
    },
    methods: {
        ...mapActions(['loadDiceModel']),
        async fetchDiceModel() {
            await this.$socket.client.emit('load_dice_model', this.item, (response) => {
                if (!response.error && response) {
                    console.log('000000000000', response);
                    this.modelData = response
                    this.initCanvas()
                    // commit('setOpenedDice', response);
                }
            });
        },
        async initCanvas() {
            const canvas = this.$refs.diceShop

            // let camera, scene, renderer;
            //
            // const params = {
            //     clipIntersection: true,
            //     planeConstant: 0,
            //     showHelpers: false
            // };
            //
            // const clipPlanes = [
            //     new THREE.Plane( new THREE.Vector3( 1, 0, 0 ), 0 ),
            //     new THREE.Plane( new THREE.Vector3( 0, - 1, 0 ), 0 ),
            //     new THREE.Plane( new THREE.Vector3( 0, 0, - 1 ), 0 )
            // ];
            //
            // renderer = new THREE.WebGLRenderer( {canvas, antialias: true } );
            // renderer.setPixelRatio( window.devicePixelRatio );
            // renderer.setSize( window.innerWidth, window.innerHeight );
            // renderer.localClippingEnabled = true;
            // // document.body.appendChild( renderer.domElement );
            //
            // scene = new THREE.Scene();
            //
            // camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 200 );
            //
            // camera.position.set( - 1.5, 2.5, 3.0 );
            //
            // const controls = new OrbitControls( camera, renderer.domElement );
            // controls.addEventListener( 'change', renderer.render ); // use only if there is no animation loop
            // controls.minDistance = 1;
            // controls.maxDistance = 10;
            // controls.enablePan = false;
            //
            // const light = new THREE.HemisphereLight( 0xffffff, 0x080808, 1.5 );
            // light.position.set( - 1.25, 1, 1.25 );
            // scene.add( light );
            //
            // // const helper = new THREE.CameraHelper( light.shadow.camera );
            // // scene.add( helper );
            //
            // //
            //
            // const group = new THREE.Group();
            //
            // for ( let i = 1; i <= 30; i += 2 ) {
            //
            //     const geometry = new THREE.SphereGeometry( i / 30, 48, 24 );
            //
            //     const material = new THREE.MeshLambertMaterial( {
            //
            //         color: new THREE.Color().setHSL( Math.random(), 0.5, 0.5 ),
            //         side: THREE.DoubleSide,
            //         clippingPlanes: clipPlanes,
            //         clipIntersection: params.clipIntersection
            //
            //     } );
            //
            //     group.add( new THREE.Mesh( geometry, material ) );
            //
            // }
            //
            // scene.add( group );
            //
            // // helpers
            //
            // const helpers = new THREE.Group();
            // // helpers.add( new THREE.PlaneHelper( clipPlanes[ 0 ], 2, 0xff0000 ) );
            // // helpers.add( new THREE.PlaneHelper( clipPlanes[ 1 ], 2, 0x00ff00 ) );
            // // helpers.add( new THREE.PlaneHelper( clipPlanes[ 2 ], 2, 0x0000ff ) );
            // // helpers.visible = false;
            // scene.add( helpers );
            //
            // // gui
            //
            // // const gui = new GUI();
            // //
            // // gui.add( params, 'clipIntersection' ).name( 'clip intersection' ).onChange( function ( value ) {
            // //
            // //     const children = group.children;
            // //
            // //     for ( let i = 0; i < children.length; i ++ ) {
            // //
            // //         children[ i ].material.clipIntersection = value;
            // //
            // //     }
            // //
            // //     // render();
            // //
            // // } );
            // //
            // // gui.add( params, 'planeConstant', - 1, 1 ).step( 0.01 ).name( 'plane constant' ).onChange( function ( value ) {
            // //
            // //     for ( let j = 0; j < clipPlanes.length; j ++ ) {
            // //
            // //         clipPlanes[ j ].constant = value;
            // //
            // //     }
            // //
            // //     render();
            // //
            // // } );
            // //
            // // gui.add( params, 'showHelpers' ).name( 'show helpers' ).onChange( function ( value ) {
            // //
            // //     helpers.visible = value;
            // //
            // //     render();
            // //
            // // } );
            //
            // renderer.render(camera, scene)
            // //
            // // window.addEventListener( 'resize', onWindowResize );

            this.scene = new Scene();


            this.camera = new PerspectiveCamera( 40,
                canvas.offsetWidth / canvas.offsetHeight,
                10,
                5000 );
            this.camera.position.set( 100, 50, 50 );

            this.scene.add( new AmbientLight( 0xffffff, 0.5 ) );

            const dirLight = new DirectionalLight( 0xffffff, 1 );
            dirLight.position.set( 5, 10, 7.5 );
            dirLight.castShadow = true;
            dirLight.shadow.camera.right = 2;
            dirLight.shadow.camera.left = - 2;
            dirLight.shadow.camera.top	= 2;
            dirLight.shadow.camera.bottom = - 2;

            dirLight.shadow.mapSize.width = 1024;
            dirLight.shadow.mapSize.height = 1024;
            this.scene.add( dirLight );

            this.renderer = new WebGLRenderer( {canvas, antialias: true } );
            this.renderer.shadowMap.enabled = true;
            this.renderer.setPixelRatio( window.devicePixelRatio );
            // renderer.setSize( window.innerWidth, window.innerHeight );
            // this.renderer.setClearColor( 0x000000 );
            this.renderer.localClippingEnabled = true;

            const ground = new Mesh(
                new PlaneGeometry( 9, 9, 1, 1 ),
                new ShadowMaterial( { color: 0x000000, opacity: 0.5, side: DoubleSide } )
            );

            ground.rotation.x = - Math.PI / 2; // rotates X/Y to X/Z
            ground.position.y = - 1;
            ground.receiveShadow = true;
            this.scene.add( ground );



            const model = await getModel(this.model)
            this.scene.add(this.camera, model.scene);



            const controls = new OrbitControls( this.camera, this.renderer.domElement );
            controls.addEventListener('change', this.render)
            controls.minDistance = 20;
            controls.maxDistance = 30;
            controls.update();


            // debugger
            // this.scene = new THREE.Scene()
            // this.scene.background = new THREE.Color( 0xa0a0a0 );
            // const camera = new THREE.PerspectiveCamera(
            //     250,
            //     canvas.offsetWidth / canvas.offsetHeight,
            //     2,
            //     50000
            // );
            // this.scene.add( new THREE.AmbientLight( 0xffffff, 0.5 ) );
            // camera.position.set( - 1, 2, 3 );
            // // const light = new THREE.DirectionalLight(0xe6e398, 2);
            // // light.position.set(10, -10, 20);
            // // const light2 = new THREE.PointLight(0xe6e398, 2);
            // // light2.position.set(10, 10, -20);
            // const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
            // const dirLight = new THREE.DirectionalLight( 0xffffff );
            // dirLight.position.set( 3, 10, 10 );
            // dirLight.castShadow = true;
            // dirLight.shadow.camera.top = 2;
            // dirLight.shadow.camera.bottom = - 2;
            // dirLight.shadow.camera.left = - 2;
            // dirLight.shadow.camera.right = 2;
            // dirLight.shadow.camera.near = 0.1;
            // dirLight.shadow.camera.far = 40;
            //
            // hemiLight.position.set( 0, 20, 0 );
            // const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: false});
            // // renderer.setClearColor(0x3d3d3d, 0);
            // renderer.outputEncoding = THREE.sRGBEncoding;
            // renderer.shadowMap.enabled = true;
            //
            // const controls = new OrbitControls( camera, renderer.domElement );
            // controls.enablePan = false;
            // controls.enableZoom = false;
            // controls.target.set( 0, 1, 0 );
            // controls.update();

            // const model = await getModel(this.model)
            // this.scene.add(model.scene);
            // this.scene.add(camera, hemiLight, dirLight);
        },
        render() {
            this.renderer.render(this.scene, this.camera)
        }
    }
};
</script>

<style lang="scss" scoped>
canvas {
    display: block;
}
.load-dice {
    padding: 5px;
    display: block;
    cursor: pointer;
    color: #fff;
    background: var(--purple-dark);
}
.box__description {
    width: 100%;

    p {
        text-align: left;
        font-size: 16px;
        font-weight: 600;
    }
}

.box-include__list {
    margin: 0;
    padding: 0;
    list-style: none;
    text-align: left;

    li {
        padding: 0;
        margin: 0;
        color: #797979;
    }
}

.title__container {
    min-height: 40px;
}

.box-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: rgba(0, 0, 0, 0.9);
    border-radius: 5px;
    border: 2px solid var(--color-background-2);
    width: 264px;
    //height: 200px;
    margin: 0 10px 15px 10px;
    position: relative;
    box-shadow: 0px 6px 4px rgba(0, 0, 0, 0.16);
    transition: transform .9s;
    transition: .1s;

    &:hover img {
        transition: .1s;
        -webkit-filter: drop-shadow(5px 1px 7px rgba(125, 0, 255, 0.5));
        filter: drop-shadow(5px 1px 7px rgba(125, 0, 255, 0.5));
        transform: scale(1.1)

    }

    .item-content {
        //height: calc(100% - 30px);
        //padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        color: #ddd;
        width: 100%;
        height: 100%;

        span {
            font-weight: bold;
        }
    }

    .item-actions {
        display: flex;
        position: relative;
        bottom: 0;
        button {
            display: block;
            bottom: 0;
            width: 100%;
            background: #323639;
            border: none;
            color: white;
            cursor: pointer;
            padding: 10px 20px;
            font-weight: 600;
            font-size: 16px;

            &:focus {
                outline: none !important;
            }

            &::-moz-focus-inner {
                border: 0;
            }

            &:not(:only-child) {
                width: 50%;
            }

            &:only-child {
                /* background-color: red !important; */
                border-radius: 0 0 3px 3px;
            }

            &:not(:only-child):first-child {
                border-right: solid 1px darken(#323639, 4);
                border-bottom-left-radius: 3px;
            }

            &:not(:only-child):last-child {
                border-bottom-right-radius: 3px;
            }

            &:not(:only-child) {
                width: 50%;
            }

            &.dollar {
                display: flex;
                align-items: center;
                justify-content: center;
                left: 0;
            }

            &.bitcoin {
                right: 0;
            }

            &.dollar:hover {
                background: #16964B;
            }

            &.bitcoin:hover {
                background: #4B1696;
            }
        }

        .label {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 25px;
            background: #989b9c;
            color: white;
            cursor: default;
            line-height: 24px;
            border-radius: 0 0 5px 5px;
        }
    }
}
</style>
