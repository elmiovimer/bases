import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  standalone: true,
  imports:[
    CommonModule
  ]
})
export class DemoComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
