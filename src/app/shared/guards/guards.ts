
import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "src/app/services/user.service";

export namespace guards{


  export const simple: CanActivateFn = (route : any, state : any) => {
    console.log('simple guard');
    console.log('route ->', route);
    console.log('state ->', state);
    return true
  };
  export const simpleFalse: CanActivateFn = (route : any, state : any) => {
    console.log('simple guard');
    console.log('route ->', route);
    console.log('state ->', state);
    return false
  };

  export const simpleConArgumentos = (params : any)=>{
  if (params == 'admin') {
    return simple

  }
  else{
    return simpleFalse;
  }
  }

  //esqueleto de un guard
  export const simpleConArgumentos2 = (params: any): CanActivateFn =>{
    //recibimos parametros adicionales
    const validador = (route : ActivatedRouteSnapshot, state : RouterStateSnapshot) =>{
      //aqui va la logica
      //podemos añadir servicion con inject
      return true;
    }
    return validador;
  }

  export const isLogin = (path : string = null): CanActivateFn =>{
    //recibimos parametros adicionales
    console.log('isLogin guard')
    const validador = async (route : ActivatedRouteSnapshot, state : RouterStateSnapshot) =>{
      //aqui va la logica
      //podemos añadir servicion con inject
      const userService : UserService = inject(UserService);
      const router : Router = inject(Router);
      const login = userService.getUser();
      console.log('isLogin -> ', login);
      if(login)
        return true;
      else
        return false;
    }
    return validador;
}


}
