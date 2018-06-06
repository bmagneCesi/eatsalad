import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';

@Injectable()
export class DatabaseProvider {
  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;
  apiRestUrl:String = '/rest/';

  constructor(public sqlitePorter: SQLitePorter, private storage: Storage, private sqlite: SQLite, private platform: Platform, private http: Http) {
    this.databaseReady = new BehaviorSubject(false);
    
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.storage.get('database_filled').then(val => {
            if (val) {
              this.databaseReady.next(true);
            } else {
              this.fillDatabase();
            }
          });
        });
    });
  }

  fillDatabase() {
    this.http.get('assets/dump.sql')
      .map(res => res.text())
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.databaseReady.next(true);
            this.storage.set('database_filled', true);
            console.log("Database created");
          })
          .catch(e => console.error(e));
      });
  }

  resetDatabase() {
    this.sqlite.deleteDatabase({name: 'data.db', location: 'default'}).then(data => {
      this.storage.set('database_filled', false);
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
      return this.http.get('/rest/restaurant')
          // .do((res: any) => console.log(JSON.stringify(res)))
          .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
    }

    getRestaurant(id_restaurant) {
      return this.http.get('/rest/restaurant/'+id_restaurant)
          // .do((res: any) => console.log(JSON.stringify(res)))
          .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
    }

    addRestaurant(data) {
      return this.http.post('/rest/restaurant', data)
          // .do((res: any) => console.log(JSON.stringify(res)))
          .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
    }

    getRestaurantsByCity(id_ville) {
      return this.http.get('/rest/restaurants-by-city/'+id_ville)
          // .do((res: any) => console.log(JSON.stringify(res)))
          .map((res: any) => res.json())
          .catch((error: any) => {
              return Observable.throw(error);
          })
    }

    deleteRestaurant(id_restaurant) {
        return this.database.executeSql("DELETE FROM `restaurant` WHERE id_restaurant = " + id_restaurant, []).then(data => {
            return data;
        }, err => {
            console.log('Error: ', JSON.stringify(err));
            return err;
        });
    }

    /*
    * __________________
    *
    * Cities Queries
    * __________________
    *
    * */
    getCities() {
        return this.http.get('/rest/city')
            // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res:any)=> res.json())
            .catch((error:any) => {
              return Observable.throw(error);
            })
    }

    getCity(id_ville) {
        return this.http.get('/rest/city/'+id_ville)
            // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res:any)=> res.json())
            .catch((error:any) => {
              return Observable.throw(error);
        })
    }

    addCity(data) {
        return this.http.post('/rest/city', data)
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
    addEvaluation(data) {
        return this.http.post('/rest/evaluation', data)
            // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res: any) => res.json())
            .catch((error: any) => {
                return Observable.throw(error);
        })
    }

    addEvaluationComment(id_evaluation, comment){
        return this.database.executeSql('UPDATE `evaluation` SET comment=\'' + comment + '\' WHERE id_evaluation = ' + id_evaluation,[]).then((data) => {
            return data;
        }, err => {
            console.log('Error add evaluation comment: ', JSON.stringify(err));
            return [];
        });
    }

    getEvaluation(id_evaluation){
        return this.http.get('/rest/evaluation/'+id_evaluation)
            // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res:any)=> res.json())
            .catch((error:any) => {
                return Observable.throw(error);
            })
    }

    getRestaurantEvaluations(id_restaurant){
        return this.http.get('/rest/evaluation-by-restaurant/'+id_restaurant)
            // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res:any)=> res.json())
            .catch((error:any) => {
                return Observable.throw(error);
            })
    }

    addAnswers(id_evaluation, answers) {
        var data = {
            'id_evaluation': id_evaluation,
            'answers': answers
        };
        return this.http.post('/rest/evaluation-answer', data)
            // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res:any)=> res.json())
            .catch((error:any) => {
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
  getFullCategories() {
    return this.database.executeSql("SELECT question_category.id_question_category, question_category.name as question_category_name, question_subcategory.id_question_subcategory, question_subcategory.name as question_subcategory_name FROM `question_category`  LEFT JOIN `question_subcategory`  ON question_category.id_question_category = question_subcategory.question_category_id GROUP BY question_category.name, question_subcategory.name", {}).then((data) => {
      let categories = [];
      if(data == null) 
      {
        return;
      }

      if(data.rows) 
      {
        if(data.rows.length > 0) 
        {
          for(var i = 0; i < data.rows.length; i++) {
            categories.push(data.rows.item(i));
          }
        }
      }

    return categories;

    }, err => {
      console.log('Error: ', JSON.stringify(err));
      return [];
    });
  }

  getCategory(id_category) {
      return this.http.get('/rest/question-category/'+id_category)
          // .do((res: any) => console.log(JSON.stringify(res)))
          .map((res:any)=> res.json())
          .catch((error:any) => {
              return Observable.throw(error);
          })
  }

  getCategories() {
      return this.http.get('/rest/question-categories')
          // .do((res: any) => console.log(JSON.stringify(res)))
          .map((res:any)=> res.json())
          .catch((error:any) => {
              return Observable.throw(error);
          })
  }

    getSubCategories() {
        return this.http.get('/rest/question-sub-categories')
            // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res:any)=> res.json())
            .catch((error:any) => {
                return Observable.throw(error);
            })
    }

    getSubCategory(id_subcategory) {
        return this.http.get('/rest/question-sub-category/'+id_subcategory)
            // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res:any)=> res.json())
            .catch((error:any) => {
                return Observable.throw(error);
            })
    }

  getSubcategoriesByCategory(id_question_category) {
    return this.database.executeSql("SELECT * FROM `question_subcategory` WHERE question_category_id = " + id_question_category, {}).then((data) => {
      let subcategories = [];
      if(data == null) 
      {
        return;
      }

      if(data.rows) 
      {
        if(data.rows.length > 0) 
        {
          for(var i = 0; i < data.rows.length; i++) {
            subcategories.push(data.rows.item(i));
          }
        }
      }

    return subcategories;

    }, err => {
      console.log('Error: ', JSON.stringify(err));
      return [];
    });
  }

  getNumberOfQuestionsBySubCategory(id_subcategory) {
    return this.database.executeSql("SELECT COUNT(*) as nbQuestionsInSubcategory FROM `question` JOIN question_subcategory ON question.question_subcategory_id = question_subcategory.id_question_subcategory WHERE id_question_subcategory = " + id_subcategory, {}).then((data) => {
      let nb;
      if(data == null) 
        {
          return;
        }
  
        if(data.rows) 
        {
          if(data.rows.length > 0) 
          {
            nb = data.rows.item(0).nbQuestionsInSubcategory;
          }
        }

        return nb;

    }, err => {
      console.log('Error: ', JSON.stringify(err));
      return [];
    });
    
  }

  getNumberOfResponseInSubCategory(id_evaluation, id_subcategory) {
    return this.database.executeSql("SELECT COUNT(*) as nbResponses FROM `question_has_response` JOIN question ON question_has_response.question_id = question.id_question JOIN question_subcategory ON question.question_subcategory_id = question_subcategory.id_question_subcategory WHERE evaluation_id = " + id_evaluation + " AND id_question_subcategory = " + id_subcategory, {}).then((data) => {
      let nb;
      if(data == null) 
        {
          return;
        }
  
        if(data.rows) 
        {
          if(data.rows.length > 0) 
          {
            nb = data.rows.item(0).nbResponses;
          }
        }
        return nb;
      }, err => {
      console.log('Error: ', JSON.stringify(err));
      return [];
    });

  }

  getSubCategoryQuestions(id_subcategory) {
    
    return this.database.executeSql("SELECT * FROM `question` WHERE question_subcategory_id = " + id_subcategory, {}).then((data) => {
      let questions = [];
      if(data == null) 
      {
        return;
      }

      if(data.rows) 
      {
        if(data.rows.length > 0) 
        {
          for(var i = 0; i < data.rows.length; i++) {
            questions.push(data.rows.item(i));
          }
        }
      }

      return questions;

    }, err => {
      console.log('Error: ', JSON.stringify(err));
      return [];
    });
  }



    getAnswers() {
        return this.http.get('/rest/answers')
        // .do((res: any) => console.log(JSON.stringify(res)))
            .map((res:any)=> res.json())
            .catch((error:any) => {
                return Observable.throw(error);
            })
    }

  deleteEvaluationSubcategory(id_question_subcategory, id_evaluation){
    return this.database.executeSql('DELETE FROM question_has_response WHERE question_has_response.evaluation_id = ' + id_evaluation + ' AND question_has_response.question_id in (SELECT id_question FROM question WHERE question.question_subcategory_id = ' + id_question_subcategory +')', {}).then((data) => {;
      return data;
    }, err => {
      console.log('Error: ', JSON.stringify(err));
      return [];
    });
  }

  newCategory(name) {
    
    return this.database.executeSql('INSERT INTO `question_category` (name) VALUES (\'' + name + '\')', {}).then((data) => {
      return data;
    }, err => {
      console.log('Error insert: ', JSON.stringify(err));
      return [];
    });
    
  }

  newSubcategory(name, id_category) {
    console.log(name);
    console.log(id_category);
    return this.database.executeSql('INSERT INTO `question_subcategory` (name, question_category_id) VALUES (\'' + name + '\', ' + id_category + ')', {}).then((data) => {
      return data;
    }, err => {
      console.log('Error insert: ', JSON.stringify(err));
      return [];
    });
    
  }

  newQuestion(name, id_subcategory) {
    
    return this.database.executeSql('INSERT INTO `question` (question, question_subcategory_id) VALUES (\'' + name + '\', ' + id_subcategory + ')', {}).then((data) => {
      return data;
    }, err => {
      console.log('Error insert: ', JSON.stringify(err));
      return [];
    });
    
  }

  cancelEvaluation(id_evaluation) {

    this.database.executeSql('DELETE FROM `evaluation` WHERE id_evaluation = ' +  id_evaluation, {}).then((data) => {
      return;
    }, err => {
      console.log('Error: ', JSON.stringify(err));
      return [];
    });;
    this.database.executeSql('DELETE FROM `question_has_response` WHERE evaluation_id = ' +  id_evaluation, {}).then((data) => {
      return;
    }, err => {
      console.log('Error: ', JSON.stringify(err));
      return [];
    });
    
  }

  getAllEvaluations() {
    return this.database.executeSql("SELECT * FROM `evaluation`", {}).then((data) => {
      let evaluations = [];
      if(data == null) 
      {
        return;
      }

      if(data.rows) 
      {
        if(data.rows.length > 0) 
        {
          for(var i = 0; i < data.rows.length; i++) {
            evaluations.push(data.rows.item(i));
          }
        }
      }

      return evaluations;

    }, err => {
      console.log('Error: ', JSON.stringify(err));
      return [];
    });
  }

  getPreviousEvaluations(id_evaluation, id_restaurant) {
    return this.database.executeSql("SELECT * FROM `evaluation` WHERE id_evaluation < " + id_evaluation + " AND restaurant_id = "+ id_restaurant + " ORDER BY id_evaluation DESC LIMIT 1", {}).then((data) => {
      let evaluation;
      if(data == null) 
      {
        return;
      }

      if(data.rows) 
      {
        if(data.rows.length > 0) 
        {
          
            evaluation = data.rows.item(0);
          
        }
      }

      return evaluation;

    }, err => {
      console.log('Error: ', JSON.stringify(err));
      return [];
    });
  }

  getTotalResponseScoreByIdEvaluation(id_evaluation) {
    return this.database.executeSql("SELECT SUM(response.score) as responseScore, COUNT(question_has_response.question_id) as nbResponse, question_category.name as category, question_category.id_question_category as id_category FROM `question_has_response` LEFT JOIN `question_has_response_image` ON `question_has_response`.id_question_has_response = `question_has_response_image`.question_has_response_id LEFT JOIN `response` ON question_has_response.response_id = response.id_response LEFT JOIN `question` ON question_has_response.question_id = question.id_question LEFT JOIN `question_subcategory` ON question.question_subcategory_id = question_subcategory.id_question_subcategory LEFT JOIN `question_category` ON question_subcategory.question_category_id = question_category.id_question_category  WHERE `question_has_response`.evaluation_id = " + id_evaluation + " GROUP BY `question_category`.name", {}).then((data) => {
      let responses = [];
      if(data == null) 
      {
        return;
      }

      if(data.rows) 
      {
        if(data.rows.length > 0) 
        {
          for(var i = 0; i < data.rows.length; i++) {
            responses.push(data.rows.item(i));
          }
        }
      }
      console.log(JSON.stringify(responses));
      return responses;

    }, err => {
      console.log('Error: ', JSON.stringify(err));
      return [];
    });
  }

  getResponseScoreByIdEvaluation(id_evaluation) {
    return this.database.executeSql("SELECT SUM(response.score) as responseScore, COUNT(question_has_response.question_id) as nbResponse, question_category.name as category, question_category.id_question_category, question_category.id_question_category as id_category, question_subcategory.name as subcategory, question_subcategory.id_question_subcategory, question_subcategory.question_category_id FROM `question_has_response` LEFT JOIN `question_has_response_image` ON `question_has_response`.id_question_has_response = `question_has_response_image`.question_has_response_id LEFT JOIN `response` ON question_has_response.response_id = response.id_response LEFT JOIN `question` ON question_has_response.question_id = question.id_question LEFT JOIN `question_subcategory` ON question.question_subcategory_id = question_subcategory.id_question_subcategory LEFT JOIN `question_category` ON question_subcategory.question_category_id = question_category.id_question_category  WHERE `question_has_response`.evaluation_id = " + id_evaluation + " GROUP BY `question_category`.name, question_subcategory.name", {}).then((data) => {
      let responses = [];
      if(data == null) 
      {
        return;
      }

      if(data.rows) 
      {
        if(data.rows.length > 0) 
        {
          for(var i = 0; i < data.rows.length; i++) {
            responses.push(data.rows.item(i));
          }
        }
      }
      console.log(data);
      return responses;

    }, err => {
      console.log('Error: ', JSON.stringify(err));
      return [];
    });
  }

  getResponseScoreByIdEvaluationByCategory(id_evaluation, id_category) {
    return this.database.executeSql("SELECT SUM(response.score) as responseScore, COUNT(question_has_response.question_id) as nbResponse, question_subcategory.* FROM `question_has_response` LEFT JOIN `question_has_response_image` ON `question_has_response`.id_question_has_response = `question_has_response_image`.question_has_response_id LEFT JOIN `response` ON question_has_response.response_id = response.id_response LEFT JOIN `question` ON question_has_response.question_id = question.id_question LEFT JOIN `question_subcategory` ON question.question_subcategory_id = question_subcategory.id_question_subcategory LEFT JOIN `question_category` ON question_subcategory.question_category_id = question_category.id_question_category  WHERE `question_has_response`.evaluation_id = " + id_evaluation + " AND `question_category`.id_question_category = " + id_category + " GROUP BY question_subcategory.name", {}).then((data) => {
      let responses = [];
      if(data == null) 
      {
        return;
      }

      if(data.rows) 
      {
        if(data.rows.length > 0) 
        {
          for(var i = 0; i < data.rows.length; i++) {
            responses.push(data.rows.item(i));
          }
        }
      }
      return responses;

    }, err => {
      console.log('Error: ', JSON.stringify(err));
      return [];
    });
  }

  getResponsePhotoByEvaluation(id_evaluation) {
  
    return this.database.executeSql("SELECT question_has_response_image.question_has_response_id "+ 
                                    "FROM question_has_response_image "+ 
                                    "LEFT JOIN question_has_response "+ 
                                    "ON question_has_response_image.question_has_response_id = question_has_response.id_question_has_response "+ 
                                    "WHERE question_has_response.evaluation_id = " + id_evaluation, {}).then((data) => {
      let photos = [];
      if(data == null) 
      {
        return;
      }

      if(data.rows) 
      {
        if(data.rows.length > 0) 
        {
          for(var i = 0; i < data.rows.length; i++) {
            photos.push(data.rows.item(i));
          }
        }
      }
      return photos;

    }, err => {
      console.log('Error getting photos: ', JSON.stringify(err));
      return [];
    });
  }

  getResponsePhotoByIdQuestionHasResponse(id_question_has_response) {
    console.log("SELECT path "+ 
    "FROM question_has_response_image "+ 
    "WHERE question_has_response_id = " + id_question_has_response);
    return this.database.executeSql("SELECT path "+ 
                                    "FROM question_has_response_image "+ 
                                    "WHERE question_has_response_id = " + id_question_has_response, {}).then((data) => {
      let photos = [];
      if(data == null) 
      {
        return;
      }

      if(data.rows) 
      {
        if(data.rows.length > 0) 
        {
          for(var i = 0; i < data.rows.length; i++) {
            photos.push(data.rows.item(i).path);
          }
        }
      }
      return photos;

    }, err => {
      console.log('Error getting photos: ', JSON.stringify(err));
      return [];
    });
  }
  
  getQuestionResponseById(id_question_has_response) {
    return this.database.executeSql("SELECT comment FROM question_has_response WHERE id_question_has_response = " + id_question_has_response, {}).then((data) => {
      let comment;
      if(data == null) 
      {
        return;
      }

      if(data.rows) 
      {
        if(data.rows.length > 0) 
        {
          
            comment = data.rows.item(0).comment;
          
        }
      }
      return comment;

    }, err => {
      console.log('Error getting photos: ', JSON.stringify(err));
      return [];
    });
  }

  getResponseByIdEvaluation(id_evaluation) {
    return this.database.executeSql("SELECT question_has_response_image.path as photo, question_has_response.comment, response.response, response.id_response, response.score, question.question, question.id_question, question_subcategory.id_question_subcategory as id_question_subcategory, question_has_response.id_question_has_response FROM `question_has_response` LEFT JOIN `response` ON question_has_response.response_id = response.id_response LEFT JOIN `question` ON question_has_response.question_id = question.id_question LEFT JOIN `question_subcategory` ON question.question_subcategory_id = question_subcategory.id_question_subcategory LEFT JOIN `question_category` ON question_subcategory.question_category_id = question_category.id_question_category LEFT JOIN question_has_response_image ON question_has_response.id_question_has_response = question_has_response_image.question_has_response_id  WHERE `question_has_response`.evaluation_id = " + id_evaluation, {}).then((data) => {
      let responses = [];
      let photos = [];
      let idAlreadyDone = [];

      if(data == null) 
      {
        return;
      }

      if(data.rows) 
      {
        if(data.rows.length > 0) 
        {
          for(var i = 0; i < data.rows.length; i++) {
            if (idAlreadyDone.indexOf(data.rows.item(i).id_question_has_response) > -1) {
              responses[idAlreadyDone.indexOf(data.rows.item(i).id_question_has_response)].photos.push(data.rows.item(i).photo);
            }
            else{
              responses.push({ 'photos': [data.rows.item(i).photo], 'id_question_subcategory': data.rows.item(i).id_question_subcategory, 'score': data.rows.item(i).score, 'question': data.rows.item(i).question, 'id_question': data.rows.item(i).id_question, 'id_response': data.rows.item(i).id_response, 'response': data.rows.item(i).response, 'comment': data.rows.item(i).comment, })
              idAlreadyDone.push(data.rows.item(i).id_question_has_response);
            }
              
          }
        }
      }

      return responses;

    }, err => {

      return [];
    });
  }

  getResponseByIdEvaluationByCategory(id_evaluation, id_category) {
    return this.database.executeSql("SELECT response.response, response.score, question.question, question_subcategory.id_question_subcategory as id_question_subcategory, question_has_response.comment, question_has_response.id_question_has_response FROM `question_has_response` LEFT JOIN `response` ON question_has_response.response_id = response.id_response LEFT JOIN `question` ON question_has_response.question_id = question.id_question LEFT JOIN `question_subcategory` ON question.question_subcategory_id = question_subcategory.id_question_subcategory LEFT JOIN `question_category` ON question_subcategory.question_category_id = question_category.id_question_category  WHERE `question_has_response`.evaluation_id = " + id_evaluation + " AND `question_category`.id_question_category = " + id_category, {}).then((data) => {
      let responses = [];
      if(data == null) 
      {
        return;
      }

      if(data.rows) 
      {
        if(data.rows.length > 0) 
        {
          for(var i = 0; i < data.rows.length; i++) {
            responses.push(data.rows.item(i));
          }
        }
      }
      return responses;

    }, err => {
      console.log('Error: ', JSON.stringify(err));
      return [];
    });
  }

  getLastImage() {
    return this.database.executeSql("SELECT path FROM question_has_response_image ORDER BY id_question_has_response_image DESC LIMIT 1", {}).then((data) => {
      let photo = [];
      if(data == null) 
      {
        return;
      }

      if(data.rows) 
      {
        if(data.rows.length > 0) 
        {
          for(var i = 0; i < data.rows.length; i++) {
            photo.push(data.rows.item(i).path);
          }
        }
      }
      return photo;

    }, err => {
      console.log('Error: ', JSON.stringify(err));
      return [];
    });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
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