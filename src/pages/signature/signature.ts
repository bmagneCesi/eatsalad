import { FilePath } from '@ionic-native/file-path';
import { Component, ViewChild } from '@angular/core';
import { Slides, NavController, NavParams, AlertController, Platform, ModalController, ToastController } from 'ionic-angular';
import { File } from '@ionic-native/file';

// Native components
import { NativeStorage } from '@ionic-native/native-storage';

// Providers
import { DatabaseProvider } from './../../providers/database/database';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { EmailComposer } from '@ionic-native/email-composer';
import { FileOpener } from '@ionic-native/file-opener';

// pages
import { SignaturepopoverPage } from '../signaturepopover/signaturepopover';

// Pages

declare var cordova: any;

@Component({
  selector: 'page-signature',
  templateUrl: 'signature.html'
})

export class SignaturePage {

    id_evaluation:number;
    evaluation = [];
    restaurant:string;
    signatureController:string;
    signatureFranchised:string;

    constructor(private fileOpener: FileOpener, private emailComposer: EmailComposer, public toastCtrl: ToastController, public file: File, public modalController:ModalController, public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private databaseprovider: DatabaseProvider, private nativeStorage: NativeStorage) {
        this.platform.ready().then(() => {
            this.navCtrl.swipeBackEnabled = false;
            this.id_evaluation = this.navParams.get('id_evaluation');
            this.databaseprovider.getEvaluationById(this.id_evaluation).then((data) => {
                this.evaluation = data;
                this.databaseprovider.getRestaurantName(data.restaurant_id).then((res) => {
                    this.restaurant = res;
                });

            });
            
        });
    }

    validateContrat(){
        cordova.plugins.pdf.htmlToPDF({
            data: '<div class="signature-container" col-10 offset-1>'+
            '<img src="assets/img/barat-logo.png" text-center id="barat-logo" alt="">'+
            '<br>'+
            '<br>'+
            '<ion-row>'+
                '<ion-label text-right>Visite de conformité effectuée par</ion-label>'+
                '<ion-input [(ngModel)]="controllerName" placeholder="Text Input"></ion-input>'+
            '</ion-row>'+
                '<br>'+
            '<ion-row>'+
                '<ion-label text-right>Dans le restaurant Eatsalad</ion-label>'+
                '<ion-label class="signature-information">{{ restaurant }}</ion-label>'+
            '</ion-row>'+
                '<br>'+
            '<ion-row>'+
                '<ion-label text-right>Le</ion-label>'+
                '<ion-label class="signature-information">{{ evaluation.date }}</ion-label>'+
            '</ion-row>'+
                '<br>'+
                '<br>'+
            '<ion-row>'+
                '<ion-col col-6>'+
                    '<h3>Signature du controlleur</h3>'+
                    '<p>(Mention "lu et approuvé")</p>'+
                    '<img class="signature-image" [src]="signatureController"/>'+   
                '</ion-col>'+
                '<ion-col col-6>'+
                    '<h3>Signature du franchisé</h3>'+
                    '<p>(Mention "lu et approuvé")</p>'+
                    '<img class="signature-image" [src]="signatureFranchised"/>'+ 
                '</ion-col>'+ 
            '</ion-row>'+
        '</div>',
            documentSize: "A4",
            landscape: "portrait",
            type: "base64"
        },
        (success) => {
            console.log('pdf created: ' + success);
            // let blob = this.b64toBlob(success, 'application/pdf');
            // var blob = this.b64toBlob(success, 'application/pdf');
            // decode base64 string, remove space for IE compatibility


            // create the blob object with content-type "application/pdf"               
            var blob = this.b64toBlob(success, 'application/pdf');
            
            this.emailComposer.isAvailable().then((available: boolean) =>{
                if(available) {

                }
            });
            let email = {
                to: 'bmagne@me.com',
                attachments: [
                    'base64:test.pdf//'+success
                ],
                subject: 'Cordova Icons',
                body: 'How are you? Nice greetings from Leipzig',
                isHtml: true
            };
            this.emailComposer.open(email);                
                
                
                // Send a text message using default options
                
            
            // this.file.writeFile(this.file.dataDirectory, this.id_evaluation+'-signed.pdf', blob).then((data) => {
            //     console.log('Pdf file ok');
            //     // 
            // }, (error) => {
            //     console.log('Mail send error: ' + JSON.stringify(error));
            // });

            
        }, (error) => console.log('error:', JSON.stringify(error))
        );
    }

    deleteSignature(type){
        if (type == 'controller')
            this.signatureController = '';    
        
        if (type == 'franchised')
            this.signatureFranchised = '';    
        
    }

    cancelEvaluation(){

        if(this.signatureFranchised != '')
            this.file.removeFile(this.file.dataDirectory, this.signatureFranchised);                   
        if(this.signatureController != '')
            this.file.removeFile(this.file.dataDirectory, this.signatureController);               
        
        this.navCtrl.pop();
    }

    signatureControllerAction(){
        let modal = this.modalController.create(SignaturepopoverPage);
        modal.onDidDismiss(data => {
            if(data != null)
            {     
                this.signatureController = data;
                let realData = data.split(",")[1];
                let typeData = data.trim().split(";")[0].split(":")[1];
                
                var blob = this.b64toBlob(realData, typeData);

                this.file.writeFile(this.file.dataDirectory, this.id_evaluation + '-controller-signature.jpg', blob)
                .then((image) => {
                    console.log(JSON.stringify(image));
                    // this.signatureController = image.nativeURL;
                }, (error) => {
                    console.log('Error: ' + JSON.stringify(error));
                });
            }
        });
        modal.present();
    }

    signatureFranchisedAction(){
        let modal = this.modalController.create(SignaturepopoverPage);
        modal.onDidDismiss(data => {
            if(data != null)
            {       
                this.signatureFranchised = data;
                let realData = data.split(",")[1];
                let typeData = data.trim().split(";")[0].split(":")[1];
                
                var blob = this.b64toBlob(realData, typeData);

                this.file.writeFile(this.file.dataDirectory, this.id_evaluation + '-franchised-signature.jpg', blob)
                .then((image) => {
                    console.log(JSON.stringify(image));
                    // this.signatureController = image.nativeURL;
                }, (error) => {
                    console.log('Error: ' + JSON.stringify(error));
                });
            }
        });
        modal.present();
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
          
        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
      }
      
}

