import { Component, OnInit } from '@angular/core';
import { IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss'],
  imports: [IonContent, IonButton]
})
export class ButtonsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
