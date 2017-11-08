import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Globalization } from '@ionic-native/globalization';
import {TokenPage} from "../pages/token/token";
import {StorageService} from "../providers/storage-service";
import {TabsPage} from "../pages/tabs/tabs";
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../providers/auth-service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, storageService: StorageService, authService: AuthService, translate: TranslateService, private globalization: Globalization) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      if(platform.is('cordova')) {
        globalization.getPreferredLanguage().then(
          res => {
            let language = res.value.split('-')[0];
            language = /(ru|en)/gi.test(language) ? language : 'en';
            translate.setDefaultLang('en');
            translate.use(language);
          }
        );
      } else {
        let language = navigator.language.split('-')[0];
        language = /(ru|en)/gi.test(language) ? language : 'en';
        translate.setDefaultLang('en');
        translate.use(language);
      }

      storageService.get("token").then(token => {
          if(token) {
            authService.setToken(token);
            this.rootPage = TabsPage;
          } else {
            this.rootPage = TokenPage;
          }
          statusBar.styleDefault();
          splashScreen.hide();
        }
      );
    });
  }

}
