import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-892e8","appId":"1:753088740401:web:0903e80884dc9ee4dba910","storageBucket":"ring-of-fire-892e8.appspot.com","apiKey":"AIzaSyBcAtiq9EnxPNSTJUtkNCDz5pnPnezTZfQ","authDomain":"ring-of-fire-892e8.firebaseapp.com","messagingSenderId":"753088740401"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
