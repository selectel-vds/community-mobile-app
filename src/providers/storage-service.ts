import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Platform} from "ionic-angular";
import {/*SecureStorage,*/ SecureStorageObject} from "@ionic-native/secure-storage";
import {Storage} from '@ionic/storage';
import {HttpClient} from "@angular/common/http";

/*
 Generated class for the StorageService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class StorageService {

  //private secureStorage: SecureStorage;

  constructor(public http: HttpClient, public platform: Platform, public storage: Storage) {
    console.log('Hello StorageService Provider');

    //if (this.platform.is('cordova')) {
      //this.secureStorage = new SecureStorage();
    //}
  }

  private async getStorage() {
    //if (this.platform.is('cordova')) {
    //  return await this.secureStorage.create('vscale_storage');
    //} else {
      await this.storage.ready();
      return this.storage;
    //}
  }

  public async get(key: string) {
    let s = await this.getStorage();
    return s.get(key);
  }

  public async set(key: string, value: string) {
    let s: SecureStorageObject | Storage = await this.getStorage();
    if (s instanceof SecureStorageObject) {
      s.set(key, value);
    } else if (s instanceof Storage) {
      s.set(key, value)
    }
  }

  public del(key: string) {
    this.getStorage().then(s => {
      return s.remove(key)
    });
  }


}
