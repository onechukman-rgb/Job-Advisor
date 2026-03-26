import { initializeApp, getApps, FirebaseApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth"
import { getFirestore, Firestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyApVmD0PqmB8u5UtN68KijEFYA8vTdreLo",
  authDomain: "job-advisor-5cc72.firebaseapp.com",
  projectId: "job-advisor-5cc72",
  storageBucket: "job-advisor-5cc72.firebasestorage.app",
  messagingSenderId: "817195947661",
  appId: "1:817195947661:web:1441ac8ead51164e3934c4"
}

let app: FirebaseApp | undefined
let auth: Auth | undefined
let db: Firestore | undefined

function getFirebaseApp() {
  if (typeof window === "undefined") return undefined
  
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  }
  return app
}

export function getFirebaseAuth() {
  if (!auth) {
    const firebaseApp = getFirebaseApp()
    if (firebaseApp) {
      auth = getAuth(firebaseApp)
    }
  }
  return auth
}

export function getFirebaseDb() {
  if (!db) {
    const firebaseApp = getFirebaseApp()
    if (firebaseApp) {
      db = getFirestore(firebaseApp)
    }
  }
  return db
}

export const googleProvider = new GoogleAuthProvider()
