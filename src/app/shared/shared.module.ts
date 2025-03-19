import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NotificationsModule } from '../notifications/notifications.module';
import { IconNotificationsComponent } from '../notifications/components/icon-notifications/icon-notifications.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { IonContent, IonFooter, IonIcon, IonInput, IonHeader, IonToolbar, IonTitle,
  IonButton, IonList, IonItem, IonLabel, IonAvatar, IonItemGroup,
  IonItemDivider, IonButtons, IonImg, IonBackButton, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { ShortPipe } from './pipes/short.pipe';
import { FiletourlPipe } from './pipes/filetourl.pipe';
import { ReftourlPipe } from './pipes/reftourl.pipe';




@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    CartDetailsComponent,
    FiletourlPipe,
    ReftourlPipe


  ],
  imports: [
    CommonModule,
    NotificationsModule,
    IonContent, IonFooter, IonIcon, IonInput, IonHeader, IonToolbar, IonTitle,
  IonButton, IonList, IonItem, IonLabel, IonAvatar, IonItemGroup,
  IonItemDivider, IonButtons, IonImg, IonBackButton, IonGrid, IonRow, IonCol,
    RouterModule,
    // IconNotificationsComponent,

  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    CartDetailsComponent,
    FiletourlPipe,
    ReftourlPipe


  ],
})
export class SharedModule { }
