import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { FirestoreService } from './firebase/firestore.service';
import { Models } from './models/models';
import { increment } from 'firebase/firestore';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
  standalone: true,
})
export class AppComponent {
  private firestoreService = inject(FirestoreService);

  constructor() {
    // this.saveProduct()
    // this.updateProduct();
    // this.getProducts();
    // this.firestoreService.getDocumentsQuery();
    // this.consultar();
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
}
