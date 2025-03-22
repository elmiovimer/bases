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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent  implements OnInit, OnDestroy {

  @ViewChild('modalRecuperarPassword') modalRecuperarPassword : IonModal;

  private fb = inject(FormBuilder);
  private authenticationService = inject(AuthenticationService);
  private interactionServices = inject(InteractionsService);
  private firestoreService = inject(FirestoreService);
  private userService = inject(UserService);
  private router = inject(Router);
  loading : boolean = false;
  // inicio : string = ' ';
  // subscription : Subscription;
  isDarkMode : boolean = window.matchMedia('(prefers-color-scheme : dark)').matches;
  providers : Models.Auth.ProviderLoginI[];
  form : Models.Auth.DatosLogin;
  // user : {
  //   email: string,
  //   name : string,
  //   photoURL : string
  // }
  user: User = this.authenticationService.getCurrentUser();

  enableResetPassword : boolean = false;
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

    } catch (error) {
      this.interactionServices.showAlert(`Importante`,`Es posible que no tengas conexion a internet. reinicia la aplicacion`)


    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      this.isDarkMode = event.matches;
      console.log('Modo oscuro cambiado:', this.isDarkMode);
      if (this.isDarkMode && this.providers) {
        //todo este codigo no funciona
        const newProviders = this.providers.map((provider)   =>{
          // provider.color === 'black' ? {...provider, color : 'white', textColor : 'black'} : provider

          if (provider.color === 'black') {
            provider = {
              ...provider,
              color : 'white',
              textColor : 'black'
            }
            console.log(provider)

          }
        }

        );
        // this.providers = newProviders


      }
      // this.providers[1].color = this.isDarkMode? 'white' : 'black'
      // this.providers[1].textColor = !this.isDarkMode? 'white' : 'black'
    });

    // this.user = this.authenticationService.getCurrentUser();




    console.log('user',this.user)



    this.loading = false




  }



  ngOnInit() {
    this.initForm();
  }
  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }


  initForm(){
    this.form = {
      email: '',
      password: '',
    }

  }

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

  // login(){
  //   if(this.datosForm.valid){
  //     try{
  //       const data = this.datosForm.value
  //       this.authenticationService.login(data.email, data.password);
  //       setTimeout(()=>{
  //         this.router.navigate(['/auth/profile'])
  //       },500);

  //     }catch(e){ console.log('error en login() ->', e)}
  //   }


  // }

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
    // if (Capacitor.isNativePlatform()) {
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

    // } else{
    //   // console.log('first')
    //   await this.interactionServices.showLoading(`Procesando...`);
    //   await this.authenticationService.loginWithProvider(provider.id);
    //   this.interactionServices.dismissLoading();
    //   setTimeout(() => {
    //     this.router.navigate(['auth', 'profile'], {replaceUrl: true});

    //   }, 200);
    // }
  }




}
