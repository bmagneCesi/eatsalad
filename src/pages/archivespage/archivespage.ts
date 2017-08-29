import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

// Pages
import  { RestaurantlistPage } from '../restaurantlist/restaurantlist';

@Component({
  selector: 'page-archivespage',
  templateUrl: 'archivespage.html'
})
export class ArchivesPage {

  restaurant:string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }


}
