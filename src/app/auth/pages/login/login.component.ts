import { Component, inject, OnDestroy, OnInit, ChangeDetectorRef, viewChild, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/firebase/authentication.service';
import { Models } from 'src/app/models/models';
import { updateDoc } from '@angular/fire/firestore';
import { FirestoreService } from '../../../firebase/firestore.service';
import {User} from '@angular/fire/auth'
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { UserService } from '../../../services/user.service';
import { IonModal } from '@ionic/angular/standalone';
import { InteractionsService } from 'src/app/services/interactions.service';
import { error } from 'firebase-functions/logger';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent  implements OnInit {

  @ViewChild('modalRecuperarPassword') modalRecuperarPassword : IonModal;

  private fb = inject(FormBuilder);
  private authenticationService = inject(AuthenticationService);
  private interactionServices = inject(InteractionsService);
  private userService = inject(UserService);
  private router = inject(Router);
  button : any;
  buttonDark : any;
  isDarkMode : boolean = window.matchMedia('(prefers-color-scheme : dark)').matches;
  providers : Models.Auth.ProviderLoginI[];
  enableLoginWithEmailAndPassword : boolean = false;

  datosForm = this.fb.group({
    email:['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  })

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  reestablecerPasswordForm = this.fb.group({
    email:['', [Validators.required, Validators.email]]
  })

  constructor() {


    try {
      this.providers = this.authenticationService.providers;
      this.button = this.providers.find(provider => provider.id == 'apple');
      this.buttonDark = {
        ...this.button,
        color: 'white',
          textColor: 'black'

      }

    } catch (error) {
      this.interactionServices.showAlert(`Importante`,`Es posible que no tengas conexion a internet. reinicia la aplicacion`)


    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      this.isDarkMode = event.matches;
      console.log('Modo oscuro cambiado:', this.isDarkMode);



        let index = this.providers.findIndex(provider => provider.id === 'apple')
        this.providers[index] = this.isDarkMode? this.buttonDark : this.button;

    });

  }



  ngOnInit() {}



  async loginWithEmail(){
    if (this.loginForm.valid) {
      const data = this.loginForm.value;
      await this.interactionServices.showLoading('Ingresando...')
      try{
        const response = await this.authenticationService.login(data.email, data.password);
        this.interactionServices.dismissLoading();
        const user = response.user;
        this.interactionServices.showToast(`Bienvenido ${user.displayName}`);
        setTimeout(()=>{
          // this.router.navigate(['/auth/profile']);
          this.router.navigate(['auth','profile'], {replaceUrl : true})
        })

      }catch (error){
        console.log('login error ->', error);
        this.interactionServices.dismissLoading();
        this.interactionServices.showAlert('Error', 'Credenciales inválidas')

      }

    }
  }


  async resetPassword(){
    console.log(this.reestablecerPasswordForm.valid)
    if(this.reestablecerPasswordForm.valid){
      console.log('reset password')
      const data = this.reestablecerPasswordForm.value;
      this.modalRecuperarPassword.dismiss();
      await this.interactionServices.showLoading('Enviando Correo...');
      try {
        await this.authenticationService.sendPasswordResetEmail(data.email);
        this.interactionServices.dismissLoading();
        this.interactionServices.showAlert('Importante', 'Te hemos enviado un correo para reestablecer tu contraseña');
        console.log('te hemos enviado un correo para reestablecer tu contraseña');

      } catch (error) {
        console.log('error en resetPassword() ->', error)
      }

    }
  }



  async loginWithProvider(provider : Models.Auth.ProviderLoginI){
    if (provider.id == 'password') {
      console.log('login with provideres')
      this.enableLoginWithEmailAndPassword = true;
      return;

    }
    console.log(Capacitor.isNativePlatform())
    if (Capacitor.isNativePlatform()  || environment.production) {
      await this.interactionServices.showLoading('Procesando...');
      const token = await this.authenticationService.getTokenOfProvider(provider.id);
      const response = await this.authenticationService.loginWithTokenOfprovider(provider.id, token);
      this.interactionServices.dismissLoading();
      if (response) {
        const user = response.user;
        this.interactionServices.showToast(`Bienvenido ${user.displayName}`)
        const userProfile = await this.userService.getUserProfile(user.uid)
        if(userProfile){
          setTimeout(() => {
            this.router.navigate(['auth', 'profile'], {replaceUrl: true});

          }, 200);

        }
        else{
          setTimeout(() => {
            this.router.navigate(['auth', 'completar-registro'], {replaceUrl: true});

          }, 200);

        }

      }

    } else{
      // console.log('first')
      await this.interactionServices.showLoading(`Procesando...`);
      await this.authenticationService.loginWithProvider(provider.id);
      this.interactionServices.dismissLoading();
      setTimeout(() => {
        this.router.navigate(['auth', 'profile'], {replaceUrl: true});

      }, 200);
    }
  }




}
