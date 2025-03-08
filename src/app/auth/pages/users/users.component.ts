import { Component, inject, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { Models } from 'src/app/models/models';
import { AuthenticationService } from '../../../firebase/authentication.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: false
})
export class UsersComponent  implements OnInit {
  private firestoreServices : FirestoreService = inject(FirestoreService);
  private authenticationService : AuthenticationService = inject(AuthenticationService);
  private fb = inject(FormBuilder)

  users: Models.Auth.UserProfile[];
  roles: Models.Auth.Rol[] = ['admin', 'client', 'driver'];
  rolSelected: Models.Auth.Rol = 'admin';
  formEmail = this.fb.group({
    email: ['', [Validators.email, Validators.required]],

  })

  cargando : boolean = false;
  enableMore : boolean = false;
  enableBuscarPorEmail : boolean = false;


  constructor() {
    this.authenticationService.authState.subscribe(res =>{
      if (res) {
        this.getMoreUsers();

      }
    })
   }

  ngOnInit() {}

  async buscarPorEmail(){
    if (this.formEmail.valid) {
      const data = this.formEmail.value;
      this.users = null;
      this.cargando = true;
      this.enableMore = false;
      const path = Models.Auth.PathUsers;
      let q : Models.Firebase.whereQuery[];
      q = [[`email`, `==`, data.email]];
      const response = await this.firestoreServices.getDocumentsQuery<Models.Auth.UserProfile>(path, q);
      this.cargando = false;
      if (!response.empty) {
        response.forEach(item =>{
          this.users = [];
          this.users.push(item.data());
        })

      }

    }
  }

  async getMoreUsers(rol : Models.Auth.Rol = this.rolSelected){
    if(this.rolSelected != rol){
      this.users = null;
      this.cargando = true;
      this.enableMore = true;
    }
    this.rolSelected = rol;
    console.log('getMoreUsers');
    const path = Models.Auth.PathUsers;
    const numItems = 2;
    let q: Models.Firebase.whereQuery[];
    q = [[`roles.${rol}`, '==', true]];
    const extras: Models.Firebase.extrasQuery = {
      orderParam: 'date',
      directionSort: 'desc',
      limit: numItems,
    }

    if (this.users) {
      const last = this.users[this.users.length -1];
      const snapdoc = await this.firestoreServices.getDocument(`${path}/${last.id}`)
      extras.startAfter = snapdoc

    }

    const res = await this.firestoreServices.getDocumentsQuery<Models.Auth.UserProfile>(path, q, extras)
    this.cargando = false;
    console.log('res ->', res.docs)
    if (res.size) {
      if (res.size < numItems){
        this.enableMore = false
      }
      if (!this.users) {
        this.users = []

      }
      res.forEach(item =>{
        this.users.push(item.data());
        console.log('item ->', item.data())
      });

    } else{
      this.enableMore = false;
    }
  }

}
