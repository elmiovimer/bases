import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../firebase/authentication.service';
import { Models } from 'src/app/models/models';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent  implements OnInit {
  private fb = inject(FormBuilder);
  private authenticationService = inject(AuthenticationService);
  private firestoreService = inject(FirestoreService);
  private router = inject(Router);

  datosForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    name: ['', Validators.required],
    photo: [''],
    age: [null]
  })
  loading : boolean = false;

  constructor() { }

  ngOnInit() {}

  async registrarse(){
    this.loading = true;
    console.log('datosForm ->', this.datosForm);
    if(this.datosForm.valid){
      const data = this.datosForm.value;
      console.log('valid ->', data);
      try{
        const res = await this.authenticationService.createUser(data.email, data.password);
        // console.log('user ->', user);
        let profile: Models.Auth.UPdatePforileI = {
          displayName : data.name,
          photoURL : data.photo
        };
        await this.authenticationService.updateProfile(profile);
        const datosUser : Models.Auth.UserProfile = {
          name: data.name,
          photo: data.photo,
          age: data.age,
          id: res.user.uid,
          email: data.email
        }
        console.log('datosUser ->', datosUser);
        await this.firestoreService.createDocument(Models.Auth.PathUsers, datosUser, res.user.uid);
        console.log('usuario creado con exito');
        this.router.navigate(['/auth/login']);

      }catch(e){ console.log('registrarse error ->', e)}
    }

  }

}
