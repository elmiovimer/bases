import { Routes } from '@angular/router';
import { ButtonsComponent } from './ionic/pages/buttons/buttons.component';

export const routes: Routes = [
  // {
  //   path: 'home',
  //   loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  // },

  // {
  //   path: 'home',
  //   redirectTo: '',
  //   pathMatch: 'full',
  // },
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },

  {
    path: 'store',
    loadChildren: () => import('./store/store.module').then((m) => m.StoreModule),
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then((m) => m.NotificationsModule),
  },
  {
    path: 'contact',
    loadChildren: () => import('./contact/contact.module').then((m) => m.ContactModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),

  },
  // {
  //   path: 'user',
  //   loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  // },


  //--------------------IONIC
  {
    path: 'content',
    loadComponent: () => import('./ionic/pages/content/content.component').then((m) => m.ContentComponent),
  },
  {
    path: 'buttons',
    loadComponent: () => import('./ionic/pages/buttons/buttons.component').then((m) => m.ButtonsComponent),
  },



  // --------------no found page -------------

  {
    path: '**',
    loadComponent: () => import('./shared/pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
    // loadComponent: async () => {
      //   const m = await import('./shared/pages/not-found/not-found.component');
      //   return m.NotFoundComponent;
      // }
  },



];
