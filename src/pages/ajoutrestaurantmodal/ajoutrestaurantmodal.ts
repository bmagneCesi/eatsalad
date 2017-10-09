import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, Platform, ModalController } from 'ionic-angular';

import { DatabaseProvider } from './../../providers/database/database';

@Component({
  selector: 'page-ajoutrestaurantmodal',
  templateUrl: 'ajoutrestaurantmodal.html'
})
export class AjoutrestaurantmodalPage {

  ville = [];

  constructor(public viewCtrl: ViewController ,public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private databaseprovider: DatabaseProvider, public modalController:ModalController) {
    this.platform.ready().then(() => {
      this.databaseprovider.getVilleById(this.navParams.get('id_ville')).then((data) => {
        this.ville = data;
      });
    });
  }

  saveRestaurant(name, address, emails){
    if (name != "" && address != "" && emails != "") {
        let data = {
            'name': name,
            'address': address,
            'emails': emails,
            'ville': this.ville
        };

        this.databaseprovider.addRestaurant(data).then((data) => {
            this.viewCtrl.dismiss(data);
        });
    }
  }

  close(){
    this.viewCtrl.dismiss();
  }

}
