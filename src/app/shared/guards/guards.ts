
import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { Models } from "src/app/models/models";
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
      // const login = userService.getUser(); //posibles resultados: user || null isLogin()
      const login = await userService.isLogin()
      console.log('isLogin? -> ', login);
      if(!login){
        router.navigate([path ? path: '/'])

        return false;
      }
      else
        return true;
    }
    return validador;
}

export const notLogin = (path : string = '/home') : CanActivateFn =>{
  console.log('notLogin guard');
  const validador = async (route: ActivatedRouteSnapshot, state : RouterStateSnapshot) => {
    const userService : UserService = inject(UserService);
    const router : Router = inject(Router);
    const login = await userService.isLogin()
      console.log('isLogin? -> ', login);
      if (login) {
        router.navigate([path ? path: '/'])
        return false;
      }
      else{
        return true;
      }
  }
  return validador;
}

export const isRol = (roles: Models.Auth.Rol[], path : string = null): CanActivateFn =>{
  //recibimos parametros adicionales
  console.log('isRol ->', roles);
  const validador = async (route : ActivatedRouteSnapshot, state : RouterStateSnapshot) =>{
    let valid = false;
    const userService : UserService = inject(UserService);
    const router : Router = inject(Router);
    const user = await userService.getUser();
    if (user){
      const userProfile = await userService.getUserProfile(user.uid);
      console.log('userProfile ->', userProfile.roles)
      roles.every( rol => {
        if (userProfile.roles[rol] == true){
          valid = true;
          return false
        }
        return true;
      });
    }
    if (!valid) {


    }
    //aqui va la logica
    //podemos añadir servicion con inject

    return true;
  }
  return validador;
}

export const isRolClaim = (roles: Models.Auth.Rol[], path: string = '/home') : CanActivateFn => {
  console.log('isRolClaim -> ', roles);
  const validador = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    let valid = false;
    const userService: UserService = inject(UserService);
    const router: Router = inject(Router);
    const user = await userService.getState();
    if (user) {
        const tokenResult = await user.getIdTokenResult(true);
        const claims: any = tokenResult.claims;
        if (claims.roles) {
          roles.every( rol => {
            if (claims.roles[rol] == true) {
              valid = true;
              return false;
            }
            return true;
          });

        }
    }
    if (!valid) {
        router.navigate([path])
    }
    console.log('valid -> ', valid);
    return valid;
  }
  return validador;

}

}
