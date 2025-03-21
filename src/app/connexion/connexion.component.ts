import { Component } from '@angular/core';
import { Route, Router, RouterModule } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { FormsModule } from '@angular/forms';
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { InscriptionComponent } from "../inscription/inscription.component"; // Importer MainBannerComponent

@Component({
  selector: 'app-connexion',
  imports: [RouterModule, FormsModule, PiedDePageComponent],
  templateUrl: './connexion.component.html',
  styleUrls: ['../../assets/styles.css']
})
export class ConnexionComponent {
  user = {
    mail: '',
    password: ''
  };

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  async onSubmit_connexion(): Promise<void> {
    if (this.user.mail && this.user.password) {
      console.log('Tentative de connexion avec les informations suivantes :');
      console.log('Mail:', this.user.mail);
      console.log('Mot de passe:', this.user.password);

      // Appeler FirebaseService pour authentifier l'utilisateur
      const isAuthenticated = await this.firebaseService.authenticateUser(this.user.mail, this.user.password);

      if (isAuthenticated) {
        console.log('Connexion réussie');
        this.router.navigate(['/confirm-connexion']);
      } else {
        console.error('Identifiants incorrects');
        this.router.navigate(['/incorrect-connexion']);
        // Afficher un message d'erreur dans l'interface utilisateur
      }
    } else {
      console.error('Veuillez remplir tous les champs');
    }
  }
}
