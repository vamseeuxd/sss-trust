import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';

const config = {
  apiKey: "AIzaSyAs3ji2IFZk3HXQcY8I7WFrCy5fyHAChNQ",
  authDomain: "sss-trust.firebaseapp.com",
  projectId: "sss-trust",
  storageBucket: "sss-trust.appspot.com",
  messagingSenderId: "730544188285",
  appId: "1:730544188285:web:5544e73aecae48f840fa14",
  measurementId: "G-YE8C36CWBV"
};


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(config),
    FormsModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  declarations: [AppComponent],
  providers: [InAppBrowser],
  bootstrap: [AppComponent]
})
export class AppModule {}
