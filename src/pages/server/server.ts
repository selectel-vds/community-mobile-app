import { Component } from '@angular/core';
import {
  NavController, NavParams, LoadingController, AlertController, ToastController,
  ModalController
} from 'ionic-angular';
import {Plan, Server, Location, VscaleService, SSHKey} from "../../providers/vscale-service";
import {DatePipe} from "@angular/common";
import {ServersPage} from "../servers/servers";
import {AddSSHKeyPage} from "../add-ssh-key/add-ssh-key";
import {TranslateService} from "@ngx-translate/core";

/**
 * Generated class for the Server page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-server',
  templateUrl: 'server.html',
})
export class ServerPage {

  server : Server;
  plan : Plan;
  plans : Plan[];
  location : Location;
  danger : Boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public vscaleService : VscaleService, public modalCtrl: ModalController, public alertCtrl: AlertController, private toastCtrl: ToastController, public translate: TranslateService) {
    this.server = this.navParams.data;

    this.vscaleService.getPlans().toPromise().then(plans => {
      this.plans = plans;
      for(let p of plans) {
        if(p.id == this.server.rplan) {
          this.plan = p;
        }
      }
    });

    this.vscaleService.getLocations().toPromise().then(locations => {
      for(let l of locations) {
        if(l.id == this.server.location) {
          this.location = l;
        }
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Server');
  }

  doRefresh(refresher) {
    this.danger = false;
    this.vscaleService.getServer(this.server.ctid).toPromise().then(res => {
      this.server = res;
      for(let p of this.plans) {
        if(p.id == this.server.rplan) {
          this.plan = p;
        }
      }
      refresher.complete()
    }, err => {
      this.vscaleService.processError(err, this.navCtrl);
    }).catch(err => console.log(err));

    console.log(this.plan);
  }

  on() {
    let prompt = this.alertCtrl.create({
      title: this.translate.instant("POWER_ON_SERVER"),
      message: this.translate.instant("ARE_YOU_SURE_YOU_WANT_POWER_ON_SERVER") + " <b>" + this.server.name + "</b>?",
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
            this.vscaleService.serverStart(this.server.ctid).toPromise().then(res => {
              this.server = res;
              this.showToast(this.translate.instant("SERVER_STARTED"));
            }, err => {
              this.vscaleService.processError(err, this.navCtrl);
            }).catch(err => console.log(err));
          }
        }
      ]
    });
    prompt.present();
  }

  off() {
    let prompt = this.alertCtrl.create({
      title: this.translate.instant("POWER_OFF_SERVER"),
      message: this.translate.instant("ARE_YOU_SURE_YOU_WANT_POWER_OFF_SERVER") + " <b>" + this.server.name + "</b>?",
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
            this.vscaleService.serverStop(this.server.ctid).toPromise().then(res => {
              this.server = res;
              this.showToast(this.translate.instant("SERVER_STOPPED"));
            }, err => {
              this.vscaleService.processError(err, this.navCtrl);
            }).catch(err => console.log(err));
          }
        }
      ]
    });
    prompt.present();
  }

  reboot() {
    let prompt = this.alertCtrl.create({
      title: this.translate.instant("REBOOT_SERVER"),
      message: this.translate.instant("ARE_YOU_SURE_YOU_WANT_REBOOT_SERVER") + " <b>" + this.server.name + "</b>?",
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
            this.vscaleService.serverRestart(this.server.ctid).toPromise().then(res => {
              this.server = res;
              this.showToast(this.translate.instant("SERVER_REBOOTED"));
            }, err => {
              this.vscaleService.processError(err, this.navCtrl);
            }).catch(err => console.log(err));
          }
        }
      ]
    });
    prompt.present();
  }

  backup() {
    let prompt = this.alertCtrl.create({
      title: this.translate.instant("SERVER_BACKUP"),
      message: "Вы действительно хотите создать бэкап " + this.server.name + "</b>?",
      inputs: [
        {
          name: 'name',
          value: this.server.name + "_backup_" + new DatePipe("en-US").transform(new Date(), "yyyyMMdd") ,
          id: "bname"
        },
      ],
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
            this.vscaleService.createBackup(this.server.ctid, data.name).toPromise().then(res => {
              this.showToast(this.translate.instant("CREATING_BACKUP"));
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
      title: this.translate.instant("REINSTALL_SERVER"),
      message: this.translate.instant("ARE_YOU_SURE_YOU_WANT_TO_REINSTALL_SERVER") + " <b>" + this.server.name + "</b>?<br/><br/> " + this.translate.instant("ENTER_ROOT_PASSWORD_IF_REQUIRED") + ":",
      inputs: [
        {
          name: 'password',
          value: null ,
          id: "pwd"
        },
      ],
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
            this.vscaleService.rebuildServer(this.server.ctid, data.password).toPromise().then(res => {
              this.server = res;
              this.showToast(this.translate.instant("REINSTALLING_SERVER"));
            }, err => {
              this.vscaleService.processError(err, this.navCtrl);
            }).catch(err => console.log(err));
          }
        }
      ]
    });
    prompt.present();
  }

  delete() {
    let prompt = this.alertCtrl.create({
      title: this.translate.instant("DELETE_SERVER"),
      message: "Вы действительно хотите удалить сервер <b>" + this.server.name + "</b>?",
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
            this.vscaleService.deleteServer(this.server.ctid).toPromise().then(res => {
              this.server = res;
              this.showToast(this.translate.instant("DELETING_SERVER"));
              this.navCtrl.setRoot(ServersPage);
            }, err => {
              this.vscaleService.processError(err, this.navCtrl);
            }).catch(err => console.log(err));
          }
        }
      ]
    });
    prompt.present();
  }

  onPlanChange() {
    this.vscaleService.upgradeServer(this.server.ctid, this.plan.id).toPromise().then(res => {
      this.server = res;
      this.showToast(this.translate.instant("SERVER_UPDATED"));
    }, err => {
      this.vscaleService.processError(err, this.navCtrl);
    }).catch(err => console.log(err));
  }

  addSSHKey() {
    const profileModal = this.modalCtrl.create(AddSSHKeyPage, { server: this.server });
    profileModal.present();
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
