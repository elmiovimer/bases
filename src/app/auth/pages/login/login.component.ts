import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent  implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  private authenticationService = inject(AuthenticationService);
  private firestoreService = inject(FirestoreService)
  private router = inject(Router)
  loading : boolean = false;
  subscription : Subscription;
  isDarkMode : boolean = false;
  providers : Models.Auth.ProviderLoginI[] = [
    {
      name: 'iniciar sesion con Google',
      id: 'google',
      color: '#20a3df',
      textColor: 'white'
    },
    {
      name: 'iniciar sesion con Facebook',
      id: 'facebook',
      color: '#20a3df',
      textColor: 'white'
    },
    {
      name: 'iniciar sesion con Apple',
      id: 'apple',
      color: 'black',
      textColor: 'white'
    },
    {
      name: 'iniciar sesion con Correo y contrasena',
      id: 'password',
      color: '#BD9B60',
      textColor: 'white'
    },
  ]
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

  constructor() {
    this.loading = true;
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      this.isDarkMode = event.matches;
      console.log('Modo oscuro cambiado:', this.isDarkMode);
      this.providers[1].color = this.isDarkMode? 'white' : 'black'
      this.providers[1].textColor = !this.isDarkMode? 'white' : 'black'
    });

    // this.user = this.authenticationService.getCurrentUser();




    console.log('user',this.user)
   this.subscription =  this.authenticationService.authState.subscribe(res =>{
      console.log('user ->',res)
      if(res){
        // this.authenticationService.verifyUserEmail(res.uid);
        this.user = res
      }else
      {
        this.user = null;
      }

    })


    this.loading = false




  }

  ngOnInit() {
    this.initForm();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  initForm(){
    this.form = {
      email: '',
      password: '',
    }

  }

  login(){
    if(this.datosForm.valid){
      try{
        const data = this.datosForm.value
        this.authenticationService.login(data.email, data.password);
        setTimeout(()=>{
          this.router.navigate(['auth'])
        },500);

      }catch(e){ console.log('error en login() ->', e)}
    }


  }

  async resetPassword(){
    this.loading = true;
    console.log('this.datosForm ->', this.datosForm)
    if(this.datosForm.controls.email.valid){
      const data = this.datosForm.value.email;
      console.log('data ->', data);
      try {
        await this.authenticationService.sendPasswordResetEmail(data);
        this.enableResetPassword = false;
        console.log('te hemos enviado un correo para reestablecer tu contraseña')

      } catch (error) {
        console.log('error en resetPassword() ->', error)
      }

    }
  }

  salir(){
    this.authenticationService.logout();
    this.datosForm.controls['email'].setValue('');
    this.datosForm.controls['password'].setValue('');
    this.user = null;

  }

  async loginWithProvider(provider : Models.Auth.ProviderLoginI){
    console.log('loginwithprovider')
    if(provider.id =='password'){
      this.enableLoginWithEmailAndPassword = true;
      return;
    }

    // if (Capacitor.isNativePlatform()) {
      const token = await this.authenticationService.getTokenOfProvider(provider.id);
      console.log(`token: ${token} para hacer el login con -> ${provider.id}`);

      await this.authenticationService.loginWithTokenOfprovider(provider.id, token);
      // this.router.navigate(['user', 'profile']);

    // } else{
      // this.authenticationService.loginWithProvider(provider.id);

    // }



  }

  ionViewDidEnter(){
    console.log('ionviewDidEnter login');
    const user = this.authenticationService.getCurrentUser();
    if (user) {
      this.user= user

    }

  }



}
