import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private db = getFirestore();  // Initialisation de Firestore

  private est_connecter = new BehaviorSubject<boolean>(false); // État de connexion
  private userSubject = new BehaviorSubject<any | null>(null); // Données utilisateur

  user$ = this.userSubject.asObservable(); // Observable pour l'utilisateur
  est_connecter$ = this.est_connecter.asObservable(); // Observable pour l'état de connexion

  private lastLoggedInEmail: string | null = null; // Stockage du dernier email connecté

  constructor() {}

  /**
   * Charger l'utilisateur connecté depuis Firestore
   */
  async loadUser() {
    try {
      if (!this.est_connecter.value || !this.lastLoggedInEmail) {
        this.userSubject.next(null);
        return;
      }

      const q = query(collection(this.db, 'user'), where('mail', '==', this.lastLoggedInEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        console.log("Utilisateur connecté :", userData);
        this.userSubject.next(userData);
      } else {
        console.log("Utilisateur introuvable");
        this.userSubject.next(null);
      }
    } catch (e) {
      console.error("Erreur lors de la récupération de l'utilisateur :", e);
      this.userSubject.next(null);
    }
  }

  /**
   * Récupérer l'utilisateur en tant qu'Observable
   */
  getCurrentUser() {
    return this.user$;
  }

  /**
   * Ajouter un utilisateur dans Firestore
   * @param user - Informations de l'utilisateur à ajouter
   */
  async addUser(user: any): Promise<void> {
    try {
      const docRef = await addDoc(collection(this.db, "user"), user);
      console.log("Utilisateur ajouté avec l'ID: ", docRef.id);
    } catch (e) {
      console.error("Erreur d'ajout de l'utilisateur : ", e);
    }
  }

  /**
   * Authentifier un utilisateur en vérifiant le mail et le mot de passe
   * @param mail - Email de l'utilisateur
   * @param password - Mot de passe de l'utilisateur
   * @returns boolean - True si la connexion réussit, False sinon
   */
  async authenticateUser(mail: string, password: string): Promise<boolean> {
    try {
      const q = query(
        collection(this.db, 'user'),
        where('mail', '==', mail),
        where('password', '==', password)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log('Utilisateur trouvé');
        this.est_connecter.next(true);
        this.lastLoggedInEmail = mail; // Stocker l'email
        this.loadUser(); // Charger les infos utilisateur après connexion
        return true;
      } else {
        console.log('Utilisateur non trouvé');
        return false;
      }
    } catch (e) {
      console.error('Erreur d\'authentification :', e);
      return false;
    }
  }

  /**
   * Mettre à jour la photo de profil de l'utilisateur
   * @param userId - L'ID de l'utilisateur
   * @param photoURL - L'URL de la nouvelle photo de profil
   * @returns Promise<void>
   */
  async updateProfilePhoto(userId: string, photoURL: string): Promise<void> {
    const userDocRef = doc(this.db, 'user', userId);
    await updateDoc(userDocRef, { photoURL: photoURL });
  }

  /**
   * Déconnecter l'utilisateur
   */
  deconnexion(): void {
    this.est_connecter.next(false);
    this.userSubject.next(null); // Réinitialiser les infos utilisateur
    this.lastLoggedInEmail = null; // Supprimer l'email stocké
    console.log("Utilisateur déconnecté");
  }

  /**
   * Récupérer l'ID de l'utilisateur connecté en utilisant son email
   * @returns Promise<string | null> - L'ID de l'utilisateur ou null si non trouvé
   */
  async getCurrentUserID(): Promise<string | null> {
    if (!this.lastLoggedInEmail) {
      console.log("Aucun email d'utilisateur connecté trouvé");
      return null;
    }

    const q = query(collection(this.db, 'user'), where('mail', '==', this.lastLoggedInEmail));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userId = querySnapshot.docs[0].id;
      console.log("ID de l'utilisateur connecté :", userId);
      return userId;
    } else {
      console.log("Utilisateur non trouvé avec l'email :", this.lastLoggedInEmail);
      return null;
    }
  }
}
