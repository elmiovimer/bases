import { Component, inject, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../firebase/authentication.service';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { User } from '@angular/fire/auth';
import { Models } from 'src/app/models/models';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../../firebase/storage.service';
import { InteractionsService } from '../../../services/interactions.service';

@Component({
  selector: 'app-completar-registro',
  templateUrl: './completar-registro.component.html',
  styleUrls: ['./completar-registro.component.scss'],
  standalone: false,
})
export class CompletarRegistroComponent  implements OnInit {
  private authenticationService : AuthenticationService = inject(AuthenticationService);
  private firestoreService : FirestoreService = inject(FirestoreService);
  private storageService : StorageService = inject(StorageService);
  private interactionsService : InteractionsService = inject(InteractionsService);
  private fb : FormBuilder = inject(FormBuilder)
  private router = inject(Router)
  loading : boolean = false;
  init: boolean = true;

  user: User
  userProfile: Models.Auth.UserProfile;
  file : File

  datosFormCompleteRegistro = this.fb.group({
    email: ['',[Validators.required, Validators.email]],
    name: ['',[Validators.required]],
    photo: ['',[Validators.required]],
    age: [null,[Validators.required]],
  })

  constructor() {

    this.user = this.authenticationService.getCurrentUser();
    const photo : any = this.user.photoURL;
    this.datosFormCompleteRegistro.setValue({
      email: this.user.email,
      name: this.user.displayName,
      photo: photo,
      age: null

    })
    console.log('photo ->', photo)
   }

  ngOnInit() {}

  async viewPreview(input : HTMLInputElement){
    if (input.files.length) {
      const files = input.files;
      console.log('viewPreview files -> ', files);
      this.file = files.item(0);

    }

  }

  async subirFoto(uid : string, file : File){
     const snap = await this.storageService.uploadFile(`PhotosPerfil/${uid}`, file.name, file);
     console.log('snap -> ', snap);
     // const url = await this.storageService.getDownloadUrl(snap.ref.fullPath)

     return snap.ref.fullPath;



   }

  async completarRegistro(){
    this.loading = true
    await this.interactionsService.showLoading('Procesando...');
    console.log('datosDormCompleteRegistro ->', this.datosFormCompleteRegistro);
    if(this.datosFormCompleteRegistro.valid){
      const data = this.datosFormCompleteRegistro.value;
      if(this.file){
      }

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
          id : user.uid,
          roles: { client: true }
        }
        console.log('datosUser ->', datosUser);
        await this.firestoreService.createDocument(Models.Auth.PathUsers, datosUser, user.uid);
        this.interactionsService.dismissLoading();
        this.interactionsService.showToast('Completado registro con éxito')
        setTimeout(() => {
          this.router.navigate(['/auth/profile'], {replaceUrl: true})

        }, 200);


      } catch (error) {
        console.log('error en completarRegistro() -> ', error)
        this.interactionsService.showAlert('Error', 'Ocurrió un error, intenta nuevamente')

      }
    }
  }

}
