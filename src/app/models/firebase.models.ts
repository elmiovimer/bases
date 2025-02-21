import { WhereFilterOp } from "firebase/firestore"

export namespace ModelsFirebase{
  export interface extrasQuery {
    limit?: number,
    orderParam?: string,
    directionSort?: 'asc' | 'desc',
    startAfter?: any,
    group? : boolean,


   }

   export const defaultExtrasQuery : extrasQuery = {
    limit: null,
    orderParam: null,
    directionSort: 'asc',
    startAfter: null,
    group : false,

   }

   export type whereQuery = WhereFilterOp[] | string[] | any[]

   

}
