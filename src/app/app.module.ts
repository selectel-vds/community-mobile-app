///<reference path="../../node_modules/@angular/common/http/src/interceptor.d.ts"/>
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import 'rxjs/add/operator/toPromise';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {TokenPage} from "../pages/token/token";
import {VscaleService} from "../providers/vscale-service";
import {BackupsPage} from "../pages/backups/backups";
import {ServersPage} from "../pages/servers/servers";
import {AccountPage} from "../pages/account/account";
import {StorageService} from "../providers/storage-service";
import {IonicStorageModule} from "@ionic/storage";
import {ServerPage} from "../pages/server/server";
import {BackupPage} from "../pages/backup/backup"
import {NewServerPage} from "../pages/new-server/new-server";
import {SSHKeyPage} from "../pages/sshkey/sshkey";
import {SSHKeysPage} from "../pages/sshkeys/sshkeys";
import {AddSSHKeyPage} from "../pages/add-ssh-key/add-ssh-key";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {AuthService} from '../providers/auth-service';
import {VscaleAuthenticationInterceptor} from "../providers/vscale-authentication-interceptor";
import {Globalization} from "@ionic-native/globalization";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    TokenPage,
    BackupsPage,
    ServersPage,
    AccountPage,
    ServerPage,
    BackupPage,
    SSHKeyPage,
    SSHKeysPage,
    NewServerPage,
    AddSSHKeyPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    TokenPage,
    BackupsPage,
    ServersPage,
    AccountPage,
    ServerPage,
    BackupPage,
    NewServerPage,
    SSHKeyPage,
    SSHKeysPage,
    NewServerPage,
    AddSSHKeyPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: VscaleAuthenticationInterceptor,
      multi: true,
    },
    VscaleService,
    StorageService,
    Globalization,
    BarcodeScanner
  ]
})

export class AppModule {}
