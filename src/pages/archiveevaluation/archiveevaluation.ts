import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ModalController } from 'ionic-angular';

import { DatabaseProvider } from './../../providers/database/database';

import { EvaluationphotoPage } from './../evaluationphoto/evaluationphoto';

@Component({
  selector: 'page-archiveevaluation',
  templateUrl: 'archiveevaluation.html'
})
export class ArchiveEvaluationPage {

  id_evaluation:number;
  id_category:number;
  subcategories = [];
  category = [];
  responses = [];
  evaluation = [];
  photos = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private databaseprovider: DatabaseProvider, public modalController:ModalController) {
    this.platform.ready().then(() => {
        this.id_evaluation = this.navParams.get('id_evaluation');
        this.id_category = this.navParams.get('id_category');
        this.databaseprovider.getEvaluation(this.id_evaluation).subscribe((data) => {
          this.evaluation = data;
        });
    });
  }

  photoShow(id_question_has_response){
    let modal = this.modalController.create(EvaluationphotoPage, {'id_question_has_response': id_question_has_response});
    modal.onDidDismiss(data => {

    });
    modal.present();
  }
}