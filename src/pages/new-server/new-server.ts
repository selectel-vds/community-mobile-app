import { Component } from '@angular/core';
import {Loading, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {Backup, Image, Location, Plan, SSHKey, VscaleService} from "../../providers/vscale-service";
import {ServersPage} from "../servers/servers";
import {TranslateService} from "@ngx-translate/core";

/**
 * Generated class for the NewServer page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-new-server',
  templateUrl: 'new-server.html',
})
export class NewServerPage {

  type : string;
  images : Image[];
  locations : Location[];
  backups : Backup[];
  plans : Plan[];
  private loading : Loading;
  keys : SSHKey[];
  fromBackup : Boolean = false;

  loc : Location;
  image : Image;
  imageId : string;
  cfg: string;
  name : string;
  password: string;
  selectedKeys : number[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public vscaleService : VscaleService, public loadingCtrl: LoadingController, private toastCtrl: ToastController, public translate: TranslateService) {
    this.type = navParams.data;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewServer');
    this.refresh();

  }

  private refresh() {
    this.showLoading();
    Promise.all([
      this.vscaleService.getLocations().toPromise(),
      this.vscaleService.getSSHKeys().toPromise(),
      this.vscaleService.getBackups().toPromise(),
      this.vscaleService.getImages().toPromise(),
      this.vscaleService.getPlans().toPromise()
    ]).then(value => {
      this.locations = value[0];
      this.keys = value[1];
      this.backups = value[2];
      this.images = value[3];
      this.plans = value[4];
      this.hideLoading();
    }, err => {
      this.vscaleService.processError(err, this.navCtrl);
    });
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

  getPlans() : string[] {
    if(!this.imageId) {
      return null;
    }
    if(this.fromBackup) {
      let backup : Backup = this.backups.find(b => b.id === this.imageId);
      let p : string[] = new Array();
      for(let plan of this.plans) {
        if(!backup || plan.disk >= (backup.size * 1024)) {
          p.push(plan.id);
        }
      }
      return p;
    } else {
      for(let i of this.images) {
        if(i.locations.lastIndexOf(this.loc.id) >= 0 && i.id === this.imageId) {
          return i.rplans;
        }
      }
    }
    this.showToast(this.translate.instant("SOMETHING_WENT_WRONG") + "... =(");
    return null;
  }

  private showToast(msg : string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000,
      position: 'bottom'
    });
    toast.present(toast);
  }

  createServer() {
    this.vscaleService.createServer(this.name, this.imageId, this.cfg, this.loc.id, true, this.selectedKeys, this.password).toPromise().then(res => {
      this.showToast(this.translate.instant("CREATING_SERVER"));
      this.navCtrl.setRoot(ServersPage);
    }, err => {
      this.vscaleService.processError(err, this.navCtrl);
    }).catch(err => console.log(err));
  }

}
