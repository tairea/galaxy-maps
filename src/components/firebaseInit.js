import firebase from 'firebase'
import 'firebase/firestore'

var firebaseConfig = {
    apiKey: "AIzaSyCuN2vNnRUqBafh3I8n7YRx_kxTNRQNHcQ",
    authDomain: "tw-galaxy.firebaseapp.com",
    databaseURL: "https://tw-galaxy.firebaseio.com",
    projectId: "tw-galaxy",
    storageBucket: "tw-galaxy.appspot.com",
    messagingSenderId: "662633443276",
    appId: "1:662633443276:web:63b942c9ae5b4ba737b769",
    measurementId: "G-S79M8DY995"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig)
export const db = firebaseApp.firestore()
export const studentsDb = db.collection("students");