import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../firebase/authentication.service';
import { Models } from 'src/app/models/models';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/firebase/storage.service';
import { Browser } from '@capacitor/browser';
import { folder } from 'ionicons/icons';
import { ListResult } from '@angular/fire/storage';

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
  pic : string = null;
  progress = '0';

  file: File;
  image: string;
  video: string;
  fileFirestore : string = 'gs://basesfire-devserv.firebasestorage.app/PhotosPerfil/Screenshot 2025-03-13 at 10.36.39 AM.png'

  datosForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    name: ['', Validators.required],
    photo: [''],
    age: [null]
  })
  loading : boolean = false;
  results : ListResult;

  //#endregion

  constructor() { }

  async ngOnInit() {
    // const folder = 'PhotosPerfil';
    // const res = await this.storageService.listAll(folder);
    // console.log('res ->', res);
  }

  async getMoreFiles(){
    console.log('getMoreFiles');
    const path = 'PhotosPerfil';
    let pageToken = null;
    if (this.results) {
      if (!this.results.nextPageToken) {
        return;

      }
      pageToken = this.results.nextPageToken;

    }
    const res = await this.storageService.list(path, 1, pageToken);
    // if (this.results) {
    //   res.items.unshift(...this.results.items);
    //   res.prefixes.unshift(...this.results.prefixes)

    // }
    this.results = res;
    console.log('this.results ->', this.results)
  }

  descargar(item : string = ''){

  }
  async registrarse(){
    this.loading = true;
    console.log('datosForm ->', this.datosForm);
    if(this.datosForm.valid){
      const data = this.datosForm.value;
      console.log('valid ->', data);
      try{
        const res = await this.authenticationService.createUser(data.email, data.password);
        // console.log('user ->', user);
        //guardar foto
        data.photo = await this.subirFoto(res.user.uid);
        let profile: Models.Auth.UpdateProfileI = {
          displayName : data.name,
          photoURL : data.photo
        };
        await this.authenticationService.updateProfile(profile);


        //
        const datosUser : Models.Auth.UserProfile = {
          name: data.name,
          photo: data.photo,
          age: data.age,
          id: res.user.uid,
          email: data.email,
          roles:{ client: true}
        }
        console.log('datosUser ->', datosUser);
        await this.firestoreService.createDocument(Models.Auth.PathUsers, datosUser, res.user.uid);
        console.log('usuario creado con exito');
        this.router.navigate(['/auth/login']);

      }catch(e){ console.log('registrarse error ->', e)}
    }

  }

  async subirFoto(uid : string){
   if (this.file) {

    const snap = await this.storageService.uploadFile(`PhotosPerfil/${uid}`, this.file.name, this.file);
    console.log('snap -> ', snap);
    // const url = await this.storageService.getDownloadUrl(snap.ref.fullPath)

    return snap.ref.fullPath;


   }
   return '';

  }

  async uploadFile(input : HTMLInputElement){
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

  async viewPreview(input : HTMLInputElement){
    if (input.files.length) {
      const files = input.files;
      console.log('viewPreview files -> ', files);
      this.file = files.item(0);
      // this.datosForm.controls['photo'].value = files.item(0)
      // this.form.controls['dept'].value = selected.id;

      // this.image = URL.createObjectURL(files.item(0));
      // this.image = await this.storageService.fileToBase64(files.item(0));

      console.log('this.image ->' , this.image)

    }

  }

  view (file : File){
    const url = this.storageService.fileToURL(file);
    Browser.open({url})
  }

  download(path: string) {
    this.storageService.downloadFile(path)
  }

  async save(){
    const folder = 'PhotosPerfil';
    //subir y esperar una promesa
    console.log('guardando...');
    const snap = await this.storageService.uploadFile(folder, this.file.name, this.file);
    console.log('snap ->', snap);
    const url = await this.storageService.getDownloadUrl(snap.ref.fullPath);
    console.log('url ->', url);
    console.log('guardado con exito')

  }

//   async uploadFile(input: HTMLInputElement) {
//     if (!input.files) return

//     const files: FileList = input.files;

//     for (let i = 0; i < files.length; i++) {
//         const file = files.item(i);
//         if (file) {
//             const storageRef = ref(this.storage, file.name);
//             uploadBytesResumable(storageRef, file);
//         }
//     }
// }

}
