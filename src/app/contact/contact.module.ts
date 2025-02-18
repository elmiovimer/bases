import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './pages/contact/contact.component';
import { FormContactComponent } from './components/form-contact/form-contact.component';
import { SharedModule } from '../shared/shared.module';
import { IonContent } from '@ionic/angular/standalone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighlightDirective } from '../shared/directives/highlight.directive';


@NgModule({
  declarations: [
    ContactComponent, //page
    FormContactComponent, //component
    
  ],
  imports: [
    CommonModule,
    ContactRoutingModule,
    SharedModule,
    IonContent,
    FormsModule,
    ReactiveFormsModule,
    HighlightDirective
  ]
})
export class ContactModule { }
