import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';


// Pages
import { HomePage } from '../home/home';
import { RestaurantDetailPage } from '../restaurantdetail/restaurantdetail';

// Providers
import { DatabaseProvider } from './../../providers/database/database';

@Component({
  selector: 'page-restaurantlist',
  templateUrl: 'restaurantlist.html'
})
export class RestaurantlistPage {
  
  restaurants: string[] = [];

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private databaseprovider: DatabaseProvider ) {
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

  addRestaurantAction(): void {
    let alert = this.alertCtrl.create({
      title: 'Ajouter un restaurant',
      inputs: [
        {
          name: 'name',
          placeholder: 'Nom du restaurant' 
        },
        {
          name: 'address',
          placeholder: 'Adresse' 
        },
        {
          name: 'postcode',
          placeholder: 'Code postal' 
        },
        {
          name: 'city',
          placeholder: 'Ville' 
        },
        {
          name: 'emails',
          placeholder: 'Adresses email (séparer par une virgule)' 
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Ajouter',
          handler: data => {
            if (data.name != "") {
              this.databaseprovider.addRestaurant(data.name);
              this.getRestaurants();
            } else {
              // invalid name
              return false;
            }
          }
        }
      ]
    });
    alert.present();
    
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
