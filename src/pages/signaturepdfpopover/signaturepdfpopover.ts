import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DatabaseProvider } from './../../providers/database/database';

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

  pdf:string;
  id_evaluation:number;
  scoretotal:number;
  categoryStat = [];
  subCategoryStat = [];
  responses = [];

  constructor(private databaseprovider: DatabaseProvider, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.id_evaluation = this.navParams.get('id_evaluation');
    this.databaseprovider.getResponseByIdEvaluation(this.id_evaluation).then((responses) => {
      
      this.databaseprovider.getResponseScoreByIdEvaluation(this.id_evaluation).then((data) => {
          var subCategoryStat = [];
          var categoryStat = [];
          let total = 0;
          let totalNb = 0;

          for (var i = 0; i < data.length; i++) {
              let percent = Math.round((data[i].responseScore / (data[i].nbResponse * 3)) * 100);
              total += percent;
              totalNb++;
              subCategoryStat.push({'category': data[i].category, 'subcategory': data[i].subcategory, 'score': percent, 'id_question_subcategory': data[i].id_question_subcategory, 'question_category_id': data[i].question_category_id});  

              var found = categoryStat.some(function (el) {
                return el.category === data[i].category;
              });
              if (!found) { categoryStat.push({'category': data[i].category, 'id_question_category': data[i].id_question_category}); }   

          }

          this.scoretotal = Math.round((total/(totalNb*100))*100);

          this.categoryStat = categoryStat;
          this.subCategoryStat = subCategoryStat;
          this.responses = responses;
        });
        
    });
  }

  dismissModal(){
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    this.pdf = this.navParams.get('pdf');
  }

}
