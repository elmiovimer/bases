import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, IonIcon, IonButton, IonLabel, IonContent, IonSplitPane, IonHeader, IonToolbar, IonMenu, IonTitle, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { FirestoreService } from './firebase/firestore.service';
import { Models } from './models/models';
import { increment } from 'firebase/firestore';
import { AuthenticationService } from './firebase/authentication.service';
import { UserService } from './services/user.service';
import { signInWithCustomToken } from '@angular/fire/auth';
import { addIcons } from 'ionicons';
import { helloWorld } from '../../functions/src/index';
import { WebService } from './services/web.service';
import { StorageService } from './firebase/storage.service';
import { IoniciconsService } from './services/ionicicons.service';
import { SidemenuComponent } from './shared/components/sidemenu/sidemenu.component';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [SidemenuComponent, IonApp, IonRouterOutlet, IonIcon, IonButton, IonLabel, IonContent, IonSplitPane, IonHeader, IonToolbar, IonMenu, IonTitle, IonButtons, IonMenuButton],
})
export class AppComponent {
  private firestoreService = inject(FirestoreService);
  private authenticationService = inject(AuthenticationService);
  private userService : UserService = inject(UserService)
  private webService : WebService = inject(WebService);
  private storageService : StorageService = inject(StorageService);
  private ionicIconsService : IoniciconsService = inject(IoniciconsService);



  // console.log(products);

  constructor() {
    // this.onSearchChange();

    // this.ionicIconsService.loadAllIcons();
    // this.storageService.uploadString()
    // this.helloWorld();
    // this.helloWorldGet();
  //   fetch('/__/auth/handler')
  // .then(response => console.log(response))
  // .catch(error => console.error('Error:', error));

  // this.test();
    // this.authenticationService.verifyUserDoc();
    // this.saveProduct()
    // this.updateProduct();
    // this.getProducts();
    // this.firestoreService.getDocumentsQuery();
    // this.consultar();
    // for (let index = 0; index < this.products.length; index++) {
    //   this.firestoreService.createDocument<Models.Store.Item>('Products', this.products[index]);


    // }

    // this.registrarse();
    // this.authenticationService.login('fabianvimer@gmail.com','123456')
    // this.authenticationService.logout();


  }

  // async onSearchChange(){



  //     const extras : Models.Firebase.extrasQuery = {
  //       parcialSearch : true,
  //     }


  //     const path = Models.Auth.PathUsers;
  //     let q : Models.Firebase.whereQuery[];
  //     q =[['email', '==', 'fab']];
  //     const response = await this.firestoreService.getDocumentsQuery<Models.Auth.UserProfile>(path, q, extras);

  //     console.log('response ->', response)

  //   }
  async test (){
    await this.authenticationService.loginWithTokenOfprovider('google', 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImJjNDAxN2U3MGE4MWM5NTMxY2YxYjY4MjY4M2Q5OThlNGY1NTg5MTkiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiVmltZXIgRmFiaWFuIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0xuckVqTTZ1clBFQ3ZSa01DZU5pWURUNEw1dXFiazNFc3NMV0E4dDh4X3VVYkRKcDQ9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYmFzZXNmaXJlLWRldnNlcnYiLCJhdWQiOiJiYXNlc2ZpcmUtZGV2c2VydiIsImF1dGhfdGltZSI6MTc0MTA1MzMyNywidXNlcl9pZCI6IkZaMmtweGdmbHBYd2lEVlc5Y3h6N2Fmd1B5NjIiLCJzdWIiOiJGWjJrcHhnZmxwWHdpRFZXOWN4ejdhZndQeTYyIiwiaWF0IjoxNzQxMDUzMzI3LCJleHAiOjE3NDEwNTY5MjcsImVtYWlsIjoidmltZXJmYWJpYW5AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDk1MzY0MjI1NzQxNjI2NDU4NzQiXSwiZW1haWwiOlsidmltZXJmYWJpYW5AZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.u_zTQslPqCIPSl9dFVNsMtRmEKVZ6Ili2Ui1LnFWE5EohDkV40wrlaStuSadwcQD7jeID7KiWkdYOe3zj13KpkEXHiMMoVZgGEG3NkMvqZ7xBa1QznR-gelquMKlFC6ZQdcsLqHyZEU_xQTZkQ6WTN1D9GVbdCZVkch-wIYQ78bswGknYridqitN8dVvxSbst35HUsnR73gWfqMbItXylCpmJgnOMU8t5oXCCnjGFklcg6iIrvYvZLY1P-sT08zEYCm5Vbis4zLOezPVJVm5-jj2vkyZU5FTzvt3iroSxGteDsUyEjEdiAgaOddc0t-LfiUDW8ABe6pMgYy7iOhwbA')
  }


  async consultar(){
    console.log('consultar');
    let q: Models.Firebase.whereQuery[];
    q = [['name', 'in', ['Hotdog']]];
    this.firestoreService.getDocumentsQueryChanges<Models.Store.Item>('Products', q).subscribe( res => {
      console.log('res -> ', res);
    });

  }
  async getProducts(){
    console.log('getProducts');
    const path = 'Products';
    // const docs = await this.firestoreService.getDocuments<Models.Store.Item>(path);
    // docs.forEach((doc)=>{
      //   console.log(doc.id, '->', doc.data());
      //   console.log('first')
      // })
      const docs = (await this.firestoreService.getDocumentsChanges<Models.Store.Item>(path)).subscribe(res => {console.log(res)});


  }

  async saveProduct(){
    console.log('saveDoc()');
    const data: Models.Store.Item = {
      name: 'Hotdog',
      desc: 'lorem ipsum dolor sit amet consectetut adipisiing elit. et vel deitisc',
      price: 5,
      image: 'https://url...',
      stock: 10
    }
    try{
      await this.firestoreService.createDocument<Models.Store.Item>('Products', data);
      console.log('guardado con exito')

    } catch(error){
      console.log('error al guardar -> ', error);
    }
  }

  async updateProduct(){
    console.log('updateProduct');
    const path = 'Products/' + '0x17IZH889NhtaXLCgOE';
    const updateDoc = {
      stock: increment(10),

    }
    try{
      await this.firestoreService.updateDocument(path, updateDoc);
      console.log('actualizado con exito')

    } catch(error){
      console.log('error al actualizar -> ', error);
    }
  }
  async registrarse(){
    const form = {email: 'fabianvimer@gmail.com', password: '123456'};
    console.log('registrarse ->', form);
    if(form.email && form.password){
      const user = await this.authenticationService.createUser(form.email, form.password);
      console.log('user ->', user)

    }

  }

  async helloWorld(){
    const url = 'http://127.0.0.1:5001/basesfire-devserv/us-central1';
    const data = {
      id: '4sMQTT6natSNmmMAskcibIs86QE2',
      path: 'Users'
    }
    const response = await this.webService.request('POST',url, 'helloWorld', data);
    console.log('response ->', response)
  }
  async helloWorldGet(){
    const url = 'http://127.0.0.1:5001/basesfire-devserv/us-central1';
    const response = await this.webService.request('GET',url, 'helloWorld');
    console.log('first')
    console.log('response ->', response)
  }

}

