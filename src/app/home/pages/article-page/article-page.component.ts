import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Models } from 'src/app/models/models';
import { WebService } from '../../../services/web.service';

@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.scss'],
  standalone: false,
})
export class ArticlePageComponent  implements OnInit {

  article : Models.Home.article2I;
  id : number;
  private route = inject(ActivatedRoute); 
  webService  = inject(WebService);

  constructor() { 
    this.route.params.subscribe(
      (params : any)=>{
        if(params.id){
          console.log(params)
          this.loadArticle(params.id)
        }
      }
    );
    
    

    
  }

  ngOnInit() {}

  async loadArticle(id : number){
    const url = 'https://jsonplaceholder.typicode.com/';
    const path = 'posts/'+id;
    const res = await this.webService.request<Models.Home.article2I>('GET', url, path)
    if(res){
      this.article = res;
      console.log('this.article ->', this.article);
    }
  }

}
