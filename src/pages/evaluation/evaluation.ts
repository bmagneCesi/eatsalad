import { Component, ViewChild } from '@angular/core';
import { Slides, NavController, NavParams, AlertController, Platform } from 'ionic-angular';

// Native components
import { NativeStorage } from '@ionic-native/native-storage';

// Providers
import { DatabaseProvider } from './../../providers/database/database';
import { Camera, CameraOptions } from '@ionic-native/camera';

// Pages
import { EvaluationCategoryPage } from '../evaluationcategory/evaluationcategory';


@Component({
  selector: 'page-evaluation',
  templateUrl: 'evaluation.html'
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
  questionHasResponse = {};
  responsesArray = [];
  subcategoriesDone = [];
  comment:string;
  image:string;
  
  constructor(private camera: Camera, public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private databaseprovider: DatabaseProvider, public alertCtrl: AlertController, private nativeStorage: NativeStorage) {
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
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
      this.image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     // Handle error
    });
    
  }

  onSelectionChange(question, response):void {
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
      this.questionHasResponse['image'] = this.image;
      this.responsesArray.push({'slide':this.slides.getPreviousIndex(), 'data':this.questionHasResponse});
      this.image = '';
      this.comment = '';
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
  
  validateForm():void {
    this.questionHasResponse['comment'] = this.comment;
    this.questionHasResponse['image'] = this.image;
    this.responsesArray.push({'slide':this.slides.getPreviousIndex(), 'data':this.questionHasResponse});

    this.image = '';
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
