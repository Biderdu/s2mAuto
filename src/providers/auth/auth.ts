import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

    // serverUrl: string = 'http://139.129.217.229/';
    // serverUrl: string = 'http://127.0.0.1:8080/';
    serverUrl: string = 'http://192.168.1.116:8080/';

    constructor(public http: HttpClient) {

    }

    login(login, password) {
        let url:string = this.serverUrl + 'api/auth/login';

        return this.http.post(
            url,
            {username: login, password: password}
        );
    }

}
