import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  // standalone: false,
  imports: [
    IonContent,
    RouterModule
  ], // Add any necessary imports here
})
export class NotFoundComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
