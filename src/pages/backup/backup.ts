import { Component } from '@angular/core';
import {
  ActionSheetController, AlertController, LoadingController, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import {Backup, Location, VscaleService, Server} from "../../providers/vscale-service";
import {BackupsPage} from "../backups/backups";
import {TranslateService} from "@ngx-translate/core";

/**
 * Generated class for the Backup page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-backup',
  templateUrl: 'backup.html',
})
export class BackupPage {

  backup : Backup;
  location : Location;
  locations : Location[];
  servers : Server[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public vscaleService : VscaleService, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, public translate: TranslateService) {
    this.backup = this.navParams.data;

    this.vscaleService.getLocations().toPromise().then(locations => {
      this.locations = locations;
      for(let l of locations) {
        if(l.id == this.backup.location) {
          this.location = l;
        }
      }
    });

    this.vscaleService.getServers().toPromise().then(res => {
      this.servers = res;
    }, err => {
      this.vscaleService.processError(err, this.navCtrl);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Backup');
  }

  doRefresh(refresher) {
    this.vscaleService.getBackup(this.backup.id).toPromise().then(res => {
      this.backup = res;
      refresher.complete()
    }, err => {
      this.vscaleService.processError(err, this.navCtrl);
    }).catch(err => console.log(err));
  }

  delete() {
    let prompt = this.alertCtrl.create({
      title: this.translate.instant("BACKUP_REMOVAL"),
      message: this.translate.instant("ARE_YOU_SURE_YOU_WANT_TO_DELETE_A_BACKUP") + " <b>" + this.backup.name + "</b>?",
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
            this.vscaleService.deleteBackup(this.backup.id).toPromise().then(res => {
              this.backup = res;
              this.showToast(this.translate.instant("BACKUP_DELETED"));
              this.navCtrl.setRoot(BackupsPage);
            }, err => {
              this.vscaleService.processError(err, this.navCtrl);
            }).catch(err => console.log(err));
          }
        }
      ]
    });
    prompt.present();
  }

  rebuild() {
    let prompt = this.alertCtrl.create({
      title: this.translate.instant("BACKUP_RECOVERY"),
      message: this.translate.instant("ARE_YOU_SURE_YOU_WANT_TO_RESTORE_A_BACKUP") + " <b>" + this.backup.name + "</b>?",
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
            var buttons = [];
            for(let s of this.servers) {
              if(s.location == this.backup.location) {
                buttons.push({
                  text: '> ' + s.name,
                  handler: () => {
                    this.vscaleService.rebuildBackup(s.ctid, this.backup.id).toPromise().then(res => {
                      this.showToast(this.translate.instant("BACKUP_RESTORED"));
                    }, err => {
                      this.vscaleService.processError(err, this.navCtrl);
                    }).catch(err => console.log(err));
                  }
                });
              }
            }

            buttons.push({
              text: this.translate.instant("CANCEL"),
              role: 'cancel'
            });

            let actionSheet = this.actionSheetCtrl.create({
              title: this.translate.instant("SELECT_SERVER"),
              buttons: buttons
            });
            actionSheet.present();

          }
        }
      ]
    });
    prompt.present();
  }

  relocate() {
    let prompt = this.alertCtrl.create({
      title: 'Перемещение бэкапа',
      message: this.translate.instant("ARE_YOU_SURE_YOU_WANT_TO_RELOCATE_A_BACKUP") + " <b>" + this.backup.name + "</b>?",
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
            var buttons = [];
            for(let l of this.locations) {
              if(l.id != this.backup.location) {
                buttons.push({
                  text: '> ' + l.description,
                  handler: () => {
                    this.vscaleService.relocateBackup(this.backup.id, l.id).toPromise().then(res => {
                      this.showToast(this.translate.instant("BACKUP_MOVED"));
                    }, err => {
                      this.vscaleService.processError(err, this.navCtrl);
                    }).catch(err => console.log(err));
                  }
                });
              }
            }

            buttons.push({
              text: this.translate.instant("CANCEL"),
              role: 'cancel'
            });

            let actionSheet = this.actionSheetCtrl.create({
              title: this.translate.instant("SELECT_LOCATION"),
              buttons: buttons
            });
            actionSheet.present();

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
