import { Component, inject, Input, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { Models } from 'src/app/models/models';
import { WebService } from 'src/app/services/web.service';
import { FunctionsService } from 'src/app/firebase/functions.service';
import { InteractionsService } from '../../../services/interactions.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  standalone: false,
})
export class UserDetailComponent  implements OnInit {
  @Input() user: Models.Auth.UserProfile;

  enableAgregarRol : boolean = false;
  rolesUser: {
    rol: Models.Auth.Rol,
    enable: boolean
  }[] = [];
  roles : Models.Auth.Rol[] = ['admin','client','driver']
  rolesSelected : Models.Auth.Rol[] = [];


  private firestoreService = inject(FirestoreService);
  private webService: WebService = inject(WebService);
  private interactionsService : InteractionsService = inject(InteractionsService);
  private userService : UserService = inject(UserService);


  constructor() { }

  ngOnInit() {
    this.initRoles();
  }

  //no se esta usando
   /**
   * Actualiza los roles del usuario en Firestore.
   */
  async actualizarRol(){
    console.log('actualizandoRol -> ', this.rolesUser);
    const roles : any = {};
    this.rolesUser.forEach( item => {
      if (item.enable) { roles[item.rol] = true;  }
    });
    const updateDoc ={  roles }
    // console.log('updateDoc ->', updateDoc);
    try {
      await this.firestoreService.updateDocument(`${Models.Auth.PathUsers}/${this.user.id}`, updateDoc);
      this.enableAgregarRol = false;
    } catch (error) {
      console.log('Error: permisos insuficientes', error)
    }
  }

    /**
   * Cambia el rol del usuario y lo actualiza en Firestore y Auth Claims.
   * @param ev - Evento de cambio de selección.
   */
  async changeRol(ev : any){
    // console.log('chengeRol ->', this.rolesSelected);
    await this.interactionsService.showLoading('Actualizando...');
    const roles : any = {};
    this.rolesSelected.forEach( rol =>{
      roles[rol] = true;
    })
    const updateDoc = {
      roles
    }
    console.log('updateDoc roles -> ', updateDoc);
    const request : Models.Functions.RequestSetRol = {
      roles,
      uid: this.user.id
    }
    try {
      // const response = await this.functionsService.call<any, any>('appCall', request)
      const response = await this.userService.setClaim(request);
      await this.firestoreService.updateDocument(`${Models.Auth.PathUsers}/${this.user.id}`, updateDoc);
      this.interactionsService.dismissLoading();
      this.interactionsService.showToast('Rol actualizado con éxito');
      // console.log('response -> ', response);

    } catch (error) {
      this.interactionsService.dismissLoading();
      this.interactionsService.showAlert('Error', "No se pudo actualizar el rol del usuario");
      console.log('changeRol error ->', error)

    }

  }

  /**
   * Inicializa los roles del usuario basados en los datos actuales.
   */
  initRoles(){
    // para obtener el nombre de las variables en un objeto
    //el for in se usa para hacer un for dentro de una variable tipo objeto
    for(const key in this.user.roles){
      const rol : any = key;
      this.rolesSelected.push(rol)
    }

  }

     /**
   * Alterna la selección de un rol activándolo o desactivándolo.
   * @param item - Objeto que contiene el rol y su estado.
   */
  selectRol(item : {rol: Models.Auth.Rol, enable: boolean}){
    item.enable = !item.enable
  }

  /**
   * Establece un nuevo rol en Firestore llamando a una función en la nube.
   */
  //no se usa
  async setRol() {
    const url = 'http://127.0.0.1:5001/basesfire/us-central1';
    const request: Models.Functions.RequestSetRol = {
      roles: {
        cliente: true
      },
      uid: this.user.id
    }
    const res = await this.webService.request<Models.Functions.ResponseSetRol>('POST', url, 'setRol', request)
    if (res.ok) {
      console.log('actualizado rol con éxito');
    }
  }

  // async setClaim(){
  //   // const response = await this.functionsService.call<any, any>('appCall');
  //   // console.log(response);

  //   const roles : any = {};
  //   this.rolesUser.forEach( item =>{
  //     if (item.enable) {
  //       roles[item.rol] = true

  //     }
  //   });
  //   const updateDoc = {roles}
  //   console.log('updateDoc ->', updateDoc);
  //   const request : Models.Functions.RequestSetRol = {
  //     roles,
  //     uid: this.user.id
  //   }
  //   const response = await this.functionsService.call<any, any>('setClaim', request);
  //   console.log('response', response)

  // }
  /**
   * Llama a una función de prueba en la nube para verificar la conectividad.
   */
  // async helloWorld(){
  //   const url = 'http://127.0.0.1:5001/basesfire-devserv/us-central1';
  //   const res = await this.webService.request<any>('POST', url, 'helloWorld');
  //   console.log("helloworkd -> ",res)
  // }

}
