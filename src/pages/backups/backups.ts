import { Component } from '@angular/core';
import {Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Backup, VscaleService} from "../../providers/vscale-service";
import {BackupPage} from "../backup/backup";
import {TranslateService} from "@ngx-translate/core";

/**
 * Generated class for the Backups page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-backups',
  templateUrl: 'backups.html',
})
export class BackupsPage {

  private backups : Backup[];
  private loading : Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public vscaleService : VscaleService, public loadingCtrl: LoadingController, public translate: TranslateService) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad Backups');
    if(!this.backups) {
      this.refresh();
    }
  }

  private refresh() {
    this.showLoading();

    this.vscaleService.getBackups().toPromise().then(res => {
      this.backups = res;
      this.hideLoading();
    }, err => {
      this.vscaleService.processError(err, this.navCtrl);
    });
  }

  doRefresh(refresher) {
    this.vscaleService.getBackups().toPromise().then(res => {
      this.backups = res;
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
      content: this.translate.instant("UPDATING_DATA")+ '...'
    });
    this.loading.present();
  }

  hideLoading() {
    if(this.loading) {
      this.loading.dismissAll();
    }
  }

  showBackup(backup : Backup) {
    this.navCtrl.push(BackupPage, backup);
  }

}
