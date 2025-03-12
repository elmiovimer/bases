import { Component, inject, OnInit, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/firebase/authentication.service';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { Models } from 'src/app/models/models';
import { updateDoc } from '@angular/fire/firestore';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {User} from '@angular/fire/auth'
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: false,
})
export class ProfileComponent  implements OnInit {
  isSame = (input: FormControl)=>{
    // console.log('input ->', input.value);
    if(this.formCambiarPassword?.value.newPassword != input?.value){
      return {notSame : true}
    }
    return {}
  }

  private authenticationService  = inject(AuthenticationService);
  private firestoreService = inject(FirestoreService);
  private userService = inject(UserService)
  private fb = inject(FormBuilder)
  private router = inject(Router)

  correoVerificado : boolean = false;

  user: User;
  userProfile : Models.Auth.UserProfile;

  newName : string = '';
  newPhoto : string = '';
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

  formDeleteUser = this.fb.group({
    // password:['',[Validators.required]],
  })




  constructor() {
    this.loading = true;
    this.user = this.userService.getUser();
    this.getDatosProfile(this.user.uid);






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

  ngOnInit() {
    console.log('userProfile ->', this.userProfile)
    // console.log('userProfile ->', this.userService.)

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
    if(this.newPhoto){
      data.photoURL = this.newPhoto;
    }
    try{
      await this.authenticationService.updateProfile(data);
      const user = this.authenticationService.getCurrentUser();
      const updateData: any = {
        name: user.displayName,
        photo: user.photoURL,
      };
      await this.firestoreService.updateDocument(`${Models.Auth.PathUsers}/${user.uid}`, updateData)
      this.user = user
      this.enableActualizarPerfil = false
    }catch(e){
      console.log('error, actualizarPerfil() ->', e)

    }

  }

  async enviarCorreo(){
    await this.authenticationService.sendEmailVerification();
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

  async actualizarEmail(){
    let user = this.authenticationService.getCurrentUser();
    if(this.formNewEmail.valid){
      const data = this.formNewEmail.value;
      console.log('valid ->', data);
      try {
        // await this.authenticationService.login(user.email, data.password);
        // await this.authenticationService.reauthenticateWithCredential(data.password);
        await this.authenticationService.verifyBeforeUpdateEmail(data.email);
        // await this.authenticationService.updateEmail(data.email);
        await this.authenticationService.logout();
        this.router.navigate(['/user/login'])
        console.log(`te hemos enviado un correo para que puedas verificar tu nuevo correo,
          verifícalo e inicia sesión con el nuevo correo,
          caso contrario inicia sesión con tu correo de siempre`);

        console.log('actualizado correo con exito')

      } catch (error) {
        console.log('error actualizarEmail() ->', error)
        console.log('deseas cerrar sesion y volver a ingresar para realizar esta accion?')

      }
    }
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
    if(this.formDeleteUser.valid){
      try {
        const user = this.authenticationService.getCurrentUser();
        const data = this.formDeleteUser.value;
        // await this.authenticationService.reauthenticateWithCredential(data.password);
        // / si falla al actualizar la contraseña entonces no podrá eliminar la cuenta
        // debe tener un inicio de sesión reciente
        await this.authenticationService.updatePassword('xxxxxx');
        //primero eliminamos el documento porque en ese momento tenemos permisos
        await this.firestoreService.deleteDocument(`${Models.Auth.PathUsers}/${user.uid}`)
        //luego si eliminamos la cuenta
        await this.authenticationService.deleteUser();

        console.log('cuenta eliminada con exito');
        await this.authenticationService.logout();
        this.router.navigate(['user/login']);

      } catch (error) {
        console.log('error en eliminar cuenta', error);
        console.log('¿Deseas cerrar sesión y volver a ingresar para realizar esta acción?');

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
