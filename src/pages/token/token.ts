import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {VscaleService} from "../../providers/vscale-service";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import {StorageService} from "../../providers/storage-service";
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../../providers/auth-service";

/**
 * Generated class for the Token page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-token',
  templateUrl: 'token.html',
})
export class TokenPage {

  private token : string = "";
  private loaded = false;

  constructor(public platform : Platform, public navCtrl: NavController, public navParams: NavParams, public vscaleService : VscaleService, public authService: AuthService, public storageService : StorageService, public translate: TranslateService, public barcodeScanner : BarcodeScanner) {
    this.storageService.get("token").then(token => {
      this.token = token;
      this.loaded = true;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Token');
  }

  login() {
    this.authService.setToken(this.token);
    this.storageService.set("token", this.token);
    this.navCtrl.setRoot(TabsPage);
  }

  scan() {
    this.platform.ready().then(() => {
      this.barcodeScanner.scan({formats: "QR_CODE"}).then(result => {
        if (!result.cancelled) {
          this.token = result.text;
        }
      }, (error) => {
        console.log(error);
      });
    });
  }

}
