import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ModalController } from 'ionic-angular';

import { DatabaseProvider } from './../../providers/database/database';

import { EvaluationphotoPage } from './../evaluationphoto/evaluationphoto';

@Component({
  selector: 'page-archiveevaluation',
  templateUrl: 'archiveevaluation.html'
})
export class ArchiveEvaluationPage {

  id_evaluation:string;
  subcategories = [];
  categories = [];
  responses = [];
  evaluation = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private databaseprovider: DatabaseProvider, public modalController:ModalController) {
    this.platform.ready().then(() => {
        this.id_evaluation = this.navParams.get('id_evaluation');
        this.databaseprovider.getEvaluationById(this.id_evaluation).then((data) => {
          this.evaluation = data;
        });
        this.databaseprovider.getResponseByIdEvaluation(this.id_evaluation).then((data) => {
          for (var i = 0; i < data.length; i++) {
            data[i].question = data[i].question.replace(/\(.*\)/, '');
          }
          this.responses = data;
          this.databaseprovider.getCategories().then((categories) => {
            this.categories = categories;
          });
          this.databaseprovider.getSubCategories().then((subcategories) => {
            this.subcategories = subcategories;

          });
                   
        });
    });
  }

  photoShow(){
    let modal = this.modalController.create(EvaluationphotoPage);
    modal.onDidDismiss(data => {
        if(data != null)
        {     
            
        }
    });
    modal.present();
  }
}
