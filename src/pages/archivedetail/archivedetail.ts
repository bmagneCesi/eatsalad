import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

// Pages
import  { StatisticPage } from '../statistic/statistic';

@Component({
  selector: 'page-archivedetail',
  templateUrl: 'archivedetail.html'
})
export class ArchiveDetailPage {

  id_evaluation:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform,) {
    this.platform.ready().then(() => {
      this.id_evaluation = this.navParams.get('id_evaluation');
    });
  }

  showStatistics(id_evaluation){
    this.navCtrl.push(StatisticPage, {'id_evaluation': id_evaluation});
  }

  showEvaluation(id_evaluation){
    this.navCtrl.push(StatisticPage, {'id_evaluation': id_evaluation});
  }
}
