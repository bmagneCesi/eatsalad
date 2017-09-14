import { Component } from '@angular/core';
import { NavParams, ViewController, Platform } from 'ionic-angular';

import { DatabaseProvider } from './../../providers/database/database';
import { File } from '@ionic-native/file';


@Component({
  selector: 'page-evaluationphoto',
  templateUrl: 'evaluationphoto.html',
})
export class EvaluationphotoPage {

  photos = [];
  
  constructor(public navParams: NavParams, public platform: Platform, private file: File,  public viewCtrl: ViewController,  private databaseprovider: DatabaseProvider) {
    this.platform.ready().then(() => {
      this.databaseprovider.getResponsePhotoByIdQuestionHasResponse(this.navParams.get('id_question_has_response')).then((photos) => {
        console.log('photos :' + photos);
        for (var i = 0; i < photos.length; i++) {
          // console.log('photo :' + photos[i]);

          // var currentName = photos[i].substr(photos[i].lastIndexOf('/') + 1);
          // this.file.readAsDataURL(this.file.dataDirectory, currentName).then((data) => {
          //   this.photos.push(data);
          //   console.log('photo: ' + JSON.stringify(data));     
          // });   
          this.photos.push(photos[i]);
          var path = photos[i].split('//')[1];
          console.log('path ' + path);
          let filepath = path.substring(0, path.lastIndexOf('/') + 1);
          let filename = path.substring(path.lastIndexOf('/') + 1, path.length);
          console.log('filename : '+filename);
          console.log('filepath : '+filepath);
          this.file.checkFile(filepath, filename).then(
            (files) => {
              console.log("files found" + files)
            }
          ).catch(
            (err) => {
              console.log("files not found ")
            }
            );   
          
        }
        console.log(JSON.stringify(this.photos));
      });
    });
  }

  close() {
      this.viewCtrl.dismiss();
  }


}