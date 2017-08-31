import { Component, ViewChild } from '@angular/core';
import { Slides, NavController, NavParams, AlertController, Platform } from 'ionic-angular';

// Native components
import { NativeStorage } from '@ionic-native/native-storage';

// Providers
import { DatabaseProvider } from './../../providers/database/database';
import { Camera, CameraOptions } from '@ionic-native/camera';

// Pages



@Component({
  selector: 'page-signature',
  templateUrl: 'signature.html'
})
export class SignaturePage {

    id_evaluation:number;
    responses = [];
    
    constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private databaseprovider: DatabaseProvider, private nativeStorage: NativeStorage) {
        this.platform.ready().then(() => {
            this.navCtrl.swipeBackEnabled = false;
            this.id_evaluation = this.navParams.get('id_evaluation');
        });
    }

    signAction(){
        
    }

}
