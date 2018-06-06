import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, Platform, ModalController } from 'ionic-angular';

import { DatabaseProvider } from './../../providers/database/database';

@Component({
  selector: 'page-ajoutquestionmodal',
  templateUrl: 'ajoutquestionmodal.html'
})
export class AjoutquestionmodalPage {

    modaltitle:string;
    categories = [];
    subcategories = [];
    loadedCategories = [];
    
  constructor(public viewCtrl: ViewController ,public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private databaseprovider: DatabaseProvider, public modalController:ModalController) {
    this.platform.ready().then(() => {
        this.modaltitle = this.navParams.get('type');
        if (this.navParams.get('type') == 'sous-categorie') {
            this.databaseprovider.getCategories().subscribe((data) => {
                this.categories = data;
            });
        }
        if (this.navParams.get('type') == 'question') {
            this.databaseprovider.getCategories().subscribe((data) => {
                this.categories = data;
            });
        }
    });
  }

  loadSubcategories(id_question_category){
      this.databaseprovider.getSubcategoriesByCategory(id_question_category).then((data) => {
        this.subcategories = data;
      });
  }

  saveCategory(name){
    this.databaseprovider.newCategory(name).then((data) => {
        this.viewCtrl.dismiss();
    });
  }

  saveSubcategory(name, category){
    this.databaseprovider.newSubcategory(name, category).then((data) => {
        this.viewCtrl.dismiss();
    });
  }

  saveQuestion(name, subcategory){
    this.databaseprovider.newQuestion(name, subcategory).then((data) => {
        this.viewCtrl.dismiss();
    });
  }

  close(){
    this.viewCtrl.dismiss();
  }

}
