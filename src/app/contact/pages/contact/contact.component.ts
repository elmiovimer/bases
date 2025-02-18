import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: false,
})
export class ContactComponent  implements OnInit {
  title: string = 'Contact';
  

  constructor() { }

  ngOnInit() {}

}
