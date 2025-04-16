import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Router, ActivatedRoute } from '@angular/router';  // Import ActivatedRoute
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { ModifPhotoComponent } from '../modif-photo/modif-photo.component';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profil',
  imports: [CommonModule, ModifPhotoComponent,FormsModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css', '../../assets/styles.css']
})
export class ProfilComponent implements OnInit, OnDestroy {
  @Input() userEmail: string | null = null; // Email de l'utilisateur à afficher
  @Input() userData: any = null; // Données de l'utilisateur à afficher
  isEditingPhoto: boolean = false;
  @Input() UserId!: string | null;
  private unsubscribe$ = new Subject<void>();  // Pour gérer l'abonnement aux observables
  isSocialMode: boolean = false;  // Variable pour différencier les vues
  isEditingProfil: boolean = false;
  editableUser: any = {};

  constructor(
    private firebaseService: FirebaseService, 
    private router: Router, 
    private route: ActivatedRoute  // Injection de ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe(urlSegments => {
      this.isSocialMode = urlSegments.some(segment => segment.path === 'social');
    });

    if (this.UserId) {
      // Mode "social": afficher l'utilisateur par ID
      this.firebaseService.getUserById(this.UserId).then(user => {
        this.userData = user;
        console.log('Utilisateur chargé par ID :', this.userData);
      }).catch((error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur par ID :', error);
      });
    } else if (this.userEmail) {
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
      // Mode "profil": afficher l'utilisateur connecté
      this.firebaseService.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
        if (user) {
          this.userData = user;
          console.log('Utilisateur connecté chargé :', this.userData);
        }
      });
    }
  }

  ngOnDestroy(): void {
    // Se désabonner lors de la destruction du composant pour éviter les fuites de mémoire
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  toggleEditPhoto() {
    this.isEditingPhoto = !this.isEditingPhoto;
  }

  updatePhoto(newPhoto: string) {
    if (this.userData && newPhoto) {
      this.userData.photoURL = newPhoto;
      this.isEditingPhoto = false;
      this.firebaseService.updateProfilePhoto(this.userData.mail, newPhoto).then(() => {
        console.log('Photo de profil mise à jour sur le serveur');
      }).catch((error) => {
        console.error('Erreur lors de la mise à jour de la photo de profil :', error);
      });
    }
  }

  editProfil() {
    this.isEditingProfil = true;
    this.editableUser = { ...this.userData }; // On copie les données de l'utilisateur
  }

  cancelEdit() {
    this.isEditingProfil = false;
    this.editableUser = {};
  }

  saveProfil(): void {
    console.log('Données utilisateur avant mise à jour :', this.editableUser); // Débogage

    if (!this.editableUser.mail) {
      console.error('Email utilisateur manquant pour la mise à jour.');
      return;
    }

    this.firebaseService.updateUser(this.editableUser).then((message) => {
      console.log(message); // Affiche le message de succès ou d'erreur retourné par `updateUser`
      this.isEditingProfil = false;
      this.userData = { ...this.editableUser }; // Mettre à jour les données locales
    }).catch(error => {
      console.error('Erreur lors de la mise à jour du profil :', error);
    });
  }

  deleteUser() {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce profil ?")) {
      if (this.userData && this.userData.mail) {
        this.firebaseService.deleteUserByEmail(this.userData.mail).then(() => {
          console.log(`Utilisateur ${this.userData.mail} supprimé avec succès.`);
            this.router.navigate(['/home']); // Redirige vers la page d'accueil
            window.location.reload(); // Recharge la page après suppression
        }).catch(error => {
          console.error(`Erreur lors de la suppression de l'utilisateur ${this.userData.mail} :`, error);
        });
      } else {
        console.error("Impossible de supprimer : email utilisateur introuvable.");
      }
    }
  }

  increaseLevel() {
    if (this.userData) {
      const currentPoints = this.userData.points || 0; // Points actuels de l'utilisateur
      const currentLevel = this.userData.level || 0; // Niveau actuel de l'utilisateur

      // Vérifier les conditions pour augmenter le niveau
      if (currentLevel === 0 && currentPoints >= 3) {
        this.firebaseService.addLevel(this.userData.mail).then(() => {
          this.userData.level = 1; // Passer au niveau 1
          console.log('Niveau augmenté à 1.');
        }).catch((error) => console.error('Erreur lors de l\'augmentation au niveau 1 :', error));
      } else if (currentLevel === 1 && currentPoints >= 7) {
        this.firebaseService.addLevel(this.userData.mail).then(() => {
          this.userData.level = 2; // Passer au niveau 2
          console.log('Niveau augmenté à 2.');
        }).catch((error) => console.error('Erreur lors de l\'augmentation au niveau 2 :', error));
      } else if (currentLevel === 2 && currentPoints >= 13) {
        this.firebaseService.addLevel(this.userData.mail).then(() => {
          this.userData.level = 3; // Passer au niveau 3
          console.log('Niveau augmenté à 3.');
        }).catch((error) => console.error('Erreur lors de l\'augmentation au niveau 3 :', error));
      } else {
        console.log('Conditions non remplies pour augmenter le niveau.');
      }
    } else {
      console.error('Données utilisateur non disponibles.');
    }
  }
}


