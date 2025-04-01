import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import emailjs from 'emailjs-com';
import { v4 as uuidv4 } from 'uuid';  // Importer uuid pour générer des tokens uniques
import { Timestamp } from 'firebase/firestore';
import { mailService } from './mail.service';
import { userService } from './user.service';
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

  constructor(
    public mailService: mailService,
    public userService: userService
  ) {}
  async authenticateUser(mail: string, password: string): Promise<boolean> {
    return this.userService.authenticateUser(mail, password);
  }

  async updateProfilePhoto(userId: string, photoURL: string): Promise<void> {
    return this.userService.updateProfilePhoto(userId, photoURL);
  }

  async updateUser(updatedUser: any): Promise<string> {
    return this.userService.updateUser(updatedUser);
  }

  async deleteUser(): Promise<void> {
    return this.userService.deleteUser();
  }

  async getHistory_logs(): Promise<any[]> {
    return this.userService.getHistory_logs();
  }

  async EffacerHistorique(): Promise<void> {
    return this.userService.EffacerHistorique();
  }

  async addLevel(mail: string, number: number): Promise<void> {
    return this.userService.addLevel(mail, number);
  }
  async reinitialiser_progression(mail: string): Promise<void>{
    return this.userService.reinitialiser_progression(mail);
  }
  async incrementLevelByToken(token: string): Promise<boolean> {
    return this.userService.incrementLevelByToken(token);
  }

  async getUsersWithLevelLessThanOrEqualTo(level: number): Promise<any[]> {
    return this.userService.getUsersWithLevelLessThanOrEqualTo(level);
  }

  async storeToken(email: string, token: string): Promise<void> {
    return this.mailService.storeToken(email, token);
  }

  getUserByMail(mail: string): Observable<any> {
    return this.mailService.getUserByMail(mail);
  }

  envoyer_mail(email: any): void {
    return this.mailService.envoyer_mail(email);
  }

  async loadUser(): Promise<void> {
    return this.userService.loadUser();
  }

  getCurrentUser(): Observable<any | null> {
    return this.userService.getCurrentUser();
  }

  async addUser(user: any): Promise<String> {
    return this.userService.addUser(user);
  }

  async logUserHistory(userData: any, eventType: 'connexion' | 'déconnexion'): Promise<void> {
    return this.userService.logUserHistory(userData, eventType);
  }

  async getCurrentUserID(): Promise<string | null> {
    return this.userService.getCurrentUserID();
  }

  async deconnexion(): Promise<void> {
    return this.userService.deconnexion();
  }
}
