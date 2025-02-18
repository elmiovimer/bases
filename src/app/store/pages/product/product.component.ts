import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Models } from 'src/app/models/models';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  standalone: false,
})
export class ProductComponent  implements OnInit {
  item : Models.Store.Item
  image: string;
  itemDesc: string;
  itemName: string;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(
      (params : any) =>{
        // this.image = params['imageURL'];
        this.image = params.imageURL
        this.itemDesc = params['desc']
        this.itemName = params['productName']
        console.log(params);


      }
    )
  }
  
  ngOnInit() {
    // console.log(this.itemID)
  }

}
