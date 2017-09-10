import { AjoutquestionmodalPage } from './../ajoutquestionmodal/ajoutquestionmodal';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ModalController } from 'ionic-angular';

import { DatabaseProvider } from './../../providers/database/database';

@Component({
  selector: 'page-ajoutquestion',
  templateUrl: 'ajoutquestion.html'
})
export class AjoutquestionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private databaseprovider: DatabaseProvider, public modalController:ModalController) {
    this.platform.ready().then(() => {
       
    });
  }

  addCategory(){
    let modal = this.modalController.create(AjoutquestionmodalPage, {'type': 'categorie'});
    modal.onDidDismiss(data => {
        
    });
    modal.present();
  }

  addSubcategory(){
    let modal = this.modalController.create(AjoutquestionmodalPage, {'type': 'sous-categorie'});
    modal.onDidDismiss(data => {

    });
    modal.present();
  }

  addQuestion(){
    let modal = this.modalController.create(AjoutquestionmodalPage, {'type': 'question'});
    modal.onDidDismiss(data => {

    });
    modal.present();
  }
  

}
