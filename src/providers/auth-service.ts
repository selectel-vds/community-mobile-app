import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "./storage-service";
import {NavController} from "ionic-angular";
import {TokenPage} from "../pages/token/token";

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthService {

  private token : string;

  constructor(public http: HttpClient) {}

  public setToken(token : string) {
    this.token = token;
  }

  public getToken() : string {
    return this.token;
  }

}
