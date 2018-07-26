import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ImagePicker} from '@ionic-native/image-picker';

import {ProjectProvider} from "../../providers/project/project";
import {ConfigProvider} from "../../providers/config/config";
import {MapComponent} from "../../components/map/map";
import {ModalProvider} from "../../providers/modal/modal";

/**
 * Generated class for the ProjectDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-project-details',
    templateUrl: 'project-details.html'
})

export class ProjectDetailsPage {

    projectId: string = '';
    projectName: string = '';

    images: Array<any> = [];

    username: string = window.localStorage.getItem('username') || '';
    password: string = window.localStorage.getItem('password') || '';

    // processModal: boolean = false;
    settingsVisible: boolean = false;
    infoVisible: boolean = false;

    exported: boolean = false;
    exportAlertVisible: boolean = false;

    color: string = 'red';

    customTriplets: boolean = false;

    settings: any = {};

    @ViewChild(MapComponent) map:MapComponent;

    constructor(public navCtrl: NavController, public navParams: NavParams, private imagePicker: ImagePicker, public prjProvider: ProjectProvider, public config: ConfigProvider, public modal: ModalProvider) {

        this.projectId = this.navParams.get('_id');
        this.projectName = this.navParams.get('name');

        this.settings.resolution = '4k';

        // let images = this.navParams.get('images');

    }

    load(): void {

        this.prjProvider.get(this.projectId).subscribe(
            (res: any) => {
                console.log('LOAD', res);

                if(res.status) {

                    if(res.project.processing) {
                        this.modal.showProcessingModal();
                    } else {
                        this.modal.hideProcessingModal();
                    }

                    this.exported = res.project.exported;

                    let images = res.project.images;

                    for (let i = 0, length = images.length; i < length; i++) {

                        let item = {
                            name: images[i].name,
                            url: this.config.serverUrl + 'uploads/sauto/' + this.projectId + '/lowres/' + images[i].name,
                            position: images[i].position

                        };

                        this.images.push(item);

                    }

                    this.redrawMap(false);

                }

                // console.log(this.projectId, this.projectName, this.images);

            },
            (error) => {
                console.log(error)
            }
        )

    }

    showSettings(): void {

        this.settingsVisible = !this.settingsVisible;

    }

    showInfo(): void {

        this.infoVisible = !this.infoVisible;

    }

    triplePick(): void {

        if(this.customTriplets) {

            this.customTriplets = false;
            this.map.triplePick(this.customTriplets);

        } else {

            this.customTriplets = true;
            this.map.triplePick(this.customTriplets);

        }

    }

    calculate_old(): void {

        this.modal.showProcessingModal();

        this.prjProvider.calculate(this.projectId).subscribe(
            (res: any) => {

                this.modal.hideProcessingModal();

                alert('Calculations Done');

                console.log(res);

            },
            (error) => {
                console.log(error)
            }
        );

    }

    calculate(): void {
        const triplets = [];

        for (let i = 0, length = this.map.highlighted.length; i < length; i++) {

            triplets.push(this.map.highlighted[i].pano);

        }

        console.log(triplets);
    }

    exportInit(): void {

        if(this.exported) {
            this.exportAlertVisible = true;
        } else {
            this.export();
        }

    }

    export(): void {

        this.modal.showProcessingModal();

        this.prjProvider.export(this.projectId, this.username, this.password, this.settings).subscribe(
            (res: any) => {

                this.modal.hideProcessingModal();

                this.exported = true;

                alert('Export Success');

                console.log(res);

            },
            (error) => {
                console.log(error)
            }
        );

    }

    onImageChange(event: any): void {

        let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
        let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
        let files: FileList = target.files;
        let file = files[0];

        const name = file.name.toLowerCase();

        let found = false;

        for (let i = 0, length = this.images.length; i < length; i++) {
            const image = this.images[i];

            if(image.name === name) {
                found = true;
            }
        }

        if(file && !found) {

            const reader = new FileReader();

            reader.readAsDataURL(file);
            reader.onload = () => {

                let value = reader.result;

                const data = {
                    fullname: name,
                    data: value
                };

                this.uploadImage(data);

            };

        }

        if(found) {
            alert('Image Duplicate!');
        }

    }

    selectImage(): void {

        // const obj = new Image();
        //
        // obj.crossOrigin = 'anonymous';
        //
        // obj.onload = () => {
        //     this.uploadImage(obj);
        // };
        //
        // obj.src = 'https://iso.500px.com/wp-content/uploads/2015/11/photo-129299193.jpg';

        this.imagePicker.getPictures({maximumImagesCount: 1}).then((results) => {
            console.log(results);

            for (let i = 0; i < results.length; i++) {

                const obj = new Image();

                obj.onload = () => {

                    console.log('loaded');

                    this.uploadImage(obj);

                };

                obj.src = results[i];

                console.log('Image URI: ' + results[i]);
            }
        }, (err) => {

        });

    }

    uploadImage(image: any): void {

        const data = image.data;

        const fullname = image.fullname;

        console.log(fullname);

        const triplets = [];

        for (let i = 0, length = this.map.highlighted.length; i < length; i++) {

            triplets.push(this.map.highlighted[i].pano);

        }

        const info = {
            data: data,
            fullname: fullname,
            triplets: triplets,
            settings : this.settings
        };

        this.modal.showProcessingModal();

        this.prjProvider.upload(this.projectId, info).subscribe(
            (res: any) => {

                if(res.success) {

                    let item = {
                        name: fullname,
                        url: this.config.serverUrl + 'uploads/sauto/' + this.projectId + '/' + fullname,
                        position: res.position
                    };

                    this.images.push(item);

                    this.redrawMap(true);

                    this.modal.hideProcessingModal();

                } else {
                    console.log('unstable solution');

                    this.modal.hideProcessingModal();

                    alert('unstable solution');
                }

                console.log(res);
            },
            (error) => {
                this.modal.hideProcessingModal();
                console.log(error)
            }
        );

    }

    removePanoEvent(point: any): void {

        let index = null;
        let image = {
            name: point
        };

        for (let i = 0, length = this.images.length; i < length; i++) {

            if(this.images[i].name === point) {
                index = i;
            }

        }

        if(index) {
            this.removeImage(image, index);
        }

    }

    removeImage(image, index): void {

        this.prjProvider.deleteImage(this.projectId, image.name).subscribe(
            (res: any) => {
                console.log(res);

                if(res.success) {
                    this.images.splice(index,1);

                    this.redrawMap(false);
                }

            },
            (error) => {
                console.log(error)
            }
        );

    }

    redrawMap(flag: boolean) {
        this.map.load(this.images, this.projectId, flag);
    }

    ionViewDidEnter() {

        this.map.initScene();

        this.load();

    }
}
