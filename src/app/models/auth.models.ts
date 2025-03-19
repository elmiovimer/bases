export namespace ModelsAuth{
  export const PathUsers = 'Users';
  export const PathIntentsLogin = 'intentsLogin';
  export const StrongPasswordRegx : RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
  export interface DatosRegister{
    email: string;
    password : string;
  }
  export interface DatosLogin{
    email: string;
    password : string;
  }

  export interface UserProfile{
    name : string;
    photo? : string;
    age? : string;
    id : string;
    email : string;
    roles: {
      admin? : boolean;
      client? : boolean;
      driver? : boolean;
    }
    date? : Date;
  }


  export interface UPdatePforileI{
    displayName? : string;
    photoURL? : string

  }

  export interface ProviderLoginI {
    name: string;
    id: IdProviderLogin;
    color: string;
    textColor: string;
    icon? : string;
    enable : boolean;
  }
  export type IdProviderLogin = 'password' | 'google' | 'facebook' | 'apple'
  export type Rol = 'admin' | 'client' | 'driver'

}
