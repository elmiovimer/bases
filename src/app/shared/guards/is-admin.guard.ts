import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { WebService } from 'src/app/services/web.service';


// isAdminGuard(){};

export const isAdminGuard: CanActivateFn = async (route, state) => {

  const webService = inject(WebService);
  return funcion();
};

const funcion = () =>{
  return false;
}

