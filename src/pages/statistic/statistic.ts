import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { DatabaseProvider } from './../../providers/database/database';
import  { ArchiveEvaluationPage } from '../archiveevaluation/archiveevaluation';

@Component({
  selector: 'page-statistic',
  templateUrl: 'statistic.html'
})
export class StatisticPage {
  
  id_evaluation:string;
  evaluation = [];
  categoryStat = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private databaseprovider: DatabaseProvider) {
    this.platform.ready().then(() => {
        this.id_evaluation = this.navParams.get('id_evaluation');   
        this.databaseprovider.getEvaluationById(this.id_evaluation).then((data) => {
          this.evaluation = data;
        });        
        this.databaseprovider.getTotalResponseScoreByIdEvaluation(this.id_evaluation).then((data) => {
          for (var i = 0; i < data.length; i++) {
              let percent = Math.round((data[i].responseScore / (data[i].nbResponse * 3)) * 100);
              this.categoryStat.push({'id_category': data[i].id_category, 'category': data[i].category, 'score': percent});
          }
        });
              
    });
  }

  showArchiveEvaluation(id_category){
    console.log(id_category);
      this.navCtrl.push(ArchiveEvaluationPage, {'id_evaluation': this.id_evaluation, 'id_category': id_category});
  }

  ionViewDidLoad(){
    console.log(JSON.stringify(this.categoryStat));
  }
}
