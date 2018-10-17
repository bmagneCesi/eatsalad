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
    });
  }

  close() {
      this.viewCtrl.dismiss();
  }

}