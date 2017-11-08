import { Component } from '@angular/core';
import {AccountPage} from "../account/account";
import {ServersPage} from "../servers/servers";
import {BackupsPage} from "../backups/backups";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ServersPage;
  tab2Root = BackupsPage;
  tab3Root = AccountPage;

  constructor() {}
}
