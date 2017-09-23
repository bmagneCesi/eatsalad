import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, Platform, ModalController } from 'ionic-angular';

import { DatabaseProvider } from './../../providers/database/database';

@Component({
  selector: 'page-ajoutrestaurantmodal',
  templateUrl: 'ajoutrestaurantmodal.html'
})
export class AjoutrestaurantmodalPage {
    
  constructor(public viewCtrl: ViewController ,public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private databaseprovider: DatabaseProvider, public modalController:ModalController) {
    this.platform.ready().then(() => {
        
    });
  }

  saveRestaurant(name, address, postcode, city, emails){
    if (name != "" && address != "" && postcode != "" && city != "" && emails != "") {
        let data = {
            'name': name,
            'address': address,
            'postcode': postcode,
            'city': city,
            'emails': emails
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
