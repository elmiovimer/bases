import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { LoginFormComponent } from './componentes/login-form/login-form.component';
import { IonContent } from '@ionic/angular/standalone';
import { RegisterComponent } from './pages/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './pages/profile/profile.component';
import { SharedModule } from '../shared/shared.module';
import { CompletarRegistroComponent } from './pages/completar-registro/completar-registro.component';
import { RequestLoginComponent } from './pages/request-login/request-login.component';


@NgModule({
  declarations: [
    LoginComponent, //page
    LoginFormComponent,
    RegisterComponent,  //component
    ProfileComponent, //page
    CompletarRegistroComponent, //page
    RequestLoginComponent, //page

  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    IonContent,
    ReactiveFormsModule,
    FormsModule,
    SharedModule



  ]
})
export class AuthModule { }
