import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';

// Pages
import  { RestaurantlistPage } from '../restaurantlist/restaurantlist';

// Providers
import { DatabaseProvider } from './../../providers/database/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  user: string;
  password: string;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private databaseprovider: DatabaseProvider, public platform:Platform) {
    this.platform.ready().then(() => {
      this.databaseprovider.getDatabaseState().subscribe(rdy => {
        if (rdy) {
          // this.databaseprovider.resetDatabase();
          this.databaseprovider.getDatabaseState();
        }
      })
    });
  }
  
  loginAction(): void {
    if (this.user == "admin" && this.password == "admin") {
      this.navCtrl.push(RestaurantlistPage);
    }
    else
    {
      let alert = this.alertCtrl.create({
        title: 'Oups!',
        subTitle: 'Mauvaise combinaison utilisateur / mot de passe',
        buttons: ['Réessayer']
      });
      alert.present();
    }
    // this.navCtrl.push(RestaurantlistPage);
  }

}