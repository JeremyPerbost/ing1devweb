import { Injectable } from '@angular/core';
import { FirebaseApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';  // Importer les fonctions Firestore


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private db = getFirestore();  // Initialiser Firestore

  constructor() { }

  async addUser(user: any){
    try{
      const docRef=await addDoc(collection(this.db, "user"), user);// Ajouter un utilisateur dans la collection "users"
      console.log("Utilisateur ajouté avec l'ID: ", docRef.id);
    }catch (e) {
      console.error("Erreur d'ajout de l'utilisateur : ", e);
    }
  }

}
