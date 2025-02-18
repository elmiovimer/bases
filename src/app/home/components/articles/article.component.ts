import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Models } from 'src/app/models/models';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  standalone: false,
})
export class ArticlesComponent  implements OnInit {
  
  @Input() article: Models.Home.article2I;

  private router = inject(Router); 
  
  constructor() {
    // this.loadArticle();
   }
  
  ngOnInit() {}

  loadArticle(){
    // const data: Models.Home.ArticleI={
    //   title: 'Angular aplications',
    //   desc: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi, vitae! Tenetur rem, nostrum nam voluptatem accusamus odit unde quia voluptate pariatur perferendis 
    //   eius hic repellendus officia dicta. Quisquam, ratione labore!`,
    //   image: {
    //     url: '/assets/images/angular-logo.png',
    //     desc:'logo de angular'
    //   },
    //   id: '1',
    // }
    // this.article = data;
    
  }

  goToArticle(){
    console.log(this.article.id)
    // this.router.navigate
    this.router.navigate([`/home/article/${this.article.id}`])

  }
  
  
}

