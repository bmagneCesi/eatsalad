import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-evaluationphoto',
  templateUrl: 'evaluationphoto.html',
})
export class EvaluationphotoPage {

  
  constructor(public navParams: NavParams, public viewCtrl: ViewController) {

    }

    drawComplete() {
        this.viewCtrl.dismiss();
    }


}