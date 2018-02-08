
import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import 'rxjs/add/operator/map'
/*
  Generated class for the RedditProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RedditProvider {

  //设置函数
  settings: any;
  //加载完成标识
  loading: boolean = false;

  posts: any = [];
  subreddit: string = 'gifs';
  page: number = 1;
  perPage: number = 15;
  after: string;
  stopIndex: number;
  sort: string = 'hot'
  moreCount: number = 0;
  constructor(public http: HttpClient) {
  }
  fetchData(): void {
    //基于用户当前偏好组装URL来访问API
    let url = 'https://www.reddit.com/r/' + this.subreddit + '/' + this.sort + '/.json?limit='+ this.perPage;
    //如果我们不是在第一页的话，我们需要加上after参数才能得到新的结果
    //这个参数基本上就是讲"把 AFTER 这个帖子的帖子给我"
    if(this.after){
      url += '&after=' + this.after;
    }
    //console.dir(url);
    //我们现在拉取数据，所有要将loading变量设为 true
    this.loading = true;
     //向指定的URL发起请求然后订阅他的 response

    this.http.get(url).subscribe(data => {

      //console.dir(data);
      let stopIndex = this.posts.length;
      this.posts = this.posts.concat(data['data'].children);
      //循环所有的 NEW 帖子。
      //我们倒序循环的原因是因为需要移除一些项。
      for(let i = this.posts.length - 1; i >= stopIndex; i--){
        let post = this.posts[i];
        //添加一个新属性用于切换单个帖子的加载动画
        post.showLoader = false;
        post.alreadyLoaded = false;
        //给 NSFW 帖子添加 NSFW 印记
        if(post.data.thumbnail == 'nsfw'){
          this.posts[i].data.thumbnail = 'images/nsfw.png';
        }
        /*
          * 移除所有非 .gifv 或者 .webm 格式的帖子，然后将保留下来的帖子转换成.mp4文件
        */
        if(post.data.url.indexOf('.gifv') > -1 || post.data.url.indexOf('.webm')
          > -1){
          this.posts[i].data.url = post.data.url.replace('.gifv', '.mp4');
          this.posts[i].data.url = post.data.url.replace('.webm', '.mp4');
          //如果有缩略图的话，将他指定到 post 的 'snapshot'
          if(typeof(post.data.preview) != "undefined"){
            this.posts[i].data.snapshot = post.data.preview.images[0].source.
            url.replace(/&amp;/g, '&');
            //如果 snapshot 未定义的话, 将他指定为空这样就不会显示一个破裂图
            if(this.posts[i].data.snapshot == "undefined"){
              this.posts[i].data.snapshot = "";
            }
          } else {
            this.posts[i].data.snapshot = "";

            }
        } else {
          this.posts.splice(i, 1);
        }
      }
      //如果没有得到够一页的数据那么继续获取GIF
      //但是，如果连续20次都没获取足够的数据的话就放弃
      if(data['data'].children.length === 0 || this.moreCount > 20){
        this.moreCount = 0;
        this.loading = false;
      } else {
        this.after = data['data'].children[data['data'].children.length - 1].data.name;
        if(this.posts.length < this.perPage * this.page){
          this.fetchData();
          this.moreCount++;
        } else {
          this.loading = false;
          this.moreCount = 0;
        }
      }
      //console.dir(this.posts);
    }, (err) => {
       //静默失败，此时加载旋转动画会持续显示
      console.log("subreddit doesn't exist!");
    });
  }
  nextPage():void{
    this.page++;
    this.fetchData();
  }

  resetPosts():void{
    this.page = 1;
    this.posts = [];
    this.after = null;
    this.fetchData();
  }
}
