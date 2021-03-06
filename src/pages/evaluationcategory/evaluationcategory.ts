import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
// Pages
import { EvaluationPage } from '../evaluation/evaluation';
import { RestaurantDetailPage } from '../restaurantdetail/restaurantdetail';
import { EvaluationCommentairePage } from '../evaluationcommentaire/evaluationcommentaire';

// Providers
import { DatabaseProvider } from './../../providers/database/database';

import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-evaluationcategory',
  templateUrl: 'evaluationcategory.html'
})
export class EvaluationCategoryPage {

  id_restaurant:string[] = [];
  categories:string[] = [];
  subcategories = [];
  id_evaluation:number;
  subcategoriesDone = [];
  photo;

  constructor(private nativeStorage: NativeStorage, public navCtrl: NavController, public navParams: NavParams, private databaseprovider: DatabaseProvider, public alertCtrl: AlertController, public platform: Platform) {
    this.platform.ready().then(() => {
      this.navCtrl.swipeBackEnabled = false;
      this.id_restaurant = this.navParams.get('id_restaurant');
      this.id_evaluation = this.navParams.get('id_evaluation');
      this.databaseprovider.getEvaluationByRestaurant(this.id_restaurant).then((data) => {
        console.log(JSON.stringify(data));
      });
      this.databaseprovider.getCategories().then((data) => {
        this.categories = data;
      });
      
      this.databaseprovider.getSubCategories().then((subcategories) => {
        this.subcategories = subcategories;
      });
      
    });
  }

  ionViewDidEnter(){
    this.nativeStorage.getItem('subcategories-done').then((data) => {
      console.log(data);
      this.subcategoriesDone = data;
    });
  }

  evaluateAction(category, subcategory, eraseAlert):void {

    if(eraseAlert)
    {
      let alert = this.alertCtrl.create({
        title: 'Évaluation déjà effectuée',
        message: 'Souhaitez vous recommencer l\'évaluation ' + subcategory.name + ' ?',
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel'
          },
          {
            text: 'Recommencer',
            cssClass: 'alertDanger',
            handler: () => {
              for (var i = 0; i <  this.subcategoriesDone.length; i++){
                if ( this.subcategoriesDone[i] === subcategory.id_question_subcategory) { 
                     this.subcategoriesDone.splice(i, 1);
                    break;
                }
              }
              this.nativeStorage.setItem('subcategories-done', this.subcategoriesDone);
              this.databaseprovider.deleteEvaluationSubcategory(subcategory.id_question_subcategory, this.id_evaluation).then(() => {
                this.navCtrl.push(EvaluationPage, {'category': category, 'subcategory':subcategory, 'id_restaurant': this.id_restaurant, 'id_evaluation': this.id_evaluation});           
              });     
            }
          }
        ]
      });
      alert.present();
    }
    else
    {
      this.navCtrl.push(EvaluationPage, {'category': category, 'subcategory':subcategory, 'id_restaurant': this.id_restaurant, 'id_evaluation': this.id_evaluation});
    }
  }

  validateEvaluation(){
    this.navCtrl.push(EvaluationCommentairePage, {'id_evaluation': this.id_evaluation, 'id_restaurant': this.id_restaurant});
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
