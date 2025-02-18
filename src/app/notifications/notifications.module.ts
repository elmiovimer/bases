import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { DetailNotificationsComponent } from './components/detail-notifications/detail-notifications.component';
import { IconNotificationsComponent } from './components/icon-notifications/icon-notifications.component';
import { IonContent } from '@ionic/angular/standalone';
import { SharedModule } from "../shared/shared.module";


@NgModule({
  declarations: [
    NotificationsComponent,  //page
    DetailNotificationsComponent, //component
    IconNotificationsComponent //component

  ],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    IonContent,
],

  exports: [
    IconNotificationsComponent //component
  ]

})
export class NotificationsModule { }
