import { Component } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController } from 'ionic-angular';

// Pages
import  { StatisticPage } from '../statistic/statistic';
import  { ArchiveEvaluationPage } from '../archiveevaluation/archiveevaluation';

@Component({
  selector: 'page-archivedetail',
  templateUrl: 'archivedetail.html'
})
export class ArchiveDetailPage {

  id_evaluation:string;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public platform: Platform,
      public loadingCtrl: LoadingController
  ) {
    this.platform.ready().then(() => {
      this.id_evaluation = this.navParams.get('id_evaluation');
      console.log(this.id_evaluation);
    });
  }

  showStatistics(id_evaluation){
    this.navCtrl.push(StatisticPage, {'id_evaluation': id_evaluation});
  }

  showEvaluation(id_evaluation){
    this.navCtrl.push(ArchiveEvaluationPage, {'id_evaluation': id_evaluation});
  }
}