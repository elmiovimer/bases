import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NotificationsModule } from '../notifications/notifications.module';
import { IconNotificationsComponent } from '../notifications/components/icon-notifications/icon-notifications.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { IonContent, IonFooter, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { ShortPipe } from './pipes/short.pipe';
import { FiletourlPipe } from './pipes/filetourl.pipe';




@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    CartDetailsComponent,
    FiletourlPipe,
    ShortPipe
  ],
  imports: [
    CommonModule,
    NotificationsModule,
    IonContent, IonFooter, IonHeader, IonToolbar,IonTitle, IonButton, IonIcon,
    RouterModule,
    // IconNotificationsComponent,
    
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    CartDetailsComponent,
    FiletourlPipe,
    ShortPipe
  ],
})
export class SharedModule { }
