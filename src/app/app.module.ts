import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Base64 } from '@ionic-native/base64';
import { NativeStorage } from '@ionic-native/native-storage';
import { SQLite } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { SignaturePadModule } from 'angular2-signaturepad';
import { EmailComposer } from '@ionic-native/email-composer';
import { FileOpener } from '@ionic-native/file-opener';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MyApp } from './app.component';

// Pages
import { HomePage } from '../pages/home/home';
import { RestaurantlistPage } from '../pages/restaurantlist/restaurantlist';
import { EvaluationCategoryPage } from '../pages/evaluationcategory/evaluationcategory';
import { RestaurantDetailPage } from '../pages/restaurantdetail/restaurantdetail';
import { ArchivePage } from '../pages/archive/archive';
import { EvaluationPage } from '../pages/evaluation/evaluation';
import { EvaluationCommentairePage } from '../pages/evaluationcommentaire/evaluationcommentaire';
import { SignaturePage } from '../pages/signature/signature';
import { SignaturepopoverPage } from '../pages/signaturepopover/signaturepopover';
import { ArchiveDetailPage } from '../pages/archivedetail/archivedetail';
import { StatisticPage } from '../pages/statistic/statistic';
import { StatisticSubCategoryPage } from '../pages/statisticsubcategory/statisticsubcategory';
import { ArchiveEvaluationPage } from '../pages/archiveevaluation/archiveevaluation';
import { EvaluationphotoPage } from '../pages/evaluationphoto/evaluationphoto';
import { AjoutquestionPage } from '../pages/ajoutquestion/ajoutquestion';
import { AjoutquestionmodalPage } from '../pages/ajoutquestionmodal/ajoutquestionmodal';
import { AjoutrestaurantmodalPage } from '../pages/ajoutrestaurantmodal/ajoutrestaurantmodal';
import { VillelistPage } from '../pages/villelist/villelist';
import { AjoutvillemodalPage } from '../pages/ajoutvillemodal/ajoutvillemodal';
import { SignaturepdfpopoverPage } from '../pages/signaturepdfpopover/signaturepdfpopover';


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
    ArchivePage,
    EvaluationCommentairePage,
    SignaturePage,
    SignaturepopoverPage,
    ArchiveDetailPage,
    StatisticPage,
    ArchiveEvaluationPage,
    EvaluationphotoPage,
    AjoutquestionPage,
    AjoutquestionmodalPage,
    AjoutrestaurantmodalPage,
    StatisticSubCategoryPage,
    VillelistPage,
    AjoutvillemodalPage,
    SignaturepdfpopoverPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    SignaturePadModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
    BrowserAnimationsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RestaurantlistPage,
    EvaluationCategoryPage,
    RestaurantDetailPage,
    EvaluationPage,
    ArchivePage,
    EvaluationCommentairePage,
    SignaturePage,
    SignaturepopoverPage,
    ArchiveDetailPage,
    StatisticPage,
    ArchiveEvaluationPage,
    EvaluationphotoPage,
    AjoutquestionPage,
    AjoutquestionmodalPage,
    AjoutrestaurantmodalPage,
    StatisticSubCategoryPage,
    VillelistPage,
    AjoutvillemodalPage,
    SignaturepdfpopoverPage
  ],
  providers: [
    StatusBar,
    NativeStorage,
    SplashScreen,
    Camera,
    EmailComposer,
    FileOpener,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,
    SQLitePorter,
    SQLite,
    File,
    Transfer,
    FilePath,
    BrowserAnimationsModule,
    FileTransfer,
    FileTransferObject,
    Base64
  ]
})
export class AppModule {}
