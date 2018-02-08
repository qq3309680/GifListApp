import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController} from 'ionic-angular';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  perPage: number;
  sort: string;
  subreddit: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,public view:ViewController) {
    this.perPage = this.navParams.get('perPage');
    this.sort = this.navParams.get('sort');
    this.subreddit = this.navParams.get('subreddit');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  save(): void {
    let settings = {
      perPage: this.perPage,
      sort: this.sort,
      subreddit: this.subreddit
    };
    this.view.dismiss(settings);
  }
  close(): void {
    this.view.dismiss();
  }
}
