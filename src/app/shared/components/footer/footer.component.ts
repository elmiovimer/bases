import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: false,
})
export class FooterComponent  implements OnInit, OnDestroy {

  private cartService = inject(CartService);
  cant : number = 0
    private router = inject(Router);

  subscripcionCart: Subscription

  constructor() {
   }

  ngOnInit() {
    this.cant = this.cartService.cart.totalQT;
    this.subscripcionCart = this.cartService.getCartChanges().subscribe(
      (cartWithChanges)=>{ //en este caso value es tipo cart
        this.cant = cartWithChanges.totalQT;

      }
    );
  }

  ngOnDestroy(){
    this.subscripcionCart?.unsubscribe()

  }





}
