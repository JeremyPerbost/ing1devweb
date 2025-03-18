import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importer RouterModule
import { FirebaseService } from '../firebase.service';
import { CommonModule } from '@angular/common'; // Importer CommonModule
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-main-banner',
  imports: [RouterModule, CommonModule, AngularFireModule],
  templateUrl: './main-banner.component.html',
  styleUrls: ['../../assets/styles.css', './main-banner.component.css']
})
export class MainBannerComponent implements OnInit {
  est_connecter: boolean = false;
  statut: string='❓';
  isBannerVisible: boolean = false;
  nom_utilisateur: string='';
  constructor(private firebaseservice: FirebaseService, private afAuth: AngularFireAuth) {}

  ngOnInit() {
    // S'abonner au statut de connexion
    this.firebaseservice.est_connecter$.subscribe(est_connecter => {
      this.est_connecter = est_connecter;
      console.log('Statut de la connexion:', this.est_connecter);  // Vérification de l'état de la connexion
      if(this.est_connecter==true){
        this.statut='✅';

      }else{
        this.statut='❌';
      }
    });
  }
  deconnexion() {
    this.firebaseservice.deconnexion();  // Déconnecter l'utilisateur
  }
  toggleBanner() {
    this.isBannerVisible = !this.isBannerVisible;  // Bascule la visibilité de la bannière
  }
}