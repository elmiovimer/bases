import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CompletarRegistroComponent } from './pages/completar-registro/completar-registro.component';
import { RequestLoginComponent } from './pages/request-login/request-login.component';
import { UsersComponent } from './pages/users/users.component';
import { guards } from '../shared/guards/guards';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [guards.notLogin('/auth/profile')]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guards.notLogin('/auth/profile')]
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [guards.isLogin("auth")]
  },
  {
    path: 'completar-registro',
    component: CompletarRegistroComponent
  },
  {
    path: 'request-login',
    component: RequestLoginComponent
  },
  {
    path: 'admin',
    component: UsersComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
