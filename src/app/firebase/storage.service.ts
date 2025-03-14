import { inject, Injectable } from '@angular/core';
import { getDownloadURL, ref, Storage, uploadBytes, uploadBytesResumable, uploadString } from '@angular/fire/storage';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage : Storage = inject(Storage);

  constructor() {
    console.log('storageService inicializado')
    const message = 'this is my message. ';
    const folder = 'Demo';
    const name = 'text';
    // this.uploadString(folder, name, message)
   }

   async uploadFile(folder : string, name : string, file : File | Blob){
    const storageref = ref(this.storage, `${folder}/${name}`);
    const snapshot = await uploadBytes(storageref, file);
    return snapshot;

   }

  uploadString(folder : string, name : string, text : string){
    const storageref = ref(this.storage, `${folder}/${name}`);
    uploadString(storageref, text).then((snapshot) => {
      console.log('Updolades string! -> ', snapshot)
    })
  }

  getDownloadUrl(path : string){
    const storageRef = ref(this.storage, path);
    return getDownloadURL(storageRef);
  }

  uploadFileProgress(folder : string, name : string, file : File | Blob){
    const storageRef = ref(this.storage, `${folder}/${name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    //uploadTask.on();
    const uploadTask$ = new Subject<ProgressUploadFile>();
    uploadTask.on('state_changed',
      (snap)=>{
        // Observe state change events such as progress, pause, and resume
         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snap.bytesTransferred / snap.totalBytes) * 100;
        console.log('upload is ' + progress + '% done');
        const event: ProgressUploadFile = {
          type: snap.state,
          progress
        }
        uploadTask$.next(event)
      },
      (error)=>{
        // Handle unsuccessful uploads
        const event: ProgressUploadFile = {
          type: 'error',
          error: error.message
        }
        uploadTask$.next(event);
      },
      async ()=>{
        // Handle successful uploads on complete
        const url = await this.getDownloadUrl(storageRef.fullPath);
        const event: ProgressUploadFile = {
          type: 'complete',
          url,
          ref: storageRef.fullPath
        }
        uploadTask$.next(event);
      }

     );
     return uploadTask$.asObservable();


  }


  fileToURL(file : File){
    return URL.createObjectURL(file);

  }

  // async downloadFile(path: string) {
  //   console.log('saveFile');
  //   const storageRef = ref(this.storage, path);
  //   const blob = await getBlob(storageRef)
  //   console.log('blob -> ', blob);

  //   // dos opciones

  //   // 1.- creando un elemento <a></a>
  //   // const urlLocal = URL.createObjectURL(blob);
  //   // const link = document.createElement("a");
  //   // link.href = urlLocal;
  //   // link.download = storageRef.name;
  //   // link.click();
  //   // link.remove();

  //   // usando un servio
  //   this.fileSaverService.save(blob, storageRef.name);
  // }

  fileToBase64(file : File){
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as string);
      };
    });
  }
}

interface ProgressUploadFile {
  type: string;
  url?: string;
  ref?: string;
  progress?: number;
  error?: string;
}