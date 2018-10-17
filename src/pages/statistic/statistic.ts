import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, Platform, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { EmailComposer } from '@ionic-native/email-composer';
import { Http, Headers } from '@angular/http';
import { DatabaseProvider } from './../../providers/database/database';
import  { ArchiveEvaluationPage } from '../archiveevaluation/archiveevaluation';
declare var cordova: any;
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';

import { GlobalProvider } from "../../providers/global/global";


@Component({
  selector: 'page-statistic',
  templateUrl: 'statistic.html'
})
export class StatisticPage {
  
  id_evaluation: number;
  id_restaurant: number;
    serverUrl: string;

  options : InAppBrowserOptions = {
      location : 'yes',//Or 'no'
      hidden : 'no', //Or  'yes'
      clearcache : 'yes',
      clearsessioncache : 'yes',
      hardwareback : 'yes',
      mediaPlaybackRequiresUserAction : 'no',
      closebuttoncaption : 'Close', //iOS only
      disallowoverscroll : 'no', //iOS only
      toolbar : 'yes', //iOS only
      enableViewportScale : 'no', //iOS only
      allowInlineMediaPlayback : 'no',//iOS only
      presentationstyle : 'pagesheet',//iOS only
      fullscreen : 'yes',//Windows only
  };

  constructor(
      public http: Http,
      public toastCtrl: ToastController,
      public viewCtrl: ViewController,
      public file: File,
      public modalController: ModalController,
      public platform: Platform,
      public navCtrl: NavController,
      public navParams: NavParams,
      public loadingCtrl: LoadingController,
      public global: GlobalProvider,
      private iab: InAppBrowser
  ) {
    this.platform.ready().then(() => {
        this.id_evaluation = this.navParams.get('id_evaluation');   
        this.id_restaurant = this.navParams.get('id_restaurant');
    });
  }

    openStatistics(){
        let target = "_blank";
        let browser = this.iab.create(this.global.serverUrl+'/uploads/evaluations/'+this.id_evaluation+'/pdf/statistiques-'+this.id_evaluation+'.pdf',target,this.options);
        browser.show();
    }

    openReport(){
        let target = "_blank";
        let browser = this.iab.create(this.global.serverUrl+'/uploads/evaluations/'+this.id_evaluation+'/pdf/visite-de-conformité-'+this.id_evaluation+'.pdf',target,this.options);
        browser.show();
    }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  showArchiveEvaluation(id_category){
      this.navCtrl.push(ArchiveEvaluationPage, {'id_evaluation': this.id_evaluation, 'id_category': id_category});
  }
}
