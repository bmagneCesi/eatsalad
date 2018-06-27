import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DatabaseProvider } from './../../providers/database/database';
import { GlobalProvider } from './../../providers/global/global';

/**
 * Generated class for the SignaturepdfpopoverPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signaturepdfpopover',
  templateUrl: 'signaturepdfpopover.html',
})
export class SignaturepdfpopoverPage {

  categories;
    evaluationAnswersPreview;
    serverUrl:string;

  constructor(
      private databaseprovider: DatabaseProvider,
      public navCtrl: NavController,
      public navParams: NavParams,
      public viewCtrl: ViewController,
      public global: GlobalProvider
  ) {
    this.evaluationAnswersPreview = this.navParams.get('evaluationAnswersPreview');
    this.categories = this.databaseprovider.getCategories();
    this.serverUrl = this.global.serverUrl;
  }

  dismissModal(){
    this.viewCtrl.dismiss();
  }


}
