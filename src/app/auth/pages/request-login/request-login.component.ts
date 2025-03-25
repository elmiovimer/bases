import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/firebase/authentication.service';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { Models } from 'src/app/models/models';
import { UserService } from 'src/app/services/user.service';
import {  OAuthProvider } from '@angular/fire/auth';
import { InteractionsService } from 'src/app/services/interactions.service';

@Component({
  selector: 'app-request-login',
  templateUrl: './request-login.component.html',
  styleUrls: ['./request-login.component.scss'],
  standalone: false
})
export class RequestLoginComponent  implements OnInit {

  private authenticationService: AuthenticationService = inject(AuthenticationService);
  private firestoreService: FirestoreService = inject(FirestoreService);
  // private userService: UserService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private interactionServices : InteractionsService = inject(InteractionsService);


  constructor() {

    console.log('RequestLoginComponent inicializado')
    this.getQueryParams();
    this.getTokenOfProvider();



   }

  ngOnInit() {}

  /**
   * Obtiene los parámetros de la URL para manejar el flujo de autenticación con proveedores externos.
   */
  async getQueryParams() {
    const queryParams: any = this.route.snapshot.queryParams;
    console.log('parametros de consulta(queryparams) -> ', queryParams);
    if (queryParams.provider && queryParams.intentId) {
      const provider = queryParams.provider;
      await this.interactionServices.showLoading('Procesando...')
      this.authenticationService.loginWithProvider(provider)
      this.router.navigate(['/auth/request-login'], { queryParams: { intentId: queryParams.intentId}})
    }

  }

  /**
   * Obtiene el token de autenticación de un proveedor tras una redirección.
   */
  async getTokenOfProvider() {
    await this.interactionServices.showLoading('Redirigiendo...')
      const result =  await this.authenticationService.getRedirectResult();
      console.log('getRedirectResult -> ', result);

      if (result) {
        const credential = OAuthProvider.credentialFromResult(result)
        const token = credential.idToken || credential.accessToken;
        this.saveToken(token);
      }
  }
  /**
   * Obtiene el token de autenticación desde un popup y lo guarda.
   * @param result Resultado de autenticación obtenido desde el popup.
   */
  async getTokenOfProviderbyPopup(result? : any) {

      console.log('Resultado del popup:', result);
      if (result) {
        const credential = OAuthProvider.credentialFromResult(result)
        const token = credential.idToken ? credential.idToken : credential.accessToken;
        if (token) this.saveToken(token);
      }else{
        this.interactionServices.dismissLoading()
      }
  }

  /**
   * Guarda el token de autenticación en Firestore y cierra la sesión.
   * @param token Token de autenticación a guardar.
   */
  async saveToken (token : string){
    const queryParams : any = this.route.snapshot.queryParams;
    const intentId = queryParams.intentId;
    if (intentId) {
      const path = Models.Auth.PathIntentsLogin;
      const dataUpdate = { token };
      await this.firestoreService.updateDocument(`${path}/${intentId}`, dataUpdate);
      this.authenticationService.logout();
      console.log('token guardado con exito')

    }

  }

}
