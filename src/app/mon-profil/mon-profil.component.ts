import { Component, OnInit } from '@angular/core';
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfilComponent } from "../profil/profil.component";

@Component({
  selector: 'app-mon-profil',
  imports: [MainBannerComponent, PiedDePageComponent, CommonModule, ProfilComponent],
  templateUrl: './mon-profil.component.html',
  styleUrls: ['../../assets/styles.css', 'mon-profil.component.css']
})
export class MonProfilComponent implements OnInit {
  userEmail: string | null = null; // Email de l'utilisateur à afficher

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Récupérer le paramètre 'user' depuis l'URL
    this.route.queryParams.subscribe(params => {
      this.userEmail = params['user'] || null; // Stocker l'email de l'utilisateur
      console.log('Email utilisateur à afficher :', this.userEmail);
    });
  }
}