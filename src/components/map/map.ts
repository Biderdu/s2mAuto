import {Component, Output, ElementRef, EventEmitter} from '@angular/core';

import {Raycaster} from '../../helpers/raycaster/raycaster';

import {ConfigProvider} from "../../providers/config/config";

declare var THREE: any;
declare var TWEEN: any;

// import * as THREE from '../../assets/three/three.module';

// import { THREE } from 'three';
// import { OrbitControls } from 'three-orbitcontrols-ts';


/**
 * Generated class for the MapComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'map',
    templateUrl: 'map.html'
})

export class MapComponent {

    @Output() private panoRemoveEvent = new EventEmitter<string>();

    private projectId: string;

    private element: any;

    private width: number = 200;
    private height: number = 200;

    private rendererWidth: number = 200;
    private rendererHeight: number = 200;

    private scene: any;
    private renderer: any;
    private camera: any;
    private controls: any;

    private state: string = 'map';

    private planeGrid: any;
    private pointsContainer: any;
    private aurasContainer: Array<any> = [];

    public highlighted: Array<any> = [];

    private pointGeometry: any;
    private pointAuraGeometry: any;
    // private pointMaterial: any;
    private pointAuraMaterial: any;

    private points: Array<any> = [];

    private raycaster: any;

    private customTriplets: boolean = false;

    // private showMapButton: boolean = false;

    private holdTimer: any;
    private holdPreviewTimer: any;

    private panoBall: any;
    private panoBallMaterial: any;

    constructor(private elementRef: ElementRef, private config: ConfigProvider) {

        this.element = this.elementRef.nativeElement;

        this.pointGeometry = new THREE.CircleGeometry(2, 16);
        this.pointAuraGeometry = new THREE.CircleGeometry(6, 16);
        // this.pointMaterial = new THREE.MeshBasicMaterial({color: 0xee2222, side: THREE.FrontSide});
        this.pointAuraMaterial = new THREE.MeshBasicMaterial({color: 0xee2222, visible: false, side: THREE.FrontSide});

    }

    initScene(): void {

        // const canvas = document.createElement('canvas');

        // el.appendChild(canvas);

        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;


        this.rendererHeight = 400;
        this.rendererWidth = this.rendererHeight * (this.width/this.height);

        // console.log(this.width, this.height, this.rendererWidth, this.rendererHeight);

        // Scene
        this.scene = new THREE.Scene();
        this.scene.name = 'Scene';

        //Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setClearColor(0x565656, 1.0);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.rendererWidth, this.rendererHeight);

        this.element.appendChild(this.renderer.domElement);

        //Camera
        // this.camera = new THREE.OrthographicCamera( this.width / - 2, this.width / 2, this.height / 2, this.height / - 2, 0.00001, 100000 );
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 100000);
        this.camera.name = 'Camera';
        this.camera.position.set(0, 150, 0);

        this.raycaster = new Raycaster(this.camera, this.renderer);

        //Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.device = false;
        this.controls.inverse = true;
        this.controls.enableRotate = true;

        this.controls.maxPolarAngle = Math.PI / 3;
        this.controls.minPolarAngle = 0;

        this.controls.enablePan = true;
        this.controls.enableZoom = true;
        this.controls.enableDamping = false;
        this.controls.target.set(0, 0, 0);
        this.controls.update();

        this.render();

        this.pointsInit();

        this.floorInit();

        this.createPanoball();

        this.listener();

        // this.load([]);

    }

    //init
    pointsInit(): void {

        this.pointsContainer = new THREE.Object3D();
        this.pointsContainer.name = 'pointsContainer';

        this.scene.add(this.pointsContainer);

    }

    floorInit(): void {
        this.planeGrid = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(1200, 1200, 10, 10)
        );

        new THREE.TextureLoader().load('assets/imgs/grid.png', (text) => {
            text.wrapS = text.wrapT = THREE.RepeatWrapping;
            text.offset.set(0, 0);
            text.repeat.set(60, 60);

            text.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

            this.planeGrid.material = new THREE.MeshBasicMaterial({
                map: text,
                transparent: true,
                side: THREE.FrontSide
            });

            this.planeGrid.material.map.needsUpdate = true;
            this.planeGrid.material.needsUpdate = true;

            this.scene.add(this.planeGrid);
        });

        this.planeGrid.name = 'floor';

        this.planeGrid.rotation.set(-Math.PI / 2, 0, 0);

        this.planeGrid.position.y = -1;
    }

    createPanoball(): void {

        const geometry = new THREE.SphereBufferGeometry(50, 32, 32);
        this.panoBallMaterial = new THREE.MeshBasicMaterial({side: THREE.BackSide})

        this.panoBall = new THREE.Mesh(geometry, this.panoBallMaterial);

        this.panoBall.scale.set(-1, 1, 1);

        // this.scene.add(this.panoBall);

    }

    load(points: Array<any>, id: string, flag: boolean): void {

        this.projectId = id;

        this.highlighted.length = 0;
        this.points.length = 0;

        console.log(points);

        for (let i = 0, length = points.length; i < length; i++) {
            this.points.push(points[i]);
        }

        this.drawScene(flag);

    }
    //

    drawScene(flag: boolean): void {

        this.clearScene();

        for (let i = 0, length = this.points.length; i < length; i++) {

            let pano = this.points[i];

            let point = this.createPoint();

            point.pano = pano.name;

            point.position.x = pano.position.x * 25;
            // point.position.y = pano.position.y * 25;
            point.position.z = pano.position.z * 25;

            this.pointsContainer.add(point);

            this.aurasContainer.push(point.aura);

        }

        console.log(flag);

        if(flag) {

            let length = this.pointsContainer.children.length;

            if(length > 0) {
                let position = this.pointsContainer.children[length - 1].position;

                console.log(position);

                this.camera.position.x = position.x;
                this.camera.position.y = position.y + 150;
                this.camera.position.z = position.z;

                this.controls.target.x = position.x;
                this.controls.target.y = position.y;
                this.controls.target.z = position.z;
            }

        }

    }

    clearScene(): void {

        this.aurasContainer.length = 0;

        for (let i = this.pointsContainer.children.length - 1; i >= 0; i--) {
            this.pointsContainer.remove(this.pointsContainer.children[i]);
        }

    }

    createPoint(): any {

        const point = new THREE.Mesh(this.pointGeometry, new THREE.MeshBasicMaterial({color: 0xee2222, side: THREE.FrontSide}));
        point.name = 'point';

        point.rotation.set(-Math.PI / 2, 0, 0);

        const aura = new THREE.Mesh(this.pointAuraGeometry, this.pointAuraMaterial);
        aura.name = 'aura';

        aura.position.set(0, 0, -0.5);

        aura.point = point;
        point.aura = aura;

        point.add(aura);

        return point;

    }

    //listeners
    listener(): void {

        this.renderer.domElement.addEventListener('mousedown', (event) => {
            this.mouseDown(event);
        }, false);

        this.renderer.domElement.addEventListener('touchstart', (event) => {
            this.mouseDown(event);
        }, false);


         this.renderer.domElement.addEventListener('mousemove', (event) => {
            this.mouseMove(event);
        }, false);

        this.renderer.domElement.addEventListener('touchmove', (event) => {
            this.mouseMove(event);
        }, false);


        this.renderer.domElement.addEventListener('mouseup', (event) => {
            this.mouseUp(event);
        }, false);

        this.renderer.domElement.addEventListener('touchend', (event) => {
            this.mouseUp(event);
        }, false);

    }

    mouseDown(event: any): void {

        if(this.state === 'map') {

            this.pointSelect(event);

        } else if(this.state === 'preview') {

            // this.holdPreviewTimer = setTimeout(() => {
            //     this.previewRemove()
            // },1500);

        }


    }

    mouseUp(event: any): void {

        if(this.holdTimer) {
            clearTimeout(this.holdTimer);
        }

        if(this.holdPreviewTimer) {
            clearTimeout(this.holdPreviewTimer);
        }

        this.pointsIntersect(event);

    }

    mouseMove(event: any): void {

        if(this.state === 'map') {

            this.raycaster.hit(event, this.aurasContainer, (intersects) => {

                if (!intersects.length) {
                    if(this.holdTimer) {
                        clearTimeout(this.holdTimer);
                    }

                    return;
                }

            });

        }

    }

    //

    pointSelect(event: any): void {

        this.raycaster.hit(event, this.aurasContainer, (intersects) => {

            if (!intersects.length) {
                return;
            }

            let intersect = intersects[0].object.point;

            this.holdTimer = setTimeout(() => {
                this.pointPreview(intersect)
            },1500);

        });

    }

    pointPreview(point: any): void {

        this.state = 'preview';

        this.panoBall.position.set(point.position.x, point.position.y + 50, point.position.z);

        this.panoBall.pano = point.pano;

        const image = new Image();

        image.crossOrigin = 'anonymous';

        const add = '?time=' + Date.now();

        const src = this.config.serverUrl + 'uploads/sauto/' + this.projectId + '/midres/' + point.pano + add;

        this.scene.add(this.panoBall);

        let start = {x: 0};
        let target = {x: 1};

        let cameraStart = this.camera.position.clone();
        let cameraDistance = new THREE.Vector3(this.panoBall.position.x - cameraStart.x, this.panoBall.position.y - cameraStart.y, this.panoBall.position.z - cameraStart.z);

        let targetStart = this.controls.target.clone();
        let targetDistance = new THREE.Vector3(this.panoBall.position.x - targetStart.x, this.panoBall.position.y - targetStart.y, this.panoBall.position.z + 1 - targetStart.z);


        let duration = 1000;

        let transition = new TWEEN.Tween(start).to(target, duration)
            .easing(TWEEN.Easing.Linear.None)
            .onStart(() => {

            }).onUpdate((alpha) => {

                this.camera.position.x = cameraStart.x + (alpha.x * cameraDistance.x);
                this.camera.position.y = cameraStart.y + (alpha.x * cameraDistance.y);
                this.camera.position.z = cameraStart.z + (alpha.x * cameraDistance.z);

                this.controls.target.x = targetStart.x + (alpha.x * targetDistance.x);
                this.controls.target.y = targetStart.y + (alpha.x * targetDistance.y);
                this.controls.target.z = targetStart.z + (alpha.x * targetDistance.z);

            }).onComplete(() => {
                transition.stop();
            }).onStop(() => {
                this.controls.maxPolarAngle = Math.PI;
            });


        image.onload = () => {
            this.panoBallMaterial.map = new THREE.Texture(image);
            this.panoBallMaterial.map.needsUpdate = true;
            this.panoBallMaterial.needsUpdate = true;

            transition.start();
        }

        image.src = src;


    }

    hidePreview(): void {

        let start = {x: 0};
        let target = {x: 1};

        let cameraStart = this.camera.position.clone();
        let cameraDistance = new THREE.Vector3(0, 150 - cameraStart.y, 0);

        let targetStart = this.controls.target.clone();
        let targetDistance = new THREE.Vector3(0 , 0 - targetStart.y, 0);

        let duration = 1000;

        let transition = new TWEEN.Tween(start).to(target, duration)
            .easing(TWEEN.Easing.Linear.None)
            .onStart(() => {

            }).onUpdate((alpha) => {

                this.camera.position.x = cameraStart.x + (alpha.x * cameraDistance.x);
                this.camera.position.y = cameraStart.y + (alpha.x * cameraDistance.y);
                this.camera.position.z = cameraStart.z + (alpha.x * cameraDistance.z);

                this.controls.target.x = targetStart.x + (alpha.x * targetDistance.x);
                this.controls.target.y = targetStart.y + (alpha.x * targetDistance.y);
                this.controls.target.z = targetStart.z + (alpha.x * targetDistance.z);

            }).onComplete(() => {
                transition.stop();
            }).onStop(() => {
                this.controls.maxPolarAngle = Math.PI/3;
            });

        this.previewRemove();

        transition.start();

    }

    removePanoEvent(): void {
        const pano = this.panoBall.pano;

        this.panoRemoveEvent.next(pano);

        this.hidePreview();
    }

    previewRemove(): void {

        if(this.panoBallMaterial.map) {
            this.panoBallMaterial.map.dispose()
            this.panoBallMaterial.map = null;
            this.panoBallMaterial.needsUpdate = true;
        }


        this.scene.remove(this.panoBall);

        this.state = 'map';

    }

    pointsIntersect(event: any): void {

        if(this.customTriplets && this.state === 'map') {

            this.raycaster.hit(event, this.aurasContainer, (intersects) => {

                if (!intersects.length) {
                    return;
                }

                let intersect = intersects[0].object.point;

                let found = false;

                for (let i = 0, length = this.highlighted.length; i < length; i++) {

                    if(this.highlighted[i].pano === intersect.pano) {
                        found = true;
                    }

                }

                if(!found) {
                    this.highlighted.push(intersect);
                }

                if(this.highlighted.length > 2) {
                    this.highlighted.shift();
                }

                this.pointsHiglight();

            })

        }


    }

    pointsHiglight(): void {

        for (let i = 0, length = this.pointsContainer.children.length; i < length; i++) {

            this.pointsContainer.children[i].material.color.setHex(0xee2222);

        }

        for (let i = 0, length = this.highlighted.length; i < length; i++) {

            this.highlighted[i].material.color.setHex(0x22ee22);

        }




    }

    triplePick(state: boolean): void {

        this.customTriplets = state;

        if(!this.customTriplets) {
            this.highlighted.length = 0;
        }

        this.pointsHiglight();

    }

    test(): void {

        this.clearScene();

    }

    render(): void {
        this.renderer.clear();

        this.renderer.render(this.scene, this.camera);

        window.requestAnimationFrame(() => {
            TWEEN.update();
            this.controls.update();

            this.render();
        });
    }

}
