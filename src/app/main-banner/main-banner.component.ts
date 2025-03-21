import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importer RouterModule
import { FirebaseService } from '../firebase.service';
import { CommonModule } from '@angular/common'; // Importer CommonModule
import { Subscription } from 'rxjs'; // Importer Subscription pour gérer les abonnements

@Component({
  selector: 'app-main-banner',
  standalone: true, // Permet d'utiliser directement les modules dans imports
  imports: [RouterModule, CommonModule],
  templateUrl: './main-banner.component.html',
  styleUrls: ['../../assets/styles.css', './main-banner.component.css']
})
export class MainBannerComponent implements OnInit, OnDestroy {
  est_connecter: boolean = false;
  statut: string = '❓';
  isBannerVisible: boolean = false;
  nom_utilisateur: string = 'Inconnu';
  private subscriptions: Subscription = new Subscription(); // Stocker les abonnements

  constructor(private firebaseservice: FirebaseService) {}

  ngOnInit() {
    // S'abonner au statut de connexion
    this.subscriptions.add(
      this.firebaseservice.est_connecter$.subscribe(est_connecter => {
        this.est_connecter = est_connecter;
        console.log('Statut de la connexion:', this.est_connecter);
        if (this.est_connecter) {
          this.statut = '✅';
          this.subscriptions.add(
            this.firebaseservice.getCurrentUser().subscribe((user) => {
              this.nom_utilisateur = user?.name || '';
            })
          );
        } else {
          this.statut = '❌';
          this.nom_utilisateur = 'Inconnu';
        }
      })
    );
  }

  deconnexion() {
    this.firebaseservice.deconnexion(); // Déconnecter l'utilisateur
  }

  toggleBanner() {
    this.isBannerVisible = !this.isBannerVisible; // Bascule la visibilité de la bannière
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe(); // Désabonnement pour éviter les fuites mémoire
  }
}
