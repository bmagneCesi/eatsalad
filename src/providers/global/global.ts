import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController, AlertController, ModalController, Platform, LoadingController, ToastController } from 'ionic-angular';

/*
  Generated class for the GlobalProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GlobalProvider {

  public serverUrl: string = 'http://46.101.45.175';

  constructor(
      public http: Http,
      public toastCtrl: ToastController
  ) {

  }

    /*
    * _______________
    *
    * Show msg notification
    * _______________
    *
    * */
    public presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 5000,
            position: 'top'
        });
        toast.present();
    }


}