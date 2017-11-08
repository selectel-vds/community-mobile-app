import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {NavController, NavParams, Loading, LoadingController} from 'ionic-angular';
import {Server, VscaleService} from "../../providers/vscale-service";
import {ServerPage} from "../server/server";
import {NewServerPage} from "../new-server/new-server";
import {TranslateService} from "@ngx-translate/core";

/**
 * Generated class for the Servers page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-servers',
  templateUrl: 'servers.html',
})
export class ServersPage {

  private servers : Server[];
  private loading : Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public vscaleService : VscaleService, public loadingCtrl: LoadingController, public translate: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Servers');

    if(!this.servers) {
      this.refresh();
    }

  }

  private refresh() {
    this.showLoading();

    this.vscaleService.getServers().subscribe(res => {
      this.servers = res;
      this.hideLoading();
    }, err => {
      this.vscaleService.processError(err, this.navCtrl);
    })
  }

  doRefresh(refresher) {
    this.vscaleService.getServers().subscribe(res => {
      this.servers = res;
      refresher.complete()
    }, err => {
      this.vscaleService.processError(err, this.navCtrl);
    })
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

  showServer(server : Server) {
    this.navCtrl.push(ServerPage, server);
  }

  newServer() {
    this.navCtrl.push(NewServerPage);
  }

}
