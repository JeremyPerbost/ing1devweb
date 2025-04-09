import { Component, OnInit } from '@angular/core';
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { FirebaseService } from '../services/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mon-profil',
  imports: [MainBannerComponent, PiedDePageComponent, FormsModule, CommonModule],
  templateUrl: './mon-profil.component.html',
  styleUrls: ['../../assets/styles.css', 'mon-profil.component.css']
})
export class MonProfilComponent implements OnInit {
  //partie publique
  username: string = "Inconnu";
  usermail: string = "Inconnu";
  userdate_naissance: string = "Inconnu";
  usersexe: string = "Inconnu";
  usercategorie: string = "Inconnu";
  //partie privée
  userNom: string = "Inconnu";
  userPrenom: string = "Inconnu";
  userpassword: string = "Inconnu";
  level: number=-66;
  points: number=-676;
  erreur: any;
  message_level: any;

  constructor(private firebaseservice: FirebaseService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const userMail = params['user'];  // Récupère le paramètre 'user' dans l'URL
      console.log("Paramètre user récupéré:", userMail); // Vérifier que l'email est bien récupéré
      
      if (userMail) {
        // Si un email est passé dans les paramètres, charger le profil de cet utilisateur
        this.loadUserProfile(userMail);
      } else {
        // Sinon, charger le profil de l'utilisateur actuel
        console.log("Chargement du profil actuel");
        this.loadCurrentUserProfile();
      }
    });
  }
  
  
  loadUserProfile(mail: string) {
    console.log(mail);
    this.firebaseservice.getUserByMail(mail).subscribe((user) => {
      this.username = user?.name || '';
      this.usermail = user?.mail || '';
      this.userdate_naissance = user?.date_de_naissance || '';
      this.usersexe = user?.sexe || '';
      this.usercategorie = user?.categorie || '';
      this.userNom = user?.nom || '';
      this.userPrenom = user?.prenom || '';
      this.userpassword = user?.password || '';
      this.level=user?.level|| 0;
      this.points=user?.points|| 0;
    });
    if (this.level==0) {
      this.message_level="debutant";
    }else if(this.level ==1){
      this.message_level="intermédiaire";
    }
    else if(this.level==2){
      this.message_level='avancé';
    }
    else if(this.level ==3){
      this.message_level='expert';
    }
  }
  reinitialiser_niveau(mail:string){
    this.loadUserProfile(this.usermail);
    this.firebaseservice.reinitialiser_progression(mail);
    this.loadUserProfile(this.usermail);
  }
  changer_niveau(mail: string, level: number) {
    if (this.points >= 3 && this.level === 0) {
      this.firebaseservice.addLevel(mail, level).then(() => {
        this.loadUserProfile(mail); // Recharger après mise à jour
      }).catch(() => {
        this.message_level = 'Erreur de mise à jour du niveau';
      });
    } else if (this.points >= 7 && this.level === 1) {
      this.firebaseservice.addLevel(mail, level).then(() => {
        this.loadUserProfile(mail); // Recharger après mise à jour
      }).catch(() => {
        this.message_level = 'Erreur de mise à jour du niveau';
      });
    } else if (this.points >= 13 && this.level === 2) {
      this.firebaseservice.addLevel(mail, level).then(() => {
        this.loadUserProfile(mail); // Recharger après mise à jour
      }).catch(() => {
        this.message_level = 'Erreur de mise à jour du niveau';
      });
    } else {
      this.message_level = 'Nombre de points insuffisants';
    }
  }
  
  loadCurrentUserProfile() {
    this.firebaseservice.getCurrentUser().subscribe((user) => {
      this.username = user?.name || '';
      this.usermail = user?.mail || '';
      this.userdate_naissance = user?.date_de_naissance || '';
      this.usersexe = user?.sexe || '';
      this.usercategorie = user?.categorie || '';
      this.userNom = user?.nom || '';
      this.userPrenom = user?.prenom || '';
      this.userpassword = user?.password || '';
      this.level=user?.level||0;
      this.points=user?.points||0;
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
  
    this.firebaseservice.updateUser(updatedUser).then((result: string) => {
      this.erreur = result;
      // Charger à nouveau les données après la mise à jour
      this.loadUserProfile(this.usermail);
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
