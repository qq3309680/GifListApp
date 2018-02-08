
import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {

  constructor(public storage:Storage) {

  }
  getData(): Promise<any> {
    return this.storage.get('settings');
  }
  save(data): void {
    let newData = JSON.stringify(data);
    this.storage.set('settings', newData);
  }
}
