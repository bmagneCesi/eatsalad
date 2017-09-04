import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { DatabaseProvider } from './../../providers/database/database';

@Component({
  selector: 'page-archiveevaluation',
  templateUrl: 'archiveevaluation.html'
})
export class ArchiveEvaluationPage {

  id_evaluation:string;
  subcategories = [];
  categories = [];
  responses = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private databaseprovider: DatabaseProvider) {
    this.platform.ready().then(() => {
        this.id_evaluation = this.navParams.get('id_evaluation');
        this.databaseprovider.getResponseByIdEvaluation(this.id_evaluation).then((data) => {
          this.responses = data;
          console.log('Responses: ' + JSON.stringify(data));
          this.databaseprovider.getCategories().then((categories) => {
            this.categories = categories;
          });
          this.databaseprovider.getSubCategories().then((subcategories) => {
            this.subcategories = subcategories;
            console.log('Subcategories: ' + JSON.stringify(subcategories)); 
          });
                   
        });
    });
  }

  ionViewDidLoad(){
    
  }
}
