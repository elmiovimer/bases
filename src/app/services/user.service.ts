import { Injectable, inject } from '@angular/core';
import { AuthenticationService } from '../firebase/authentication.service';
import { FirestoreService } from '../firebase/firestore.service';
import { User } from '@angular/fire/auth';
import { Models } from '../models/models';
import { Router } from '@angular/router';
import { WebService } from './web.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private authenticationService = inject(AuthenticationService);
  private firestoreService = inject(FirestoreService);
  private router = inject(Router);
  private webService = inject(WebService);

  private userSubject = new BehaviorSubject<User | null>(null); // Estado del usuario
  user$ = this.userSubject.asObservable(); // Observable para los componentes

  private loginStatus: 'login' | 'not-login' = 'not-login'; // Estado del usuario

  constructor() {
    console.log('UserService inicializado');

    this.authenticationService.authState.subscribe(user => {
      console.log('Estado de autenticación cambiado:', user);
      this.userSubject.next(user); // Actualiza el estado global

      if (user) {
        this.loginStatus = 'login';
        this.getUserProfile(user.uid);
      } else {
        this.loginStatus = 'not-login';
      }
    });
  }

  /** Obtiene el usuario actual sin suscribirse */
  getUser(): User | null {
    return this.userSubject.value;
  }

  /** Obtiene el estado del usuario sin crear nuevas suscripciones */
  async getState(): Promise<User | null> {
    if (this.loginStatus === 'login') {
      return this.getUser();
    }

    const user = await firstValueFrom(this.authenticationService.authState);
    this.userSubject.next(user);

    if (user) {
      this.loginStatus = 'login';
      this.getUserProfile(user.uid);
    } else {
      this.loginStatus = 'not-login';
    }

    return user;
  }

  /** Obtiene el perfil del usuario desde Firestore */
  private async getUserProfile(uid: string) {
    const response = await this.firestoreService.getDocument<Models.Auth.UserProfile>(`${Models.Auth.PathUsers}/${uid}`);

    if (response.exists()) {
      const userProfile = response.data();

      // Sincronizar email si es diferente
      if (userProfile.email !== this.getUser()?.email) {
        console.log('Sincronizando email...');
        await this.firestoreService.updateDocument(`${Models.Auth.PathUsers}/${uid}`, { email: this.getUser()?.email });
      }
    } else {
      // Redirigir al usuario a completar su registro si no tiene perfil
      this.router.navigate(['/user/completar-registro']);
    }
  }
}
