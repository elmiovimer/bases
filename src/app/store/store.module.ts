import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { StoreComponent } from './pages/store/store.component';
import { SharedModule } from '../shared/shared.module';
import { ProductComponent } from './pages/product/product.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { IonContent } from '@ionic/angular/standalone';


@NgModule({
  declarations: [
    StoreComponent, //page
    ProductComponent, //page 
    ProductDetailComponent, //component
  ],
  imports: [
    CommonModule,
    StoreRoutingModule,
    SharedModule,
    IonContent,
  ]
})
export class StoreModule { }
