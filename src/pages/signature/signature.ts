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
import { GlobalProvider } from "../../providers/global/global";

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
        public toastCtrl: ToastController,
        public viewCtrl: ViewController,
        public file: File,
        public modalController:ModalController,
        public platform: Platform,
        public navCtrl: NavController,
        public navParams: NavParams,
        private databaseprovider: DatabaseProvider,
        public global: GlobalProvider
    ) {
        this.platform.ready().then(() => {
            this.logoEatSalad = global.serverUrl+'eatsaladBackoffice/web/img/eatsalad-logo.png';
            this.baratLogo = global.serverUrl+'eatsaladBackoffice/web/img/baratcorporate-logo.png';
            
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
            this.databaseprovider.getEvaluationAnswersPreview(this.id_evaluation).subscribe((evaluationAnswersPreview) => {
                console.log(JSON.stringify(evaluationAnswersPreview));
                let modal = this.modalController.create(SignaturepdfpopoverPage, {'evaluationAnswersPreview': evaluationAnswersPreview});
                modal.present();
            });
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
        fileTransfer.upload(imageURI, this.global.serverUrl+'app_dev.php/rest/evaluation-signature/upload', options)
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
            this.presentToast(data);
            this.navCtrl.push(RestaurantDetailPage, {'id_restaurant': this.id_restaurant}).then(() => {
                // first we find the index of the current view controller:
                const index = this.viewCtrl.index;
                // then we remove it from the navigation stack
                this.navCtrl.remove(index);
                this.navCtrl.remove(index-1);
                this.navCtrl.remove(index-2);
                this.navCtrl.remove(index-3);
            });
        });

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

