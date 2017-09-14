import { Component, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate, AUTO_STYLE } from '@angular/animations';
import { Slides, NavController, NavParams, AlertController, Platform, ActionSheetController, ToastController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from '@ionic-native/camera';
// Native components
import { NativeStorage } from '@ionic-native/native-storage';

// Providers
import { DatabaseProvider } from './../../providers/database/database';

// Pages
import { EvaluationCategoryPage } from '../evaluationcategory/evaluationcategory';

declare var cordova: any;

@Component({
  selector: 'page-evaluation',
  templateUrl: 'evaluation.html',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
        ])
      ]
    )
  ],
})
export class EvaluationPage {
  @ViewChild(Slides) slides: Slides;

  id_restaurant:number;
  id_evaluation:number;
  questions:string[] = [];
  responses:string[] = [];
  id_response:string;
  category:string[] = [];
  subcategory:string[] = [];
  currentSlide:number;
  radioChecked:number;
  questionHasResponse = {};
  responsesArray = [];
  subcategoriesDone = [];
  comment:string = '';
  imagesArray = [];

  constructor(private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, private camera: Camera, public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private databaseprovider: DatabaseProvider, public alertCtrl: AlertController, private nativeStorage: NativeStorage) {
    this.platform.ready().then(() => {
      this.navCtrl.swipeBackEnabled = false;
      this.id_restaurant = this.navParams.get('id_restaurant');
      this.id_evaluation = this.navParams.get('id_evaluation');
      this.category = this.navParams.get('category');
      this.subcategory = this.navParams.get('subcategory');
  
      this.databaseprovider.getSubCategoryQuestions(this.navParams.get('subcategory').id_question_subcategory).then(data => {
        this.questions = data;
      });
      this.databaseprovider.getAllResponses().then(data => {
        this.responses = data;
      });

      this.nativeStorage.getItem('subcategories-done').then((data) => {
        this.subcategoriesDone = data;
      });

    });
  }

  ionViewDidLoad() { 
    this.slides.lockSwipes(true);
    this.currentSlide = this.slides.getActiveIndex();
  } 

  isEmpty(obj) {
    for (var i in obj) if (obj.hasOwnProperty(i)) return false;
    return true;
  };

  addPicture(){
    
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }
    
    this.camera.getPicture(options).then((imagePath) => {
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }, (err) => {
     console.log('Error take picture: ' + JSON.stringify(err));
    });
    
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }
  
  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.imagesArray.push({'image': this.pathForImage(newFileName)});
    }, error => {
      this.presentToast('Erreur durant l\'enregistrement de l\'image.');
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
  
  deletePhoto(image){
    this.file.removeFile(this.file.dataDirectory, image);
    this.removeByAttr(this.imagesArray, 'image', image);
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.file.dataDirectory + img;
    }
  }

  onSelectionChange(question, response, event):void {
    this.radioChecked = event;
    this.questionHasResponse = {'question': question, 'response': response};
  }

  isBeginning():boolean {
    return this.slides.isBeginning();
  }

  isEnd():boolean {
    return this.slides.isEnd();
  }

  nextQuestion():void {
      this.slides.lockSwipes(false);
      this.slides.slideNext();
      this.slides.lockSwipes(true);
      this.questionHasResponse['comment'] = this.comment;
      if  (this.imagesArray.length > 0)
        this.questionHasResponse['images'] = this.imagesArray;
      
      this.responsesArray.push({'slide':this.slides.getPreviousIndex(), 'data':this.questionHasResponse});
      this.imagesArray = [];
      this.comment = '';
      this.radioChecked = 20;
      this.questionHasResponse = {};
  }

  prevQuestion():void {
      this.slides.lockSwipes(false);
      this.slides.slidePrev();
      this.slides.lockSwipes(true);
      this.responsesArray = this.removeByAttr(this.responsesArray, 'slide', this.slides.getActiveIndex());
  }

  removeByAttr(arr, attr, value){
    var i = arr.length;
    while(i--){
        if( arr[i] 
            && arr[i].hasOwnProperty(attr) 
            && (arguments.length > 2 && arr[i][attr] === value ) ){ 

            arr.splice(i,1);

        }
    }
    return arr;
  }
  
  validateForm() {
    this.questionHasResponse['comment'] = this.comment;
    if (this.imagesArray.length > 0)
      this.questionHasResponse['images'] = this.imagesArray;

    this.responsesArray.push({'slide':this.slides.getPreviousIndex(), 'data':this.questionHasResponse});
    this.imagesArray = [];
    this.comment = '';
    this.questionHasResponse = {};
    this.databaseprovider.addResponses(this.id_evaluation, this.responsesArray);

    this.subcategoriesDone.push(this.navParams.get('subcategory').id_question_subcategory);
    this.nativeStorage.setItem('subcategories-done', this.subcategoriesDone);
    this.navCtrl.popTo(EvaluationCategoryPage);
  }

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
