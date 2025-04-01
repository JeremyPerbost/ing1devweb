import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import emailjs from 'emailjs-com';
import { v4 as uuidv4 } from 'uuid';  // Importer uuid pour générer des tokens uniques
import { Timestamp } from 'firebase/firestore';
@Injectable({
    providedIn: 'root'
})
export class mailService{
  private db = getFirestore(inject(FirebaseApp));  // Injection de FirebaseApp
  async storeToken(email: string, token: string) {
        try {
          // Chercher l'utilisateur par email dans la base de données Firestore
          const q = query(collection(this.db, 'user'), where('mail', '==', email));
          const querySnapshot = await getDocs(q);
    
          if (!querySnapshot.empty) {
            const userDocRef = querySnapshot.docs[0].ref;
    
            // Ajouter le token dans Firestore sous l'utilisateur
            await updateDoc(userDocRef, {
              token: token,  // Token généré pour l'utilisateur
              tokenUsed: false  // Indiquer que ce token n'est pas encore utilisé
            });
    
            console.log(`Token pour l'utilisateur ${email} enregistré.`);
          } else {
            console.log(`Utilisateur avec l'email ${email} non trouvé`);
          }
        } catch (error) {
          console.error('Erreur lors de l\'enregistrement du token :', error);
        }
      }
    getUserByMail(mail: string): Observable<any> {
        const q = query(collection(this.db, 'user'), where('mail', '==', mail));
        return new Observable(observer => {
          getDocs(q).then(querySnapshot => {
            if (!querySnapshot.empty) {
              observer.next(querySnapshot.docs[0].data());
            } else {
              observer.next(null);
            }
            observer.complete();
          }).catch(error => {
            observer.error(error);
          });
        });
      }
    envoyer_mail(email: any) {
    const token = uuidv4();  // Générer un token unique pour chaque utilisateur
    const lien = `http://localhost:4200/increment-level?token=${token}`;  // Créer le lien unique avec le token
    
    // Stocker le token dans Firestore avec une propriété `used` initialisée à false
    this.storeToken(email, token);  // Une méthode qui enregistre ce token dans Firestore
    
    emailjs.send("service_p65hfb5", "template_a2t96in", {
        lien: lien,  // Lien contenant le token unique
        mail: email,
    }, 'H9gBdFM3Vx43S4MDN')  // Utilise ta clé publique ici
    .then((response) => {
        console.log('Email envoyé à :', email, 'réponse : ', response);
    })
    .catch((error) => {
        console.error('Erreur de l\'envoi du mail à :', email, 'réponse', error);
    });
    }
}