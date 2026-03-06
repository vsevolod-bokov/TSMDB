import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBxSytFQ0MKYZbGRRUlNLRiJFN3id0l1nY",
  authDomain: "tsmdb-e8988.firebaseapp.com",
  projectId: "tsmdb-e8988",
  storageBucket: "tsmdb-e8988.firebasestorage.app",
  messagingSenderId: "318863662585",
  appId: "1:318863662585:web:bcf921a9bdda25ea51b128",
  measurementId: "G-3JCW2122YT",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
