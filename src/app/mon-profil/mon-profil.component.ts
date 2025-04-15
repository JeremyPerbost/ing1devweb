import { Component, OnInit } from '@angular/core';
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../firebase.service';
import { ProfilComponent } from "../profil/profil.component";

@Component({
  selector: 'app-mon-profil',
  imports: [MainBannerComponent, PiedDePageComponent, CommonModule, ProfilComponent],
  templateUrl: './mon-profil.component.html',
  styleUrls: ['../../assets/styles.css', 'mon-profil.component.css']
})
export class MonProfilComponent implements OnInit {
  userEmail: string | null = null; // Email de l'utilisateur à afficher
  userData: any = null; // Données de l'utilisateur à afficher

  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userEmail = params['user'] || null; // Récupérer l'email depuis l'URL
      if (this.userEmail) {
        console.log('Chargement du profil pour :', this.userEmail);

        // Charger les informations de l'utilisateur spécifié par email
        this.firebaseService.getUserByMail(this.userEmail).subscribe({
          next: user => {
            this.userData = user;
            console.log('Utilisateur chargé par email :', this.userData);
          },
          error: error => {
            console.error('Erreur lors du chargement de l\'utilisateur par email :', error);
          }
        });
      } else {
        console.log('Aucun email spécifié. Chargement de l\'utilisateur connecté.');

        // Charger les informations de l'utilisateur connecté
        this.firebaseService.getCurrentUser().subscribe({
          next: user => {
            this.userData = user;
            console.log('Utilisateur connecté chargé :', this.userData);
          },
          error: error => {
            console.error('Erreur lors du chargement de l\'utilisateur connecté :', error);
          }
        });
      }
    });
  }
}