import { RestaurantlistPage } from './../restaurantlist/restaurantlist';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController } from 'ionic-angular';

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
        private databaseprovider: DatabaseProvider,
    public loadingCtrl: LoadingController
) {
        this.platform.ready().then(() => {
            this.id_restaurant = this.navParams.get('id_restaurant');
            this.getRestaurantEvaluations(this.id_restaurant);
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
        console.log(JSON.stringify(data));
        this.databaseprovider.addEvaluation(data).subscribe((id_evaluation) => {
            this.navCtrl.push(EvaluationCategoryPage, {'id_restaurant': this.id_restaurant, 'id_evaluation': id_evaluation});
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

    /*
    * _______________________
    *
    * Get restaurants by city
    * _______________________
    * */
    getRestaurantEvaluations(id_restaurant) {
        let loading = this.loadingCtrl.create({
            content: 'Chargement des informations du restaurant...'
        });
        loading.present();
        this.databaseprovider.getRestaurantEvaluations(id_restaurant).subscribe((data) => {
            if (data.length > 0) {
                this.hasEvaluation = true;
            }
            loading.dismiss();
        });
    }

}
