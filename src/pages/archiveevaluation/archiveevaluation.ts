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
        this.databaseprovider.getResponseByIdEvaluationByCategory(this.id_evaluation, this.id_category).then((data) => {
          for (var i = 0; i < data.length; i++) {
            data[i].question = data[i].question.replace(/\(.*\)/, '');
          }
          this.responses = data;
          console.log(JSON.stringify(data));
          this.databaseprovider.getCategory(this.id_category).subscribe((category) => {
            this.category = category;
          });

          this.databaseprovider.getResponseScoreByIdEvaluationByCategory(this.id_evaluation, this.id_category).then((responseScore) => {
            let subcategories = [];

            for (var i = 0; i < responseScore.length; i++) {
                let percent = Math.round((responseScore[i].responseScore / (responseScore[i].nbResponse * 3)) * 100);
                subcategories.push({'question_category_id': responseScore[i].question_category_id, 'score': percent, 'name': responseScore[i].name, 'id_question_subcategory': responseScore[i].id_question_subcategory});
            }
            this.subcategories = subcategories;
          });

          this.databaseprovider.getResponsePhotoByEvaluation(this.id_evaluation).then((photos) => {
            for (var i = 0; i < photos.length; i++) {
              this.photos.push(photos[i].question_has_response_id);              
            }
          });
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