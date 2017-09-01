import { Component, ViewChild } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { SignaturePage } from '../signature/signature';

@Component({
  selector: 'page-signaturepopover',
  templateUrl: 'signaturepopover.html',
})
export class SignaturepopoverPage {
  @ViewChild(SignaturePad) public signaturePad : SignaturePad;

  public signaturePadOptions : Object = {
    'minWidth': 2,
    'canvasWidth': 340,
    'canvasHeight': 200
  };
  public signatureImage;
    
  from:string;

  constructor(public navParams: NavParams, public viewCtrl: ViewController) {
    this.from = this.navParams.get('from');
  }

   //Other Functions

    drawCancel() {
        this.viewCtrl.dismiss();
    }

    drawComplete() {
        this.signatureImage = {'signature': this.signaturePad.toDataURL(), 'from': this.from};
        this.viewCtrl.dismiss(this.signatureImage);
    }

    drawClear() {
        this.signaturePad.clear();
    }

    canvasResize() {
        let canvas = document.querySelector('canvas');
        this.signaturePad.set('minWidth', 1);
        this.signaturePad.set('canvasWidth', canvas.offsetWidth);
        this.signaturePad.set('canvasHeight', canvas.offsetHeight);
    }

    ngAfterViewInit() {
        this.signaturePad.clear();
        this.canvasResize();
    }

}