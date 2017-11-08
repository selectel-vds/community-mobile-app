import { Component } from '@angular/core';
import {IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {SSHKey, VscaleService} from "../../providers/vscale-service";
import {SSHKeyPage} from "../sshkey/sshkey";
import {TranslateService} from "@ngx-translate/core";

/**
 * Generated class for the SshkeysPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-sshkeys',
  templateUrl: 'sshkeys.html',
})
export class SSHKeysPage {

  private keys : SSHKey[];
  private loading : Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public vscaleService : VscaleService, public loadingCtrl: LoadingController, public translate: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SshkeysPage');

    if(!this.keys) {
      this.refresh();
    }

  }

  private refresh() {
    this.showLoading();

    this.vscaleService.getSSHKeys().toPromise().then(res => {
      this.keys = res;
      this.hideLoading();
    }, err => {
      this.vscaleService.processError(err, this.navCtrl);
    });
  }

  doRefresh(refresher) {
    this.vscaleService.getSSHKeys().toPromise().then(res => {
      this.keys = res;
      refresher.complete()
    }, err => {
      this.vscaleService.processError(err, this.navCtrl);
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

  showKey(key : SSHKey) {
    this.navCtrl.push(SSHKeyPage, key);
  }

}
