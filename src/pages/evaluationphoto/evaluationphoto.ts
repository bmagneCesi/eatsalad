import { Component } from '@angular/core';
import { NavParams, ViewController, Platform } from 'ionic-angular';

import { DatabaseProvider } from './../../providers/database/database';


@Component({
  selector: 'page-evaluationphoto',
  templateUrl: 'evaluationphoto.html',
})
export class EvaluationphotoPage {

  comment = '';
  photos = [];
  
  constructor(public navParams: NavParams, public platform: Platform, public viewCtrl: ViewController,  private databaseprovider: DatabaseProvider) {
    this.platform.ready().then(() => {
      this.databaseprovider.getQuestionResponseById(this.navParams.get('id_question_has_response')).then((data) => {
        this.comment = data;
        console.log(JSON.stringify(data));
      });
      this.databaseprovider.getResponsePhotoByIdQuestionHasResponse(this.navParams.get('id_question_has_response')).then((photos) => {
        for (var i = 0; i < photos.length; i++) {
          this.photos.push(photos[i]);
        }
      });
    });
  }

  close() {
      this.viewCtrl.dismiss();
  }

}