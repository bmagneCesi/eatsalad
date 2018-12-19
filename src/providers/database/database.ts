import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HTTP, HTTPResponse } from '@ionic-native/http';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { GlobalProvider } from "../../providers/global/global";



@Injectable()
export class DatabaseProvider {
  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;
  apiRestUrl:String = '/rest/';

  constructor(
      public sqlitePorter: SQLitePorter,
      private storage: Storage,
      private sqlite: SQLite,
      private platform: Platform,
      private http: Http,
      private global: GlobalProvider,
      public httpPlugin:HTTP
  ) {
    this.databaseReady = new BehaviorSubject(false);
    
    this.platform.ready().then(() => {

    });
  }

    /*
    * __________________
    *
    * Restaurant Queries
    * __________________
    *
    * */
    getRestaurants() {
      return this.http.get(this.global.serverUrl+'/rest/restaurants')
          // .do((res: any) => console.log(JSON.stringify(res)))
          .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
    }

    getRestaurant(id_restaurant) {
      return this.http.get(this.global.serverUrl+'/rest/restaurant/'+id_restaurant)
          // .do((res: any) => console.log(JSON.stringify(res)))
          .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
    }

    addRestaurant(data) {
      console.log(JSON.stringify(data));
      return this.http.post(this.global.serverUrl + '/rest/restaurant', data)
          // .do((res: any) => console.log(JSON.stringify(res)))
          .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
    }

    getRestaurantsByCity(id_ville) {
      return this.http.get(this.global.serverUrl+'/rest/restaurants-by-city/'+id_ville)
          // .do((res: any) => console.log(JSON.stringify(res)))
          .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
    }

    /*
    * __________________
    *
    * Cities Queries
    * __________________
    *
    * */
    getCities() {
        return this.http.get(this.global.serverUrl+'/rest/city')
            // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
    }

    getCity(id_ville) {
        return this.http.get(this.global.serverUrl+'/rest/city/'+id_ville)
            // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
    }

    addCity(data) {
        return this.http.post(this.global.serverUrl + '/rest/city', data)
            // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res: any) => res)
            .catch((error: any) => {
              return Observable.throw(error);
        })
    }

    /*
    * __________________
    *
    * Evaluation Queries
    * __________________
    *
    * */
    addEvaluation(id_restaurant) {
        let data = {
            "id_restaurant": id_restaurant,
            "subcategories_done":[]
        };
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.serverUrl + '/rest/evaluation', data, options)
            // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res: any) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
        })
    }

    addEvaluationComment(id_evaluation, comment){
        var data = {
          'id_evaluation': id_evaluation,
          'comment' : comment
        };
        return this.http.post(this.global.serverUrl + '/rest/evaluation/comment', data)
        // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res: any) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            })
    }


    getEvaluationSubcategoriesDone(id_evaluation){
        return this.http.get(this.global.serverUrl+'/rest/evaluation/'+id_evaluation+'/subcategoriesdone')
        // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res: any) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            })
    }

    getEvaluation(id_evaluation){
        return this.http.get(this.global.serverUrl+'/rest/evaluation/'+id_evaluation)
            // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
    }

    getEvaluationAnswers(id_evaluation){
        return this.http.get(this.global.serverUrl+'/rest/evaluation-answer/'+id_evaluation)
            // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
    }

    getEvaluationAnswersPreview(id_evaluation){
        return this.http.get(this.global.serverUrl+'/rest/evaluation-answer-preview/'+id_evaluation)
            // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
    }

    getRestaurantEvaluations(id_restaurant){
        return this.http.get(this.global.serverUrl+'/rest/evaluations-by-restaurant/'+id_restaurant)
            // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
    }

    addAnswers(id_evaluation, answers) {
        let data = {
            'id_evaluation': id_evaluation,
            'answers': answers
        };
        return this.http.post(this.global.serverUrl + '/rest/evaluation-answer', data)
            // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
    }

    evaluationAddSubcategoryDone(id_evaluation, subcategoryDone) {
        let data = {
            'id_evaluation': id_evaluation,
            'subcategory_done': subcategoryDone
        };
        return this.http.post(this.global.serverUrl + '/rest/evaluation/subcategory-done', data)
            // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
    }

    /*
    *
    *  @var data, array
    *
    * */
    createReport(id_evaluation, controllerSignature, controllerName, franchisedSignature) {
        let data = {
            'id_evaluation' : id_evaluation,
            'controllerName' : controllerName,
            'controllerSignature' : controllerSignature,
            'franchisedSignature' : franchisedSignature
        };
        return this.http.post(this.global.serverUrl + '/rest/evaluation/report', data)
            // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
    }

    /*
    * __________________
    *
    * Categories Queries
    * __________________
    *
    * */

  getCategory(id_category) {
      return this.http.get(this.global.serverUrl+'/rest/category/'+id_category)
          // .do((res: any) => console.log(JSON.stringify(res)))
          .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
  }

  getCategories() {
      return this.http.get(this.global.serverUrl+'/rest/categories')
          // .do((res: any) => console.log(JSON.stringify(res)))
          .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
  }

    getSubCategories() {
        return this.http.get(this.global.serverUrl+'/rest/sub-categories')
            // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
    }

    getSubCategory(id_subcategory) {
        return this.http.get(this.global.serverUrl+'/rest/sub-category/'+id_subcategory)
            // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
    }

    cancelEvaluation(id_evaluation) {
        return this.http.delete(this.global.serverUrl + '/rest/evaluation/'+id_evaluation)
        // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
    }

    cancelEvaluationSubcategory(id_evaluation, id_subcategory) {
      console.log(this.global.serverUrl + '/rest/evaluation-answer-delete/'+id_evaluation+'/'+id_subcategory);
        return this.http.delete(this.global.serverUrl + '/rest/evaluation-answer-delete/'+id_evaluation+'/'+id_subcategory)
        // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res: any) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
            })
    }


    getAnswers() {
        return this.http.get(this.global.serverUrl+'/rest/answers')
        // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
    }

 
  getTodayDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0!
    let yyyy = today.getFullYear();
    let day;
    let month;

    if(dd<10) {
        day = '0'+dd;
    }else{
      day = dd;
    }
    
    if(mm<10) {
        month = '0'+mm;
    }else{
      month = mm;
    }
    let date =  day + '/' + month + '/' + yyyy;

    return date;
  }


}