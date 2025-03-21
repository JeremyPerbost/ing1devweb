import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importer RouterModule
import { FirebaseService } from '../firebase.service';
import { CommonModule } from '@angular/common'; // Importer CommonModule
import { Subscription } from 'rxjs';
import { ModifPhotoComponent } from "../modif-photo/modif-photo.component"; // Importer Subscription pour gérer les abonnements

@Component({
  selector: 'app-main-banner',
  standalone: true, // Permet d'utiliser directement les modules dans imports
  imports: [RouterModule, CommonModule, ModifPhotoComponent],
  templateUrl: './main-banner.component.html',
  styleUrls: ['../../assets/styles.css', './main-banner.component.css']
})
export class MainBannerComponent implements OnInit, OnDestroy {
  est_connecter: boolean = false;
  statut: string = '❓';
  isBannerVisible: boolean = false;
  nom_utilisateur: string = 'Inconnu';
  private subscriptions: Subscription = new Subscription(); // Stocker les abonnements
  photoURL: string = '../../assets/img/avatars/avatar_default.png'; // URL de la photo de profil

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
              this.photoURL = user?.photoURL || this.photoURL;
            })
          );
        } else {
          this.statut = '❌';
          this.nom_utilisateur = 'Inconnu';
          this.photoURL = '../../assets/img/avatars/avatar_default.png';
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
