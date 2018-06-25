import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ImagePicker} from '@ionic-native/image-picker';

import {ProjectProvider} from "../../providers/project/project";
import {ConfigProvider} from "../../providers/config/config";

/**
 * Generated class for the ProjectDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-project-details',
    templateUrl: 'project-details.html',
})
export class ProjectDetailsPage {

    projectId: string = '';
    projectName: string = '';
    images: Array<any> = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, private imagePicker: ImagePicker, public prjProvider: ProjectProvider, public config: ConfigProvider) {

        this.projectId = this.navParams.get('_id');
        this.projectName = this.navParams.get('name');

        let images = this.navParams.get('images');

        // let test = ['https://iso.500px.com/wp-content/uploads/2015/11/photo-129299193.jpg', 'http://illusion.scene360.com/wp-content/uploads/2015/10/alejandro-burdisio-12.jpg', 'https://i.pinimg.com/originals/0e/22/4a/0e224aaa4db22edd39bf4662f94eb800.jpg', 'https://i.pinimg.com/originals/0d/0f/7e/0d0f7e52483128a5845922c2b53d151e.jpg'];

        for (let i = 0, length = images.length; i < length; i++) {

            let item = {
                name: images[i].name,
                url: this.config.serverUrl + 'uploads/sauto/' + this.projectId + '/' + images[i].name
            };

            this.images.push(item);

        }

        console.log(this.projectId, this.projectName, this.images);

    }

    calculate(): void {

        this.prjProvider.calculate(this.projectId).subscribe(
            (res: any) => {
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
        canvas.width = image.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = image.naturalHeight; // or 'height' if you want a special/scaled size

        canvas.getContext('2d').drawImage(image, 0, 0);

        const data = canvas.toDataURL('image/jpg');

        const fullname = image.src.split("/").pop();
        // const name = fullname.split(".")[0];
        // const extension = fullname.split(".")[1];

        console.log(fullname);

        const info = {
            data,
            fullname
        };

        this.prjProvider.upload(this.projectId, info).subscribe(
            (res: any) => {

                if(res.success) {

                    let item = {
                        url: this.config.serverUrl + 'uploads/sauto/' + this.projectId + '/' + fullname
                    };

                    this.images.push(item);

                }

                console.log(res);
            },
            (error) => {
                console.log(error)
            }
        );

    }

    removeImage(image, index): void {

        console.log(image);

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
}
