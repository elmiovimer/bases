import { Injectable } from '@angular/core';
import { Models } from '../models/models';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  //sujeto
  private cart$ = new Subject<Models.Store.Cart>();

  cart: Models.Store.Cart;


  constructor() {
    this.initCart();

  }

  getCartChanges(){
    return this.cart$.asObservable();
  }

  private initCart(){
    this.cart = {
      items:[
        // {
        //   item: null, 
        //   cant: 0
        // }
      ],
      total: 0,
      totalQT: 0,
    };
  }

  getTotal(){
    this.cart.total = 0
      this.cart.totalQT = 0;
    for (let index = 0; index < this.cart.items.length; index++) {
      this.cart.total += this.cart.items[index].cant * this.cart.items[index].item.price;
      this.cart.totalQT += this.cart.items[index].cant; 

    }
    this.cart$.next(this.cart); //esto emite los cambios
  }

  removeItem(item: Models.Store.Item){
    console.log('removeItem()', item.price);
    
    const existingItem = this.cart.items.find(cartItem => cartItem.item.id === item.id);
    
    if(existingItem){
      if(existingItem.cant > 1)
        existingItem.cant--;
      else
      {
          const existingItemindex = this.cart.items.findIndex(cartItem => cartItem.item.id === item.id);
          this.cart.items.splice(existingItemindex, 1);
          
        
        }
    }

    this.getTotal();

  }


  addItem(item: Models.Store.Item){
    console.log('addItem()', item);
    // revisar si el item se encuentra en el carrito
    const existingItem = this.cart.items.find(cartItem => {
      if(cartItem.item.id === item.id)
        return true;
      else
        return false;

    });
    //si el item se encuentra en el carrito, aumentar cantidad
    if(existingItem){
      existingItem.cant++;
    }
    else{
    //si el item no se encuentra en el carrito, agregarlo con cantidad 1
      this.cart.items.push({
        item, 
        cant: 1,
      });
    }

    this.getTotal();
      
    
    



  }

  getQuantityItem(item: Models.Store.Item){
    const existingItem = this.cart.items.find(cartItem => cartItem.item.id === item.id);
    if(existingItem)
      return existingItem.cant;
    else
      return 0;
  }

}
