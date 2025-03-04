import { Component, inject, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../firebase/authentication.service';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { User } from '@angular/fire/auth';
import { Models } from 'src/app/models/models';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-completar-registro',
  templateUrl: './completar-registro.component.html',
  styleUrls: ['./completar-registro.component.scss'],
  standalone: false,
})
export class CompletarRegistroComponent  implements OnInit {
  private authenticationService : AuthenticationService = inject(AuthenticationService);
  private firestoreService : FirestoreService = inject(FirestoreService);
  private fb : FormBuilder = inject(FormBuilder)
  private router = inject(Router)
  loading : boolean = false;
  init: boolean = true;

  user: User
  userProfile: Models.Auth.UserProfile;

  datosFormCompleteRegistro = this.fb.group({
    email: ['',[Validators.required, Validators.email]],
    name: ['',[Validators.required]],
    photo: ['',[Validators.required]],
    age: [null,[Validators.required]],
  })

  constructor() {
    this.authenticationService.authState.subscribe(res => {
      if(res){
        this.user = res;
        this.datosFormCompleteRegistro.setValue({
          email : res.email,
          name : res.displayName,
          photo : res.photoURL,
          age : null
        })
      }
      this.loading = false;
    })
   }

  ngOnInit() {}

  async completarRegistro(){
    this.loading = true;
    console.log('datosDormCompleteRegistro ->', this.datosFormCompleteRegistro);
    if(this.datosFormCompleteRegistro.valid){
      const data = this.datosFormCompleteRegistro.value;
      console.log('valid ->', data);
      try {
        let profile: Models.Auth.UPdatePforileI = {
          displayName: data.name,
          photoURL: data.photo
        }
        const user = this.authenticationService.getCurrentUser();
        await this.authenticationService.updateProfile(profile);
        const datosUser : Models.Auth.UserProfile = {
          name: data.name,
          photo: data.photo,
          age : data.age,
          email : data.email,
          id : user.uid
        }
        console.log('datosUser ->', datosUser);
        await this.firestoreService.createDocument(Models.Auth.PathUsers, datosUser, user.uid);
        this.router.navigate(['/user/profile'])


      } catch (error) {
        console.log('error en completarRegistro() -> ', error)

      }
    }
  }

}
