import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ArticlePageComponent } from './pages/article-page/article-page.component';

const routes: Routes = [
  {
    path:'', component: HomeComponent
  },


  {
    path:'article/:id', component: ArticlePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
