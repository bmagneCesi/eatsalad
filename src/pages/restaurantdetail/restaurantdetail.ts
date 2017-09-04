import { RestaurantlistPage } from './../restaurantlist/restaurantlist';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

// Pages
import  { EvaluationCategoryPage } from '../evaluationcategory/evaluationcategory';
import  { ArchivePage } from '../archive/archive';

// Providers
import { DatabaseProvider } from './../../providers/database/database';

import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-restaurantdetail',
  templateUrl: 'restaurantdetail.html'
})
export class RestaurantDetailPage {

  id_restaurant:number;

  constructor(private nativeStorage: NativeStorage, public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private databaseprovider: DatabaseProvider) {
    this.platform.ready().then(() => {
      this.id_restaurant = this.navParams.get('id_restaurant');
    });
  }

  newEvaluationAction():void{
    // New evaluation in database
    this.databaseprovider.newEvaluation(this.id_restaurant).then((id_evaluation) => {
      this.nativeStorage.setItem('subcategories-done', []);
      this.navCtrl.push(EvaluationCategoryPage, {'id_restaurant': this.id_restaurant, 'id_evaluation': id_evaluation});
    });
  }

  showArchivesAction():void {
    this.navCtrl.push(ArchivePage, {'id_restaurant': this.id_restaurant});
  }

  backToRestaurants(){
    this.navCtrl.popTo(RestaurantlistPage);
  }

}
