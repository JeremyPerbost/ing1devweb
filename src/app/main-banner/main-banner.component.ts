import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importer RouterModule
import { FirebaseService } from '../firebase.service';
import { CommonModule } from '@angular/common'; // Importer CommonModule

@Component({
  selector: 'app-main-banner',
  imports: [RouterModule, CommonModule],
  templateUrl: './main-banner.component.html',
  styleUrls: ['../../assets/styles.css', './main-banner.component.css']
})
export class MainBannerComponent implements OnInit {
  est_connecter: boolean = false;
  isBannerVisible: boolean = false;
  constructor(private firebaseservice: FirebaseService) {}

  ngOnInit() {
    // S'abonner au statut de connexion
    this.firebaseservice.est_connecter$.subscribe(est_connecter => {
      this.est_connecter = est_connecter;
      console.log('Statut de la connexion:', this.est_connecter);  // Vérification de l'état de la connexion
    });
  }

  deconnexion() {
    this.firebaseservice.deconnexion();  // Déconnecter l'utilisateur
  }
  toggleBanner() {
    this.isBannerVisible = !this.isBannerVisible;  // Bascule la visibilité de la bannière
  }
}