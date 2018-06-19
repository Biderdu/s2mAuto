import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

/*
  Generated class for the ProjectProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProjectProvider {

    // serverUrl: string = 'http://139.129.217.229/';
    // serverUrl: string = 'http://127.0.0.1:8080/';
    serverUrl: string = 'http://192.168.1.116:8080/';

    constructor(public http: HttpClient) {

    }

    getProjects(username, password) {
        let url: string = this.serverUrl + 'api/stmauto/projects';

        return this.http.post(
            url,
            {username, password}
        );
    }

    create(name, username, password) {
        let url: string = this.serverUrl + 'api/stmauto/create';

        return this.http.post(
            url,
            {name, username, password}
        );
    }

    remove(id) {
        let url: string = this.serverUrl + 'api/stmauto/remove';

        return this.http.post(
            url,
            {id}
        );
    }

    upload(id, data) {
        let url: string = this.serverUrl + 'api/stmauto/upload';

        return this.http.post(
            url,
            {id, data}
        );
    }

    calculate(id) {
        let url: string = this.serverUrl + 'api/stmauto/calculate';

        return this.http.post(
            url,
            {id}
        );
    }

}
