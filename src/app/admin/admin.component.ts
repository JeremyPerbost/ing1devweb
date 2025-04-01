import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css', '../../assets/styles.css']
})
export class AdminComponent implements OnInit {
  isadmin: boolean = false;
  users: any[] = [];
  history_logs: any[] = [];
  etat='';

  constructor(private firebaseservice: FirebaseService, private router: Router) {}

  ngOnInit() {
    // Vérifier si l'utilisateur est un administrateur
    this.firebaseservice.getCurrentUser().subscribe((user: any) => {
      if (user.level >= 3) {
        this.isadmin = true;
        this.loadUsers();
      } else {
        this.isadmin = false;
      }
    });
    this.loadHistory();
  }
  Valider_Inscription(mail: any, level: any) {
    console.log("Valider_Inscription");
    this.firebaseservice.addLevel(mail, 1);
    this.firebaseservice.envoyer_mail(mail);
    this.loadUsers();
  }

  ModifierProfil(mail: string) {
    console.log("ModifierProfil");
    this.router.navigate(['/profil'], { queryParams: { user: mail } });
  }
  changeLevel(user: any, nombre: number) {
    // Calculer le nouveau niveau
    let newLevel = user.level + nombre;
      if (newLevel < 0) {
      newLevel = 0;
    }
    user.level = newLevel;
    this.firebaseservice.updateUser(user);
  }
  
  async loadUsers() {
    this.users = await this.firebaseservice.getUsersWithLevelLessThanOrEqualTo(2);
    this.users.forEach(user => {
      if (user.level <= -2) {
        user.etat = 'en attente de validation';
      } else if (user.level == 0 || user.level == 1) {
        user.etat = 'utilisateur Simple';
      } else if (user.level == 2) {
        user.etat = 'utilisateur Complexe';
      } else if (user.level >= 3) {
        user.etat = 'Administrateur';
      } else if (user.level == -1) {
        user.etat = 'en attente de confirmation du mail';
      }
    });
  }
  async loadHistory() {
    console.log('Historique des connexions:', this.history_logs);
    this.history_logs = await this.firebaseservice.getHistory_logs();
    this.history_logs.forEach((history_log) => {
      history_log.name = history_log.pseudo || 'Inconnu';
      history_log.temps = history_log.temps.toDate(); 
    });
  }
  EffacerHistorique() {
    console.log("Effacer historique");
    this.firebaseservice.EffacerHistorique();
  }
  
  
}
