import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { DatabaseProvider } from './../../providers/database/database';

@Component({
  selector: 'page-statistic',
  templateUrl: 'statistic.html'
})
export class StatisticPage {

  id_evaluation:string;
  data = [];
  subCategoryStat = [];
  categoryStat = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private databaseprovider: DatabaseProvider) {
    this.platform.ready().then(() => {
        this.id_evaluation = this.navParams.get('id_evaluation');

        this.databaseprovider.getResponseScoreByIdEvaluation(this.id_evaluation).then((data) => {
          console.log(JSON.stringify(data));        
          for (var i = 0; i < data.length; i++) {
            let percent = Math.round((data[i].responseScore / (data[i].nbResponse * 4)) * 100);
            this.subCategoryStat.push({'category': data[i].category, 'subcategory': data[i].subcategory, 'score': percent});          
            if (this.categoryStat.indexOf(data[i].category) < 0)
            {
              this.categoryStat.push(data[i].category);         
            }
               
          }

        });
    });
  }

  ionViewDidLoad(){
    console.log(JSON.stringify(this.categoryStat));
  }
}
