import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { DatabaseProvider } from './../../providers/database/database';

@Component({
  selector: 'page-statisticsubcategory',
  templateUrl: 'statisticsubcategory.html'
})
export class StatisticSubCategoryPage {
  
  id_evaluation:number;
  id_category:number;
  data = [];
  subCategoryStat = [];
  categoryStat = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private databaseprovider: DatabaseProvider) {
    this.platform.ready().then(() => {
        this.id_evaluation = this.navParams.get('id_evaluation');
        this.id_category = this.navParams.get('id_category');

    });
  }

  showStatistics(id_category){
    //   this.navCtrl.push(statisticSubCategory);
  }

  ionViewDidLoad(){
    console.log(JSON.stringify(this.categoryStat));
  }
}
