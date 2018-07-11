import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ImagePicker} from '@ionic-native/image-picker';

import {ProjectProvider} from "../../providers/project/project";
import {ConfigProvider} from "../../providers/config/config";
import {MapComponent} from "../../components/map/map";

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

    processModal: boolean = false;

    color: string = 'red';

    @ViewChild(MapComponent) map:MapComponent;

    constructor(public navCtrl: NavController, public navParams: NavParams, private imagePicker: ImagePicker, public prjProvider: ProjectProvider, public config: ConfigProvider) {

        this.projectId = this.navParams.get('_id');
        this.projectName = this.navParams.get('name');

        // let images = this.navParams.get('images');

        this.load();

    }

    load(): void {

        this.prjProvider.get(this.projectId).subscribe(
            (res: any) => {
                console.log('LOAD', res);

                if(res.status) {

                    let images = res.project.images;

                    for (let i = 0, length = images.length; i < length; i++) {

                        let item = {
                            name: images[i].name,
                            url: this.config.serverUrl + 'uploads/sauto/' + this.projectId + '/' + images[i].name,
                            position: images[i].position

                        };

                        this.images.push(item);

                    }

                    this.redrawMap();

                }

                // console.log(this.projectId, this.projectName, this.images);

            },
            (error) => {
                console.log(error)
            }
        )

    }

    calculate_old(): void {

        this.processModal = true;

        this.prjProvider.calculate(this.projectId).subscribe(
            (res: any) => {

                this.processModal = false;

                alert('Calculations Done');

                console.log(res);

            },
            (error) => {
                console.log(error)
            }
        );

    }

    calculate(): void {
        this.map.test();
    }

    export(): void {

        this.processModal = true;

        this.prjProvider.export(this.projectId, this.username, this.password).subscribe(
            (res: any) => {

                this.processModal = false;

                alert('Export Success');

                console.log(res);

            },
            (error) => {
                console.log(error)
            }
        );

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

    uploadImage(image): void {

        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        canvas.getContext('2d').drawImage(image, 0, 0);

        const data = canvas.toDataURL('image/jpeg',0.9);

        const fullname = image.src.split("/").pop().toLowerCase();

        console.log(fullname);

        const info = {
            data,
            fullname
        };

        this.processModal = true;

        this.prjProvider.upload(this.projectId, info).subscribe(
            (res: any) => {

                if(res.success) {

                    let item = {
                        url: this.config.serverUrl + 'uploads/sauto/' + this.projectId + '/' + fullname,
                        position: res.position
                    };

                    this.images.push(item);

                    this.redrawMap();

                    this.processModal = false;

                } else {
                    console.log('unstable solution');

                    this.processModal = false;

                    alert('unstable solution');
                }

                console.log(res);
            },
            (error) => {
                this.processModal = false;
                console.log(error)
            }
        );

    }

    removeImage(image, index): void {

        this.prjProvider.deleteImage(this.projectId, image.name).subscribe(
            (res: any) => {
                console.log(res);

                if(res.success) {
                    this.images.splice(index,1);
                }

            },
            (error) => {
                console.log(error)
            }
        );

    }

    redrawMap() {
        this.map.load(this.images);
    }

    ionViewDidEnter() {

        this.map.initScene();

        // this.redrawMap();

    }
}
