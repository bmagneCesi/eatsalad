import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

// Providers
import { DatabaseProvider } from './../../providers/database/database';

// Pages
import { SignaturePage } from '../signature/signature';


@Component({
  selector: 'page-evaluationcommentaire',
  templateUrl: 'evaluationcommentaire.html'
})
export class EvaluationCommentairePage {

    id_evaluation:number;
    id_restaurant:number;
    
  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private databaseprovider: DatabaseProvider) {
    this.platform.ready().then(() => {
      this.navCtrl.swipeBackEnabled = false;
      this.id_evaluation = this.navParams.get('id_evaluation');
      this.id_restaurant = this.navParams.get('id_restaurant');
    });
  }

  validate(comment){
      this.databaseprovider.addEvaluationComment(this.id_evaluation, comment).subscribe(() => {
        this.navCtrl.push(SignaturePage, {'id_evaluation': this.id_evaluation, 'id_restaurant': this.id_restaurant});
      });
  }

}
