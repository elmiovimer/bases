import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { Subscription } from 'rxjs';
import { WebService } from '../../../services/web.service';
import { Models } from 'src/app/models/models';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
  // imports: [IonicModule],
})
export class HomeComponent  implements OnInit, OnDestroy {
  private cartService = inject(CartService);
  cartSubscription: Subscription;
  articles: Models.Home.article2I[];
  loading : boolean = false;
  private webService = inject(WebService)
  res : any;



  
  


  constructor() { }

  ngOnInit() {
    this.cartSubscription =  this.cartService.getCartChanges().subscribe((cartWithChanges) => {
      console.log('cambios en el home -> ',cartWithChanges)

      
      
      
    })
    this.getArticles();
    // this.createArticle();
    
    // this.webService.login('vimerfabian@gmail.com', '123456').then(res =>{
    //   this.res = res;
    //   console.log('res ->', this.res);
    // })
    
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
    console.log(this.res)
  }

  async getArticles(){
    this.loading = true;
    const url = 'https://jsonplaceholder.typicode.com';
    const res = await this.webService.request<Models.Home.article2I[]>('GET', url, 'posts');
    if(res){
      this.articles = res;
      this.articles.forEach(element => {
        element.time = new Date();
      });
    }
    console.log('data -> ', this.articles);
    this.loading = false;
  }

  async createArticle(){
    this.loading = true;
    const data ={
      title: 'foo',
      body: 'bar',
      userId: 1,
    }
    const url = 'https://jsonplaceholder.typicode.com';
    const res = await this.webService.request<Models.Home.article2I>('POST', url, 'posts', data);
    console.log('data -> ', res);
    if(res){
      // this.articles.push(res);
      // console.log("article ->",this.articles)
    }
    this.loading = false;

  }

  // ionViewDidLeave() {
  //   const element = document.getElementById('home.component');
  //   if (element) {
  //     element.setAttribute('inert', 'true');
  //   } // Elimina el foco del botón actual
  //   console.log(document.getElementById('home.component'))
  // }
  
  // ionViewDidEnter(){
  //   console.log(document.getElementById('focus-target')) // Elimina el foco del botón actual

  // }

}
