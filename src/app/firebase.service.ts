import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
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
  async addUser(user: any): Promise<String> {
    try {
      if (!user.mail || !user.password || !user.date_de_naissance || !user.name || !user.sexe || !user.categorie) {
        return "Tous les champs doivent être remplis";
      }
      if (!user.mail.endsWith('@gmail.com')) {
        return "L'email doit se terminer par @gmail.com";
      }
      if (user.mail.length > 16) {
        return "L'email ne doit pas dépasser 16 caractères";
      }
      if (user.password.length < 4 || user.password.length > 8) {
        return "Le mot de passe doit comporter entre 4 et 8 caractères";
      }
      if (user.name.length > 8) {
        return "Le nom ne doit pas dépasser 8 caractères";
      }
      const sqlInjectionPattern = /['";\-]/;
      if (sqlInjectionPattern.test(user.mail) || sqlInjectionPattern.test(user.password) || sqlInjectionPattern.test(user.name)) {
        return "Les champs ne doivent pas contenir de caractères spéciaux";
      }
      const q = query(collection(this.db, 'user'), where('mail', '==', user.mail));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return `L'email ${user.mail} existe déjà dans la base de données`;
      }
      const birthDate = new Date(user.date_de_naissance);
      const today = new Date();
      if (birthDate >= today) {
        return "La date de naissance doit être antérieure à aujourd'hui";
      }
      const docRef = await addDoc(collection(this.db, "user"), user);
      return `${user.name} fait son entrée !😀`;
    } catch (e) {
      console.error("Erreur d'ajout de l'utilisateur : ", e);
      return "Erreur d'ajout de l'utilisateur";
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
      const q = query(collection(this.db, 'user'), where('mail', '==', mail), where('password', '==', password));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        await updateDoc(querySnapshot.docs[0].ref, { points: (userData['points'] || 0) + 1 });
        this.est_connecter.next(true);
        this.lastLoggedInEmail = mail;
        this.loadUser();
        return true;
      }
      return false;
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
   * Mettre à jour les informations de l'utilisateur
   * @param updatedUser - Les nouvelles informations de l'utilisateur
   * @returns Promise<void>
   */
  async updateUser(updatedUser: any): Promise<void> {
    const userId = await this.getCurrentUserID();
    if (!userId) {
      console.log("Impossible de mettre à jour l'utilisateur car l'ID est introuvable");
      return;
    }
    const userDocRef = doc(this.db, 'user', userId);
    await updateDoc(userDocRef, updatedUser);
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
  async deleteUser(): Promise<void> {
    const userId = await this.getCurrentUserID();
    if (!userId) {
      console.log("Impossible de supprimer l'utilisateur car l'ID est introuvable");
      return;
    }
    const userDocRef = doc(this.db, 'user', userId);
    await deleteDoc(userDocRef);
    this.deconnexion(); // Déconnecter l'utilisateur après suppression
    console.log("Utilisateur supprimé avec succès");
  }
}
