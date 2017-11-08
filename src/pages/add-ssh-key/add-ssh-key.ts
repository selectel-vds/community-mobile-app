import { Component } from '@angular/core';
import {Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Server, SSHKey, VscaleService} from "../../providers/vscale-service";
import {TranslateService} from "@ngx-translate/core";

/**
 * Generated class for the AddSshKeyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-ssh-key',
  templateUrl: 'add-ssh-key.html',
})
export class AddSSHKeyPage {

  server : Server;
  keys : SSHKey[];
  private loading : Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public vscaleService : VscaleService,  public loadingCtrl: LoadingController, public translate: TranslateService) {
    this.server = navParams.get('server');
    this.showLoading();

    Promise.all([this.vscaleService.getServer(this.server.ctid).toPromise(),  this.vscaleService.getSSHKeys().toPromise()])
      .then(([server, keys]) => {
        this.server = server;
        this.keys = keys;
        this.hideLoading();
      }, err => {
        this.vscaleService.processError(err, this.navCtrl);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddSshKeyPage');
  }

  ionViewDidLeave(){
    this.hideLoading();
  }

  addKey(key : number) {
    this.vscaleService.addSSHKeyToServer(this.server.ctid, key).toPromise().then(res => {
      this.server = res;
    }, err => {
      this.vscaleService.processError(err, this.navCtrl);
    }).catch(err => console.log(err));
    this.navCtrl.pop();
  }

  back() {
    this.navCtrl.pop();
  }

  isExistKey(key : number) : boolean {
    for(let k of this.server.keys) {
      if(k.id == key) {
        return true;
      }
    }
    return false;
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

}
