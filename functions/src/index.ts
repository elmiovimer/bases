/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onCall, onRequest, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { ModelsFunctions } from "./models";
import { getAuth } from "firebase-admin/auth";


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

initializeApp();
const firestore = getFirestore();
const auth = getAuth();

export const helloWorld = onRequest(async(request, response) =>  {
  logger.info("Hello logs!", {structuredData: true});
  const id = request.body.id;
  const path = request.body.path;

  logger.info('data colected -> ', request.body)

  const refdoc = firestore.collection(path).doc(id)
  const doc = await refdoc.get();
  if (doc.exists) {
    response.send({
      data: doc.data()
    });
  }else{
    response.send({
      message: 'error'
    })
  }
});


export const setRol = onRequest(async (request, response) =>{
  //validaciones
  const res: ModelsFunctions.ResponseSetRol = {
    ok: false,
  }
  logger.info("setRol function called", {structuredData: true});
  const body : ModelsFunctions.RequestSetRol = request.body;
  console.log('setRol ->', body);
  const roles = body.roles;
  const uid = body.uid;
  const updateDoc ={
    roles: roles
  }

  try {
    await firestore.doc(`Users/${uid}`).update(updateDoc);
    console.log('rol cambiado con exito');
   res.ok = true
    response.send(res);

  } catch (error) {
    console.log('error en setRol function ->', error)

  }



});

export const createUser = onRequest({cors: true}, async (request, response) => {
  // validaciones
  // const userData: ModelsFunctions.RequestCreateUser = request.body
  const res:  ModelsFunctions.ResponseCreateUser = {
      ok: false
  }
  try {

      const user = await auth.createUser(
          {
              email: 'user@example.com',
              emailVerified: false,
              // phoneNumber: '+11234567890',
              password: 'secretPassword',
              displayName: 'John Doe',
              photoURL: 'https://cdn.pixabay.com/photo/2021/01/04/10/37/icon-5887113_1280.png',
              disabled: false,
          }
      )

      const profile: ModelsFunctions.UserProfile = {
          name: user.displayName,
          photo: user.photoURL,
          age: 25,
          id: user.uid,
          email: user.email,
          roles: {
              cliente: true
          }
      }

      await firestore.doc(`Users/${user.uid}`).create(profile);
      res.uid = user.uid;
      res.ok = true;
      response.send(res);
  } catch (error) {
      console.log('error create user -> ', error);
      response.send(res);
  }


});

export const setClaim = onRequest({cors: true}, async (request, response) => {
  console.log(' setClaim  -> ', request.body);
  // validaciones
  const body:  ModelsFunctions.RequestSetRol = request.body;
  const roles = body.roles;
  const uid = body.uid
  const claims = {
    roles: roles,
  }
  await auth.setCustomUserClaims(uid, claims);
  console.log('set claim con éxito');

  response.send({ok: true})
})

export const appCall = onCall(async (request) => {
  console.log('user ->', request.auth);
  let valid = false;
  valid = await isRol(request.auth.uid, ['admin']);

  if(valid){
    console.log('hacer la funcion');
  }
})

export const isRol = async ( uid : string, roles : string[]) =>{
  const doc = await firestore.doc(`Users/${uid}`).get();
  let valid = false;
  if (doc.exists) {
    const data : any = doc.data();
    roles.every( rol =>{
      if (data.roles[rol] == true) {
        valid = true;
        return false;
      }
      return true;
    })

  }
  return valid;

}

// esqueleto de function
export const functionName = onRequest(async (request, response) =>{
  logger.info("Hello logs!", {structuredData: true});
});
