import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {getFunctions, provideFunctions} from '@angular/fire/functions'
import { getAuth, indexedDBLocalPersistence, initializeAuth, provideAuth } from '@angular/fire/auth';
import { environment } from './environments/environment';
import { Capacitor } from '@capacitor/core';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { LogLevel, setLogLevel } from '@angular/fire';


// setLogLevel(LogLevel.VERBOSE);
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),

    //se debe hacer esta integracion para que firebase funcione correectamente en las ios y android
    provideFirebaseApp(() => {
      const app = initializeApp(environment.firebaseConfig);
      if (Capacitor.isNativePlatform()) {
        initializeFirestore(app, {
          localCache: persistentLocalCache(),
        });
        initializeAuth(app, {
          persistence: indexedDBLocalPersistence
        });
      }
      return app;
    }),

    //firebase
    //esta es la importacion correcta para la version de angular 17
    // importProvidersFrom(provideFirebaseApp(() => initializeApp())),
    // importProvidersFrom(provideFirestore(() => getFirestore()),),

    //esta es la importacion correcta para la version de angular 18 en adelante
    // provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideFunctions(() => getFunctions()),
    // provideAuth(()=> getAuth()),

  ],

});
