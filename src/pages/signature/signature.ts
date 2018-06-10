    import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, Platform, ModalController, ToastController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';


// Providers
import { DatabaseProvider } from './../../providers/database/database';
import { EmailComposer } from '@ionic-native/email-composer';

// pages
import { SignaturepopoverPage } from '../signaturepopover/signaturepopover';
import { RestaurantDetailPage } from '../restaurantdetail/restaurantdetail';
import { SignaturepdfpopoverPage } from '../signaturepdfpopover/signaturepdfpopover';

// Pages

declare var cordova: any;

@Component({
  selector: 'page-signature',
  templateUrl: 'signature.html'
})

export class SignaturePage {

    id_evaluation:number;
    id_restaurant:number;
    evaluation = [];
    restaurant = [];
    signatureController:string;
    signatureFranchised:string;
    controllerName:string;
    baratLogo:string;
    logoEatSalad:string;
    hour:number;
    minutes:number;
    pdfEvaluationName:string;
    total;
    totalNb;
    categoryStat;
    subCategoryStat;
    responses;
    refusal:boolean;

    constructor(
        public http: Http,
        private transfer: FileTransfer,
        public loadingController:LoadingController,
        private fileOpener: FileOpener,
        private emailComposer: EmailComposer,
        public toastCtrl: ToastController,
        public viewCtrl: ViewController,
        public file: File,
        public modalController:ModalController,
        public platform: Platform,
        public navCtrl: NavController,
        public navParams: NavParams,
        private databaseprovider: DatabaseProvider,
    ) {
        this.platform.ready().then(() => {
            this.logoEatSalad = 'http://bmagne.ovh/eatsaladBackoffice/web/img/eatsalad-logo.png';
            this.baratLogo = 'http://bmagne.ovh/eatsaladBackoffice/web/img/baratcorporate-logo.png';
            
            this.navCtrl.swipeBackEnabled = false;
            this.id_evaluation = this.navParams.get('id_evaluation');
            this.id_restaurant = this.navParams.get('id_restaurant'); 
            var currentdate = new Date(); 
            this.hour = currentdate.getHours();
            this.minutes = currentdate.getMinutes();
            this.databaseprovider.getEvaluation(this.id_evaluation).subscribe((data) => {
                this.evaluation = data;
                this.databaseprovider.getRestaurant(this.id_restaurant).subscribe((res) => {
                    this.restaurant = res;
                });
            });

            let modal = this.modalController.create(SignaturepdfpopoverPage, {'id_evaluation': this.id_evaluation, 'logoEatSalad': this.logoEatSalad, 'baratLogo': this.baratLogo});
            modal.present();

        });
    }

    /* _________________________________
    *
    * Upload Photo
    * _________________________________
    *
    * */
    uploadPhoto(imageURI, photo_rest_path, photo_name) {
        const fileTransfer: FileTransferObject = this.transfer.create();

        let options: FileUploadOptions = {
            fileKey: 'file',
            fileName: photo_name,
            chunkedMode: false,
            mimeType: "image/jpeg",
            headers: {},
            params: {
                'folder_path': photo_rest_path
            }
        };
        fileTransfer.upload(imageURI, 'http://bmagne.ovh/eatsaladBackoffice/web/app_dev.php/rest/evaluation-signature/upload', options)
            .then((data) => {
                this.presentToast("Image uploaded successfully");
            }, (err) => {
                console.log(JSON.stringify(err));
                this.presentToast('Upload failed.');
            });
    }


    validateContrat(controllerName){

        let loading = this.loadingController.create({ content: "Génération du rapport, veuillez patienter..." });
        loading.present();

        let signatureFranchised = (this.refusal ? null : this.signatureFranchised);

        this.databaseprovider.createReport(this.id_evaluation, this.signatureController, controllerName, signatureFranchised).subscribe((data) => {
            loading.dismiss();
        });


            // this.databaseprovider.getResponseByIdEvaluation(this.id_evaluation).then((responses) => {
            //
            //     this.databaseprovider.getResponseScoreByIdEvaluation(this.id_evaluation).then((data) => {
            //         var subCategoryStat = [];
            //         var categoryStat = [];
            //         let total = 0;
            //         let totalNb = 0;
            //
            //         for (var i = 0; i < data.length; i++) {
            //             let percent = Math.round((data[i].responseScore / (data[i].nbResponse * 3)) * 100);
            //             total += percent;
            //             totalNb++;
            //             subCategoryStat.push({'category': data[i].category, 'subcategory': data[i].subcategory, 'score': percent, 'id_question_subcategory': data[i].id_question_subcategory, 'question_category_id': data[i].question_category_id});
            //
            //             var found = categoryStat.some(function (el) {
            //               return el.category === data[i].category;
            //             });
            //             if (!found) { categoryStat.push({'category': data[i].category, 'id_question_category': data[i].id_question_category}); }
            //
            //         }
            //
            //         categoryStat.forEach(category => {
            //
            //             subCategoryStat.forEach(subcategory => {
            //
            //                 if (subcategory.category == category.category) {
            //
            //
            //                     responses.forEach(response => {
            //
            //                         if (response.id_question_subcategory == subcategory.id_question_subcategory && subcategory.question_category_id == category.id_question_category) {
            //
            //                             for (var i = 0; i < response.photos.length; i++) {
            //                                 if (response.photos[i] != null) {
            //                                     // Destination URL
            //                                     var url = "http://crazyabout.it/eatsalad/eatsalad-img.php";
            //
            //                                     // File name only
            //                                     var filename = response.photos[i].replace(/.*\/(?!.*\/)/, '');
            //
            //                                     var options = {
            //                                         fileKey: "file",
            //                                         fileName: filename,
            //                                         chunkedMode: false,
            //                                         mimeType: "multipart/form-data",
            //                                         params: {
            //                                             'id_evaluation': this.id_evaluation,
            //                                             'id_category': category.id_question_category,
            //                                             'id_subcategory': subcategory.id_question_subcategory,
            //                                             'id_question': response.id_question,
            //                                         }
            //                                     };
            //
            //                                     const fileTransfer: TransferObject = this.transfer.create();
            //
            //                                     // Use the FileTransfer to upload the image
            //                                     fileTransfer.upload(response.photos[i], url, options).then(data => {
            //
            //                                     }, err => {
            //                                         this.presentToast('Error while uploading file. ' + JSON.stringify(err));
            //                                         console.log('erreur: ' + err);
            //                                     });
            //                                 }
            //                             }
            //                         }
            //                     });
            //                 }
            //             });
            //
            //         });
            //
            //         let dataArr = {
            //             'total': total,
            //             'totalNb': totalNb,
            //             'id_evaluation': this.id_evaluation,
            //             'categoryStat': categoryStat,
            //             'subCategoryStat': subCategoryStat,
            //             'responses': responses,
            //             'restaurant': this.restaurant,
            //             'evaluation': this.evaluation
            //         };
            //
            //         // console.log('dataSent: ' + JSON.stringify(dataArr));
            //
            //         let headers: any = new Headers({ 'Content-Type': 'application/json' }),
            //             url: any = "http://crazyabout.it/eatsalad/eatsalad-pdf_dev.php";
            //
            //         this.http.post(url, JSON.stringify(dataArr), headers)
            //         .subscribe((data: any) => {
            //
            //             cordova.plugins.pdf.htmlToPDF({
            //                 url: data['_body'],
            //                 documentSize: "A4",
            //                 landscape: "portrait",
            //                 type: "base64"
            //             },
            //             (compteRendu) => {
            //
            //                 let htmlPdfConformite = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
            //                 htmlPdfConformite += '<html xmlns="http://www.w3.org/1999/xhtml">';
            //                 htmlPdfConformite += '<head>';
            //                 htmlPdfConformite += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';
            //                 htmlPdfConformite += '<title></title>';
            //                 htmlPdfConformite += '<style>*{font-family:Helvetica, sans-serif}</style>';
            //                 htmlPdfConformite += '</head>';
            //                 htmlPdfConformite += '<body>';
            //                 htmlPdfConformite += '<table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">';
            //                 htmlPdfConformite += '<tr>';
            //                 htmlPdfConformite += '<td align="center" valign="top">';
            //                 htmlPdfConformite += '<table border="0" cellpadding="20" cellspacing="0" width="600" id="emailContainer">';
            //                 htmlPdfConformite += '<tr>';
            //                 htmlPdfConformite += '<td align="center" valign="top">';
            //                 htmlPdfConformite += '<table border="0" cellpadding="20" cellspacing="0" width="50%" id="emailHeader">';
            //                 htmlPdfConformite += '<tr>';
            //                 htmlPdfConformite += '<td align="center" valign="top">';
            //                 htmlPdfConformite += '<img width="150" src="' + this.baratLogo + '"/>';
            //                 htmlPdfConformite += '</td>';
            //                 htmlPdfConformite += '</tr>';
            //                 htmlPdfConformite += '</table>';
            //                 htmlPdfConformite += '</td>';
            //                 htmlPdfConformite += '</tr>';
            //                 htmlPdfConformite += '<tr>';
            //                 htmlPdfConformite += '<td align="center" valign="top">';
            //                 htmlPdfConformite += '<table border="0" cellpadding="20" cellspacing="0" width="100%" id="emailFooter">';
            //                 htmlPdfConformite += '<tr>';
            //                 htmlPdfConformite += '<td align="right" style="padding:0px 5px" valign="top" width="50%">';
            //                 htmlPdfConformite += '<p>Visite de conformité effectuée par</p>';
            //                 htmlPdfConformite += '</td>';
            //                 htmlPdfConformite += '<td align="left" style="padding:0px 5px" valign="top" width="50%">';
            //                 htmlPdfConformite += '<p style="font-weight:bold">' + this.controllerName + '</p>';
            //                 htmlPdfConformite += '</td>';
            //                 htmlPdfConformite += '</tr>';
            //                 htmlPdfConformite += '<tr>';
            //                 htmlPdfConformite += '<td align="right" style="padding:0px 5px" valign="top" width="50%">';
            //                 htmlPdfConformite += '<p>Dans le restaurant</p>';
            //                 htmlPdfConformite += '</td>';
            //                 htmlPdfConformite += '<td align="left" style="padding:0px 5px" valign="top" width="50%">';
            //                 htmlPdfConformite += '<p style="font-weight:bold">' + this.restaurant['name'] + '</p>';
            //                 htmlPdfConformite += '</td>';
            //                 htmlPdfConformite += '</tr>';
            //                 htmlPdfConformite += '<tr>';
            //                 htmlPdfConformite += '<td align="right" style="padding:0px 5px" valign="top" width="50%">';
            //                 htmlPdfConformite += '<p>Le</p>';
            //                 htmlPdfConformite += '</td>';
            //                 htmlPdfConformite += '<td align="left" style="padding:0px 5px" valign="top" width="50%">';
            //                 htmlPdfConformite += '<p style="font-weight:bold">' + this.evaluation['date'] + '</p>';
            //                 htmlPdfConformite += '</td>';
            //                 htmlPdfConformite += '</tr>';
            //                 htmlPdfConformite += '<tr>';
            //                 htmlPdfConformite += '<td align="right" style="padding:0px 5px" valign="top" width="50%">';
            //                 htmlPdfConformite += '<p>À</p>';
            //                 htmlPdfConformite += '</td>';
            //                 htmlPdfConformite += '<td align="left" style="padding:0px 5px" valign="top" width="50%">';
            //                 htmlPdfConformite += '<p style="font-weight:bold">' + this.hour + 'H' + this.minutes + '</p>';
            //                 htmlPdfConformite += '</td>';
            //                 htmlPdfConformite += '</tr>';
            //                 htmlPdfConformite += '</table>';
            //                 htmlPdfConformite += '</td>';
            //                 htmlPdfConformite += '</tr>';
            //                 htmlPdfConformite += '<tr>';
            //                 htmlPdfConformite += '<td align="center" valign="top">';
            //                 htmlPdfConformite += '<table border="0" cellpadding="20" cellspacing="0" width="100%" id="emailBody">';
            //                 htmlPdfConformite += '<tr>';
            //                 htmlPdfConformite += '<td align="center" valign="top">';
            //                 htmlPdfConformite += '<p>Signature du contrôleur</p>';
            //                 htmlPdfConformite += '<img width="100%" src="' + this.signatureController + '"/>';
            //                 htmlPdfConformite += '</td>';
            //                 htmlPdfConformite += '<td align="center" valign="top">';
            //                 htmlPdfConformite += '<p>Signature du franchisé ou responsable du magasin</p>';
            //                 htmlPdfConformite += '<img width="100%" src="' + this.signatureFranchised + '"/>';
            //                 htmlPdfConformite += '</td>';
            //                 htmlPdfConformite += '</tr>';
            //                 htmlPdfConformite += '</table>';
            //                 htmlPdfConformite += '</td>';
            //                 htmlPdfConformite += '</tr>';
            //                 htmlPdfConformite += '</table>';
            //                 htmlPdfConformite += '</td>';
            //                 htmlPdfConformite += '</tr>';
            //                 htmlPdfConformite += '</table>';
            //                 htmlPdfConformite += '</body>';
            //                 htmlPdfConformite += '</html>';
            //
            //                 cordova.plugins.pdf.htmlToPDF({
            //                     data: htmlPdfConformite,
            //                     documentSize: "A4",
            //                     landscape: "portrait",
            //                     type: "base64"
            //                 },
            //                     (visiteConformite) => {
            //
            //                         // console.log('conversion pdf: ' + JSON.stringify(success1));
            //                         let htmlEmail = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
            //                         htmlEmail += '<html xmlns="http://www.w3.org/1999/xhtml">';
            //                         htmlEmail += '<head>';
            //                         htmlEmail += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';
            //                         htmlEmail += '<title></title>';
            //                         htmlEmail += '<style>*{font-family: "Helvetica, sans-serif"}</style>'
            //                         htmlEmail += '</head>';
            //                         htmlEmail += '<body>';
            //                         htmlEmail += '<table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">';
            //                         htmlEmail += '<tr>';
            //                         htmlEmail += '<td align="center" valign="top">';
            //                         htmlEmail += '<table style="padding:0px" width="100%" border="0" cellpadding="20" cellspacing="0" id="emailContainer">';
            //                         htmlEmail += '<tr style="background-color:#ffffff;padding:50px">';
            //                         htmlEmail += '<td style="padding-bottom: 0px;" align="center" valign="top">';
            //                         htmlEmail += '<table border="0" style="padding:0 8%" cellpadding="20" cellspacing="0" width="100%" id="emailHeader">';
            //                         htmlEmail += '<tr>';
            //                         htmlEmail += '<td style="padding-bottom: 0px;" align="center" valign="top">';
            //                         htmlEmail += '<table border="0" style="background-color:#fff" cellpadding="20" cellspacing="0" width="100%" id="emailHeader">';
            //                         htmlEmail += '<tr>';
            //                         htmlEmail += '<td align="center" valign="top">';
            //                         htmlEmail += '<img width="50%" src="' + this.logoEatSalad + '" alt="">';
            //                         htmlEmail += '</td>';
            //                         htmlEmail += '</tr>';
            //                         htmlEmail += '</table>';
            //                         htmlEmail += '</td>';
            //                         htmlEmail += '</tr>';
            //                         htmlEmail += '</table>';
            //                         htmlEmail += '</td>';
            //                         htmlEmail += '</tr>';
            //                         htmlEmail += '<tr>';
            //                         htmlEmail += '<td style="padding-top: 0px;" align="center" valign="top">';
            //                         htmlEmail += '<table border="0" style="padding:0 8%" cellpadding="20" cellspacing="0" width="100%" id="emailBody">';
            //                         htmlEmail += '<tr>';
            //                         htmlEmail += '<td style="padding-top: 0px;" align="center" valign="top">';
            //                         htmlEmail += '<h1 style="font-family:Helvetica, sans-serif;color: #FFFFFF;text-align: center;font-weight: 500;font-size: 25px;margin: 0px auto;border:none;"></h1>';
            //                         htmlEmail += '<table border="0" style="background-color: #89BD29;" cellpadding="20" cellspacing="0" width="100%" id="emailBody">';
            //                         htmlEmail += '<tr>';
            //                         htmlEmail += '<td style="padding:100px" align="center" valign="top">';
            //                         htmlEmail += '<p style="font-family:Helvetica, sans-serif;color: #FFFFFF;text-align: left;font-weight: 300;font-size: 20px;">';
            //                         htmlEmail += 'Bonjour,';
            //                         htmlEmail += '<br>';
            //                         htmlEmail += '<br>';
            //                         htmlEmail += 'Vous trouverez ci-dessous le compte rendu de notre visite du ' + this.evaluation['date'] + ' ainsi que le rapport signé.';
            //                         htmlEmail += '<br>';
            //                         htmlEmail += '<br>';
            //                         htmlEmail += 'Cordialement,';
            //                         htmlEmail += '<br>';
            //                         htmlEmail += '<br>';
            //                         htmlEmail += 'L\'équipe Eatsalad.';
            //                         htmlEmail += '</p>';
            //                         htmlEmail += '</td>';
            //                         htmlEmail += '</tr>';
            //                         htmlEmail += '</table>';
            //                         htmlEmail += '</td>';
            //                         htmlEmail += '</tr>';
            //                         htmlEmail += '</table>';
            //                         htmlEmail += '</td>';
            //                         htmlEmail += '</tr>';
            //                         htmlEmail += '</table>';
            //                         htmlEmail += '</td>';
            //                         htmlEmail += '</tr>';
            //                         htmlEmail += '</table>';
            //                         htmlEmail += '</body>';
            //                         htmlEmail += '</html>';
            //
            //                         let emailsArr = this.restaurant['emails'].split(';');
            //                         let email = {
            //                             to: emailsArr,
            //                             bcc: ['colin.delorme@eatsalad.fr', 'wahid.benserir@eatsalad.fr'],
            //                             attachments: [
            //                                 'base64:visite.pdf//' + visiteConformite,
            //                                 'base64:compte-rendu.pdf//' + compteRendu,
            //                             ],
            //                             subject: '[EatSalad] Compte rendu de la visite du ' + this.evaluation['date'],
            //                             body: htmlEmail,
            //                             isHtml: true
            //                         };
            //
            //                         loading.dismissAll();
            //
            //                         this.emailComposer.open(email);
            //
            //                         this.navCtrl.push(RestaurantDetailPage, { 'id_restaurant': this.id_restaurant }).then(() => {
            //                             // first we find the index of the current view controller:
            //                             const index = this.viewCtrl.index;
            //                             // then we remove it from the navigation stack
            //                             this.navCtrl.remove(index);
            //                             this.navCtrl.remove(index - 1);
            //                             this.navCtrl.remove(index - 2);
            //                             this.navCtrl.remove(index - 3);
            //                         });
            //
            //                     }, (error) => {
            //                         this.presentToast('Error generating email.');
            //                         console.log('erreur generation de l\'email : ' + error);
            //                     });
            //             }, (error) => {
            //                 this.presentToast('Error writing pdf.');
            //                 console.log('erreur generation du pdf : ' + error);
            //             });
            //         },
            //         (error: any) => {
            //             this.presentToast('Error posting data to server.');
            //             console.log('Erreur post data vers serveur : ' + JSON.stringify(error));
            //         });
            //
            //
            //     }, (error) => {
            //             this.presentToast('error:' + JSON.stringify(error));
            //             console.log('erreur2: ' + error);
            //         });
            // }, (error) => {
            //     this.presentToast('error:' + JSON.stringify(error));
            //     console.log('erreur3: ' + error);
            // });

    }

    deleteSignature(type){
        if (type == 'controller')
            this.signatureController = '';    
        
        if (type == 'franchised')
            this.signatureFranchised = '';
            this.refusal = null;
        
    }

    signatureControllerAction(){
        let modal = this.modalController.create(SignaturepopoverPage);
        modal.onDidDismiss(data => {
            if(data != null)
            {
                this.signatureController = data;
            }
        });
        modal.present();
    }

    signatureFranchisedAction(refusal){
        if(!refusal){
            let modal = this.modalController.create(SignaturepopoverPage);
            modal.onDidDismiss(data => {
                if(data != null)
                {
                    this.signatureFranchised = data;
                }
            });
            modal.present();
        }
        this.refusal = refusal;
    }

    private presentToast(text) {
        let toast = this.toastCtrl.create({
        message: text,
        duration: 3000,
        position: 'top'
        });
        toast.present();
    }

    b64toBlob(b64Data, contentType) {
        contentType = contentType || '';
        var sliceSize = 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

}

