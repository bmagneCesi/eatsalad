import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { DatabaseProvider } from './../../providers/database/database';


@Component({
  selector: 'page-evaluationphoto',
  templateUrl: 'evaluationphoto.html',
})
export class EvaluationphotoPage {

  photos = [];
  
  constructor(public navParams: NavParams, public viewCtrl: ViewController,  private databaseprovider: DatabaseProvider) {
    this.databaseprovider.getResponsePhoto(this.navParams.get('id_question_has_response')).then((photos) => {
      this.photos = photos;
      console.log(photos);
    });

  }

  close() {
      this.viewCtrl.dismiss();
  }


}