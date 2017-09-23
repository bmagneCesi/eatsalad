import { AjoutquestionPage } from './../ajoutquestion/ajoutquestion';
import { Component } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';


// Pages
import { HomePage } from '../home/home';
import { RestaurantDetailPage } from '../restaurantdetail/restaurantdetail';
import { AjoutrestaurantmodalPage } from '../ajoutrestaurantmodal/ajoutrestaurantmodal';

// Providers
import { DatabaseProvider } from './../../providers/database/database';

@Component({
  selector: 'page-restaurantlist',
  templateUrl: 'restaurantlist.html'
})
export class RestaurantlistPage {
  
  restaurants: string[] = [];

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public alertCtrl: AlertController, private databaseprovider: DatabaseProvider ) {
    this.databaseprovider.getAllRestaurants().then(data => {
      this.restaurants = data;
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

      let modal = this.modalCtrl.create(AjoutrestaurantmodalPage, {'type': 'categorie'});
      modal.onDidDismiss(data => {
        if(data)
          this.getRestaurants();
      });
      modal.present();    
  }

  deleteRestaurantAction(restaurant):void {
    this.databaseprovider.deleteRestaurant(restaurant.id_restaurant).then(data => {
      this.getRestaurants();
    });
  }

  // Get restaurants
  getRestaurants() {
    this.databaseprovider.getAllRestaurants().then(data => {
      this.restaurants = data;
    })
  }

}
