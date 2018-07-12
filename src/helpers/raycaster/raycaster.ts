declare var THREE: any;

export class Raycaster {

    private camera: any;
    private renderer: any;

    private raycaster: any;

    constructor(camera, renderer) {
        this.camera = camera;
        this.renderer = renderer;

        this.raycaster = new THREE.Raycaster();
    }

    hit(event, object, done, recursive = true) {

        let pointer = event.changedTouches ? event.changedTouches[0] : event;

        let rect = this.renderer.domElement.getBoundingClientRect();

        let mouse = new THREE.Vector2(
            ((pointer.clientX - rect.left) / rect.width) * 2 - 1,
            -((pointer.clientY - rect.top) / rect.height) * 2 + 1
        );

        let origin = new THREE.Vector3();
        let direction = new THREE.Vector3();

        let intersects = null;

        this.camera.updateMatrixWorld();

        if (this.camera instanceof THREE.PerspectiveCamera || this.camera.inPerspectiveMode) {
            origin.setFromMatrixPosition(this.camera.matrixWorld);
            direction.set(mouse.x, mouse.y, 0.5).unproject(this.camera).sub(origin).normalize();
        } else if (this.camera instanceof THREE.OrthographicCamera || this.camera.inOrthographicMode) {
            origin.set(mouse.x, mouse.y, (this.camera.near + this.camera.far) / (this.camera.near - this.camera.far)).unproject(this.camera); // set origin in plane of camera
            direction.set(0, 0, -1).transformDirection(this.camera.matrixWorld);
        } else {
            console.warn('Unsupported camera');
        }

        this.raycaster.set(origin, direction);

        if (Array.isArray(object)) {
            intersects = this.raycaster.intersectObjects(object, recursive);
        } else {
            intersects = this.raycaster.intersectObject(object, recursive);
        }

        done(intersects);
    }
}
