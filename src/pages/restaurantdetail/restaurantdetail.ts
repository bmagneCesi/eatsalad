import { RestaurantlistPage } from './../restaurantlist/restaurantlist';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

// Pages
import  { EvaluationCategoryPage } from '../evaluationcategory/evaluationcategory';
import  { ArchivePage } from '../archive/archive';

// Providers
import { DatabaseProvider } from './../../providers/database/database';

@Component({
  selector: 'page-restaurantdetail',
  templateUrl: 'restaurantdetail.html'
})
export class RestaurantDetailPage {

    id_restaurant:number;
    hasEvaluation:boolean = false;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public platform: Platform,
        private databaseprovider: DatabaseProvider
    ) {
        this.platform.ready().then(() => {
            this.id_restaurant = this.navParams.get('id_restaurant');
            this.databaseprovider.getRestaurantEvaluations(this.id_restaurant).subscribe((data) => {
                if (data.length > 0) {
                    this.hasEvaluation = true;
                }
            });
        });
    }

    /*
    * _______________
    *
    * Add Evaluation
    * _______________
    * */
    addEvaluationAction():void{
        let data = {
            'id_restaurant' : this.id_restaurant,
            'subcategories_done' : []
        };
        this.databaseprovider.addEvaluation(data).subscribe((data) => {
            this.navCtrl.push(EvaluationCategoryPage, {'id_restaurant': this.id_restaurant, 'id_evaluation': data.id_evaluation});
        });
    }

    /*
    * __________________
    *
    * Show Archive page
    * __________________
    * */
    showArchivesAction():void {
        this.navCtrl.push(ArchivePage, {'id_restaurant': this.id_restaurant});
    }

    /*
    * ________________________
    *
    * Back to Restaurant page
    * ________________________
    * */
    backToRestaurants(){
        this.navCtrl.popTo(RestaurantlistPage);
    }

}
