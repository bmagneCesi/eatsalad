import { FilePath } from '@ionic-native/file-path';
import { Component, ViewChild } from '@angular/core';
import { Slides, NavController, NavParams, AlertController, Platform, ModalController, ToastController } from 'ionic-angular';
import { File } from '@ionic-native/file';

// Native components
import { NativeStorage } from '@ionic-native/native-storage';

// Providers
import { DatabaseProvider } from './../../providers/database/database';
import { Camera, CameraOptions } from '@ionic-native/camera';

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
    signatureController:string;
    signatureFranchised:string;

    constructor(public toastCtrl: ToastController, public file: File, public modalController:ModalController, public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private databaseprovider: DatabaseProvider, private nativeStorage: NativeStorage) {
        this.platform.ready().then(() => {
            this.navCtrl.swipeBackEnabled = false;
            this.id_evaluation = this.navParams.get('id_evaluation');
        });
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
            
            let realData = data.signature.split(",")[1];
            let typeData = data.signature.trim().split(";")[0].split(":")[1];

            var base64Blob = new Blob([realData], {type: typeData});

            this.file.writeFile(this.file.dataDirectory, this.id_evaluation + '-controller-signature.png', base64Blob).then((image) => {
                this.signatureController = image.nativeURL;
            }, (error) => {
                console.log('Error: ' + JSON.stringify(error));
            });
            

            
        });
        modal.present();
    }

    signatureFranchisedAction(){
        let modal = this.modalController.create(SignaturepopoverPage);
        modal.onDidDismiss(data => {
            let realData = data.signature.split(",")[1];
            let typeData = data.signature.trim().split(";")[0].split(":")[1];

            var base64Blob = new Blob([realData], {type: typeData});

            this.file.writeFile(this.file.dataDirectory, this.id_evaluation + '-franchised-signature.png', base64Blob).then((image) => {
                this.signatureFranchised = image.nativeURL;

            }, (error) => {
                console.log('Error: ' + JSON.stringify(error));
            });
     
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
        console.log('into blob function');
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

        console.log('byteArrays: ' + byteArrays);
        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }  

}
