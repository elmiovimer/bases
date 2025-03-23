import { Component, inject, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../firebase/authentication.service';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { User } from '@angular/fire/auth';
import { Models } from 'src/app/models/models';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../../firebase/storage.service';
import { InteractionsService } from '../../../services/interactions.service';
import { UserService } from '../../../services/user.service';

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
  private userService : UserService = inject(UserService)
  private fb : FormBuilder = inject(FormBuilder)
  private router = inject(Router)


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
   }

  ngOnInit() {}

  /**
   * Muestra una vista previa de la imagen seleccionada por el usuario.
   * @param files - Elemento de entrada de tipo archivo.
   */
  async viewPreview({ files } : HTMLInputElement){
    //files es un elemento desestructurado. por eso esta entre
    if (files.length) {
      this.file = files.item(0);
      const img: any = files.item(0)
        this.datosFormCompleteRegistro.controls.photo.setValue(img);

    }

  }
/**
   * Sube la foto de perfil del usuario al almacenamiento y devuelve la ruta del archivo.
   * @param uid - Identificador del usuario.
   * @param file - Archivo de la imagen a subir.
   * @returns Ruta de almacenamiento de la imagen.
   */
  async subirFoto(uid : string, file : File){
      const path = Models.Firebase.PathPhotosPerfil;
     const snap = await this.storageService.uploadFile(`${path}/${uid}`, file.name, file);
     return snap.ref.fullPath;

   }
  /**
   * Completa el registro del usuario guardando su información en Firestore.
   */
  async completarRegistro(){
    console.log('datosDormCompleteRegistro ->', this.datosFormCompleteRegistro);

    if(!this.datosFormCompleteRegistro.valid){
      this.interactionsService.showAlert(this.interactionsService.titleImportante, this.interactionsService.mensajeEmptyFields);
      return;
    }
    // console.log(this.datosFormCompleteRegistro.value);
    await this.interactionsService.showLoading('Procesando...');
    try {
      const data = this.datosFormCompleteRegistro.value;
      // data.photo = !data.photo.includes('http') && await this.subirFoto(this.user.uid, this.file)
      data.photo = data.photo.includes('http')? data.photo : await this.subirFoto(this.user.uid, this.file)
      // console.log(data)

      let profile: Models.Auth.UpdateProfileI = {
        displayName: data.name,
        photoURL: data.photo
      };
      await this.authenticationService.updateProfile(profile);

      const datosUser : Models.Auth.UserProfile = {
        name: data.name,
        photo: data.photo,
        age : data.age,
        email : data.email,
        id : this.user.uid,
        roles: { client: true }
      };

      await this.firestoreService.createDocument(Models.Auth.PathUsers, datosUser, this.user.uid);
      this.interactionsService.dismissLoading();
      this.interactionsService.showToast('Registro completado con éxito')
      setTimeout(() => {  this.router.navigate(['/auth/profile'], {replaceUrl: true})  }, 200);
    } catch (error) {
      this.interactionsService.dismissLoading();
      console.log('error en completarRegistro() -> ', error)
      this.interactionsService.showAlert('Error', this.interactionsService.mensajeError)

    }

  }

}
