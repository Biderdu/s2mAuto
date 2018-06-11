import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

import {HomePage} from '../home/home';

import {ProjectProvider} from "../../providers/project/project";

/**
 * Generated class for the ProjectsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-projects',
    templateUrl: 'projects.html'
})
export class ProjectsPage {

    projects: Array<any> = [];

    modalShow: Boolean = false;

    newProjectName: string = '';

    username: string = window.localStorage.getItem('username') || '';
    password: string = window.localStorage.getItem('password') || '';

    constructor(public navCtrl: NavController, public navParams: NavParams, public prjProvider: ProjectProvider) {

        this.projects = [];

        this.prjProvider.getProjects(this.username, this.password).subscribe(
            (res: any) => {

                if(res.status) {

                    for (let i = 0, length = res.projects.length; i < length; i++) {

                        let proj = res.projects[i];

                        this.projects.push(proj);

                    }

                }

                console.log(res);
            },
            (error) => {
                console.log(error)
            }
        );

    }

    logout(): void {

        console.log('logout');

        window.localStorage.setItem('username', null);
        window.localStorage.setItem('password', null);


        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();

    }

    selectProject(project): void {

        this.navCtrl.push(HomePage);

        console.log(project);
    }

    openModal(): void {
        this.modalShow = true;
    }

    closeModal():void {
        this.modalShow = false;
    }

    createNewProject(): void {

        this.prjProvider.create(this.newProjectName, this.username, this.password).subscribe(
            (res: any) => {
                console.log(res);

                if(res.status) {
                    this.projects.push(res.project);

                    this.closeModal();
                }
            },
            (error) => {
                console.log(error)
            }
        );

        console.log('Create New Project');

    }

}
