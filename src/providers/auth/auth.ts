import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {ConfigProvider} from "../config/config";

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

    constructor(public http: HttpClient, public config: ConfigProvider) {

    }

    login(login, password) {
        let url:string = this.config.serverUrl + 'api/auth/login';

        return this.http.post(
            url,
            {username: login, password: password}
        );
    }

}
