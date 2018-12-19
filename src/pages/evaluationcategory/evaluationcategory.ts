import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, LoadingController } from 'ionic-angular';
// Pages
import { EvaluationPage } from '../evaluation/evaluation';
import { RestaurantDetailPage } from '../restaurantdetail/restaurantdetail';
import { EvaluationCommentairePage } from '../evaluationcommentaire/evaluationcommentaire';

// Providers
import { DatabaseProvider } from './../../providers/database/database';
import { GlobalProvider } from './../../providers/global/global';

import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-evaluationcategory',
  templateUrl: 'evaluationcategory.html'
})
export class EvaluationCategoryPage {

    id_restaurant:string[] = [];
    categories:string[] = [];
    subcategoriesNb:number;
    id_evaluation:number;
    subcategoriesDone = [];
    photo;

    constructor(
        private nativeStorage: NativeStorage,
        public navCtrl: NavController,
        public navParams: NavParams,
        private databaseprovider: DatabaseProvider,
        public alertCtrl: AlertController,
        public platform: Platform,
        public loadingCtrl: LoadingController,
        public global:GlobalProvider
    ){
        this.platform.ready().then(() => {
            this.navCtrl.swipeBackEnabled = false;
            this.id_restaurant = this.navParams.get('id_restaurant');
            this.id_evaluation = this.navParams.get('id_evaluation');
            this.getCategories();
        });
    }

    /*
    * _______________
    *
    * Get Categories
    * _______________
    *
    * */
    getCategories() {
        this.databaseprovider.getCategories().subscribe(categories => {
            this.categories = categories;
            let subcategoriesNb = 0;
            for(let category of categories){
                subcategoriesNb += category.sub_categories.length;
            }
            this.subcategoriesNb = subcategoriesNb;
        })
    }


    /*
    * __________________________
    *
    * Disable Subcategories done
    * __________________________
    *
    * */
    ionViewDidEnter(){
        let loading = this.loadingCtrl.create();
        loading.present();
        this.databaseprovider.getEvaluation(this.id_evaluation).subscribe((data) => {
            this.subcategoriesDone = data.subcategoriesDone;
        }, (err) => {
            console.log(JSON.stringify(err));
            this.global.presentToast('Get evaluations failed' + 'evaluationcategory');
            loading.dismiss();
        },() => {
            loading.dismiss();
        });
    }

    /*
    * __________________________
    *
    * Evaluate a SubCategory
    * __________________________
    *
    * */
    evaluateAction(subcategory, eraseAlert):void {
        if(eraseAlert) {
            let alert = this.alertCtrl.create({
                title: 'Évaluation déjà effectuée',
                message: 'Souhaitez vous recommencer l\'évaluation ' + subcategory.name + ' ?',
                buttons: [
                    {
                        text: 'Annuler',
                        role: 'cancel'
                    },
                    {
                        text: 'Recommencer',
                        cssClass: 'alertDanger',
                        handler: () => {
                            this.databaseprovider.cancelEvaluationSubcategory(this.id_evaluation, subcategory.id).subscribe((res) => {
                                console.log(res);
                                this.navCtrl.push(EvaluationPage, {'subcategory':subcategory, 'id_restaurant': this.id_restaurant, 'id_evaluation': this.id_evaluation});
                            }, (err) => {
                                console.log(JSON.stringify(err));
                                this.global.presentToast('Redo evaluations failed');
                            });
                        }
                    }
                ]
            });
        alert.present();
        }else{
            this.navCtrl.push(EvaluationPage, {'subcategory':subcategory, 'id_restaurant': this.id_restaurant, 'id_evaluation': this.id_evaluation});
        }
    }

    /*
    * __________________________
    *
    * Validate a complete Evaluation
    * __________________________
    *
    * */
    validateEvaluation(alert){
        if(alert){
            let alert = this.alertCtrl.create({
                title: 'L\'évluation semble ne pas être complête',
                message: 'Veuillez vérifier que toutes les rubriques ont bien été validées. Voulez vous quand même continuer ?',
                buttons: [
                    {
                        text: 'Annuler',
                        cssClass: 'alertDanger',
                    },
                    {
                        text: 'Poursuivre',
                        role: 'cancel',
                        handler: () => {
                            this.navCtrl.push(EvaluationCommentairePage, {'id_evaluation': this.id_evaluation, 'id_restaurant': this.id_restaurant});
                        } 
                    }
                ]
            });
            alert.present();
        }else{
            this.navCtrl.push(EvaluationCommentairePage, {'id_evaluation': this.id_evaluation, 'id_restaurant': this.id_restaurant});
        }
    }

    /*
    * ___________________________________________________________
    *
    * Cancel the evaluation and go back to RestaurantDetail page
    * ___________________________________________________________
    *
    * */
    cancelEvaluation():void {
        let alert = this.alertCtrl.create({
            title: 'Annuler l\'évaluation ?',
            message: 'En revenant au menu précédant, vous perdrez toutes les informations relative à l\'évaluation en cours.',
            buttons: [
                {
                    text: 'Annuler',
                    cssClass: 'alertDanger',
                    handler: () => {
                        this.databaseprovider.cancelEvaluation(this.id_evaluation).subscribe((res) => {
                            console.log(res);
                            this.navCtrl.popTo(RestaurantDetailPage, {'id_restaurant': this.id_restaurant});
                        }, (err) => {
                            console.log(JSON.stringify(err));
                            this.global.presentToast('Cancel evaluation failed');
                        });
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
