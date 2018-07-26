import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {HttpClientModule} from '@angular/common/http';

import {ImagePicker} from '@ionic-native/image-picker';

import {ComponentsModule} from '../components/components.module';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {ProjectsPage} from '../pages/projects/projects';
import {ProjectDetailsPage} from '../pages/project-details/project-details';
import {AuthProvider} from '../providers/auth/auth';
import {ProjectProvider} from '../providers/project/project';
import {ConfigProvider} from '../providers/config/config';
import {ModalProvider} from '../providers/modal/modal';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        ProjectsPage,
        ProjectDetailsPage
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp),
        ComponentsModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        ProjectsPage,
        ProjectDetailsPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        AuthProvider,
        ProjectProvider,
        ImagePicker,
        ConfigProvider,
        ModalProvider
    ]
})
export class AppModule {
}
