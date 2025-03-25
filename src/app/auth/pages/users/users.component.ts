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
  private fb : FormBuilder = inject(FormBuilder);

  rolSegment: Models.Auth.Rol = 'admin';
  users: Models.Auth.UserProfile[] = [];
  roles: Models.Auth.Rol[] = ['admin', 'client', 'driver'];
  rolSelected: Models.Auth.Rol = 'admin';

  enableMore : boolean = false;
  enableBuscarPorEmail : boolean = false;
  numItems: number = 4;

  formEmail = this.fb.group({
    email: ['', [Validators.email, Validators.required]],

  })


  constructor() {
    this.authenticationService.authState.subscribe(res =>{
      if (res) {
        this.getMoreUsers();
        // console.log('token',res.getIdTokenResult())

      }
    })
   }

  ngOnInit() {  }


 /**
   * Maneja la búsqueda por email a medida que el usuario escribe.
   * @param ev Evento de entrada de búsqueda.
   */
  async onSearchChange(ev : any){
    this.enableBuscarPorEmail = true;
    // console.log('onSerachChange ->',ev);
    const email = ev.detail.value;
    this.users = [];
    // this.cargando = null;
    this.enableMore = false;
    // const extras : Models.Firebase.extrasQuery = {
    //   parcialSearch : true,
    // }


    const path = Models.Auth.PathUsers;
    let query : Models.Firebase.whereQuery[];
    query =[['email', '==', email]];
    const response = await this.firestoreServices.getDocumentsQuery<Models.Auth.UserProfile>(path, query);
    // this.cargando = false;
    console.log('response ->', response)
    if (!response.empty) {
      this.users = [];
      response.forEach(item =>{
        this.users.push(item.data())

      })

    }
  }

   /**
   * Carga más usuarios al hacer scroll en la lista.
   * @param ev Evento de carga.
   */
  async loadData(ev:any){
    // console.log('loadData');
    await this.getMoreUsers();
    ev.target.complete();
  }

   /**
   * Realiza la búsqueda de usuarios por email.
   */
  async buscarPorEmail(){
    if (this.formEmail.valid) { return; }
    const data = this.formEmail.value;
    this.users = [];
    this.enableMore = false;
    const path = Models.Auth.PathUsers;
    let q : Models.Firebase.whereQuery[];

    q = [[`email`, `==`, data.email]];
    const response = await this.firestoreServices.getDocumentsQuery<Models.Auth.UserProfile>(path, q);
    if (!response.empty) this.users = response.docs.map((doc) => doc.data());

    // usar el metodo comentado es mejor cuando queremos agregar mas datos y no llenar una lista de cero
    // if (!response.empty) {

    //   response.forEach(item =>{
    //     this.users = [];
    //     this.users.push(item.data());
    //   })

    // }


  }

  /**
   * Obtiene más usuarios basados en el rol seleccionado.
   * @param rol Rol del usuario a filtrar.
   */
  async getMoreUsers(rol : Models.Auth.Rol = this.rolSelected){
    // console.log('getMoreUsers -> ', this.rolSegment)
    if(this.rolSelected != rol){
      this.users = [];
      this.enableMore = true;
    }
    this.rolSelected = rol;

    const path = Models.Auth.PathUsers;
    const numItems = this.numItems;
    let q: Models.Firebase.whereQuery[] = [[`roles.${rol}`, '==', true]];
    const extras: Models.Firebase.extrasQuery = {
      orderParam: 'date',
      directionSort: 'desc',
      limit: numItems,
    };

    if (this.users && this.users.length > 0) {
      const last = this.users[this.users.length -1];
      const snapdoc = await this.firestoreServices.getDocument(`${path}/${last.id}`)
      extras.startAfter = snapdoc

    }

    const res = await this.firestoreServices.getDocumentsQuery<Models.Auth.UserProfile>(path, q, extras)
    // console.log('res ->', res.docs)
    // if (res.size) {
    //   if (res.size < numItems){
    //     this.enableMore = false
    //   }
    //   if (!this.users) {
    //     this.users = []

    //   }
    //   res.forEach(item =>{
    //     this.users.push(item.data());
    //     console.log('item ->', item.data())
    //   });

    // } else{
    //   this.enableMore = false;
    // }

    if(res.size){
      this.enableMore = res.size <= numItems;

      this.users.push(...res.docs.map(doc => doc.data()))
      // Cómo funciona el spread operator aquí (...):

      // map() devuelve un array con los datos.
      // push() espera recibir elementos individuales, no un array.
      // El spread operator (...) descompone el array en elementos individuales.
    } else{
      this.enableMore = false
    }
  }

   /**
   * Cancela la búsqueda y restaura la lista de usuarios.
   */
  cancelSearch() {
    setTimeout(() => {
      this.getMoreUsers(this.rolSegment);
      this.enableBuscarPorEmail = false;
    }, 200);
  }

}
