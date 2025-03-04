import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { DataDemo, DataDemo2 } from 'src/app/models/demo';
import { Models } from 'src/app/models/models';
import { DatabaseService } from '../../../services/database.service';
import { CartService } from 'src/app/services/cart.service';
import { FirestoreService } from '../../../firebase/firestore.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
  standalone: false,
})
export class StoreComponent  implements OnInit, OnDestroy {

  cart: Models.Store.Cart;
  items: Models.Store.Item[];
  order: Models.Store.Order[];
  loading: boolean = false;
  cartSubscription : Subscription;
  titlePage = 'Store'
  enableMore : boolean = true;

  private firestoreService = inject(FirestoreService);
  private cartService = inject(CartService);



 categoriaSelected : string = "snack"
  categories = [
    {name: 'Fast Food', id:'fastfood'},
    {name: 'dessert', id:'dessert'},
    {name: 'snack', id:'snack'},
  ];



  //constructor(private database2: DatabaseService) otra forma de iyectar el servicio. a trves del constructor
  constructor( ) {

    // this.loadItems();
  }

  ngOnInit() {
    this.getProductsByCategoria();
    // this.cart = this.cartService.cart;
    // this.consultar();
    this.cart = this.cartService.cart;
    this.cartSubscription = this.cartService.getCartChanges().subscribe(
      (cartWithChanges)=>{
        console.log('getCartChanges -> ', cartWithChanges)
        this.cart = cartWithChanges;


      }
    )
  }



  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }

  loadItems(){
    this.loading = true;
    setTimeout(()=>{
      this.items = DataDemo;

      this.loading = false;

    }, 0);
  }

  async consultar(){

    this.loading = true;
    console.log('consultar()');
    const path = 'Products';
    let q: Models.Firebase.whereQuery[];
    // q=[['enable','==',true]];
    q = [[]]

        // q = [['enable', '==', true, 'salty', '==', true], ['name', '==', 'Water']];
    // q = [ ['name', 'in', ['Hotdog', 'Fish']]];
    // q = [ ["price", ">=", 0, "price", "<=", 6]];
    // q = [ ['state', '==', 'new']];
    // q = [ ['user.id', '==', '8njXZ7n0GuhJyi1ysXO9']];

    const extras: Models.Firebase.extrasQuery = {
      // orderParam: 'date',
      // directionSort: 'asc',
      limit: 2,
      // group: true
    }
    if(this.items){
      const last = this.items[this.items.length-1];
      const snapDoc = await this.firestoreService.getDocument(`${path}/${last.id}`);
      extras.startAfter = snapDoc


    }

    this.firestoreService.getDocumentsQueryChanges<Models.Store.Item>(path, q, extras).subscribe((res) =>{
      console.log('res ->', res);

      if(this.items){
        res.forEach(itemNew =>{
          const exist = this.items.findIndex(item => {return item.id === itemNew.id})
          console.log('exist',exist)
          if(exist >=0){
            this.items[exist] = itemNew
          }else{
            this.items.push(itemNew)
          }
        })
        // this.items.push(...res);

      }
      else{ this.items = res;}
      this.loading = false;

    })

  }

  async getProductsByCategoria(id : string = this.categoriaSelected){
    console.log('consultar por categorias');

    if(!this.items) this.loading = true;

    if(this.categoriaSelected != id){
      this.items = null;
      this.loading = true;
      this.enableMore = true;
    }

    this.categoriaSelected = id;
    console.log('categoriaSelected ->', this.categoriaSelected)

    let restante = 0
    const numItems= 2;
    const path = 'Products';
    let q: Models.Firebase.whereQuery[];
    // q=[['enable','==',true]];
    q = [['categories', 'array-contains',`${id}`]];
    const extras: Models.Firebase.extrasQuery = {
      // orderParam: 'date',
      // directionSort: 'asc',
      limit: numItems,

      // group: true
    }

    if(this.items){
      const last = this.items[this.items.length-1];
      const snapDoc = await this.firestoreService.getDocument(`${path}/${last.id}`);
      extras.startAfter = snapDoc


    }

    this.firestoreService.getDocumentsQueryChanges<Models.Store.Item>(path, q, extras).subscribe((res) =>{
      console.log('res ->', res);
      // restante = res.length;
      console.log('cuantos items me trajo ->',res.length)
      if(res.length < numItems){
        this.enableMore = false;

      }

     if(res.length){




      if(this.items){
        res.forEach(itemNew => {
          const isSameCategoria = itemNew.categories.find(categoria => {return this.categoriaSelected == categoria})
          if(isSameCategoria){

            const exist = this.items.findIndex(item => {return item.id === itemNew.id});
            if(exist >= 0){
              this.items[exist] = itemNew;
            } else {
              this.items.push(itemNew)

            }
          }


        })
      }
      else{
        this.items = res;
      }

      // if(this.items){
      //   res.forEach(itemNew =>{
      //     const exist = this.items.findIndex(item => {return item.id === itemNew.id})

      //     const isSameCategory = itemNew.categories.find(category => {return this.categoriaSelected == category})
      //     if(exist >=0){
      //       console.log('aqui')
      //       this.items[exist] = itemNew
      //     }else{
      //       this.items.push(itemNew)
      //     }
      //   })
      //   // this.items.push(...res);

      // }
      // else{ this.items = res;}

     }

      this.loading = false;

    })


  }









}
