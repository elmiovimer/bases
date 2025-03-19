import { Injectable } from '@angular/core';
import { addIcons } from 'ionicons';
import * as all  from 'ionicons/icons';

@Injectable({
  providedIn: 'root'
})
export class IoniciconsService {

  constructor() {
    addIcons(all);
   }

  // loadIcons(){
  //   addIcons({home, logoIonic, balloon});
  // }

  loadAllIcons(){
    addIcons(all);
  }
}
