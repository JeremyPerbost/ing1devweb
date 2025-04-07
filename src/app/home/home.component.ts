import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { AdminComponent } from "../admin/admin.component"; // Importer RouterModule
import { BarreRechercheComponent } from "../barre-recherche/barre-recherche.component";
import { GestionComponent } from "../gestion/gestion.component";
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../services/firebase.service';
@Component({
  selector: 'app-home',
  imports: [RouterModule, MainBannerComponent, PiedDePageComponent, AdminComponent, AdminComponent, BarreRechercheComponent, GestionComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: '../../assets/styles.css'
})
export class HomeComponent {
  constructor(private firebaseservice: FirebaseService, private router: Router) {}
  isvisiteur: boolean = false;
  users: any[] = [];

  ngOnInit() {
    // Vérifier si l'utilisateur est un visiteur sans prendre en compte la connexion
    this.firebaseservice.getCurrentUser().subscribe((user: any) => {
      if (user?.level > -1) {
      this.isvisiteur = false;
      } else {
      this.isvisiteur = true;
      }
    });
  }
}
