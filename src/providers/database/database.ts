import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
 
@Injectable()
export class DatabaseProvider {
  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

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
 
  addRestaurant(data) {
    return this.database.executeSql('INSERT INTO `restaurant`(name, address, postcode, city, emails) VALUES(\'' + data.name + '\', \'' + data.address + '\', \'' + data.postcode + '\', \'' + data.city + '\', \'' + data.emails + '\')', []).then(data => {
      return data;
    }, err => {
      console.log('Error: ', JSON.stringify(err));
      return err;
    });
  }

  deleteRestaurant(id_restaurant) {
    return this.database.executeSql("DELETE FROM `restaurant` WHERE id_restaurant = " + id_restaurant, []).then(data => {
      return data;
    }, err => {
      console.log('Error: ', JSON.stringify(err));
      return err;
    });
  }

  getRestaurant(id_restaurant) {
    return this.database.executeSql("SELECT * FROM `restaurant` WHERE id_restaurant = " + id_restaurant, []).then((data) => {
      let restaurant;
      if(data == null) 
      {
        return;
      }
      if(data.rows) 
      {
        if(data.rows.length > 0) 
        {
          
          restaurant = data.rows.item(0);
          
        }
      }
      return restaurant;

    }, err => {
      console.log('Error getRestaurantName: ', JSON.stringify(err));
      return [];
    });
  }
 
  getAllRestaurants() {
    return this.database.executeSql("SELECT * FROM `restaurant` ORDER BY id_restaurant DESC", {}).then((data) => {
      let restaurants = [];
      if(data == null) 
      {
        return;
      }

      if(data.rows) 
      {
        if(data.rows.length > 0) 
        {
          for(var i = 0; i < data.rows.length; i++) {
            restaurants.push(data.rows.item(i));
          }
        }
      }

      return restaurants;

    }, err => {
      console.log('Error: ', JSON.stringify(err));
      return [];
    });
  }
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
  
  getCategories() {
    return this.database.executeSql("SELECT * FROM `question_category`", {}).then((data) => {
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
 
  getSubCategories() {
    return this.database.executeSql("SELECT * FROM `question_subcategory`", {}).then((data) => {
      let subcategories = [];
      let id_subcategory_tmp;
      let nbQuestionsSubcategory;
      let nbResponsesSubcategory;
      let sub_category_tmp = [];

      if(data == null) 
      {
        return;
      }

      if(data.rows) 
      {
        if(data.rows.length > 0) 
        {
          for(var i = 0; i < data.rows.length; i++) {
            id_subcategory_tmp = data.rows.item(i).id_question_subcategory;
            sub_category_tmp = data.rows.item(i);

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

  addEvaluationComment(id_evaluation, comment){
    return this.database.executeSql('UPDATE `evaluation` SET comment=\'' + comment + '\' WHERE id_evaluation = ' + id_evaluation,[]).then((data) => {
      return data;
    }, err => {
      console.log('Error add evaluation comment: ', JSON.stringify(err));
      return [];
    });
  }

  getEvaluationById(id_evaluation){
    return this.database.executeSql("SELECT * FROM `evaluation` WHERE id_evaluation = " + id_evaluation + " ORDER BY id_evaluation DESC", {}).then((data) => {
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
      console.log('Error getEvaluationById: ', JSON.stringify(err));
      return [];
    });
  }

  getEvaluationByRestaurant(id_restaurant){
    return this.database.executeSql("SELECT * FROM `evaluation` WHERE restaurant_id = " + id_restaurant + " ORDER BY id_evaluation DESC", {}).then((data) => {
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

  getAllResponses() {
    
    return this.database.executeSql("SELECT * FROM `response`", {}).then((data) => {
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

  deleteEvaluationSubcategory(id_question_subcategory, id_evaluation){
    return this.database.executeSql('DELETE FROM question_has_response WHERE question_has_response.evaluation_id = ' + id_evaluation + ' AND question_has_response.question_id in (SELECT id_question FROM question WHERE question.question_subcategory_id = ' + id_question_subcategory +')', {}).then((data) => {;
      return data;
    }, err => {
      console.log('Error: ', JSON.stringify(err));
      return [];
    });
  }

  newEvaluation(id_restaurant) {

    let date = this.getTodayDate();
    
    return this.database.executeSql('INSERT INTO `evaluation` (date, comment, restaurant_id) VALUES (\'' + date + '\', \'\', ' + id_restaurant + ')', {}).then((data) => {
      console.log('after instert: ' + data);
      return data.insertId;
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

  getResponseScoreByIdEvaluation(id_evaluation) {
    return this.database.executeSql("SELECT SUM(response.score) as responseScore, COUNT(question_has_response.question_id) as nbResponse, question_category.name as category, question_subcategory.name as subcategory FROM `question_has_response` LEFT JOIN `question_has_response_image` ON `question_has_response`.id_question_has_response = `question_has_response_image`.question_has_response_id LEFT JOIN `response` ON question_has_response.response_id = response.id_response LEFT JOIN `question` ON question_has_response.question_id = question.id_question LEFT JOIN `question_subcategory` ON question.question_subcategory_id = question_subcategory.id_question_subcategory LEFT JOIN `question_category` ON question_subcategory.question_category_id = question_category.id_question_category  WHERE `question_has_response`.evaluation_id = " + id_evaluation + " GROUP BY `question_category`.name, question_subcategory.name", {}).then((data) => {
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

  getResponseByIdEvaluation(id_evaluation) {
    return this.database.executeSql("SELECT response.response, response.score, question_has_response_image.path as image, question.question, question_subcategory.id_question_subcategory as id_question_subcategory FROM `question_has_response` LEFT JOIN `response` ON question_has_response.response_id = response.id_response LEFT JOIN `question` ON question_has_response.question_id = question.id_question LEFT JOIN `question_subcategory` ON question.question_subcategory_id = question_subcategory.id_question_subcategory LEFT JOIN `question_category` ON question_subcategory.question_category_id = question_category.id_question_category LEFT JOIN `question_has_response_image` ON question_has_response.id_question_has_response=question_has_response_image.question_has_response_id WHERE `question_has_response`.evaluation_id = " + id_evaluation, {}).then((data) => {
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


  addResponses(id_evaluation, responses) {        
    
    responses.forEach(response => {
      
      
      this.database.executeSql('INSERT INTO `question_has_response`(comment, question_id, response_id, evaluation_id) VALUES(\'' + response.data.comment + '\', \'' + response.data.question.id_question + '\', \'' + response.data.response.id_response + '\', \'' + id_evaluation + '\')', {}).then((id_qhr) => {
        let last_id_question_has_response = id_qhr.insertId;
                
        if('images' in response.data)
        {
          let images = response.data.images;
          images.forEach(image => {

            this.database.executeSql('INSERT INTO `question_has_response_image`(path, question_has_response_id) VALUES(\'' + image.image + '\', ' + last_id_question_has_response + ')', {}).then((data) => {
              return data;
            }, err => {
              console.log('Error insert image: ', JSON.stringify(err));
              return [];
            }); 

          });
        }        

      }, err => {
        console.log('Error: ', JSON.stringify(err));
        return [];
      });

      

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