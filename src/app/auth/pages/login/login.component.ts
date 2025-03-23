import { Component, inject, OnInit, viewChild, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/firebase/authentication.service';
import { Models } from 'src/app/models/models';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { UserService } from '../../../services/user.service';
import { IonModal } from '@ionic/angular/standalone';
import { InteractionsService } from 'src/app/services/interactions.service';
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

  isDarkMode : boolean = window.matchMedia('(prefers-color-scheme : dark)').matches;
  providers : Models.Auth.ProviderLoginI[];
  enableLoginWithEmailAndPassword : boolean = false;

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

    //para saber si el dispositivo esta en darkMode
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      this.isDarkMode = event.matches;
    });

  }



  ngOnInit() {}


  /**
   * Inicia sesión con correo y contraseña si el formulario es válido.
   */
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
        }, 200)

      }catch (error){
        console.log('login error ->', error);
        this.interactionServices.dismissLoading();
        this.interactionServices.showAlert('Error', 'Credenciales inválidas')

      }

    }
  }

  /**
   * Envía un correo para restablecer la contraseña si el formulario es válido.
   */
  async resetPassword(){

    if(!this.reestablecerPasswordForm.valid){return;}
    console.log('reset password')
    const data = this.reestablecerPasswordForm.value;
    this.modalRecuperarPassword.dismiss();
    await this.interactionServices.showLoading('Enviando Correo...');
    try {
      await this.authenticationService.sendPasswordResetEmail(data.email);
      this.interactionServices.dismissLoading();
      this.interactionServices.showAlert('Importante', 'Te hemos enviado un correo para reestablecer tu contraseña');
    } catch (error) {
      this.interactionServices.dismissLoading();
      this.interactionServices.showToast('Parece que ocurrió un problema. Por favor, inténtalo nuevamente. Si el inconveniente continúa, contacta a nuestro equipo de soporte para obtener ayuda.')
      console.log('error en resetPassword() ->', error)
    }


  }


/**
   * Inicia sesión con un proveedor de autenticación.
   * @param provider tipo ProviderLoginI - Proveedor de autenticación (Google, Apple, etc.)
   */
  async loginWithProvider(provider : Models.Auth.ProviderLoginI){
    if (provider.id == 'password') {
      this.enableLoginWithEmailAndPassword = true;
      return;

    }
    await this.interactionServices.showLoading('Procesando...');
    if (Capacitor.isNativePlatform()  || environment.production) {
      const token = await this.authenticationService.getTokenOfProvider(provider.id);
      const response = await this.authenticationService.loginWithTokenOfprovider(provider.id, token);
      this.interactionServices.dismissLoading();

      if (response) {
        const user = response.user;
        const userProfile = await this.userService.getUserProfile(user.uid)
        const route = userProfile? 'profile' : 'completar-registro';
        this.interactionServices.showToast(`Bienvenido ${user.displayName}`)
        setTimeout(() => {   this.router.navigate(['auth', route], {replaceUrl: true})   }, 200);
      }

    } else{
      await this.authenticationService.loginWithProvider(provider.id);
      this.interactionServices.dismissLoading();
      setTimeout(() => {  this.router.navigate(['auth', 'profile'], {replaceUrl: true});      }, 200);
    }
  }





}
