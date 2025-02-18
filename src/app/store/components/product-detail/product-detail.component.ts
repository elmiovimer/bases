import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Models } from 'src/app/models/models';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: false,
})
export class ProductDetailComponent  implements OnInit {

  @Input() item: Models.Store.Item
  // @Input() index: number;
  cant: number;
  color: 'aliceblue' | '#fde2e2' | '#dfe7d6' = 'aliceblue';
  
  // @Output() onAdd = new EventEmitter();
  // @Output() onRemove = new EventEmitter();
  // @Output() onItemCant = new EventEmitter();
  
  // cart : Models.Store.Cart;
  private cartService = inject(CartService);




  constructor() {
    // this.cart = this.cartService.cart
    this.cant = this.cartService.getQuantityItem(this.item);
  }
  
  ngOnInit() {
    this.getColor();
    
  }

  addItem(item: Models.Store.Item){
    this.cartService.addItem(item);
    this.cant = this.cartService.getQuantityItem(item)
  }
  removeItem(item: Models.Store.Item){
    //en lugar de solicitar el metodo onRemove de la clase padre
    //voy a llamarlo directamente desde el servicio
    // this.onRemove.emit();
    this.cartService.removeItem(item);
    this.cant = this.cartService.getQuantityItem(item)
  }

  getColor(){
    if(this.item.stock ===0){
      this.color = '#fde2e2'; 
    } else if(this.item.stock < 5){
      this.color = 'aliceblue';

    } else {
      this.color = '#dfe7d6';
    }
    
  }


}
