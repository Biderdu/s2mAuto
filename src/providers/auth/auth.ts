import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

    serverUrl: string = 'http://139.129.217.229/api/auth/login';

    constructor(public http: HttpClient) {
        console.log('Hello AuthProvider Provider');
    }

    login(login, password) {
        return this.http.post(
            this.serverUrl,
            {username: login, password: password}
        );
    }

    logout() {
        return this.http.post(
            `http://localhost:8080/auth/logout`,
            {},
            {withCredentials: true}
        );
    }


}
