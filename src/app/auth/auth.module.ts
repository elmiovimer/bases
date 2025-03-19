import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { LoginFormComponent } from './componentes/login-form/login-form.component';
import { RegisterComponent } from './pages/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './pages/profile/profile.component';
import { SharedModule } from '../shared/shared.module';
import { CompletarRegistroComponent } from './pages/completar-registro/completar-registro.component';
import { RequestLoginComponent } from './pages/request-login/request-login.component';
import { UsersComponent } from './pages/users/users.component';
import { IonContent, IonInput, IonHeader, IonToolbar, IonTitle,
  IonButton, IonList, IonItem, IonLabel, IonAvatar, IonIcon, IonItemGroup,
  IonItemDivider, IonButtons, IonImg, IonBackButton, IonGrid, IonRow, IonCol,
  IonInputPasswordToggle, IonModal, IonSpinner, IonListHeader, IonChip, IonAccordionGroup, IonAccordion } from '@ionic/angular/standalone';
import { UserDetailComponent } from './componentes/user-detail/user-detail.component';


@NgModule({
  declarations: [
    LoginComponent, //page
    LoginFormComponent,
    RegisterComponent,  //component
    ProfileComponent, //page
    CompletarRegistroComponent, //page
    RequestLoginComponent, //page
    UsersComponent,
    UserDetailComponent,


  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,

    IonContent, IonInput, IonHeader, IonToolbar, IonTitle, IonButton, IonList, IonItem, IonLabel, IonAvatar, IonIcon,
    IonItemGroup, IonItemDivider, IonButtons, IonImg, IonSpinner, IonListHeader,
    IonBackButton, IonRow, IonCol, IonGrid, IonInputPasswordToggle, IonModal, IonChip, IonAccordionGroup, IonAccordion






    //

  ]
})
export class AuthModule { }
