import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/firebase/authentication.service';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { Models } from 'src/app/models/models';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { GoogleAuthProvider, OAuthProvider } from '@angular/fire/auth';

@Component({
  selector: 'app-request-login',
  templateUrl: './request-login.component.html',
  styleUrls: ['./request-login.component.scss'],
  standalone: false
})
export class RequestLoginComponent  implements OnInit {
  private authenticationService: AuthenticationService = inject(AuthenticationService);
  private firestoreService: FirestoreService = inject(FirestoreService);
  userService: UserService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);


  message : string = 'procesando...';

  constructor() {

    console.log('en request - login')
    this.getQueryParams();
    this.getTokenOfProvider();



   }

  ngOnInit() {}

  getQueryParams() {
    const queryParams: any = this.route.snapshot.queryParams;
    console.log('queryParams -> ', queryParams);
    if (queryParams.provider && queryParams.intentId) {
      const provider = queryParams.provider;
      // if(!environment.production){ //esto esta sin probar y es para ser utilizado solo en pruebas
      //   const res = this.authenticationService.loginWithProviderByPopup(provider);
      //   this.router.navigate(['/user/request-login'], { queryParams: { intentId: queryParams.intentId}})
      //   this.getTokenOfProviderbyPopup(res)



      // }
      this.authenticationService.loginWithProvider(provider)
      this.router.navigate(['/user/request-login'], { queryParams: { intentId: queryParams.intentId}})
    }

  }

  async getTokenOfProvider() {
      const result =  await this.authenticationService.getRedirectResult();
      console.log('getRedirectResult -> ', result);
      if (result) {
        this.message = 'redirigiendo...'
        const credential = OAuthProvider.credentialFromResult(result)
        console.log('credential -> ', credential);
        const token = credential.idToken ? credential.idToken : credential.accessToken;
        this.saveToken(token);
      }
  }
  async getTokenOfProviderbyPopup(result? : any) {

      console.log('getRedirectResult -> ', result);
      if (result) {
        this.message = 'redirigiendo...'
        const credential = OAuthProvider.credentialFromResult(result)
        console.log('credential -> ', credential);
        const token = credential.idToken ? credential.idToken : credential.accessToken;
        this.saveToken(token);
      }
  }

  async saveToken (token : string){
    const queryParams : any = this.route.snapshot.queryParams;
    const intentId = queryParams.intentId;
    console.log('intentId ->', intentId);
    console.log('token ->', token);
    if (intentId) {
      const path = Models.Auth.PathIntentsLogin;
      const dataUpdate = {token};
      await this.firestoreService.updateDocument(`${path}/${intentId}`, dataUpdate);
      this.authenticationService.logout();
      console.log('token guardado con exito')

    }

  }

}
