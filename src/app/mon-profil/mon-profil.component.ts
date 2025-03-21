import { Component } from '@angular/core';
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { FirebaseService } from '../firebase.service';
import { NgForm } from '@angular/forms';
import { NgModel } from '@angular/forms';
import{FormsModule} from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-mon-profil',
  imports: [MainBannerComponent, PiedDePageComponent, FormsModule],
  templateUrl: './mon-profil.component.html',
  styleUrls: ['../../assets/styles.css', 'mon-profil.component.css']
})
export class MonProfilComponent {
  //partie publique
  username: String = "Inconnu";
  usermail: String = "Inconnu";
  userdate_naissance: String = "Inconnu";
  usersexe: String = "Inconnu";
  usercategorie: String = "Inconnu";
  //partie privée
  userNom: String = "Inconnu";
  userPrenom: String = "Inconnu";
  userpassword: String= "Inconnu";
  erreur: any;
  constructor(private firebaseservice: FirebaseService, private router: Router) { }
  
  ngOnInit() {
    this.firebaseservice.getCurrentUser().subscribe((user) => {
      this.username = user?.name || '';
      this.usermail = user?.mail || '';
      this.userdate_naissance = user?.date_de_naissance || 0;
      this.usersexe = user?.sexe || '';
      this.usercategorie = user?.categorie || '';
      this.userNom = user?.nom || '';
      this.userPrenom = user?.prenom || '';
      this.userpassword = user?.password || '';
    })
    //si l'utilisateur n'est pas connecté : redirection vers /home
    this.firebaseservice.getCurrentUser().subscribe((user) => {
      if (user === null) {
        this.router.navigate(['/home']);
      }
    });
  }


  onSubmit() {
    const updatedUser = {
      name: this.username,
      mail: this.usermail,
      date_de_naissance: this.userdate_naissance,
      sexe: this.usersexe,
      categorie: this.usercategorie,
      nom: this.userNom,
      prenom: this.userPrenom,
      password: this.userpassword
    };
    this.firebaseservice.updateUser(updatedUser).then((result: String) => {
      this.erreur = result;
    });
  }
  onDeleteAccount() {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      this.firebaseservice.deleteUser().then(response => {
        console.log('User deleted successfully', response);
        this.router.navigate(['/home']);
      }).catch(error => {
        console.error('Error deleting user', error);
      });
    }
  }
}
