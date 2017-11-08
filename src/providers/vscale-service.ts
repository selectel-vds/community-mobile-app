import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";
import {NavController, Platform, ToastController} from "ionic-angular";
import {TokenPage} from "../pages/token/token";
import {
  HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest,
} from "@angular/common/http";
import {AuthService} from "./auth-service";

/*
 Generated class for the VscaleService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */

@Injectable()
export class VscaleService {

  private API_URL = '/v1/';

  constructor(public http: HttpClient, public platform: Platform, private toastCtrl: ToastController) {
    console.log('Hello VscaleService Provider');
    if(platform.is('cordova')) {
      this.API_URL = 'https://api.vscale.io/v1/';
    }
  }

  public getAccount() : Observable<AccountHolder> {
    console.log('Loading account data...');
    return this.http.get(this.API_URL + 'account');
  }

  public getBalance() : Observable<Balance> {
    console.log('Loading balance info data...');
    return this.http.get(this.API_URL + 'billing/balance');
  }

  public getServers() : Observable<Server[]> {
    console.log('Loading servers info data...');
    return this.http.get(this.API_URL + 'scalets');
  }

  public getServer(ctid : number) : Observable<Server> {
    console.log('Loading servers info data...');
    return this.http.get(this.API_URL + 'scalets/' + ctid);
  }

  public getPlans() : Observable<Plan[]> {
    console.log('Loading plans info data...');
    return this.http.get(this.API_URL + 'rplans');
  }

  public serverStart(ctid : number) : Observable<Server> {
    console.log('Starting server ...');
    let headers = new HttpHeaders({'Content-Type' : 'application/json;charset=UTF-8'});
    return this.http.patch(this.API_URL + 'scalets/' + ctid + "/start", '{"id": "' + ctid + '"}', {headers: headers});
  }

  public serverStop(ctid : number) : Observable<Server> {
    console.log('Starting server ...');
    let headers = new HttpHeaders({'Content-Type' : 'application/json;charset=UTF-8'});
    return this.http.patch(this.API_URL + 'scalets/' + ctid + "/stop", '{"id": "' + ctid + '"}', {headers: headers});
  }

  public createServer(name : string, from : string, rplan : string, location : string, start : boolean, keys : number[], password : string ) : Observable<Server> {
    console.log('Creating server ...');
    let headers = new HttpHeaders({'Content-Type' : 'application/json;charset=UTF-8'});
    return this.http.post(this.API_URL + 'scalets',
      '{' +
        '"make_from": "' + from + '", ' +
        '"rplan": "' + rplan + '", ' +
        '"do_start": ' + start + ', ' +
        '"name": "' + name + '", ' +
        (keys ? '"keys": ' + JSON.stringify(keys) + ', ' : '') +
        (password ? '"password": "' + password + '", ' : '')  +
        '"location": "' + location + '" ' +
      '}',
      {headers: headers});
  }

  public serverRestart(ctid : number) : Observable<Server> {
    console.log('Starting server ...');
    let headers = new HttpHeaders({'Content-Type' : 'application/json;charset=UTF-8'});
    return this.http.patch(this.API_URL + 'scalets/' + ctid + "/restart", '{"id": "' + ctid + '"}', {headers: headers});
  }

  public rebuildServer(ctid : number, password : string) : Observable<Server> {
    console.log('Rebuilding server ...');
    let headers = new HttpHeaders({'Content-Type' : 'application/json;charset=UTF-8'});
    return this.http.patch(this.API_URL + 'scalets/' + ctid + "/rebuild", (password ? '{"password": "' + password + '"}' : null), {headers: headers});
  }

  public deleteServer(ctid : number) : Observable<Server> {
    console.log('Rebuilding server ...');
    let headers = new HttpHeaders({'Content-Type' : 'application/json;charset=UTF-8'});
    return this.http.delete(this.API_URL + 'scalets/' + ctid , {headers: headers});
  }

  public addSSHKeysToServer(ctid : number, keys : number[]) : Observable<Server> {
    console.log('Add SSH keys to server ...');
    let headers = new HttpHeaders({'Content-Type' : 'application/json;charset=UTF-8'});
    return this.http.patch(this.API_URL + 'scalets/' + ctid, '{"keys": ' + JSON.stringify(keys) + '}' , {headers: headers});
  }

  public addSSHKeyToServer(ctid : number, key : number) : Observable<Server> {
    console.log('Add SSH keys to server ...');
    let headers = new HttpHeaders({'Content-Type' : 'application/json;charset=UTF-8'});
    return this.http.patch(this.API_URL + 'scalets/' + ctid, '{"keys": [' + key + ']}' , {headers: headers});
  }

  public upgradeServer(ctid : number, rplan : string) : Observable<Server> {
    console.log('Rebuilding server ...');
    let headers = new HttpHeaders({'Content-Type' : 'application/json;charset=UTF-8'});
    return this.http.post(this.API_URL + 'scalets/' + ctid + "/upgrade", '{"rplan": "' + rplan + '"}', {headers: headers});
  }

  public getLocations(): Observable<Location[]> {
    console.log('Loading locations ...');
    return this.http.get(this.API_URL + 'locations');
  }

  public getBackups() : Observable<Backup[]> {
    console.log('Loading backups ...');
    return this.http.get(this.API_URL + 'backups');
  }

  public getBackup(id : string) : Observable<Backup> {
    console.log('Loading backups ...');
    return this.http.get(this.API_URL + 'backups/' + id);
  }

  public createBackup(ctid : number, name : string) : Observable<Backup> {
    console.log('Create backup ...');
    let headers = new HttpHeaders({'Content-Type' : 'application/json;charset=UTF-8'});
    return this.http.post(this.API_URL + 'scalets/' + ctid + "/backup", '{"name": "' + name + '"}', {headers: headers});
  }

  public rebuildBackup(ctid : number, id : string) : Observable<Server> {
    console.log('Rebuild backup ...');
    let headers = new HttpHeaders({'Content-Type' : 'application/json;charset=UTF-8'});
    return this.http.patch(this.API_URL + 'scalets/' + ctid + "/rebuild", '{"make_from": "' + id + '"}', {headers: headers});
  }

  public deleteBackup(id : string) : Observable<Backup> {
    console.log('Delete backup ...');
    return this.http.delete(this.API_URL + 'backups/' + id);
  }

  public relocateBackup(id : string, locationId : string) : Observable<Relocation> {
    console.log('Relocate backup ...');
    let headers = new HttpHeaders({'Content-Type' : 'application/json;charset=UTF-8'});
    return this.http.post(this.API_URL + 'backups/' + id + '/relocate', '{"destination": "' + locationId + '"}', {headers: headers});
  }

  public getSSHKeys() : Observable<SSHKey[]> {
    console.log('Load ssh keys...');
    return this.http.get(this.API_URL + 'sshkeys');
  }

  public deleteSshKey(id: number) : Observable<SSHKey[]> {
    console.log('Delete ssh key...');
    return this.http.delete(this.API_URL + 'sshkeys/' + id);
  }

  public getImages() : Observable<Image[]> {
    console.log('Load images...');
    return this.http.get(this.API_URL + 'images');
  }


  public processError(response: any, navCtrl : NavController) {
    if (response instanceof HttpErrorResponse) {
      console.log('HttpErrorResponse', response);
      let errorMessage = response.headers.get("Vscale-Error-Message");
      if (!errorMessage) {
        if (response.status > 399 && response.status < 500) {
          errorMessage = "Bad request";
        } else if (response.status > 499 && response.status < 600) {
          errorMessage = "Server error";
        } else {
          errorMessage = "Unknown error";
        }
      }
      if (response.status === 401 || response.status === 403) {
        errorMessage = "Unauthorized";
        navCtrl.setRoot(TokenPage);
      }
      this.showToast(errorMessage);
    } else {
      this.showToast("Fatal error");
    }
  }

  private showToast(msg : string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000,
      position: 'top'
    });
    toast.present(toast);
  }

}

export interface Balance {
  balance: number;
  bonus: number;
  status: string;
  summ: number;
  unpaid: number;
  user_id: number;
}

export interface Account {
  actdate: string;
  country: string;
  email: string;
  face_id: string;
  id: string;
  locale: string;
  middlename: string;
  mobile: string;
  name: string;
  state: string;
  surname: string;
}

export interface AccountHolder {
  info: Account;
  status: String;
}

export interface SSHKey {
  name: string;
  key: string;
  id: number;
}

export interface PublicAddress {
  netmask: string;
  gateway: string;
  address: string;
}

export interface PrivateAddress {
}

export interface Server {
  hostname: string;
  locked: boolean;
  location: string;
  rplan: string;
  name: string;
  active: boolean;
  keys: SSHKey[];
  public_address: PublicAddress;
  status: string;
  made_from: string;
  ctid: number;
  private_address: PrivateAddress;
}

export interface Plan {
  addresses: number;
  cpus: number;
  locations: string[];
  id: string;
  memory: number;
  templates: string[];
  network: number;
  disk: number;
}

export interface Location {
  active: boolean;
  private_networking: boolean;
  image: string[];
  id: string;
  description: string;
  rplans: string[];
  templates: string[];
}

export interface Backup {
  is_deleted: boolean;
  active: boolean;
  name: string;
  locked: boolean;
  status: string;
  id: string;
  location: string;
  scalet: number;
  size: number;
  template: string;
  created: string;
}

export interface Relocation {
  src_location: string;
  dst_location: string;
  task_id: string;
}

export interface SshKey {
  id: number;
  key: string;
  name: string;
}

export interface Image {
  rplans: string[];
  active: boolean;
  size: number;
  locations: string[];
  id: string;
  description: string;
}

