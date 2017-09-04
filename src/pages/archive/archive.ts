import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { DatabaseProvider } from './../../providers/database/database';

// Pages
import  { ArchiveDetailPage } from '../archivedetail/archivedetail';


@Component({
  selector: 'page-archive',
  templateUrl: 'archive.html'
})
export class ArchivePage {

  id_restaurant:string;
  archives = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private databaseprovider: DatabaseProvider) {
    this.platform.ready().then(() => {
         
    });
  }

  ionViewWillEnter(){
    this.id_restaurant = this.navParams.get('id_restaurant');
    this.databaseprovider.getEvaluationByRestaurant(this.id_restaurant).then((data) => {
      this.archives = data;
      console.log(JSON.stringify(data));
    });
  }

  showArchive(id_evaluation){
    this.navCtrl.push(ArchiveDetailPage, {'id_evaluation': id_evaluation});
  }


}
