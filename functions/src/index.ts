/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onCall,onRequest,HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {ModelsFunctions} from "./models";
import {getAuth} from "firebase-admin/auth";
import {auth as authv1,analytics} from 'firebase-functions/v1';
import {onDocumentCreated} from "firebase-functions/v2/firestore";

initializeApp();

import {Users} from "./users";
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const firestore = getFirestore();
const auth = getAuth();

export const createUser = Users.createUser;
export const helloWorld = onRequest({cors: true}, async(request, response) =>  {
  logger.info("Hello logs!", {structuredData: true});
  const headers : any = request.headers;
  try {
    const token : string = headers.authorization.split(' ')[1];
    const tokenResult : any = await auth.verifyIdToken(token);
    console.log('tokenResult ->', tokenResult);
    if(tokenResult.roles?.admin){
      // const doc = await firestore.doc('path').get();
      // if(doc.exists){
        // logger.log('message ->', doc.data());
        // response.send({data: doc.data()})
        response.send({data: 'token recibido'})
      // }
    }

  } catch (error) {
    console.log(error)

  }
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


export const setRol = onRequest({cors: true}, async (request, response) =>{
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



export const setClaim2 = onRequest({cors: true}, async (request, response) => {
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

export const appCall = onCall({cors: true}, async (request) => {
  console.log('user ->', request.auth);
  let valid = false;
  valid = await isRol(request.auth.uid, ['admin']);

  if(valid){
    console.log('hacer la funcion');
  }
  throw new HttpsError("permission-denied", "no es admin");
})

export const setClaim = onCall({cors: true}, async (request) => {
  console.log('user ->', request.auth);
  let valid = false;
  const token: any = request.auth.token;
  if(token.roles){
    valid = token.roles.admin == true ? true : false
  }
  else{
    valid = await isRol(request.auth.uid, ['admin']);

  }
  if (valid) {
    console.log('hacer la funcions');
    const data : ModelsFunctions.RequestSetRol = request.data;
    const claims = {roles: data.roles};
    await auth.setCustomUserClaims(data.uid, claims);
    await firestore.doc(`Users/${data.uid}`).update(claims);
    console.log('set claims con exito');
    return {ok: true}
  }
  throw new HttpsError("permission-denied", 'no es admin')

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

export const sendWelcomeEmail = authv1.user().onCreate(user =>{

})

export const sendCouponOnPurchase = analytics.event('in_app_purchase').onLog((event) => {
  // ...

});

export const makeuppercase = onDocumentCreated("messages/{documentId}", (event) =>{
  const data : any = event.data.data();
  const text : string = data.text;

  logger.log("Uppercasing", event.params.documentId, text);

  const uppercase = text.toUpperCase();

  const updateData = {
    text: uppercase,
  }
  return event.data.ref.update(updateData);
});

// esqueleto de function
export const functionName = onRequest(async (request, response) =>{
  logger.info("Hello logs!", {structuredData: true});
});


