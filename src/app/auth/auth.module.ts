import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { LoginFormComponent } from './componentes/login-form/login-form.component';
import { IonContent } from '@ionic/angular/standalone';


@NgModule({
  declarations: [
    LoginComponent, //page
    LoginFormComponent,  //component
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    IonContent,
  ]
})
export class AuthModule { }
