import { AjoutquestionPage } from './../ajoutquestion/ajoutquestion';
import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, Platform } from 'ionic-angular';


// Pages
import { HomePage } from '../home/home';
import { RestaurantlistPage } from '../restaurantlist/restaurantlist';
import { AjoutvillemodalPage } from '../ajoutvillemodal/ajoutvillemodal';

// Providers
import { DatabaseProvider } from './../../providers/database/database';
/**
 * Generated class for the VillelistPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-villelist',
  templateUrl: 'villelist.html',
})
export class VillelistPage {
  villes = [];
  constructor(public platform: Platform, public navCtrl: NavController, public modalCtrl: ModalController, public alertCtrl: AlertController, private databaseprovider: DatabaseProvider ) {
    this.platform.ready().then(() => {
      this.databaseprovider.getVilles().subscribe(data => {
        this.villes = data;
        console.log(JSON.stringify(data));
      });
    });
  }

  // Return on homepage
  logoutAction(): void {
    this.navCtrl.popTo(HomePage);
  }

  showRestaurantAction(id_ville): void{
    this.navCtrl.push(RestaurantlistPage, {'id_ville': id_ville});
  }

  addVilleAction(): void {

      let modal = this.modalCtrl.create(AjoutvillemodalPage);
      modal.onDidDismiss(data => {
        if(data)
          this.getVilles();
      });
      modal.present();    
  }


  // Get restaurants
  getVilles() {
    this.databaseprovider.getVilles().then(data => {
      this.villes = data;
    })
  }

}
