import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

/*
  Generated class for the ModalProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ModalProvider {

    public processingModal: boolean = false;

    constructor(public http: HttpClient) {
        console.log('Hello ModalProvider Provider');
    }

    showProcessingModal(): void {

        this.processingModal = true;

    }

    hideProcessingModal(): void {

        this.processingModal = false;

    }

}
