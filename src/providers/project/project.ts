import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {ConfigProvider} from "../config/config";

/*
  Generated class for the ProjectProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProjectProvider {

    constructor(public http: HttpClient, public config: ConfigProvider) {

    }

    getProjects(username, password) {
        let url: string = this.config.serverUrl + 'api/stmauto/projects';

        return this.http.post(
            url,
            {username, password}
        );
    }

    get(id) {
        let url: string = this.config.serverUrl + 'api/stmauto/get';

        return this.http.post(
            url,
            {id}
        );
    }

    create(name, username, password) {
        let url: string = this.config.serverUrl + 'api/stmauto/create';

        return this.http.post(
            url,
            {name, username, password}
        );
    }

    remove(id) {
        let url: string = this.config.serverUrl + 'api/stmauto/remove';

        return this.http.post(
            url,
            {id}
        );
    }

    upload(id, data) {
        let url: string = this.config.serverUrl + 'api/stmauto/upload';

        return this.http.post(
            url,
            {id, data}
        );
    }

    deleteImage(id, name) {

        let url: string = this.config.serverUrl + 'api/stmauto/deleteimage';

        return this.http.post(
            url,
            {id, name}
        );
    }

    calculate(id) {
        let url: string = this.config.serverUrl + 'api/stmauto/calculate';

        return this.http.post(
            url,
            {id}
        );
    }

    export(id, username, password, settings) {
        let url: string = this.config.serverUrl + 'api/stmauto/export';

        return this.http.post(
            url,
            {id, username, password, settings}
        );
    }

}
