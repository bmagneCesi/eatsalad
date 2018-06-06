import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, Platform, ModalController, ToastController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { EmailComposer } from '@ionic-native/email-composer';
import { LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { DatabaseProvider } from './../../providers/database/database';
import  { ArchiveEvaluationPage } from '../archiveevaluation/archiveevaluation';
declare var cordova: any;
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';

@Component({
  selector: 'page-statistic',
  templateUrl: 'statistic.html'
})
export class StatisticPage {
  
  evaluation = [];
  categoryStat = [];
  baratLogo = '';
  logoEatSalad = '';
  id_evaluation: number;
  id_restaurant: number;
  restaurant = [];
  signatureController: string;
  signatureFranchised: string;
  controllerName: string;
  hour: number;
  minutes: number;
  pdfEvaluationName: string;

  constructor(public http: Http, private transfer: Transfer, public loadingController:LoadingController, private fileOpener: FileOpener, private emailComposer: EmailComposer, public toastCtrl: ToastController, public viewCtrl: ViewController, public file: File, public modalController: ModalController, public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private databaseprovider: DatabaseProvider) {
    this.platform.ready().then(() => {
        this.id_evaluation = this.navParams.get('id_evaluation');   
        this.id_restaurant = this.navParams.get('id_restaurant');   
        this.databaseprovider.getEvaluation(this.id_evaluation).subscribe((data) => {
          this.evaluation = data;
        });        
        this.databaseprovider.getTotalResponseScoreByIdEvaluation(this.id_evaluation).then((data) => {
          for (var i = 0; i < data.length; i++) {
              let percent = Math.round((data[i].responseScore / (data[i].nbResponse * 3)) * 100);
              this.categoryStat.push({'id_category': data[i].id_category, 'category': data[i].category, 'score': percent});
          }
        });
      this.databaseprovider.getEvaluation(this.id_evaluation).subscribe((data) => {
        this.evaluation = data;
        this.databaseprovider.getRestaurant(this.id_restaurant).subscribe((res) => {
          this.restaurant = res;
          console.log('res: ' + JSON.stringify(res));
          console.log('res2: ' + res);
        });
      });
      this.logoEatSalad = 'data:image/png;base64,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';
              
    });
  }

  generatePdf(){
    let loading = this.loadingController.create({ content: "Génération du pdf, veuillez patienter..." });
    loading.present();

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
          subCategoryStat.push({ 'category': data[i].category, 'subcategory': data[i].subcategory, 'score': percent, 'id_question_subcategory': data[i].id_question_subcategory, 'question_category_id': data[i].question_category_id });

          var found = categoryStat.some(function (el) {
            return el.category === data[i].category;
          });
          if (!found) { categoryStat.push({ 'category': data[i].category, 'id_question_category': data[i].id_question_category }); }

        }

        categoryStat.forEach(category => {


          subCategoryStat.forEach(subcategory => {

            if (subcategory.category == category.category) {


              responses.forEach(response => {

                if (response.id_question_subcategory == subcategory.id_question_subcategory && subcategory.question_category_id == category.id_question_category) {

                  for (var i = 0; i < response.photos.length; i++) {
                    if (response.photos[i] != null) {
                      // Destination URL
                      var url = "http://crazyabout.it/eatsalad/eatsalad-img.php";

                      // File name only
                      var filename = response.photos[i].replace(/.*\/(?!.*\/)/, '');

                      var options = {
                        fileKey: "file",
                        fileName: filename,
                        chunkedMode: false,
                        mimeType: "multipart/form-data",
                        params: {
                          'id_evaluation': this.id_evaluation,
                          'id_category': category.id_question_category,
                          'id_subcategory': subcategory.id_question_subcategory,
                          'id_question': response.id_question,
                        }
                      };

                      const fileTransfer: TransferObject = this.transfer.create();

                      // Use the FileTransfer to upload the image
                      fileTransfer.upload(response.photos[i], url, options).then(data => {

                      }, err => {
                        this.presentToast('Error while uploading files');
                        console.log('Error while uploading files: ' + JSON.stringify(err));
                      });
                    }
                  }
                }
              });
            }
          });

        });

        let dataArr = {
            'total': total,
            'totalNb': totalNb,
            'id_evaluation': this.id_evaluation,
            'categoryStat': categoryStat,
            'subCategoryStat': subCategoryStat,
            'responses': responses,
            'restaurant': this.restaurant,
            'evaluation': this.evaluation
        };

        // console.log('dataSent: ' + JSON.stringify(dataArr));

        let headers: any = new Headers({ 'Content-Type': 'application/json' }),
          url: any = "http://crazyabout.it/eatsalad/eatsalad-pdf_dev.php";

        this.http.post(url, JSON.stringify(dataArr), headers)
          .subscribe((data: any) => {

            cordova.plugins.pdf.htmlToPDF({
              url: data['_body'],
              documentSize: "A4",
              landscape: "portrait",
              type: "base64"
            },
              (compteRendu) => {

                    // console.log('conversion pdf: ' + JSON.stringify(success1));
                    let htmlEmail = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
                    htmlEmail += '<html xmlns="http://www.w3.org/1999/xhtml">';
                    htmlEmail += '<head>';
                    htmlEmail += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';
                    htmlEmail += '<title></title>';
                    htmlEmail += '<style>*{font-family: "Helvetica, sans-serif"}</style>'
                    htmlEmail += '</head>';
                    htmlEmail += '<body>';
                    htmlEmail += '<table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">';
                    htmlEmail += '<tr>';
                    htmlEmail += '<td align="center" valign="top">';
                    htmlEmail += '<table style="padding:0px" width="100%" border="0" cellpadding="20" cellspacing="0" id="emailContainer">';
                    htmlEmail += '<tr style="background-color:#ffffff;padding:50px">';
                    htmlEmail += '<td style="padding-bottom: 0px;" align="center" valign="top">';
                    htmlEmail += '<table border="0" style="padding:0 8%" cellpadding="20" cellspacing="0" width="100%" id="emailHeader">';
                    htmlEmail += '<tr>';
                    htmlEmail += '<td style="padding-bottom: 0px;" align="center" valign="top">';
                    htmlEmail += '<table border="0" style="background-color:#fff" cellpadding="20" cellspacing="0" width="100%" id="emailHeader">';
                    htmlEmail += '<tr>';
                    htmlEmail += '<td align="center" valign="top">';
                    htmlEmail += '<img width="50%" src="' + this.logoEatSalad + '" alt="">';
                    htmlEmail += '</td>';
                    htmlEmail += '</tr>';
                    htmlEmail += '</table>';
                    htmlEmail += '</td>';
                    htmlEmail += '</tr>';
                    htmlEmail += '</table>';
                    htmlEmail += '</td>';
                    htmlEmail += '</tr>';
                    htmlEmail += '<tr>';
                    htmlEmail += '<td style="padding-top: 0px;" align="center" valign="top">';
                    htmlEmail += '<table border="0" style="padding:0 8%" cellpadding="20" cellspacing="0" width="100%" id="emailBody">';
                    htmlEmail += '<tr>';
                    htmlEmail += '<td style="padding-top: 0px;" align="center" valign="top">';
                    htmlEmail += '<h1 style="font-family:Helvetica, sans-serif;color: #FFFFFF;text-align: center;font-weight: 500;font-size: 25px;margin: 0px auto;border:none;"></h1>';
                    htmlEmail += '<table border="0" style="background-color: #89BD29;" cellpadding="20" cellspacing="0" width="100%" id="emailBody">';
                    htmlEmail += '<tr>';
                    htmlEmail += '<td style="padding:100px" align="center" valign="top">';
                    htmlEmail += '<p style="font-family:Helvetica, sans-serif;color: #FFFFFF;text-align: left;font-weight: 300;font-size: 20px;">';
                    htmlEmail += 'Bonjour,';
                    htmlEmail += '<br>';
                    htmlEmail += '<br>';
                    htmlEmail += 'Vous trouverez ci-dessous le compte rendu de notre visite du ' + this.evaluation['date'] + ' ainsi que le rapport signé.';
                    htmlEmail += '<br>';
                    htmlEmail += '<br>';
                    htmlEmail += 'Cordialement,';
                    htmlEmail += '<br>';
                    htmlEmail += '<br>';
                    htmlEmail += 'L\'équipe Eatsalad.';
                    htmlEmail += '</p>';
                    htmlEmail += '</td>';
                    htmlEmail += '</tr>';
                    htmlEmail += '</table>';
                    htmlEmail += '</td>';
                    htmlEmail += '</tr>';
                    htmlEmail += '</table>';
                    htmlEmail += '</td>';
                    htmlEmail += '</tr>';
                    htmlEmail += '</table>';
                    htmlEmail += '</td>';
                    htmlEmail += '</tr>';
                    htmlEmail += '</table>';
                    htmlEmail += '</body>';
                    htmlEmail += '</html>';

                    let emailsArr = this.restaurant['emails'].split(';');
                    let email = {
                      to: emailsArr,
                      bcc: ['colin.delorme@eatsalad.fr', 'wahid.benserir@eatsalad.fr'],
                      attachments: [
                        'base64:compte-rendu.pdf//' + compteRendu,
                      ],
                      subject: '[EatSalad] Compte rendu de la visite du ' + this.evaluation['date'],
                      body: htmlEmail,
                      isHtml: true
                    };

                    loading.dismissAll();

                    this.emailComposer.open(email);

                  }, (error) => {
                    this.presentToast('Error generating email.');
                    console.log('erreur generation de l\'email: ' + error);
                  });

          },
          (error: any) => {
            this.presentToast('Error writing PDFposting data to server.');
            console.log('Erreur post data vers serveur : ' + JSON.stringify(error));
          });


      }, (error) => {
        this.presentToast('error:' + JSON.stringify(error));
        console.log('erreur2: ' + error);
      });
    }, (error) => {
      this.presentToast('error:' + JSON.stringify(error));
      console.log('erreur3: ' + error);
    });
  }


  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  convertToBase64(photo){
    var image = new Image();
    image.src = photo;
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    var dataURL = canvas.toDataURL("image/jpg");
    return dataURL;
  }

  showArchiveEvaluation(id_category){

      this.navCtrl.push(ArchiveEvaluationPage, {'id_evaluation': this.id_evaluation, 'id_category': id_category});
  }

  ionViewDidLoad(){

  }
}
