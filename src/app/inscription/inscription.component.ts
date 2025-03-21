import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importer RouterModule
import { FirebaseService } from '../firebase.service';
import { FormsModule } from '@angular/forms';
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { ConnexionComponent } from "../connexion/connexion.component";  // Ajouter cet import
@Component({
  selector: 'app-inscription',
  imports: [RouterModule, FormsModule, MainBannerComponent, PiedDePageComponent, ConnexionComponent],
  templateUrl: './inscription.component.html',
  styleUrls: ['../../assets/styles.css', 'inscription.component.css']
})
export class InscriptionComponent {
  user= {
    name: '',
    mail: '',
    password: '',
    photoURL: '',
    categorie: '',
    date_de_naissance: '',
    sexe: '',
    level: -1,
    points: 0
  };
  erreur: String='';
  constructor(private firebaseService: FirebaseService){}
  onSubmit_inscription(): void{
    this.firebaseService.addUser(this.user).then((result: String) => {
      this.erreur = result;
      this.user = { name: '', mail: '', password: '', photoURL: '', categorie: '', date_de_naissance: '', sexe: '', level: -1, points: 0 };
      //level -1 = utilisateur pas encore vérifié par l'admin
    });
  }
}
