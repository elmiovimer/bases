import { inject, Injectable } from '@angular/core';
import { LogLevel, setLogLevel } from '@angular/fire';
import {FacebookAuthProvider, OAuthCredential, signInWithRedirect, Auth, authState, createUserWithEmailAndPassword, deleteUser, EmailAuthProvider, getRedirectResult, GoogleAuthProvider, OAuthProvider, reauthenticateWithCredential, sendEmailVerification, sendPasswordResetEmail, signInWithCredential, signInWithCustomToken, signInWithEmailAndPassword, signInWithPopup, signOut, updateEmail, updatePassword, updateProfile, verifyBeforeUpdateEmail } from '@angular/fire/auth';
import { FirestoreService } from './firestore.service';
import { Models } from '../models/models';
import { updateDoc } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { LocalStorageService } from '../services/local-storage.service';
// import { getAuth } from 'firebase-admin/auth';
// import {getAuth} from "firebase-admin/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  auth : Auth = inject(Auth);
  authState = authState(this.auth);
  firestoreService = inject(FirestoreService);
  private localStorageService : LocalStorageService = inject(LocalStorageService)
  router = inject(Router)
  userID : string
  providers : Models.Auth.ProviderLoginI[] = [];


  constructor() {
    console.log('AuthenticationService inicializado')
    this.auth.languageCode = 'es';
    this.getProviderLoginButtons();


   }



  async getProviderLoginButtons(){
    console.log('getProviderLoginButtons');
    const path = 'ProviderLogin'
    const localButtons = await this.localStorageService.getObject('providers');
    console.log('localButtons ->', localButtons)



    if (localButtons) {
      this.providers = localButtons

    }else{

      const response = await this.firestoreService.getDocuments<Models.Auth.ProviderLoginI>(`${path}`);
      if(response){

        response.forEach(element => {
          console.log('response ->',element.data());
          if (element.data().enable) {

            this.providers.push(element.data())
            // this.localStorageService.setObject(element.data().id, element.data());



          }


        });
        this.localStorageService.setObject('providers', this.providers);
    }
      // sessionStorage.setItem('providers',this.providers )

    }

    // return this.providers


  }

  async createUser(email : string, password : string){
    const user = await createUserWithEmailAndPassword(this.auth, email, password);
    await this.sendEmailVerification();
    return user;

  }

  async login(email : string, password : string){
    const user = await signInWithEmailAndPassword(this.auth, email, password);


    this.userID = user.user.uid

    //aqui cojo el usuario y puedo hacer la co
    return user;

  }

  async verifyUserEmail(userID : string){


    // console.log(this.auth.currentUser.uid)
    const path = `${Models.Auth.PathUsers}/${userID}`
    // const path = 'Users/Gel2Gc1q4ihXLREei6wISDpa9mA2'
    // console.log(path)
    const res = await this.firestoreService.getDocument<Models.Auth.UserProfile>(path)
    if (res){
      console.log('data ->',res.data().email);
      console.log('auth', this.getCurrentUser().email)
      if(!(res.data().email === this.getCurrentUser().email)){
        try {
          const updateDoc = {
            email: this.getCurrentUser().email,
          }
          await this.firestoreService.updateDocument(path, updateDoc)
          console.log('guardado con exito')
        } catch (error) {
          console.log('error en verifyUserEmail()')

        }

      }

    }
  }

  updatePassword(newPassword : string){
    return updatePassword(this.auth.currentUser, newPassword);
  }

  async logout(reload = true){
    await signOut(this.auth);
    if (reload) {
      window.location.reload()

    }

  }

  getCurrentUser(){
    return this.auth.currentUser
  }

  updateProfile(data : {displayName? : string, photoURL? : string}){
    return updateProfile(this.auth.currentUser, data);

  }

  updateEmail(email : string){
    return updateEmail(this.auth.currentUser, email)

  }

  sendEmailVerification(){

    return sendEmailVerification(this.auth.currentUser)
  }

  reauthenticateWithCredential(password : string){
    const credential = EmailAuthProvider.credential(
      this.auth.currentUser.email,
      password
    )
    return reauthenticateWithCredential(this.auth.currentUser, credential)
  }

  verifyBeforeUpdateEmail(email : string){
    return verifyBeforeUpdateEmail(this.auth.currentUser, email)
  }

  sendPasswordResetEmail(email : string ){
    return sendPasswordResetEmail(this.auth, email);
  }

  deleteUser(){
    return deleteUser(this.auth.currentUser)
  }

  getRedirectResult(){

    return getRedirectResult(this.auth);
  }

  async setClaim(uid : string, name : string, claim : any){
    console.log('setClain');
    const data = {
      [name] : claim
    }
    // await getAuth().setCustomUserClaims(uid, data);
    console.log(`Claims asignados a UID: ${uid}`, data);

  }





async loginWithTokenOfprovider(providerId : string, token : string){
  let credential : OAuthCredential;
  console.log('providerId ->', providerId)
  switch(providerId){
    case 'google':
      credential = GoogleAuthProvider.credential(token);
      break;
    case 'apple':
      const OAuth = new OAuthProvider('apple.com');
      credential = OAuth.credential({idToken : token});
      break;
    case 'facebook':
      credential = FacebookAuthProvider.credential(token);
      break;
  };
  console.log('credentials -> ', credential);
  if(credential){
     return await signInWithCredential(this.auth, credential);
  }
  return null;

}
async loginWithProviderByPopup(providerId : string){
  console.log('loginwithprovider')


    let provider;
    if (providerId == 'google'){
      provider = new GoogleAuthProvider();
    }
    if(providerId == 'apple'){
      provider = new OAuthProvider('apple.com')

    }
    if (providerId == 'facebook') {
      provider = new FacebookAuthProvider();
     }

    // if(environment.production){
    if(provider)
      return  await signInWithPopup(this.auth, provider);
    else
    return null;

}

  async loginWithProvider(providerId : string){
    console.log('loginwithprovider')


    let provider;
    if (providerId == 'google'){
      provider = new GoogleAuthProvider();
    }
    if(providerId == 'apple'){
      provider = new OAuthProvider('apple.com')

    }
    if (providerId == 'facebook') {
      provider = new FacebookAuthProvider();
     }

    // if(environment.production){
    if(provider)
      signInWithRedirect(this.auth, provider);
      // console.log('res, signinwithreditect ->',res)
      // return this.getRedirectResult();

    // }
    // else{

    //  return signInWithPopup(this.auth,provider);
      // return signInWithRedirect(this.auth, provider)

    // }

  }



  getTokenOfProvider(providerId : string){
    console.log('getTokenOfProvider ->', providerId);

    return new Promise<string>(async (resolve) => {
      try {
        const path = Models.Auth.PathIntentsLogin;
        const data : any = {
          provider: providerId,
          token : null,
        }

        const id = await this.firestoreService.createDocument(path, data);
        const s = this.firestoreService.getDocumentChanges<any>(`${path}/${id}`).subscribe( async (response) =>{
          if (response) {
            console.log('response ->', response);
            if (response.provider == providerId && response.token) {
              console.log('intento de login con token')
              Browser.close();
              s.unsubscribe();
              // this.firestoreService.deleteDocument(`${path}/${id}`)
              resolve(response.token);
              console.log('login con token ')

            }


          }
        })

        // const link = `http://localhost:4200/auth/request-login?provider=${providerId}&intentId=${id}`;

        const link = `https://${environment.firebaseConfig.authDomain}/auth/request-login?provider=${providerId}&intentId=${id}`;
        // console.log('link ->', link)
        await Browser.open({ url: link });
        // this.router.navigate(['/auth/request-login'], {queryParams: {intentId: queryParams.intentId}});
        // this.router.navigate([link]);


      } catch (error) {
        console.log('error en getTokenOfProvider() ->', error);
        resolve(null);

      }
    });

  }
}
