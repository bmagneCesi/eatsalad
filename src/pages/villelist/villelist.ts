import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, Platform, LoadingController, ToastController } from 'ionic-angular';
import { GlobalProvider } from "../../providers/global/global";


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

    constructor(
        public global:GlobalProvider,
      public platform: Platform,
      public navCtrl: NavController,
      public modalCtrl: ModalController,
      public alertCtrl: AlertController,
      private databaseprovider: DatabaseProvider,
      public toastCtrl: ToastController,
      public loadingCtrl: LoadingController){

        this.platform.ready().then(() => {
          this.getCities();
        });

    }

    /*
    * __________________
    *
    * Return homepage
    * __________________
    *
    * */
    logoutAction(): void {
        this.navCtrl.popTo(HomePage);
    }

    /*
    * __________________
    *
    * Go to restaurant list page
    * __________________
    *
    * */
    showRestaurantAction(id_ville): void{
        this.navCtrl.push(RestaurantlistPage, {'id_ville': id_ville});
    }

    /*
    * __________________
    *
    * Add city
    * __________________
    *
    * */
    addCityAction(): void {
        let modal = this.modalCtrl.create(AjoutvillemodalPage);
        modal.onDidDismiss(data => {
            if(data)
                this.getCities();
        });
        modal.present();
    }


    /*
    * __________________
    *
    * Get cities
    * __________________
    *
    * */
    getCities() {
        let loading = this.loadingCtrl.create({
            content: 'Récupération des villes, veuillez patienter...'
        });
        loading.present();
        this.databaseprovider.getCities().subscribe(data => {
            this.villes = data;
        }, err => {
            this.global.presentToast(err);
        }, () => {
            loading.dismiss();
        });
    }

}
