import { VillelistPage } from './../villelist/villelist';
import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';

// Pages
import  { RestaurantlistPage } from '../restaurantlist/restaurantlist';

// Providers
import { DatabaseProvider } from './../../providers/database/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: string;
  password: string;
  restaurants;
    cities;
    evaluations;
    categories;
    subcategories;
    questions;
    questionHasResponses;
    questionHasResponsesImages;

  constructor(
      public navCtrl: NavController,
      public alertCtrl: AlertController,
      private databaseprovider: DatabaseProvider,
      public platform:Platform,
      public emailComposer: EmailComposer,

  ) {
    this.platform.ready().then(() => {
      this.databaseprovider.getDatabaseState().subscribe(rdy => {
        if (rdy) {
          // this.databaseprovider.resetDatabase();
          this.databaseprovider.getDatabaseState();
          this.databaseprovider.exportRestaurants().then(restaurants =>{

          this.databaseprovider.exportCities().then(cities =>{

          this.databaseprovider.exportEvaluation().then(evaluations =>{

          this.databaseprovider.exportQuestionCategory().then(categories =>{

          this.databaseprovider.exportQuestionSubCategory().then(subcategories =>{

          this.databaseprovider.exportQuestion().then(questions =>{

          this.databaseprovider.exportQuestionHasResponse().then(questionHasResponses =>{

          this.databaseprovider.exportQuestionHasResponseImages().then(questionHasResponsesImages =>{
              var b64restaurants = '';
              restaurants.forEach(restaurant => {
                  b64restaurants += JSON.stringify(restaurant);
                });
              b64restaurants = this.b64EncodeUnicode(b64restaurants);

              var b64cities = '';
              cities.forEach(citie => {
                  b64cities += JSON.stringify(citie);
                });
              b64cities = this.b64EncodeUnicode(b64cities);

              var b64questions = '';
                questions.forEach(question => {
                    b64questions += JSON.stringify(question);
                });
              b64questions = this.b64EncodeUnicode(b64questions);

              var b64categories = '';
              categories.forEach(categorie => {
                  b64categories += JSON.stringify(categorie);
                });
              b64categories = this.b64EncodeUnicode(b64categories);

              var b64subcategories = '';
              subcategories.forEach(subcategorie => {
                  b64subcategories += JSON.stringify(subcategorie);
                });
              b64subcategories = this.b64EncodeUnicode(b64subcategories);

              var b64evaluations = '';
              evaluations.forEach(evaluation => {
                  b64evaluations += JSON.stringify(evaluation);
                });
              b64evaluations = this.b64EncodeUnicode(b64evaluations);

              var b64questionHasReponses = '';
              questionHasResponses.forEach(questionHasResponse => {
                  b64questionHasReponses += JSON.stringify(questionHasResponse);
                });
              b64questionHasReponses = this.b64EncodeUnicode(b64questionHasReponses);

              var b64questionHasResponsesImages = '';
              questionHasResponsesImages.forEach(questionHasResponsesImage => {
                  b64questionHasResponsesImages += JSON.stringify(questionHasResponsesImage);
                });
              b64questionHasResponsesImages = this.b64EncodeUnicode(b64questionHasResponsesImages);

              let email = {
                    to: 'bmagne@me.com',
                    attachments: [
                        'base64:restaurants.txt//'+b64restaurants,
                        'base64:cities.txt//'+b64cities,
                        'base64:questions.txt//'+b64questions,
                        'base64:categories.txt//'+b64categories,
                        'base64:subcategories.txt//'+b64subcategories,
                        'base64:evaluations.txt//'+b64evaluations,
                        'base64:questionHasReponses.txt//'+b64questionHasReponses,
                        'base64:questionHasReponsesImages.txt//'+b64questionHasResponsesImages,
                    ],
                    subject: '[EatSalad] EXPORT DATABASE',
                    body: 'export',
                    isHtml: true
                };
                this.emailComposer.open(email);
          });
          });
          });
          });
          });
          });
          });
          });

        }
      })
    });
  }
    b64EncodeUnicode(str: string): string {
        if (window
            && "btoa" in window
            && "encodeURIComponent" in window) {
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
                return String.fromCharCode(("0x" + p1) as any);
            }));
        } else {
            console.warn("b64EncodeUnicode requirements: window.btoa and window.encodeURIComponent functions");
            return null;
        }

    }
  loginAction(): void {
    // if (this.user == "BaratCorporate" && this.password == "Eatsalad33") {
    //   this.navCtrl.push(VillelistPage);
    // }
    // else
    // {
    //   let alert = this.alertCtrl.create({
    //     title: 'Oups!',
    //     subTitle: 'Mauvaise combinaison utilisateur / mot de passe',
    //     buttons: ['Réessayer']
    //   });
    //   alert.present();
    // }
    this.navCtrl.push(VillelistPage);
  }

}