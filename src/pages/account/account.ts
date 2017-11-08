import { Component } from '@angular/core';
import {NavController, NavParams, Loading, LoadingController} from 'ionic-angular';
import {Balance, VscaleService, Account} from "../../providers/vscale-service";
import {StorageService} from "../../providers/storage-service";
import {TokenPage} from "../token/token";
import {SSHKeysPage} from "../sshkeys/sshkeys";
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../../providers/auth-service";

/**
 * Generated class for the Billing page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-billing',
  templateUrl: 'account.html',
})
export class AccountPage {

  private balance : Balance;
  private account : Account;
  private loading : Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public vscaleService : VscaleService, public authService: AuthService, public loadingCtrl: LoadingController, public storageService : StorageService, public translate: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Billing');
    if(!this.balance) {
      this.refresh();
    }
  }

  private refresh() {
    this.showLoading();
    Promise.all([
      this.vscaleService.getBalance().toPromise(),
      this.vscaleService.getAccount().toPromise()
    ]).then(([balance, accountHolder]) => {
      this.balance = balance;
      this.account = accountHolder.info;
      this.hideLoading();
    });
  }

  doRefresh(refresher) {
    this.vscaleService.getBalance().toPromise().then(res => {
      this.balance = res;
      refresher.complete()
    }).catch(err => console.log(err));
  }

  ionViewDidLeave(){
    this.hideLoading();
  }

  showLoading() {
    this.hideLoading();
    this.loading = this.loadingCtrl.create({
      content: this.translate.instant("UPDATING_DATA") + '...'
    });
    this.loading.present();
  }

  hideLoading() {
    if(this.loading) {
      this.loading.dismissAll();
    }
  }

  exit() {
    this.authService.setToken(null);
    this.storageService.del("token");
    if (this.storageService.platform.is('cordova')) {
      this.storageService.platform.exitApp();
    } else {
      this.navCtrl.setRoot(TokenPage);
    }
  }

  showSSHkeys() {
    this.navCtrl.push(SSHKeysPage);
  }

}
