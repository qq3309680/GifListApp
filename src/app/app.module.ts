import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {Keyboard} from "ionic-angular";
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {SettingsPage} from '../pages/settings/settings';
import { DataProvider } from '../providers/data/data';
import { RedditProvider } from '../providers/reddit/reddit';
import {HttpClientModule} from "@angular/common/http";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {IonicStorageModule} from "@ionic/storage";
import 'rxjs/add/operator/map'
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SettingsPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SettingsPage,
  ],
  providers: [
    InAppBrowser,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    RedditProvider,
    Keyboard

  ]
})
export class AppModule {}
