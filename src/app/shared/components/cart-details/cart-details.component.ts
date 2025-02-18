import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Models } from 'src/app/models/models';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.scss'],
  standalone: false,
})
export class CartDetailsComponent  implements OnInit, OnDestroy {

  private cartService = inject(CartService);
  cart: Models.Store.Cart

  cartSubscription : Subscription



  constructor() { }

  ngOnInit() {
    this.cart = this.cartService.cart;
    this.cartSubscription = this.cartSubscription = this.cartService.getCartChanges().subscribe(
      (cartWithChanges)=>{
        this.cart = cartWithChanges

      }
    )
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe()
  }

}
