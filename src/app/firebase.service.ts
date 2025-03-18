import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';  // Importer les fonctions Firestore
import { BehaviorSubject } from 'rxjs';  // Importer BehaviorSubject pour suivre l'état de la connexion

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private db = getFirestore();  // Initialiser Firestore
  private est_connecter = new BehaviorSubject<boolean>(false);  // Valeur initiale : l'utilisateur est déconnecté
  est_connecter$ = this.est_connecter.asObservable();  // Observable pour les composants abonnés

  constructor() { }

  /**
   * Ajouter un utilisateur dans Firestore
   * @param user - Les informations de l'utilisateur à ajouter
   */
  async addUser(user: any): Promise<void> {
    try {
      const docRef = await addDoc(collection(this.db, "user"), user); // Ajouter un utilisateur dans la collection "user"
      console.log("Utilisateur ajouté avec l'ID: ", docRef.id);
    } catch (e) {
      console.error("Erreur d'ajout de l'utilisateur : ", e);
    }
  }

  /**
   * Authentifier un utilisateur en vérifiant le mail et le mot de passe
   * @param mail - L'email de l'utilisateur
   * @param password - Le mot de passe de l'utilisateur
   * @returns Promise<boolean> - Retourne true si la connexion réussie, false sinon
   */
  async authenticateUser(mail: string, password: string): Promise<boolean> {
    try {
      // Créer une requête pour rechercher un utilisateur par mail et mot de passe
      const q = query(
        collection(this.db, 'user'),
        where('mail', '==', mail),
        where('password', '==', password)
      );

      const querySnapshot = await getDocs(q);  // Exécuter la requête pour vérifier si l'utilisateur existe

      if (!querySnapshot.empty) {
        console.log('Utilisateur trouvé');
        this.est_connecter.next(true);  // L'utilisateur est authentifié
        return true;  // Connexion réussie
      } else {
        console.log('Utilisateur non trouvé');
        return false;  // Identifiants incorrects
      }
    } catch (e) {
      console.error('Erreur d\'authentification :', e);
      return false;  // En cas d'erreur, la connexion échoue
    }
  }
  /**
   * Déconnecter l'utilisateur
   */
  deconnexion(): void {
    this.est_connecter.next(false);  // L'utilisateur est déconnecté
  }
}
