import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";

import {ProjectsPage} from '../projects/projects';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    loginField: string = '';
    password: string = '';

    constructor(public navCtrl: NavController, public auth: AuthProvider) {

    }

    login() {

        this.auth.login(this.loginField, this.password).subscribe(
            (res: any) => {
                if (res.message === 'Login success.') {
                    window.localStorage.setItem('username', this.loginField);
                    window.localStorage.setItem('password', this.password);

                    console.log('AUTH SUCCESS');

                    this.navCtrl.setRoot(ProjectsPage);

                }
            },
            (error) => {
                console.log(error)
            }
        );

    }

}
