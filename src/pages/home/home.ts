import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    loginField: string = '';
    password: string = '';


    constructor(public navCtrl: NavController, public auth: AuthProvider) {



    }

    login(event) {


        let data: any = {

            username: this.loginField,
            password: this.password

        };

        this.auth.login(this.loginField, this.password).subscribe(
            res => console.log(res),
            error => console.log(error)
        );

        console.log(this.loginField, this.password);

    }

}
