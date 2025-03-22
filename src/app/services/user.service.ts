import { Injectable, inject } from '@angular/core';
import { AuthenticationService } from '../firebase/authentication.service';
import { FirestoreService } from '../firebase/firestore.service';
import { User } from '@angular/fire/auth';
import { Models } from '../models/models';
import { Router } from '@angular/router';
import { WebService } from './web.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { updateDoc } from '@angular/fire/firestore';
import { response } from 'express';
import { FunctionsService } from '../firebase/functions.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private authenticationService = inject(AuthenticationService);
  private firestoreService = inject(FirestoreService);
  private functionsService : FunctionsService = inject(FunctionsService);
  private router = inject(Router);
  private webService = inject(WebService);
  private user: User;
  private userProfile: Models.Auth.UserProfile;
  private roles : any;


  private userSubject = new BehaviorSubject<User | null>(null); // Estado del usuario
  user$ = this.userSubject.asObservable(); // Observable para los componentes

  private loginStatus: 'login' | 'not-login' ; // Estado del usuario
  // private login: 'login' | 'not-login'; // Estado del usuario

  constructor() {
    console.log('UserService inicializado');





    this.subscribirse();
  }

  subscribirse(){
    this.authenticationService.authState.subscribe(user => {
      console.log('Estado de autenticación cambiado:', user);
      this.userSubject.next(user); // Actualiza el estado global

      if (user) {
        this.loginStatus = 'login';
        this.user = user;
        this.user.getIdToken().then(
          token =>{
            console.log('token -> ', token)
            this.webService.token = token;
          }
        )
        this.getUserProfile(user.uid);
      } else {
        this.loginStatus = 'not-login';
        this.user = null;
      }
    });

  }



  /** Obtiene el usuario actual sin suscribirse */
  getUser(): User | null {
    return this.userSubject.value;
  }

  isLogin() {
    return new Promise<boolean>( async (resolve) => {
      console.log('isLogin');

      const user = await this.getState();
      // console.log('first, user', user)
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    })
  }

  // async isLogin(){
  //   const user = await this.getState();
  //   if(user){
  //     return true;
  //   }
  //   else{
  //     return false;
  //   }
  // }

  /** Obtiene el estado del usuario sin crear nuevas suscripciones */
  async getState(): Promise<User | null> {
    console.log('getState')
    if (this.loginStatus === 'login') {
      return this.getUser();
    }


    const user = await firstValueFrom(this.authenticationService.authState);
    this.userSubject.next(user);

    if (user) {
      this.loginStatus = 'login';
      console.log(this.loginStatus)
      this.user = user;
      this.getUserProfile(user.uid);
    } else {
      this.loginStatus = 'not-login';
    }

    return user;
  }

//   getState() {
//     return new Promise<User>((resolve) => {
//         if (this.login) {
//           resolve(this.user);
//           return;
//         }
//         this.authenticationService.authState.subscribe( res => {
//           if (res) {
//             console.log('res first ->', res)
//             this.user = res;
//             this.login = 'login';
//             console.log('authState -> ', this.user);
//             // this.user.getIdToken().then( token => {
//             //   // console.log('token -> ', token);
//             //   this.webService.token = token;
//             // });
//             // this.getRol();
//             if (!this.userProfile) {
//               this.getUserProfile(res.uid);
//             }
//           } else {
//             this.user = null
//             this.login = 'not-login';
//           }
//           resolve(this.user);
//         });
//     })
// }

async getRol() {
  // console.log('roles ->', this.roles)

  if (this.roles) {
    return this.roles
  }
  if (this.user) {
    const tokenResult = await this.user.getIdTokenResult(true);
    // console.log('tokenResult -> ', tokenResult);
    const claims: any = tokenResult.claims;
    console.log('claims ->', claims)
    if(claims.roles !== this.userProfile.roles){
      this.roles = this.userProfile.roles;


      const roles : {[key : string] : boolean} = {};
      Object.keys(this.userProfile.roles).forEach(key =>{
        roles[key] = true;
      })

      const request : Models.Functions.RequestSetRol = {
        roles,
        uid: this.user.uid
      }
      try {
        const response = await this.setClaim(request)

      } catch (error) {

      }


    }
    if (claims.roles) {
      this.roles = claims.roles;
      // return claims.roles
    }
    return this.roles


  }
  return null;
}


//llamado a function en firebase functions
async setClaim(data  :any){


    const request : Models.Functions.RequestSetRol = data
    try {
      const response = await this.functionsService.call<any, any>('setClaim', request);
      console.log('response', response)
      return response;

    } catch (error) {
      console.log('error en setClaim', error)

    }
    return null

  }

  /** Obtiene el perfil del usuario desde Firestore */
  async getUserProfile(uid: string) {
    console.log('getUserProfile', this.userProfile)
    if (this.userProfile) {
      return this.userProfile;
    }
    const response = await this.firestoreService.getDocument<Models.Auth.UserProfile>(`${Models.Auth.PathUsers}/${uid}`);

    if (response.exists()) {
      console.log('response.data() ->',response.data())
      this.userProfile = response.data();

      // Sincronizar email si es diferente
      if (this.userProfile.email !== this.getUser()?.email) {
        console.log('Sincronizando email...');
        const updateDoc = { email: this.getUser()?.email }
        await this.firestoreService.updateDocument(`${Models.Auth.PathUsers}/${uid}`, updateDoc );
        console.log('userProfile ->', this.userProfile)
      }
    } else {
      // Redirigir al usuario a completar su registro si no tiene perfil
      this.router.navigate(['/auth/completar-registro']);

    }
    return this.userProfile;
    // return null;

  }




}
