import { EvaluationCategoryPage } from './../evaluationcategory/evaluationcategory';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
// Pages
import { EvaluationPage } from '../evaluation/evaluation';
import { RestaurantDetailPage } from '../restaurantdetail/restaurantdetail';
import { EvaluationCommentairePage } from '../evaluationcommentaire/evaluationcommentaire';

// Providers
import { DatabaseProvider } from './../../providers/database/database';

import { NativeStorage } from '@ionic-native/native-storage';

/**
 * Generated class for the EvaluationMainCategoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-evaluation-main-category',
  templateUrl: 'evaluation-main-category.html',
})
export class EvaluationMainCategoryPage {
  categories = [];
  id_restaurant:string[] = [];
  id_evaluation:number;  

  constructor(public alertCtrl: AlertController, public nativeStorage: NativeStorage, private databaseprovider: DatabaseProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.databaseprovider.getCategories().then((data) => {
      this.categories = data;
    });
    this.navCtrl.swipeBackEnabled = false;
    this.id_restaurant = this.navParams.get('id_restaurant');
    this.id_evaluation = this.navParams.get('id_evaluation');
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EvaluationMainCategoryPage');
  }

  showSubcategories(id_category){
    this.navCtrl.push(EvaluationCategoryPage, {'id_restaurant': this.id_restaurant, 'id_evaluation': this.id_evaluation, 'id_category': id_category});
  }

  cancelEvaluation():void {
    let alert = this.alertCtrl.create({
      title: 'Annuler l\'évaluation ?',
      message: 'En revenant au menu précédant, vous perdrez toutes les informations relative à l\'évaluation en cours.',
      buttons: [
        {
          text: 'Annuler',
          cssClass: 'alertDanger',
          handler: () => {

            this.databaseprovider.cancelEvaluation(this.id_evaluation);
            this.nativeStorage.setItem('subcategories-done', []);
            this.navCtrl.popTo(RestaurantDetailPage, {'id_restaurant': this.id_restaurant});

          }
        },
        {
          text: 'Poursuivre',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }

}
