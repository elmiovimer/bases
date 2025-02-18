import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NotificationsModule } from '../notifications/notifications.module';
import { IconNotificationsComponent } from '../notifications/components/icon-notifications/icon-notifications.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { IonContent } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { ShortPipe } from './pipes/short.pipe';



@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    CartDetailsComponent,
  ],
  imports: [
    CommonModule,
    NotificationsModule,
    IonContent,
    RouterModule,
    // IconNotificationsComponent,
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    CartDetailsComponent,
  ],
})
export class SharedModule { }
