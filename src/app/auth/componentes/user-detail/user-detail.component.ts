import { Component, inject, Input, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { Models } from 'src/app/models/models';
import { updateDoc } from '@angular/fire/firestore';

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

}
