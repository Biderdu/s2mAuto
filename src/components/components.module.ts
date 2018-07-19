import {NgModule} from '@angular/core';
import {MapComponent} from './map/map';
import {CommonModule} from "@angular/common";

@NgModule({
    declarations: [MapComponent],
    imports: [CommonModule],
    exports: [MapComponent]
})

export class ComponentsModule {
}
