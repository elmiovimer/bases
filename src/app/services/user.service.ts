import { inject, Injectable } from '@angular/core';
import { AuthenticationService } from '../firebase/authentication.service';
import { FirestoreService } from '../firebase/firestore.service';
import { User } from '@angular/fire/auth';
import { Models } from '../models/models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private authenticationService : AuthenticationService = inject(AuthenticationService);
  private firestoreService : FirestoreService = inject(FirestoreService);
  private router = inject(Router)
  user : User;
  userProfile : Models.Auth.UserProfile

  constructor() {
    console.log('UserServices init');
    this.authenticationService.authState.subscribe( res => {
      if(res){
        this.user = res;
        this.getUserProfile(res.uid);
      }
      else{
        this.user = null;
      }
    })

   }
   async getUserProfile( uid : string){
    const response = await this.firestoreService.getDocument<Models.Auth.UserProfile>(`${Models.Auth.PathUsers}/${uid}`);
    if (response.exists()) {
      this.userProfile = response.data();
      if (this.userProfile.email != this.user.email) {

        console.log('sincronizar email');
        const updateData = {
          email: this.user.email
        }
        this.firestoreService.updateDocument(`${Models.Auth.PathUsers}/${uid}`, updateData);


      }

    } else {
      this.router.navigate(['/user/completar-registro'])

    }


  }




//end class
}

