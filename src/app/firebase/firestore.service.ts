import { observable } from './../../../node_modules/rxjs/src/internal/symbol/observable';
import { name } from './../../../node_modules/@leichtgewicht/ip-codec/types/index.d';
import { inject, Injectable } from '@angular/core';
import { DocumentSnapshot, getDoc, Firestore, addDoc, collection,QuerySnapshot, collectionData, where, collectionGroup, deleteDoc, doc, docData, getDocs, query, serverTimestamp, setDoc, updateDoc, or, WhereFilterOp, and, limit  } from '@angular/fire/firestore';
// import {   } from 'firebase/firestore';
import { Observable, timestamp } from 'rxjs';
import { Models } from '../models/models';

import { orderBy, startAfter } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore: Firestore = inject(Firestore);

  constructor() {
   }

   // CRUDS -> CREATE - READ - UPDATE - DELETE
  // ---| CREATE |---//



  async createDocument<tipo>(path : string, data : tipo){
    //   Descripción: Crea un nuevo documento en la colección especificada, generando automáticamente un ID y añadiendo la marca de tiempo de creación (serverTimestamp()).
    //   Parámetros:
      //   path: Ruta de la colección donde se almacenará el documento.
      //   data: Objeto de datos a guardar.
    //   Retorno: Promise<void>, indicando que la operación se completó.
    const refCollection = collection(this.firestore, path);
    const refDoc = doc(refCollection);
    const dataDoc: any = data;
    dataDoc.id = refDoc.id;
    dataDoc.date = serverTimestamp();

    return await setDoc(refDoc, dataDoc);
  }


    // ---| UPDATE |---//
  async updateDocument(path: string, data: any){
//     Descripción: Actualiza un documento existente y añade una marca de tiempo updateAt.
    // Parámetros:
    // path: Ruta del documento a actualizar.
    // data: Objeto con los datos actualizados.
    // Retorno: Promise<void>.

    const refDoc = doc(this.firestore, path);
    data.updateAt = serverTimestamp();
    return await updateDoc(refDoc, data)

  }

    // ---| DELETE |---//
  async deleteDocument(path: string){
//     Descripción: Elimina el documento especificado.
    // Parámetros: path - Ruta del documento a eliminar.
    // Retorno: Promise<void>.
    const refDoc = doc(this.firestore, path);
    return await deleteDoc(refDoc);


  }

    // ---| READ |---//

    async getDocument<tipo>(path : string){
    // Descripción: Obtiene un documento único a partir de su ruta.
    // Parámetros: path - Ruta del documento.
    // Retorno: DocumentSnapshot<tipo>, que contiene los datos del documento.
    const docRef = doc(this.firestore, path);
    return await getDoc(docRef) as DocumentSnapshot<tipo>;


  }


  getDocumentChanges<tipo>(path : string){

    //   Descripción: Retorna un observable para escuchar los cambios en tiempo real de un documento.
    //   Retorno: Observable<tipo>.
    const document = doc(this.firestore, path);
    return docData(document) as Observable<tipo>;

  }

  async getDocuments<tipo>(path : string, group : boolean = false){
    // Descripción: Obtiene todos los documentos de una colección o de un grupo de colecciones.
    // Parámetros:
      // path: Ruta de la colección.
      // group: Si es true, utiliza collectionGroup para buscar en grupos de colección.
    // Retorno: QuerySnapshot<tipo>.


    if(!group){
      const refCollection = collection(this.firestore, path);
      return await getDocs(refCollection) as QuerySnapshot<tipo>

    }else{
      const refCollectionGroup = collectionGroup(this.firestore, path);
      return await getDocs(refCollectionGroup) as QuerySnapshot<tipo>

    }
   }

   async getDocumentsChanges<tipo>(path : string, group : boolean = false){
    // Descripción: Retorna un observable de todos los documentos para escuchar cambios en tiempo real.
    // Parametros:
      // path: Ruta de la colección.
      // group: Si es true, utiliza collectionGroup para buscar en grupos de colección.
// Retorno: Observable<tipo>.
    if(!group){
      const refCollection = collection(this.firestore, path);
      return await collectionData(refCollection) as Observable<tipo>

    }else{
      const refCollectionGroup = collectionGroup(this.firestore, path);
      return await collectionData(refCollectionGroup) as Observable<tipo>

    }


   }

    // ------------------//


    // ---| QUERY |---//

    async getDocumentsQuery<tipo>(
      path: string, querys: Models.Firebase.whereQuery[],
      extras: Models.Firebase.extrasQuery = Models.Firebase.defaultExtrasQuery) {

//         Descripción: Realiza una consulta con múltiples condiciones (where, orderBy, limit, startAfter).
        // Parámetros:
          // path: Ruta de la colección.
          // querys: Lista de condiciones para el where.
          // extras: Parámetros adicionales para la consulta (limit, orderParam, directionSort, startAfter).
        // Retorno: QuerySnapshot<tipo>.

        let q = this.getQuery(path, querys, extras)
        return await getDocs(q) as QuerySnapshot<tipo>;
    }

    getDocumentsQueryChanges<tipo>(
      path: string, querys: Models.Firebase.whereQuery[],
      extras: Models.Firebase.extrasQuery = Models.Firebase.defaultExtrasQuery) {

//         Descripción: Igual a getDocumentsQuery pero retorna un Observable para escuchar los cambios en tiempo real.
        // Parámetros:
            // path: Ruta de la colección.
            // querys: Lista de condiciones para el where.
            // extras: Parámetros adicionales para la consulta (limit, orderParam, directionSort, startAfter).
//      Retorno: Observable<tipo[]>.


        let q = this.getQuery(path, querys, extras)
        return collectionData(q) as Observable<tipo[]>;
    }

    async getDocumentsOneQuery<tipo>(path: string, campo: string, condicion: WhereFilterOp, valor: string) {

      //Descripción: Obtiene documentos de una colección que cumplan con una sola condición where.
     // Parámetros:
        // campo: Campo de la colección a consultar.
        // condicion: Operador para la condición (==, <, >, etc.).
        // valor: Valor a comparar.
     // Retorno: QuerySnapshot<tipo>.

      let ref = collection(this.firestore, path);
      let q = query(ref, where(campo, condicion, valor))
      return await getDocs(q) as QuerySnapshot<tipo>;
    }






  private getQuery(path: string, querys: Models.Firebase.whereQuery[], extras: Models.Firebase.extrasQuery = Models.Firebase.defaultExtrasQuery) {

//     Descripción: Construye dinámicamente una consulta avanzada de Firestore utilizando:
      // where para condiciones.
      // and y or para combinar múltiples condiciones.
      // limit, orderBy y startAfter para paginación y orden.
    // Retorno: Una consulta lista para ser ejecutada (Query).

    let ref = extras.group? collectionGroup(this.firestore, path) : collection(this.firestore, path);

    let ors: any = [];
    querys.forEach( (row) => {
      let wheres: any = [];
      for (let col = 0; col < row.length; col = col + 3) {
        wheres.push(where(row[col], row[col + 1], row[col + 2]))
      }
      const AND = and(...wheres)
      ors.push( AND )
    });
    let q = query(ref, or(...ors))

    // limit
    if (extras.limit) {
      q = query(q, limit(extras.limit))
    }

    // orderBy
    if (extras.orderParam) {
      q = query(q, orderBy(extras.orderParam, extras.directionSort))
    }

    // startAfter
    if (extras.startAfter) {
      q = query(q, startAfter(extras.startAfter))
    }

    return q;

  }






}
