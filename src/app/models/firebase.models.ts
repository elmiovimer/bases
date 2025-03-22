import { WhereFilterOp } from "firebase/firestore"

export namespace ModelsFirebase{
  export interface extrasQuery {
    limit?: number,
    orderParam?: string,
    directionSort?: 'asc' | 'desc',
    startAfter?: any,
    group? : boolean,
    parcialSearch? : boolean


   }

   export const defaultExtrasQuery : extrasQuery = {
    limit: null,
    orderParam: null,
    directionSort: 'asc',
    startAfter: null,
    group : false,
    // parcialSearch : false

   }

   export type whereQuery = WhereFilterOp[] | string[] | any[]



}
