import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, Platform, ModalController } from 'ionic-angular';

import { DatabaseProvider } from './../../providers/database/database';

/**
 * Generated class for the AjoutvillemodalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-ajoutvillemodal',
  templateUrl: 'ajoutvillemodal.html',
})
export class AjoutvillemodalPage {
  
    constructor(public viewCtrl: ViewController ,public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private databaseprovider: DatabaseProvider, public modalController:ModalController) {
      this.platform.ready().then(() => {

      });
    }
  
    saveVille(name, postcode){
      if (name != "" && postcode) {
          let data = {
              'name': name.toUpperCase(),
              'postcode': postcode,
          };
  
          this.databaseprovider.addVille(data).then((data) => {
              this.viewCtrl.dismiss(data);
          });
      }
    }
  
    close(){
      this.viewCtrl.dismiss();
    }
}
