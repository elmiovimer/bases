import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  imports:[IonContent, IonHeader, IonToolbar, IonTitle]
})
export class ContentComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
