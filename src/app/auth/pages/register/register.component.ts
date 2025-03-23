import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../firebase/authentication.service';
import { Models } from 'src/app/models/models';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/firebase/storage.service';
import { Browser } from '@capacitor/browser';
import { ListResult } from '@angular/fire/storage';
import { InteractionsService } from '../../../services/interactions.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent  implements OnInit {
  //#region variables
  private fb = inject(FormBuilder);
  private authenticationService = inject(AuthenticationService);
  private firestoreService = inject(FirestoreService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private changeDetectorRef : ChangeDetectorRef = inject(ChangeDetectorRef);
  private interactionsService : InteractionsService = inject(InteractionsService);

  pic : string = null;
  progress = '0';
  file: File;
  image: string;
  video: string;
  fileFirestore : string = 'gs://basesfire-devserv.firebasestorage.app/PhotosPerfil/Screenshot 2025-03-13 at 10.36.39 AM.png'
  loading : boolean = false;
  results : ListResult;


  datosForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    name: ['', Validators.required],
    photo: ['', Validators.required],
    age: [null, Validators.required]
  })


  //#endregion

  constructor() { }

  ngOnInit() { }

  /**
   * Obtiene más archivos desde Firestore Storage.
   */
  async getMoreFiles(){
    console.log('getMoreFiles');
    const path = Models.Firebase.PathPhotosPerfil;
    let pageToken = this.results?.nextPageToken || null;
    if(!pageToken) return;
    this.results = await this.storageService.list(path, 1, pageToken);
    console.log('this.results ->', this.results)
  }

  /**
   * Registra un nuevo usuario en Firebase Authentication y almacena su información en Firestore.
   */
  async registrarse(){
    // this.loading = true;
    if(!this.datosForm.valid){
      this.interactionsService.showAlert(this.interactionsService.titleImportante, this.interactionsService.mensajeEmptyFields);
      return;
    }
    await this.interactionsService.showLoading('Procesando...');
    try{
      const data = this.datosForm.value;
      const res = await this.authenticationService.createUser(data.email, data.password);
      data.photo = data.photo.includes('http')? data.photo : await this.subirFoto(res.user.uid, this.file)
      let profile: Models.Auth.UpdateProfileI = {
        displayName : data.name,
        photoURL : data.photo
      };
      await this.authenticationService.updateProfile(profile);

      const datosUser : Models.Auth.UserProfile = {
        name: data.name,
        photo: data.photo,
        age: data.age,
        id: res.user.uid,
        email: data.email,
        roles:{ client: true}
      }
      // console.log('datosUser ->', datosUser);
      await this.firestoreService.createDocument(Models.Auth.PathUsers, datosUser, res.user.uid);
      this.interactionsService.dismissLoading();
      this.interactionsService.showToast('Usuario creado con exito')
      this.router.navigate(['/auth/profile']);

    }catch(e){
      console.log('registrarse error ->', e)
      this.interactionsService.dismissLoading();
      this.interactionsService.showAlert('Error', this.interactionsService.mensajeError)
    }


  }

  /**
 * Sube la foto de perfil del usuario al almacenamiento y devuelve la ruta del archivo.
 * @param uid - Identificador del usuario.
 * @returns Ruta del archivo subido.
 */
  async subirFoto(uid : string, file : File){
      const path = Models.Firebase.PathPhotosPerfil;
      const snap = await this.storageService.uploadFile(`${path}/${uid}`, file.name, file);
      return snap.ref.fullPath;

  }

  async subirArchivoConProgreso(input : HTMLInputElement){
    if (input.files.length) {
      const files = input.files;
      console.log('files -> ', files);
      // return;
      const folder = 'PhotosPerfil';
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
          //subir y esperar una promesa
          // const snap = await this.storageService.uploadFile(folder, file.name, file);
          // console.log('snapshot -> ', snap);
          // const url = await this.storageService.getDownloadUrl(snap.ref.fullPath);
          // console.log(url);
          // this.pic = url;

          const s = this.storageService.uploadFileProgress(folder, file.name, file).subscribe(res=>{
            console.log('uploadFileProgress -> ', res);
            if (res.progress) {
              this.progress = res.progress.toFixed(2);
              console.log('this.progress ->', this.progress);
              this.changeDetectorRef.detectChanges(); //esto obliga a detectar el cambio cuando la variable progress cambia


            }
            if (res.type == 'complete') {
              s.unsubscribe();

            }

          })

        }

      }



    }
  }

 /**
   * Muestra una vista previa de la imagen seleccionada por el usuario.
   * @param files - Elemento de entrada de tipo archivo.
   */
 async viewPreview({ files } : HTMLInputElement){
  //files es un elemento desestructurado. por eso esta entre
  if (files.length) {
    this.file = files.item(0);
    const img: any = files.item(0)
      this.datosForm.controls.photo.setValue(img);

  }

}


  /**
 * Descarga un archivo desde Firestore Storage.
 * @param path - Ruta del archivo en el almacenamiento.
 */
  download(path: string) {
    this.storageService.downloadFile(path)
  }




}
