import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageModule } from './pages/login/login.module';
import { SignupPageModule } from './pages/signup/signup.module';

import { AngularFireModule} from '@angular/fire/compat'
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { ComponentModule } from './comp.module';

import { environment } from '../environments/environment';
// import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
// import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
// import { provideAuth,getAuth } from '@angular/fire/auth';
// import { provideDatabase,getDatabase } from '@angular/fire/database';
// import { provideStorage,getStorage } from '@angular/fire/storage';
// import { provideFirestore, getFirestore } from '@angular/fire/firestore';


import { HttpClientModule } from '@angular/common/http';
// import { FileSizePipe } from './file-size.pipe';
// FileSizePipe
@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule, 
    BrowserModule, IonicModule.forRoot(), 
    AppRoutingModule, 
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, 
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    SignupPageModule,
    LoginPageModule,
    ComponentModule,
    FormsModule, 
    ReactiveFormsModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, AngularFirestoreModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
// provideFirebaseApp(() => initializeApp(environment.firebase)), provideAnalytics(() => getAnalytics()), provideAuth(() => getAuth()), provideDatabase(() => getDatabase()), provideFirestore(() => getFirestore()), provideStorage(() => getStorage())