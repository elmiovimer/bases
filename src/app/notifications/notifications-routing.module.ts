import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { isAdminGuard } from '../shared/guards/is-admin.guard';

const routes: Routes = [
  {
    path: '',
    component: NotificationsComponent, canActivate: [isAdminGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }
