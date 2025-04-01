import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import emailjs from 'emailjs-com';
import { v4 as uuidv4 } from 'uuid';  // Importer uuid pour générer des tokens uniques
import { Timestamp } from 'firebase/firestore';
@Injectable({
    providedIn: 'root'
})
export class userService{
    private db = getFirestore();  // Initialisation de Firestore

    private est_connecter = new BehaviorSubject<boolean>(false); // État de connexion
    private userSubject = new BehaviorSubject<any | null>(null); // Données utilisateur
  
    user$ = this.userSubject.asObservable(); // Observable pour l'utilisateur
    est_connecter$ = this.est_connecter.asObservable(); // Observable pour l'état de connexion
  
    private lastLoggedInEmail: string | null = null; // Stockage du dernier email connecté
  
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
    getCurrentUser() {
        return this.user$;
    }   
    async addUser(user: any): Promise<String> {
        try {
          if (!user.mail || !user.password || !user.date_de_naissance || !user.name || !user.sexe || !user.categorie) {
            return "Tous les champs doivent être remplis";
          }
          if (!user.mail.endsWith('@gmail.com')) {
            return "L'email doit se terminer par @gmail.com";
          }
          if (user.mail.length > 30) {
            return "L'email ne doit pas dépasser 30 caractères";
          }
          if (user.password.length < 4 || user.password.length > 30) {
            return "Le mot de passe doit comporter entre 4 et 30 caractères";
          }
          if (user.name.length > 30) {
            return "Le nom ne doit pas dépasser 30 caractères";
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
    async authenticateUser(mail: string, password: string): Promise<boolean> {
        try {
            const q = query(collection(this.db, 'user'), where('mail', '==', mail), where('password', '==', password));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            await this.logUserHistory(userData, 'connexion');
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
    async updateProfilePhoto(userId: string, photoURL: string): Promise<void> {
        const userDocRef = doc(this.db, 'user', userId);
        await updateDoc(userDocRef, { photoURL: photoURL });
    }
    async updateUser(updatedUser: any): Promise<string> {
        try {
          if (!updatedUser.mail || !updatedUser.password || !updatedUser.date_de_naissance || !updatedUser.name || !updatedUser.sexe || !updatedUser.categorie) {
            return "Tous les champs doivent être remplis";
          }
          if (!updatedUser.mail.endsWith('@gmail.com')) {
            return "L'email doit se terminer par @gmail.com";
          }
          if (updatedUser.mail.length > 30) {
            return "L'email ne doit pas dépasser 30 caractères";
          }
          if (updatedUser.password.length < 4 || updatedUser.password.length > 30) {
            return "Le mot de passe doit comporter entre 4 et 30 caractères";
          }
          if (updatedUser.name.length > 30) {
            return "Le nom ne doit pas dépasser 30 caractères";
          }
          const sqlInjectionPattern = /['";\-]/;
          if (sqlInjectionPattern.test(updatedUser.mail) || sqlInjectionPattern.test(updatedUser.password) || sqlInjectionPattern.test(updatedUser.name)) {
            return "Les champs ne doivent pas contenir de caractères spéciaux";
          }
          const birthDate = new Date(updatedUser.date_de_naissance);
          const today = new Date();
          if (birthDate >= today) {
            return "La date de naissance doit être antérieure à aujourd'hui";
          }
          const q = query(collection(this.db, 'user'), where('mail', '==', updatedUser.mail));
          const querySnapshot = await getDocs(q);
          if (querySnapshot.empty) {
            return "Utilisateur non trouvé";
          }
          const userDocRef = querySnapshot.docs[0].ref;
          await updateDoc(userDocRef, updatedUser);
          return "Utilisateur mis à jour avec succès";
        } catch (e) {
          console.error("Erreur de mise à jour de l'utilisateur : ", e);
          return "Erreur de mise à jour de l'utilisateur";
        }
      }
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
    async logUserHistory(userData: any, eventType: 'connexion' | 'déconnexion'): Promise<void> {
        try {
          const db = getFirestore();
          const historiqueData = {
            temps: Timestamp.now(),  // Horodatage de l'événement
            mail: userData.mail,   // L'email de l'utilisateur
            pseudo: userData.name || 'Inconnu',  // Pseudo de l'utilisateur
            type: eventType,  // Type d'événement, soit 'connexion' soit 'déconnexion'
          };
          await addDoc(collection(db, 'historique'), historiqueData);
          console.log(`Historique de ${eventType} ajouté avec succès.`);
        } catch (error) {
          console.error(`Erreur lors de l'enregistrement de l'historique de ${eventType} :`, error);
        }
    }
    async getHistory_logs(): Promise<any[]> {
        const q = query(collection(this.db, 'historique'));
        const querySnapshot = await getDocs(q);
        const historiques = querySnapshot.docs.map(doc => doc.data());
        return historiques;
    }
    async EffacerHistorique() {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, 'historique')); // Récupère tous les documents de la collection 'historique'
            querySnapshot.forEach(async (docSnap) => {
            await deleteDoc(doc(db, 'historique', docSnap.id)); // Supprime le document de la collection
        });
        console.log("Historique effacé avec succès.");
    }
    async addLevel(mail: string, number: number): Promise<void> {
        if (!mail) {
            console.error("Erreur : l'email fourni est invalide");
            return;
        }
        try {
            const q = query(collection(this.db, 'user'), where('mail', '==', mail));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
            const userDocRef = querySnapshot.docs[0].ref;
            const userData = querySnapshot.docs[0].data();
            const currentLevel = userData['level'] !== undefined ? userData['level'] : 0;
            await updateDoc(userDocRef, { level: currentLevel + number });
            console.log(`Niveau de l'utilisateur ${mail} augmenté de ${number}`);
            } else {
            console.log(`Utilisateur avec l'email ${mail} non trouvé`);
            }
        } catch (e) {
            console.error("Erreur lors de l'augmentation du niveau de l'utilisateur :", e);
        }
    }
    async reinitialiser_progression(mail: string): Promise<void> {
      if (!mail) {
        console.error("Erreur : l'email fourni est invalide");
        return;
      }
      try {
        const q = query(collection(this.db, 'user'), where('mail', '==', mail));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDocRef = querySnapshot.docs[0].ref;
          await updateDoc(userDocRef, { level: 0, points: 0 });
          console.log(`Progression de l'utilisateur ${mail} réinitialisée.`);
        } else {
          console.log(`Utilisateur avec l'email ${mail} non trouvé.`);
        }
      } catch (e) {
        console.error("Erreur lors de la réinitialisation de la progression :", e);
      }
    }
    async getUsersWithLevelLessThanOrEqualTo(level: number): Promise<any[]> {
        const q = query(collection(this.db, 'user'), where('level', '<=', level));
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map(doc => doc.data());
        return users;
    }
    
    async incrementLevelByToken(token: string): Promise<boolean> {
        try {
            // Rechercher l'utilisateur par token
            const q = query(collection(this.db, 'user'), where('token', '==', token));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
            const userDocRef = querySnapshot.docs[0].ref;
            const userData = querySnapshot.docs[0].data();
            
            // Vérifier si le token a déjà été utilisé
            if (userData['tokenUsed']) {
                return false;  // Le token a déjà été utilisé
            }
            // Incrémenter le niveau de l'utilisateur
            const currentLevel = userData['level'] || 0;
            await updateDoc(userDocRef, { level: currentLevel + 1, tokenUsed: true });

            console.log(`Niveau de l'utilisateur ${userData['mail']} augmenté.`);
            return true;
            } else {
            return false;  // Le token est invalide
            }
        } catch (error) {
            console.error('Erreur lors de l\'incrémentation du niveau :', error);
            return false;
        }
    }
    deconnexion(): void {
        this.logUserHistory(this.userSubject.value, 'déconnexion');
        this.est_connecter.next(false);
        this.userSubject.next(null); // Réinitialiser les infos utilisateur
        this.lastLoggedInEmail = null; // Supprimer l'email stocké
        console.log("Utilisateur déconnecté");
    }
}