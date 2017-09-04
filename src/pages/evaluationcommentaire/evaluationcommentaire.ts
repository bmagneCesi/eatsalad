import { Component, ViewChild } from '@angular/core';
import { Slides, NavController, NavParams, AlertController, Platform } from 'ionic-angular';

// Native components
import { NativeStorage } from '@ionic-native/native-storage';

// Providers
import { DatabaseProvider } from './../../providers/database/database';
import { Camera, CameraOptions } from '@ionic-native/camera';

// Pages
import { EvaluationCategoryPage } from '../evaluationcategory/evaluationcategory';
import { SignaturePage } from '../signature/signature';


@Component({
  selector: 'page-evaluationcommentaire',
  templateUrl: 'evaluationcommentaire.html'
})
export class EvaluationCommentairePage {

    id_evaluation:number;
    id_restaurant:number;
    
  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private databaseprovider: DatabaseProvider, private nativeStorage: NativeStorage) {
    this.platform.ready().then(() => {
      this.navCtrl.swipeBackEnabled = false;
      this.id_evaluation = this.navParams.get('id_evaluation');
      this.id_evaluation = this.navParams.get('id_restaurant');
    });
  }

  validate(comment){
      this.databaseprovider.addEvaluationComment(this.id_evaluation, comment).then(() => {
        this.navCtrl.push(SignaturePage, {'id_evaluation': this.id_evaluation, 'id_restaurant': this.id_restaurant});
      });
  }

}
