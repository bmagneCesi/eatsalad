import { Component } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController } from 'ionic-angular';

import { DatabaseProvider } from './../../providers/database/database';
import { GlobalProvider } from "../../providers/global/global";

// Pages
import { StatisticPage } from '../statistic/statistic';


@Component({
  selector: 'page-archive',
  templateUrl: 'archive.html'
})
export class ArchivePage {

  id_restaurant:string;
  archives = [];

  constructor(
      public global:GlobalProvider,
      public navCtrl: NavController,
      public navParams: NavParams,
      public platform: Platform,
      private databaseprovider: DatabaseProvider,
      public loadingCtrl: LoadingController) {
    this.platform.ready().then(() => {
         
    });
  }

  ionViewWillEnter(){
    this.id_restaurant = this.navParams.get('id_restaurant');
      let loading = this.loadingCtrl.create({
          content: 'Chargement des archives, veuillez patienter...'
      });
      loading.present();
    this.databaseprovider.getRestaurantEvaluations(this.id_restaurant).subscribe((data) => {
      this.archives = data;
    }, err => {
        this.global.presentToast(err);
    }, () => {
        loading.dismiss();
    });
  }

  showArchive(id_evaluation){
    this.navCtrl.push(StatisticPage, {'id_evaluation': id_evaluation, 'id_restaurant': this.id_restaurant});
  }
  
}