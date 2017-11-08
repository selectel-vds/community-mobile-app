import { Component } from '@angular/core';
import {
  ActionSheetController, AlertController, LoadingController, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import {SSHKey, VscaleService} from "../../providers/vscale-service";
import {SSHKeysPage} from "../sshkeys/sshkeys";
import {TranslateService} from "@ngx-translate/core";

/**
 * Generated class for the SshkeyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-sshkey',
  templateUrl: 'sshkey.html',
})
export class SSHKeyPage {

  key : SSHKey;

  constructor(public navCtrl: NavController, public navParams: NavParams, public vscaleService : VscaleService, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, public translate: TranslateService) {
    this.key = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SshkeyPage');
  }

  deleteKey() {
    let prompt = this.alertCtrl.create({
      title: this.translate.instant("KEY_REMOVAL"),
      message: this.translate.instant("ARE_YOU_SURE_YOU_WANT_TO_DELETE_THE_KEY") + " <b>" + this.key.name + "</b>?",
      buttons: [
        {
          text: this.translate.instant("NO"),
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.translate.instant("YES"),
          handler: data => {
            this.vscaleService.deleteSshKey(this.key.id).toPromise().then(res => {
              this.showToast(this.translate.instant("KEY_DELETED"));
              this.navCtrl.setRoot(SSHKeysPage);
            }, err => {
              this.vscaleService.processError(err, this.navCtrl);
            }).catch(err => console.log(err));
          }
        }
      ]
    });
    prompt.present();
  }

  private showToast(msg : string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000,
      position: 'bottom'
    });
    toast.present(toast);
  }

}
