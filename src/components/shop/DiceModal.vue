<template>
    <div class="overlay">
        <div class="dice-modal">
            <canvas ref="diceShop" width="600" height="400" style="z-index: 10000"></canvas>
        </div>
    </div>
</template>

<script>
import { WebGLRenderer, Scene, PerspectiveCamera, DoubleSide, DirectionalLight, AmbientLight, Mesh, PlaneGeometry, ShadowMaterial} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
// import GUI from 'three/examples/jsm/libs/dat.gui.module';
import {getModel} from '@/helpers/modelLoader.js';

export default {
    name: "DiceModal",
    data() {
        return {
            scene: null,
            renderer: null,
            camera: null,
        }
    },
    computed: {
        model() {
            return this.$store.getters.openedDice.model_url
        }
    },
    methods: {
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
            this.renderer.setClearColor( 0x263238 );
            this.renderer.localClippingEnabled = true;

            const ground = new Mesh(
                new PlaneGeometry( 9, 9, 1, 1 ),
                new ShadowMaterial( { color: 0x000000, opacity: 0.25, side: DoubleSide } )
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
    },
    async mounted() {
        await this.initCanvas();
    }
};
</script>

<style scoped lang="scss">
.overlay {
    width: 100%;
    height: 100%;
    display: flex;
    position: fixed;
    background: rgba(#000, .5);
    backdrop-filter: blur(10px);
    z-index: 5000;
    left: 0;
    top: 0;
    justify-content: center;
    align-items: center;
}
.dice-modal {
    background: #000;
    padding: 15px;
    border-radius: 10px;
}
</style>
