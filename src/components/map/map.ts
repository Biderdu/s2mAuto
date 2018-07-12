import {Component, Input, ElementRef} from '@angular/core';

import {Raycaster} from '../../helpers/raycaster/raycaster';

declare var THREE: any;

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

    @Input() color: string;

    private element: any;

    private width: number = 200;
    private height: number = 200;

    private scene: any;
    private renderer: any;
    private camera: any;
    private controls: any;

    private planeGrid: any;
    private pointsContainer: any;

    public highlighted: Array<any> = [];

    private pointGeometry: any;
    // private pointMaterial: any;

    private points: Array<any> = [];

    private raycaster: any;

    private customTriplets: boolean = false;

    constructor(private elementRef: ElementRef) {

        this.element = this.elementRef.nativeElement;

        this.pointGeometry = new THREE.CircleGeometry(2, 16);
        // this.pointMaterial = new THREE.MeshBasicMaterial({color: 0xee2222, side: THREE.FrontSide});

    }

    initScene(): void {

        // const canvas = document.createElement('canvas');

        // el.appendChild(canvas);

        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;

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
        this.renderer.setSize(this.width, this.height);

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
            new THREE.PlaneBufferGeometry(400, 400, 10, 10)
        );

        new THREE.TextureLoader().load('assets/imgs/grid.png', (text) => {
            text.wrapS = text.wrapT = THREE.RepeatWrapping;
            text.offset.set(0, 0);
            text.repeat.set(20, 20);

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

    load(points: Array<any>): void {

        this.highlighted.length = 0;
        this.points.length = 0;

        console.log(points);

        for (let i = 0, length = points.length; i < length; i++) {


            this.points.push(points[i]);

        }

        this.drawScene();

    }
    //

    drawScene(): void {

        this.clearScene();

        for (let i = 0, length = this.points.length; i < length; i++) {

            let pano = this.points[i];

            let point = this.createPoint();

            point.pano = pano.name;

            point.position.x = pano.position.x * 25;
            // point.position.y = pano.position.y * 25;
            point.position.z = pano.position.z * 25;

            this.pointsContainer.add(point);

        }

    }

    clearScene(): void {

        for (let i = this.pointsContainer.children.length - 1; i >= 0; i--) {
            this.pointsContainer.remove(this.pointsContainer.children[i]);
        }

    }

    createPoint(): any {

        const point = new THREE.Mesh(this.pointGeometry, new THREE.MeshBasicMaterial({color: 0xee2222, side: THREE.FrontSide}));

        point.rotation.set(-Math.PI / 2, 0, 0);

        return point;

    }


    listener(): void {

        this.renderer.domElement.addEventListener('mouseup', (event) => {
            this.pointsIntersect(event);
        }, false);

        this.renderer.domElement.addEventListener('touchend', (event) => {
            this.pointsIntersect(event);
        }, false);

    }

    pointsIntersect(event: any) {

        if(this.customTriplets) {

            this.raycaster.hit(event, this.pointsContainer.children, (intersects) => {

                if (!intersects.length) {
                    return;
                }

                let intersect = intersects[0].object;

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
            this.controls.update();

            this.render();
        });
    }

}
