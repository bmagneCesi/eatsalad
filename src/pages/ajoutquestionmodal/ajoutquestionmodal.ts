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

  close(){
    this.viewCtrl.dismiss();
  }

}
