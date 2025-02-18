import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { DataDemo, DataDemo2 } from 'src/app/models/demo';
import { Models } from 'src/app/models/models';
import { DatabaseService } from '../../../services/database.service';
import { CartService } from 'src/app/services/cart.service';

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
  loading: boolean = true;
  cartSubscription : Subscription;

 

  titlePage = 'Store'

  private cartService = inject(CartService);

  //constructor(private database2: DatabaseService) otra forma de iyectar el servicio. a trves del constructor
  constructor() {
    
    this.loadItems();
    this.cart = this.cartService.cart;
  }

  ngOnInit() {
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
    setTimeout(()=>{
      this.items = DataDemo;
      
      this.loading = false;

    }, 0);
  }

  // addItem(item: Models.Store.Item, index: number){
  //   this.cartService.addItem(item, index);
  //   // this.cart = this.cartService.cart
    

  // }

  // removeItem(item: Models.Store.Item){
  //   this.cartService.removeItem(item)


  // }
  // getQuantityItem(item: Models.Store.Item){
  //   return this.cartService.getQuantityItem(item)
  // }

  



 

  updateInput(){
    console.log('updateInput()');
  }
  validateInput(event: any){
    console.log('validateInput()', event);

  }

  



}
