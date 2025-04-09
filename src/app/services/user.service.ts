import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class userService {
  private db = getFirestore();  // Initialisation de Firestore

  private est_connecter = new BehaviorSubject<boolean>(false); // État de connexion
  private userSubject = new BehaviorSubject<any | null>(null); // Données utilisateur

  user$ = this.userSubject.asObservable(); // Observable pour l'utilisateur
  est_connecter$ = this.est_connecter.asObservable(); // Observable pour l'état de connexion

  private lastLoggedInEmail: string | null = null; // Stockage du dernier email connecté

  // Méthode pour charger l'utilisateur connecté
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

  // Méthode pour obtenir l'utilisateur actuel
  getCurrentUser(): Observable<any | null> {
    return this.user$;
  }

  // Méthode pour ajouter un utilisateur
  async addUser(user: any): Promise<string> {
    try {
      // Validation des champs
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

      // Vérifier si l'email existe déjà
      const q = query(collection(this.db, 'user'), where('mail', '==', user.mail));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return `L'email ${user.mail} existe déjà dans la base de données`;
      }

      // Vérifier la date de naissance
      const birthDate = new Date(user.date_de_naissance);
      const today = new Date();
      if (birthDate >= today) {
        return "La date de naissance doit être antérieure à aujourd'hui";
      }

      // Ajouter l'utilisateur à Firestore
      const docRef = await addDoc(collection(this.db, "user"), user);
      return `${user.name} fait son entrée !😀`;
    } catch (e) {
      console.error("Erreur d'ajout de l'utilisateur : ", e);
      return "Erreur d'ajout de l'utilisateur";
    }
  }

  // Méthode pour authentifier un utilisateur
  async authenticateUser(mailOrPseudo: string, password: string): Promise<boolean> {
    try {
      let querySnapshot = await getDocs(query(
        collection(this.db, 'user'),
        where('mail', '==', mailOrPseudo),
        where('password', '==', password)
      ));

      if (querySnapshot.empty) {
        const qPseudo = query(
          collection(this.db, 'user'),
          where('name', '==', mailOrPseudo),
          where('password', '==', password)
        );
        querySnapshot = await getDocs(qPseudo);
      }

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        this.userSubject.next(userData); // Mettre à jour les données utilisateur
        this.est_connecter.next(true);
        console.log(this.est_connecter);// Mettre à jour l'état de connexion
        console.log('Utilisateur connecté :', userData);
        this.lastLoggedInEmail = userData['mail'];
        return true;
      }

      return false;
    } catch (e) {
      console.error('Erreur d\'authentification :', e);
      return false;
    }
  }

  // Méthode pour mettre à jour la photo de profil
  async updateProfilePhoto(userId: string, photoURL: string): Promise<void> {
    const userDocRef = doc(this.db, 'user', userId);
    await updateDoc(userDocRef, { photoURL: photoURL });
  }

  // Méthode pour mettre à jour un utilisateur
  async updateUser(updatedUser: any): Promise<string> {
    try {
      // Validation des champs
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

      // Vérifier si l'email existe
      const q = query(collection(this.db, 'user'), where('mail', '==', updatedUser.mail));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return "Utilisateur non trouvé";
      }

      // Mettre à jour les données utilisateur
      const userDocRef = querySnapshot.docs[0].ref;
      await updateDoc(userDocRef, updatedUser);
      return "Utilisateur mis à jour avec succès";
    } catch (e) {
      console.error("Erreur de mise à jour de l'utilisateur : ", e);
      return "Erreur de mise à jour de l'utilisateur";
    }
  }

  // Méthode pour obtenir l'ID de l'utilisateur connecté
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

  // Méthode pour supprimer un utilisateur
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

  // Méthode pour se déconnecter
  deconnexion(): void {
    this.est_connecter.next(false);
    this.userSubject.next(null); // Réinitialiser les infos utilisateur
    this.lastLoggedInEmail = null; // Supprimer l'email stocké
    console.log("Utilisateur déconnecté");
  }

  // Méthode pour gérer l'historique de l'utilisateur
  async logUserHistory(userData: any, eventType: 'connexion' | 'déconnexion'): Promise<void> {
    try {
      const historiqueData = {
        temps: Timestamp.now(),  // Horodatage de l'événement
        mail: userData.mail,   // L'email de l'utilisateur
        pseudo: userData.name || 'Inconnu',  // Pseudo de l'utilisateur
        type: eventType,  // Type d'événement, soit 'connexion' soit 'déconnexion'
      };
      await addDoc(collection(this.db, 'historique'), historiqueData);
      console.log(`Historique de ${eventType} ajouté avec succès.`);
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement de l'historique de ${eventType} :`, error);
    }
  }

  // Méthode pour obtenir l'historique des événements
  async getHistory_logs(): Promise<any[]> {
    const q = query(collection(this.db, 'historique'));
    const querySnapshot = await getDocs(q);
    const historiques = querySnapshot.docs.map(doc => doc.data());
    return historiques;
  }

  // Méthode pour effacer l'historique
  async EffacerHistorique() {
    const querySnapshot = await getDocs(collection(this.db, 'historique')); // Récupère tous les documents
    querySnapshot.forEach(async (docSnap) => {
      await deleteDoc(doc(this.db, 'historique', docSnap.id)); // Supprime chaque document
    });
    console.log("Historique effacé avec succès.");
  }

  // Méthode pour ajouter des niveaux à un utilisateur
  async addLevel(mail: string, number: number): Promise<void> {
    if (!mail) {
      console.error("Erreur : l'email fourni est invalide");
      return;
    }
    try {
      const q = query(collection(this.db, 'user'), where('mail', '==', mail));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userId = querySnapshot.docs[0].id;
        const userRef = doc(this.db, 'user', userId);
        const userDoc = querySnapshot.docs[0].data();
        const newLevel = userDoc['level'] + number; // Ajoute le niveau
        await updateDoc(userRef, { level: newLevel });
        console.log("Niveau ajouté avec succès ! Le niveau de l'utilisateur est maintenant " + newLevel);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du niveau :", error);
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
}
