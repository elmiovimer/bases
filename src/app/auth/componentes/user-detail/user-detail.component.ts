// import { Request } from 
import { Component, inject, Input, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { Models } from 'src/app/models/models';
import { updateDoc } from '@angular/fire/firestore';
import { WebService } from 'src/app/services/web.service';
import { setClaim, helloWorld } from '../../../../../functions/src/index';
import { FunctionsService } from 'src/app/firebase/functions.service';

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


  private firestoreService = inject(FirestoreService);
  private webService: WebService = inject(WebService);
  private functionsService : FunctionsService = inject(FunctionsService)

  constructor() {
  }

  ngOnInit() {
    this.initRoles();

  }

  async actualizarRol(){
    console.log('actualizandoRol -> ', this.rolesUser);
    const roles : any = {};
    this.rolesUser.forEach( item => {
      if (item.enable) {
        roles[item.rol] = true;

      }

    });
    const updateDoc ={
      roles
    }
    console.log('updateDoc ->', updateDoc);
    try {
      await this.firestoreService.updateDocument(`${Models.Auth.PathUsers}/${this.user.id}`, updateDoc);
      this.enableAgregarRol = false;


    } catch (error) {
      console.log('permisos insuficientes', error)

    }
  }

  initRoles(){
    this.roles.forEach( rol =>{
      this.rolesUser.push({rol, enable: this.user.roles[rol]})

    })
  }

  selectRol(item : {rol: Models.Auth.Rol, enable: boolean}){
    item.enable = !item.enable
  }

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

  async setClaim(){
    // const response = await this.functionsService.call<any, any>('appCall');
    // console.log(response);

    const roles : any = {};
    this.rolesUser.forEach( item =>{
      if (item.enable) {
        roles[item.rol] = true

      }
    });
    const updateDoc = {roles}
    console.log('updateDoc ->', updateDoc);
    const request : Models.Functions.RequestSetRol = {
      roles,
      uid: this.user.id
    }
    const response = await this.functionsService.call<any, any>('setClaim', request);
    console.log('response', response)

  }

  async helloWorld(){
    const url = 'http://127.0.0.1:5001/basesfire-devserv/us-central1';
    const res = await this.webService.request<any>('POST', url, 'helloWorld');
    console.log("helloworkd -> ",res)
  }

}
