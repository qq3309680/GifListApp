import { Component } from '@angular/core';
import {ModalController, NavController, Platform} from 'ionic-angular';
import {Keyboard} from "ionic-angular";
import {SettingsPage} from "../settings/settings";
import {DataProvider} from "../../providers/data/data";
import {RedditProvider} from "../../providers/reddit/reddit";
import {FormControl} from "@angular/forms";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  settings:any;
  subredditValue:string;
  subredditControl:FormControl;
  constructor(public dataService:DataProvider,public redditService:RedditProvider,public modalCtrl:ModalController,public platform:Platform, public navCtrl: NavController,public keyboard:Keyboard,public inAppBrowser:InAppBrowser) {
    this.subredditControl=new FormControl();
  }
  ionViewDidLoad(){
    this.subredditControl.valueChanges.debounceTime(1500)
      .distinctUntilChanged().subscribe(subreddit => {
      if(subreddit != '' && subreddit){
        this.redditService.subreddit = subreddit;
        this.changeSubreddit();
       this.keyboard.close();
      }
    });
    this.platform.ready().then(() => {
      this.loadSettings();
    });
  }
  loadSettings(): void {
    this.dataService.getData().then((settings) => {
      if(settings && typeof(settings) != "undefined"){
        let newSettings = JSON.parse(settings);
        this.redditService.settings = newSettings;
        if(newSettings.length != 0){
          this.redditService.sort = newSettings.sort;
          this.redditService.perPage = newSettings.perPage;
          this.redditService.subreddit = newSettings.subreddit;
        }
      }
      this.changeSubreddit();
    });
  }
  showComments(post): void {
    let browser = this.inAppBrowser.create('http://reddit.com' + post.data.permalink);
  }
   openSettings():void{
     let settingsModal = this.modalCtrl.create(SettingsPage, {
       perPage: this.redditService.perPage,
       sort: this.redditService.sort,
       subreddit: this.redditService.subreddit
     });
     settingsModal.onDidDismiss(settings => {
       if(settings){
         this.redditService.perPage = settings.perPage;
         this.redditService.sort = settings.sort;
         this.redditService.subreddit = settings.subreddit;
         this.dataService.save(settings);
         this.changeSubreddit();
       }
     });
     settingsModal.present();
  }
  playVideo(e, post): void {
    //创建视频的引用
    //console.dir(e.target);
    let target=e.target;
    let video:any;
    if(target.tagName=="VIDEO"){
      video= e.target;
    }else{
      video = e.target.getElementsByTagName('video')[0];
    }



    if(!post.alreadyLoaded){
      post.showLoader = true;
    }
    //切换视频播放

    if(video.paused){
    //展示加载gif
      video.play();
     //一旦开始播放视频，隐藏加载gif
      video.addEventListener("playing", function(e){
        post.showLoader = false;
        post.alreadyLoaded = true;
      });
    } else {
      video.pause();
    }
  }
  changeSubreddit(): void {
    this.redditService.resetPosts();
  }
  loadMore():void{
    this.redditService.nextPage();
  }
}
