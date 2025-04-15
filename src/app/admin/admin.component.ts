import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
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
  etat = '';

  constructor(private firebaseservice: FirebaseService, private router: Router) {}

  ngOnInit() {
    // Vérifier si l'utilisateur est un administrateur
    this.firebaseservice.getCurrentUser().subscribe((user: any) => {
      if (user.level > 2) {
        this.isadmin = true;
        this.loadUsers();
      } else {
        this.isadmin = false;
      }
    });
    this.loadHistory();
  }

  Valider_Inscription(mail: string) {
    console.log('Valider_Inscription');
    this.firebaseservice.addLevel(mail).then(() => {
      this.firebaseservice.envoyer_mail(mail);
      this.loadUsers();
    }).catch(error => {
      console.error('Erreur lors de la validation de l\'inscription :', error);
    });
  }

  ModifierProfil(mail: string) {
    console.log('ModifierProfil');
    this.router.navigate(['/mon-profil'], { queryParams: { user: mail } });
  }

  changeLevel(user: any, nombre: number) {
    // Calculer le nouveau niveau
    let newLevel = user.level + nombre;
    if (newLevel < 0) {
      newLevel = 0;
    }
    user.level = newLevel;
    this.firebaseservice.updateUser(user).then(() => {
      console.log(`Niveau de l'utilisateur ${user.mail} mis à jour.`);
    }).catch(error => {
      console.error('Erreur lors de la mise à jour du niveau :', error);
    });
  }

  async loadUsers() {
    try {
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
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs :', error);
    }
  }

  async loadHistory() {
    try {
      this.history_logs = await this.firebaseservice.getHistory_logs();
      this.history_logs.forEach(history_log => {
        history_log.name = history_log.pseudo || 'Inconnu';
        history_log.temps = history_log.temps.toDate(); // Convertir le timestamp Firestore en date
      });
      console.log('Historique des connexions chargé :', this.history_logs);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique :', error);
    }
  }

  EffacerHistorique() {
    this.firebaseservice.EffacerHistorique().then(() => {
      console.log('Historique effacé.');
      this.loadHistory(); // Recharger l'historique après suppression
    }).catch(error => {
      console.error('Erreur lors de l\'effacement de l\'historique :', error);
    });
  }
}
