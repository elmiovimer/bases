import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { ArticlesComponent } from './components/articles/article.component';
import { HomeComponent } from './pages/home/home.component';
import { IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonMenuButton,
  IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { SharedModule } from '../shared/shared.module';
import { NotFoundComponent } from '../shared/pages/not-found/not-found.component';
import { ArticlePageComponent } from './pages/article-page/article-page.component';
import { ShortPipe } from '../shared/pipes/short.pipe';
import { HighlightDirective } from '../shared/directives/highlight.directive';



@NgModule({
  declarations: [
    HomeComponent,
    ArticlesComponent,
    ArticlePageComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    NotFoundComponent,
    ShortPipe,
    HighlightDirective,
    IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonMenuButton,
    IonRow, IonTitle, IonToolbar
  ],
  exports:[]
})
export class HomeModule { }
