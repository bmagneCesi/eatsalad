import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, NavParams, Platform, LoadingController } from 'ionic-angular';


// Pages
import { HomePage } from '../home/home';
import { RestaurantDetailPage } from '../restaurantdetail/restaurantdetail';
import { AjoutrestaurantmodalPage } from '../ajoutrestaurantmodal/ajoutrestaurantmodal';
import { AjoutquestionPage } from './../ajoutquestion/ajoutquestion';

// Providers
import { DatabaseProvider } from './../../providers/database/database';

@Component({
  selector: 'page-restaurantlist',
  templateUrl: 'restaurantlist.html'
})
export class RestaurantlistPage {
  
  restaurants = [];
  id_ville:number;

  constructor(
      public navParams: NavParams,
      public platform: Platform,
      public navCtrl: NavController,
      public modalCtrl: ModalController,
      public alertCtrl: AlertController,
      private databaseprovider: DatabaseProvider,
      public loadingCtrl: LoadingController){

          this.platform.ready().then(() => {
            this.id_ville = this.navParams.get('id_ville');
            this.getRestaurantsByCity(this.id_ville);
          });

  }


  // Return on homepage
  logoutAction(): void {
    this.navCtrl.popTo(HomePage);
  }

  showRestaurantAction(id_restaurant): void{
    this.navCtrl.push(RestaurantDetailPage, {'id_restaurant': id_restaurant});
  }

  addQuestion(): void{
    this.navCtrl.push(AjoutquestionPage);
  }

  addRestaurantAction(): void {
      let modal = this.modalCtrl.create(AjoutrestaurantmodalPage, {'type': 'categorie', 'id_ville': this.id_ville});
      modal.onDidDismiss(data => {
        if(data)
          this.getRestaurantsByCity(this.id_ville);
      });
      modal.present();    
  }

  deleteRestaurantAction(restaurant):void {
    this.databaseprovider.deleteRestaurant(restaurant.id_restaurant).then(data => {
      this.getRestaurantsByCity(this.id_ville);
    });
  }

  // Get restaurants by city
  getRestaurantsByCity(id_ville) {
      let loading = this.loadingCtrl.create({
          content: 'Chargement...'
      });
      loading.present();
    this.databaseprovider.getRestaurantsByCity(id_ville).subscribe(data => {
      loading.dismiss();
      this.restaurants = data;
    })
  }

}
