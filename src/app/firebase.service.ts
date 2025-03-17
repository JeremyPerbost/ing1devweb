import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, query, where, getDocs} from 'firebase/firestore';  // Importer les fonctions Firestore


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
  async authenticateUser(mail: string, password: string): Promise<boolean> {
    try {
      // Créer une requête pour rechercher un utilisateur par mail et mot de passe
      const q = query(
        collection(this.db, 'user'),
        where('mail', '==', mail),
        where('password', '==', password)
      );
      
      const querySnapshot = await getDocs(q);

      // Si un utilisateur est trouvé, la connexion est réussie
      if (!querySnapshot.empty) {
        console.log('Utilisateur trouvé');
        return true;  // Connexion réussie
      } else {
        console.log('Utilisateur non trouvé');
        return false; // Identifiants incorrects
      }
    } catch (e) {
      console.error('Erreur d\'authentification :', e);
      return false;
    }
  }
}
