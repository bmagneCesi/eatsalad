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
    signatureArray = [];

    constructor(public toastCtrl: ToastController, public file: File, public modalController:ModalController, public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private databaseprovider: DatabaseProvider, private nativeStorage: NativeStorage) {
        this.platform.ready().then(() => {
            this.navCtrl.swipeBackEnabled = false;
            this.id_evaluation = this.navParams.get('id_evaluation');
        });
    }

    cancelEvaluation(){
        let signatureArr = this.signatureArray;
        for (var i = 0; i < signatureArr.length; i++) {
            this.file.removeFile(cordova.file.dataDirectory, signatureArr[i].path);         
            console.log('getImagePath: ' + JSON.stringify(this.pathForImage(name)));   
        }
        
        this.navCtrl.pop();
    }

    signatureControllerAction(){
        let modal = this.modalController.create(SignaturepopoverPage);
        modal.onDidDismiss(data => {
            
            var realData = data.signature.split(",")[1];
            let base64Blob = this.b64toBlob(realData, 'image/png');

            this.file.writeFile(cordova.file.externalDataDirectory, this.id_evaluation+'-control-signature.png', base64Blob).then(
              function(success){
                console.log('success');
                console.log(JSON.stringify(success));
              },
              function(error){
                console.log('error');
                console.log('erreur: ' + JSON.stringify(error));
                console.log('path: ' + JSON.stringify(cordova.file.externalDataDirectory));
                console.log('name: ' + JSON.stringify(this.id_evaluation+'-control-signature.png'));
                console.log('b64blob: ' + JSON.stringify(base64Blob));
              }
            )

            // let imagePath = data.signature.substr(22);
            // console.log('imagePath: ' + imagePath);
            // var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
            // var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
            // console.log('currentName: ' + currentName);
            // console.log('currentName: ' + currentName);
            // this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), 'controller');
        });
        modal.present();
    }

    signatureFranchisedAction(){
        let modal = this.modalController.create(SignaturepopoverPage);
        modal.onDidDismiss(data => {
            let imagePath = data.signature.substr(22);
            var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
            var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), 'franchised');
        });
        modal.present();
    }

    // Create a new name for the image
    private createFileName() {
        var d = new Date(),
        n = d.getTime(),
        newFileName =  n + ".jpg";
        return newFileName;
    }
    
    // Copy the image to a local folder
    private copyFileToLocalDir(namePath, currentName, newFileName, signatureType) {
        this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
            this.signatureArray.push({'signatureType': signatureType, 'path': this.pathForImage(newFileName), 'name': newFileName});
            console.log(JSON.stringify(this.signatureArray));
        }, error => {
            console.log(JSON.stringify(error));
        this.presentToast('Erreur durant l\'enregistrement de l\'image: ');
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

    // Always get the accurate path to your apps folder
    public pathForImage(img) {
        if (img === null) {
        return '';
        } else {
        return cordova.file.dataDirectory + img;
        }
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
