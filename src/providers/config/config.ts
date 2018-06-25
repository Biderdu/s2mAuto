import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfigProvider {

    // serverUrl: string = 'http://3dcloudworld.com/';
    serverUrl: string = 'http://192.168.1.116:8080/';
    // serverUrl: string = 'http://139.129.217.229/';

    constructor(public http: HttpClient) {
        console.log('Hello ConfigProvider Provider');
    }

}
