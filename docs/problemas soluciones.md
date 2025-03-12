🛑 Problemas y Soluciones

❌ Problema: Error "FirebaseError: Missing or insufficient permissions" en Firestore.
✅ Solución: Configurar las reglas de Firestore adecuadamente:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /restaurants/{restaurantId} {
      allow read, write: if request.auth != null;
    }
  }
}

🔌 API y Endpoints