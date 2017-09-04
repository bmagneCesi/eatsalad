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
  categoryStat = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private databaseprovider: DatabaseProvider) {
    this.platform.ready().then(() => {
        this.id_evaluation = this.navParams.get('id_evaluation');

        this.databaseprovider.getResponseScoreByIdEvaluation(this.id_evaluation).then((data) => {
          
          for (var i = 0; i < data.length; i++) {
            let percent = (data[i].responseScore / (data[i].nbResponse * 4)) * 100;
            this.categoryStat.push({'category': data[i].category, 'score': percent});          
          }

        });
    });
  }

}
