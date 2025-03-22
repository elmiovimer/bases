import { IonModal } from '@ionic/angular/standalone';
import { Component, inject, OnInit, Input, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/firebase/authentication.service';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { Models } from 'src/app/models/models';
import { updateDoc } from '@angular/fire/firestore';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {User} from '@angular/fire/auth'
import { UserService } from 'src/app/services/user.service';
import { StorageService } from 'src/app/firebase/storage.service';
import { InteractionsService } from '../../../services/interactions.service';
import { response } from 'express';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: false,
})
export class ProfileComponent  implements OnInit {

  @ViewChild('modalEditInfo') modalEditInfo: IonModal;
  // @ViewChild('files') file : HTMLInputElement;
  titleModal : string;
  opcModal: 'email' | 'photo' | 'name' | 'password';

  isSame = (input: FormControl)=>{
    // console.log('input ->', input.value);
    if(this.formCambiarPassword?.value.newPassword != input?.value){
      return {notSame : true}
    }
    return {}
  }

  private authenticationService  = inject(AuthenticationService);
  private firestoreService = inject(FirestoreService);
  private storageService = inject(StorageService)
  private userService = inject(UserService)
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private interactionsService : InteractionsService = inject(InteractionsService);

  correoVerificado : boolean = false;

  user: User;

  userProfile : Models.Auth.UserProfile;

  newName : string = '';
  newPhoto : File;
  newAge : number = null;
  loading : boolean = false;
  visible :boolean = false;
  showButton : boolean = false

  enableActualizarEmail : boolean = false;
  enableActualizarPerfil : boolean = false;
  enableActualizarContrasena : boolean = false;
  enableBorrarCuenta : boolean = false;
  isAdmin : boolean = false
  formNewEmail = this.fb.group({
    email:['', [Validators.required, Validators.email]],
    // password:['', [Validators.required]],
  })

  formCambiarPassword = this.fb.group({
    // oldPassword:['',[Validators.required]],
    newPassword: ['',[Validators.required, Validators.pattern(Models.Auth.StrongPasswordRegx)]],
    repeatPassword: ['',[Validators.required, this.isSame]],

  })






  constructor() {
    // this.loading = true;
    // this.user = this.userService.getUser();
    this.user = this.userService.getUser();
    this.getDatosProfile(this.user.uid);
    console.log('datosProfile', this.userProfile)







    // this.authenticationService.authState.subscribe(res => {
    //   console.log('res ->', res);
    //   if(res){
    //     this.user = res
    //     this.correoVerificado = res.emailVerified;
    //     console.log('user ->', this.user)
    //     this.getDatosProfile(res.uid);

    //   }else{
    //     this.user = null;
    //   }
    //   this.loading = false;
    // })
   }

   async viewPreview(input : HTMLInputElement){
    console.log('input ->', input)
    if (input.files.length) {
      const files = input.files;
      this.newPhoto = files.item(0);

    }

  }

   selectOpcModal(opc : 'email' | 'photo' | 'name' | 'password'){
    this.opcModal = opc;
    if (this.opcModal == 'email') {
      this.titleModal = 'Cambiar Correo';

    }
    if (this.opcModal == 'photo') {
      this.titleModal = 'Cambiar foto'

    }
    if (this.opcModal == 'name') {
      this.titleModal = 'Cambiar nombre';
      this.newName = this.user.displayName;

    }
    if (this.opcModal == 'password') {
      this.titleModal = 'Cambiar Contraseña'

    }
    this.modalEditInfo.isOpen = true;
   }

  salir(){
    this.authenticationService.logout();
  //  this.datosForm.controls['email'].setValue('');
  //  this.datosForm.controls['password'].setValue('');
    this.user = null;

  }

  async actualizarEmail(){
    let user = this.authenticationService.getCurrentUser();

    if(this.formNewEmail.valid){
      const data = this.formNewEmail.value;
      console.log('valid ->', data);
      try {
        await this.interactionsService.showLoading("Enviando enlaace de verificacion...");
        // await this.authenticationService.login(user.email, data.password);
        // await this.authenticationService.reauthenticateWithCredential(data.password);
        await this.authenticationService.verifyBeforeUpdateEmail(data.email);
        this.interactionsService.dismissLoading();
        await this.interactionsService.showAlert('Importante',
          `Te hemos enviado un correo a <strong>${data.email}</strong> para que puedas verificar tu nuevo correo.
           Verifícalo e inicia sesion con el nuevo correo, caso contrario inicia sesion con tu correo de siempre.`
        )
        // await this.authenticationService.updateEmail(data.email);
        await this.authenticationService.logout();
        this.modalEditInfo.isOpen = false;
        setTimeout(() => {
          this.router.navigate(['/auth/login'])


        }, 200);
        console.log(`te hemos enviado un correo para que puedas verificar tu nuevo correo,
          verifícalo e inicia sesión con el nuevo correo,
          caso contrario inicia sesión con tu correo de siempre`);

        console.log('actualizado correo con exito')

      } catch (error) {
        console.log('error actualizarEmail() ->', error)
        console.log('deseas cerrar sesion y volver a ingresar para realizar esta accion?');
        this.interactionsService.dismissLoading();
        this.modalEditInfo.isOpen = false;
        const response = await this.interactionsService.showAlert('Error',
        `Para realizar esta acción debes haber realizado un inicio de sesión reciente.
        ¿Deseas cerrar sesión y volver a ingresar para realizar esta acción?`,
      'Cancelar');
      if (response) {
        await this.authenticationService.logout();
        setTimeout(() => {
          this.router.navigate(['/auth/login'], {replaceUrl : true})
        }, 200);

      }

      }
    }
  }


  ngOnInit() {
    console.log('userProfile ->', this.userProfile)
    // console.log('userProfile ->', this.userService.)

  }

  descargarFoto(){
    this.storageService.downloadFile(this.userProfile.photo);

  }

  async getDatosProfile(uid : string){
    console.log('getDatosProfile ->', uid)
    // this.firestoreService.getDocumentChanges<Models.Auth.UserProfile>(`${Models.Auth.PathUsers}/${uid}`).subscribe((res)=>{
    //   this.isAdmin = false;
    //   if(res){
    //     this.userProfile = res;
    //     console.log('this.userProfile ->', this.userProfile);
    //     if(this.userProfile.roles?.admin == true){
    //       this.isAdmin = true;
    //     }
    //   }
    // });

    this.userProfile = await this.userService.getUserProfile(uid);
    console.log('first', this.userProfile)
    if(this.userProfile.roles['admin']){
      this.isAdmin = true;
    }
    this.loading = false;

  }

  async actualizarPerfil(){
    let data : Models.Auth.UPdatePforileI = {};
    if(this.newName){
      data.displayName = this.newName;
    }
    if (data.displayName) {
      this.modalEditInfo.isOpen = false;
      await this.interactionsService.showLoading('Actualizando...');
      await this.authenticationService.updateProfile(data);
      const user = this.authenticationService.getCurrentUser();
      const updateData: any = {
        name: user.displayName,
        photo: user.photoURL,
      };
      await this.firestoreService.updateDocument(`${Models.Auth.PathUsers}/${user.uid}`, updateData)
      this.interactionsService.dismissLoading();
      this.interactionsService.showToast("Actualizado con éxito");
      this.user = user;
      this.newName = null;
      this.newPhoto = null;

    }



  }

  async downloadProfilePicture(){
    console.log(this.userProfile.photo)
    try {
      await this.storageService.downloadFile(this.userProfile.photo);
      this.interactionsService.showToast('Imagen descargada con éxito')
      console.log('imagend escargada con exito')

    } catch (error) {
      this.interactionsService.showAlert('Importante','Esta Imagen no se encuentra en nuestros registros, por lo que no es posible descargarse')

    }

  }

  async editarProfilePicture(){
    console.log('subiendo...')
    await this.interactionsService.showLoading('subiendo...');
    const folder = `PhotosPerfil/${this.user.uid}`;
    const name = this.newPhoto.name;
    const snap = await this.storageService.uploadFile(folder, name, this.newPhoto);
    await this.authenticationService.updateProfile({photoURL: snap.ref.fullPath});
    const updateDoc : any ={
      photo : snap.ref.fullPath
    }
    await this.firestoreService.updateDocument(`${Models.Auth.PathUsers}/${this.user.uid}`, updateDoc);
    this.user = this.authenticationService.getCurrentUser();
    this.interactionsService.dismissLoading();
    this.interactionsService.showToast('Actualizado con éxito');
    this.newPhoto = null;
    this.modalEditInfo.isOpen = false;

  }

  async enviarCorreo(){
    this.interactionsService.showLoading("Enviando correo...");
    await this.authenticationService.sendEmailVerification();
    this.interactionsService.dismissLoading();
    await this.interactionsService.showAlert("Importante",
      "Te hemos enviado un enlace de verificacion a tu correo");
    console.log('correo enviado -> comprueba tu correo',);
  }

  async actualizarEdad(){
    const user = this.authenticationService.getCurrentUser();
    const path = `${Models.Auth.PathUsers}/${user.uid}`;
    const updateDoc : any = {
      age: this.userProfile.age
    }
    await this.firestoreService.updateDocument(path, updateDoc)
    console.log('actualizado con exito')
  }



  async cambiarPassword(){
    console.log('this.formCambiarPassword ->', this.formCambiarPassword)
    if(this.formCambiarPassword.valid){
      const data = this.formCambiarPassword.value;
      console.log('valid ->', data);
      try {
        // await this.authenticationService.reauthenticateWithCredential(data.oldPassword);
        await this.authenticationService.updatePassword(data.newPassword);
        this.enableActualizarContrasena = false;
        console.log('contraseña actualizada con exito')

      } catch (error) {
        console.log('error en cambiarPassword() ->', error)

      }
    }


  }

  hideButton() {
    // Esperamos un poco para verificar si el foco pasó al botón
    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement.tagName !== 'BUTTON') {
        this.showButton = false;
      }
    }, 100);
  }

  isEqual(input: FormControl){
    console.log('input ->', input.value)
    if(this.formCambiarPassword?.value?.newPassword != input?.value ){
      return {notSame: true}
    }
    else
      return {notSame: false}
  }

  async eliminarCuenta(){
    //preguntar al usuario si esta seguro de eliminar la cuenta
    const responseAlert = await this.interactionsService.showAlert("Importante",
      `Seguro que deseas eliminar tu cuenta, <strong> esta accion no se puede reverrir</strong>`,
      'Cancelar');
    if(responseAlert){
      try {
        await this.interactionsService.showLoading('Eliminando...');

        const user = this.authenticationService.getCurrentUser();
        // await this.authenticationService.reauthenticateWithCredential(data.password);
        // / si falla al actualizar la contraseña entonces no podrá eliminar la cuenta
        // debe tener un inicio de sesión reciente
        await this.authenticationService.updatePassword('xxxxxx');
        //primero eliminamos el documento porque en ese momento tenemos permisos
        await this.firestoreService.deleteDocument(`${Models.Auth.PathUsers}/${user.uid}`)
        //luego si eliminamos la cuenta
        await this.authenticationService.deleteUser();

        console.log('cuenta eliminada con exito');
        await this.interactionsService.dismissLoading();
        await this.authenticationService.logout();
        this.router.navigate(['auth/login']);

      } catch (error) {
        console.log('error en eliminar cuenta', error);
        console.log('¿Deseas cerrar sesión y volver a ingresar para realizar esta acción?');
        const responseAlert = await this.interactionsService.showAlert('Error',
          `Para eliminar tu cuenta debes cerrar tu sesion e ingresar nuevamente, <strong> Deseas cerrar tu sesion?</strong>`,
          'Cancelar'
        );
        if (responseAlert) {
          await this.authenticationService.logout(false);
          setTimeout(() => {
            this.router.navigate(['auth/login'], {replaceUrl: true})

          }, 200);

        }

      }

    }
  }

  //cada vez que se entre a este componente se genera este evento
  ionViewDidEnter(){
    console.log('ionviewDidEnter login');
    const user = this.authenticationService.getCurrentUser();
    if (user) {
      this.user=user

    }

  }



}
