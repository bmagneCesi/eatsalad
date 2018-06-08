import { Component, ViewChild } from '@angular/core';
import { Slides, NavController, NavParams, AlertController, Platform, ActionSheetController, ToastController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';

// Native components
import { NativeStorage } from '@ionic-native/native-storage';

// Providers
import { DatabaseProvider } from './../../providers/database/database';

// Pages
import { EvaluationCategoryPage } from '../evaluationcategory/evaluationcategory';

@Component({
  selector: 'page-evaluation',
  templateUrl: 'evaluation.html'
})
export class EvaluationPage {
  @ViewChild(Slides) slides: Slides;

    imageFileName:string;
    id_restaurant:number;
    id_evaluation:number;
    subcategory:string[] = [];
    questions:string[] = [];
    answers:string[] = [];
    id_response:string;
    category:string[] = [];
    currentSlide:number;
    radioChecked:number;
    questionHasResponse = {};
    responsesArray = [];
    subcategoriesDone = [];
    comment:string = '';
    imagesArray = [];

    constructor(
        private file: File,
        private transfer: FileTransfer,
        public actionSheetCtrl: ActionSheetController,
        public toastCtrl: ToastController,
        private camera: Camera,
        public platform: Platform,
        public navCtrl: NavController,
        public navParams: NavParams,
        private databaseprovider: DatabaseProvider,
        public alertCtrl: AlertController,
        private nativeStorage: NativeStorage
    ) {
        this.platform.ready().then(() => {
            this.navCtrl.swipeBackEnabled = false;
            this.id_restaurant = this.navParams.get('id_restaurant');
            this.id_evaluation = this.navParams.get('id_evaluation');
            this.subcategory = this.navParams.get('subcategory');
            this.getAnswers();
        });
    }

    /*
    * _______________
    *
    * On load lock swipes
    * _______________
    *
    * */
    ionViewDidLoad() {
        this.slides.lockSwipes(true);
        this.currentSlide = this.slides.getActiveIndex();
    }

    /*
    * _______________
    *
    * Get all answers
    * _______________
    *
    * */
    getAnswers(){
        this.databaseprovider.getAnswers().subscribe(answers => {
          this.answers = answers;
        });
    }

    /*
    * _______________
    *
    * Check if object is empty
    * _______________
    *
    * */
    isEmpty(obj) {
        for (var i in obj) if (obj.hasOwnProperty(i)) return false;
        return true;
    };

    /*
    * _______________
    *
    * Add new photo
    * _______________
    *
    * */
    addPhoto(){
        const options: CameraOptions = {
            quality: 70,
            sourceType: this.camera.PictureSourceType.CAMERA,
            saveToPhotoAlbum: false,
            correctOrientation: true,
            targetHeight: 1000,
            targetWidth: 750
        };
        this.camera.getPicture(options).then((imagePath) => {
            var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
            var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        }, (err) => {
            console.log('Error taking picture: ' + JSON.stringify(err));
        });
    }

    /*
    * _______________
    *
    * Create a new name for the image
    * _______________
    *
    * */
    private createFileName() {
        var d = new Date(),
        n = d.getTime(),
        newFileName =  n + ".jpg";
        return newFileName;
    }
  
    /*
    * _______________
    *
    * Copy the image to a local folder
    * _______________
    *
    * */
    private copyFileToLocalDir(namePath, currentName, newFileName) {
        this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
            this.imagesArray.push({'image': this.pathForImage(newFileName)});
            this.imagesArray.push({'name': newFileName});
            console.log(JSON.stringify(this.imagesArray));
        }, error => {
            this.presentToast('Erreur durant l\'enregistrement de l\'image.');
        });
    }

    /*
    * _______________
    *
    * Show msg notification
    * _______________
    *
    * */
    private presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }

    /*
    * _______________
    *
    * Delete photo
    * _______________
    *
    * */
    deletePhoto(image){
        this.file.removeFile(this.file.dataDirectory, image);
        this.removeByAttr(this.imagesArray, 'image', image);
    }

    /*
    * _______________
    *
    * Always get the accurate path to your apps folder
    * _______________
    *
    * */
    public pathForImage(img) {
        if (img === null) {
            return '';
        } else {
            return this.file.dataDirectory + img;
        }
    }

    /*
    * _______________
    *
    *
    * _______________
    *
    * */
    onSelectionChange(question, answer, event):void {
        this.radioChecked = event;
        this.questionHasResponse = {'question': question, 'answer': answer};
    }

    /*
    * _______________
    *
    * Is first slide
    * _______________
    *
    * */
    isBeginning():boolean {
        return this.slides.isBeginning();
    }

    /*
    * _______________
    *
    * Is last slide
    * _______________
    *
    * */
    isEnd():boolean {
        return this.slides.isEnd();
    }

    /*
    * _______________
    *
    * Next question
    * _______________
    *
    * */
    nextQuestion():void {
        this.slides.lockSwipes(false);
        this.slides.slideNext();
        this.slides.lockSwipes(true);
        this.questionHasResponse['comment'] = this.comment;
        if  (this.imagesArray.length > 0)
            this.questionHasResponse['photos'] = this.imagesArray;
        this.responsesArray.push({'slide':this.slides.getPreviousIndex(), 'data':this.questionHasResponse});
        this.imagesArray = [];
        this.comment = '';
        this.radioChecked = 20;
        this.questionHasResponse = {};
    }

    /*
    * _______________
    *
    * Back to prev question
    * _______________
    *
    * */
    prevQuestion():void {
        this.slides.lockSwipes(false);
        this.slides.slidePrev();
        this.slides.lockSwipes(true);
        this.responsesArray = this.removeByAttr(this.responsesArray, 'slide', this.slides.getActiveIndex());
    }

    removeByAttr(arr, attr, value){
        var i = arr.length;
        while(i--){
            if( arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value ) ){
                arr.splice(i,1);
            }
        }
        return arr;
    }

    /*
    * _________________________________
    *
    * Validate current subcategory form
    * _________________________________
    *
    * */
    validateForm() {
        this.questionHasResponse['comment'] = this.comment;
        if (this.imagesArray.length > 0)
            this.questionHasResponse['photos'] = this.imagesArray;
        this.responsesArray.push({'slide':this.slides.getPreviousIndex(), 'data':this.questionHasResponse});
        this.imagesArray = [];
        this.comment = '';
        this.questionHasResponse = {};

        this.databaseprovider.addAnswers(this.id_evaluation, this.responsesArray).subscribe((evaluationAnswers) => {
            console.log(JSON.stringify(evaluationAnswers));
            for(let answer of evaluationAnswers){
                for(let response of this.responsesArray){
                    if(response.data.question.id == answer.question.id){
                        for(let photo of answer.photos){
                            console.log(JSON.stringify(photo));
                            console.log(JSON.stringify(photo.length));
                            // if(photo.length > 0){
                                this.uploadPhoto(this.file.dataDirectory + photo.name, photo.path, photo.name);
                            // }
                        }
                    }
                }
            }
        });

        this.subcategoriesDone.push(this.navParams.get('subcategory').id_question_subcategory);
        this.nativeStorage.setItem('subcategories-done', this.subcategoriesDone);
        this.navCtrl.popTo(EvaluationCategoryPage);
    }

    /*
    * _________________________________
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

        fileTransfer.upload(imageURI, 'http://bmagne.ovh/eatsaladBackoffice/web/app_dev.php/rest/evaluation-answer/upload', options)
            .then((data) => {
                this.presentToast("Image uploaded successfully");
                console.log(JSON.stringify(data));
            }, (err) => {
                console.log(JSON.stringify(err));
                this.presentToast('Upload failed.');
            });
    }

    /*
    * _______________
    *
    * Cancel questions
    * _______________
    *
    * */
    cancelResponses(subcategory):void {
        let alert = this.alertCtrl.create({
            title: 'Annuler le questionnaire : ' + subcategory + '?',
            message: 'En revenant au menu précédent vous perdrez les réponses non validés de ce questionnaire.',
            buttons: [
                {
                    text: 'Annuler',
                    cssClass: 'alertDanger',
                    handler: () => {
                        this.navCtrl.pop();
                    }
                },
                {
                    text: 'Poursuivre',
                    role: 'cancel'
                }
            ]
        });
        alert.present();
    }

}
