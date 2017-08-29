import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NativeStorage } from '@ionic-native/native-storage';
import { SQLite } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';

import { MyApp } from './app.component';

// Pages
import { HomePage } from '../pages/home/home';
import { RestaurantlistPage } from '../pages/restaurantlist/restaurantlist';
import { EvaluationCategoryPage } from '../pages/evaluationcategory/evaluationcategory';
import { RestaurantDetailPage } from '../pages/restaurantdetail/restaurantdetail';
import { ArchivesPage } from '../pages/archivespage/archivespage';
import { EvaluationPage } from '../pages/evaluation/evaluation';

// Providers
import { DatabaseProvider } from '../providers/database/database';

import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    RestaurantlistPage,
    EvaluationCategoryPage,
    RestaurantDetailPage,
    EvaluationPage,
    ArchivesPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RestaurantlistPage,
    EvaluationCategoryPage,
    RestaurantDetailPage,
    EvaluationPage,
    ArchivesPage
  ],
  providers: [
    StatusBar,
    NativeStorage,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,
    SQLitePorter,
    SQLite
  ]
})
export class AppModule {}
