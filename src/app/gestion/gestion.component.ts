import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../services/firebase.service';
import { Firestore, collection, collectionData, deleteDoc, doc, query, where, getDocs, updateDoc } from '@angular/fire/firestore';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CreateObjectComponent } from "../create-object/create-object.component";
@Component({
  selector: 'app-gestion',
  standalone: true,
  imports: [CommonModule, RouterModule, CreateObjectComponent],
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css', '../../assets/styles.css']
})
export class GestionComponent {
  onConnectiviteChange(event: Event, objet: any): void {


    const target = event.target as HTMLSelectElement;
    const nouvelleConnectivite = target.value; // Récupérer la nouvelle connectivité sélectionnée
    const collectionRef = collection(this.firestore, 'objet-maison');
    const q = query(collectionRef, where('ID', '==', objet.ID)); // Rechercher par champ personnalisé 'ID'

    getDocs(q).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // Supposons qu'il n'y ait qu'un seul document avec cet ID
        const docRef = querySnapshot.docs[0].ref; // Récupérer la référence du document
        updateDoc(docRef, { Connectivite: nouvelleConnectivite }) // Mettre à jour la connectivité dans Firestore
          .then(() => {
            objet.Connectivite = nouvelleConnectivite; // Mettre à jour localement
            console.log(`Connectivité mise à jour avec succès pour ${objet.Nom} : ${nouvelleConnectivite}`);
          })
          .catch((error) => {
            console.error("Erreur lors de la mise à jour de la connectivité :", error);
          });
      } else {
        console.error("Aucun document trouvé avec l'ID :", objet.ID);
      }
    }).catch((error) => {
      console.error("Erreur lors de la récupération du document :", error);
    });
  }

  objets$: Observable<any[]> = new Observable(); // Initialisation avec une valeur par défaut
  constructor(private firestore: Firestore, private firebaseservice: FirebaseService, private router: Router) { }
  iscomplexe: boolean = false;
  issimple: boolean = false;
  users: any[] = [];

  onCouleurChange(event: Event, objet: any): void {
    const target = event.target as HTMLInputElement;
    const nouvelleCouleur = target.value; // Récupérer la nouvelle couleur sélectionnée
    const collectionRef = collection(this.firestore, 'objet-maison');
    const q = query(collectionRef, where('ID', '==', objet.ID)); // Rechercher par champ personnalisé 'ID'

    getDocs(q).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // Supposons qu'il n'y ait qu'un seul document avec cet ID
        const docRef = querySnapshot.docs[0].ref; // Récupérer la référence du document
        updateDoc(docRef, { Couleur: nouvelleCouleur }) // Mettre à jour la couleur dans Firestore
          .then(() => {
            objet.Couleur = nouvelleCouleur; // Mettre à jour localement
            console.log(`Couleur mise à jour avec succès pour ${objet.Nom} : ${nouvelleCouleur}`);
          })
          .catch((error) => {
            console.error("Erreur lors de la mise à jour de la couleur :", error);
          });
      } else {
        console.error("Aucun document trouvé avec l'ID :", objet.ID);
      }
    }).catch((error) => {
      console.error("Erreur lors de la récupération du document :", error);
    });
  }

  modifierLuminosite(objet: any, nouvelleLuminosite: number) {
    const collectionRef = collection(this.firestore, 'objet-maison');
    const q = query(collectionRef, where('ID', '==', objet.ID)); // Rechercher par champ personnalisé 'ID'

    getDocs(q).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // Supposons qu'il n'y ait qu'un seul document avec cet ID
        const docRef = querySnapshot.docs[0].ref; // Récupérer la référence du document
        updateDoc(docRef, { Luminosite: nouvelleLuminosite }) // Mettre à jour la luminosité dans Firestore
          .then(() => {
            objet.Luminosite = nouvelleLuminosite; // Mettre à jour localement
            console.log(`Luminosité mise à jour avec succès pour ${objet.Nom} : ${nouvelleLuminosite}`);
          })
          .catch((error) => {
            console.error("Erreur lors de la mise à jour de la luminosité :", error);
          });
      } else {
        console.error("Aucun document trouvé avec l'ID :", objet.ID);
      }
    }).catch((error) => {
      console.error("Erreur lors de la récupération du document :", error);
    });
  }

  onLuminositeChange(event: Event, objet: any): void {
    const target = event.target as HTMLInputElement;
    const nouvelleLuminosite = Number(target.value); // Convertir en nombre si nécessaire
    this.modifierLuminosite(objet, nouvelleLuminosite);
  }

  async connexion(objet: any) {
    const collectionRef = collection(this.firestore, 'objet-maison');
    const q = query(collectionRef, where('ID', '==', objet.ID)); // Rechercher par champ personnalisé 'ID'
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Supposons qu'il n'y ait qu'un seul document avec cet ID
        const docRef = querySnapshot.docs[0].ref; // Récupérer la référence du document
        const newConnexionStatus = objet.Connexion === "déconnecter" ? "connecter" : "déconnecter";
        await updateDoc(docRef, { Connexion: newConnexionStatus }); // Mettre à jour le champ Connexion
        objet.Connexion = newConnexionStatus; // Mettre à jour localement
        console.log("Connexion mise à jour avec succès :", objet.Nom, "nouveau statut :", newConnexionStatus);
      } else {
        console.error("Aucun document trouvé avec l'ID :", objet.ID);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la connexion :", error);
    }
  }
    
  async supprimer_objet(objet: any) {
    const collectionRef = collection(this.firestore, 'objet-maison');
    const q = query(collectionRef, where('ID', '==', objet.ID)); // Rechercher par champ personnalisé 'ID'
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Supposons qu'il n'y ait qu'un seul document avec cet ID
        const docRef = querySnapshot.docs[0].ref; // Récupérer la référence du document
        await deleteDoc(docRef); // Supprimer le document
        console.log("Objet supprimé avec succès :", objet.Nom, "de type", objet.Type, "avec ID", objet.ID);
      } else {
        console.error("Aucun document trouvé avec l'ID :", objet.ID);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'objet :", error);
    }
  }

  onResolutionChange(event: Event, objet: any): void {
    const target = event.target as HTMLSelectElement;
    const nouvelleResolution = target.value; // Récupérer la nouvelle résolution sélectionnée
    const collectionRef = collection(this.firestore, 'objet-maison');
    const q = query(collectionRef, where('ID', '==', objet.ID)); // Rechercher par champ personnalisé 'ID'

    getDocs(q).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // Supposons qu'il n'y ait qu'un seul document avec cet ID
        const docRef = querySnapshot.docs[0].ref; // Récupérer la référence du document
        updateDoc(docRef, { Resolution: nouvelleResolution }) // Mettre à jour la résolution dans Firestore
          .then(() => {
            objet.Resolution = nouvelleResolution; // Mettre à jour localement
            console.log(`Résolution mise à jour avec succès pour ${objet.Nom} : ${nouvelleResolution}`);
          })
          .catch((error) => {
            console.error("Erreur lors de la mise à jour de la résolution :", error);
          });
      } else {
        console.error("Aucun document trouvé avec l'ID :", objet.ID);
      }
    }).catch((error) => {
      console.error("Erreur lors de la récupération du document :", error);
    });
  }
  onMicrophoneChange(event: Event, objet: any): void {
    const target = event.target as HTMLSelectElement;
    const nouvelEtatMicrophone = target.value === 'true'; // Convertir la valeur en booléen
    const collectionRef = collection(this.firestore, 'objet-maison');
    const q = query(collectionRef, where('ID', '==', objet.ID)); // Rechercher par champ personnalisé 'ID'

    getDocs(q).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // Supposons qu'il n'y ait qu'un seul document avec cet ID
        const docRef = querySnapshot.docs[0].ref; // Récupérer la référence du document
        updateDoc(docRef, { Microphone: nouvelEtatMicrophone }) // Mettre à jour l'état du microphone dans Firestore
          .then(() => {
            objet.Microphone = nouvelEtatMicrophone; // Mettre à jour localement
            console.log(`Microphone mis à jour avec succès pour ${objet.Nom} : ${nouvelEtatMicrophone ? 'Ouvert' : 'Fermé'}`);
          })
          .catch((error) => {
            console.error("Erreur lors de la mise à jour du microphone :", error);
          });
      } else {
        console.error("Aucun document trouvé avec l'ID :", objet.ID);
      }
    }).catch((error) => {
      console.error("Erreur lors de la récupération du document :", error);
    });
  }
  onVolumeCibleChange(event: Event, objet: any): void {
    const target = event.target as HTMLInputElement;
    const nouveauVolumeCible = Number(target.value); // Convertir en nombre
    const collectionRef = collection(this.firestore, 'objet-maison');
    const q = query(collectionRef, where('ID', '==', objet.ID)); // Rechercher par champ personnalisé 'ID'

    getDocs(q).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref; // Récupérer la référence du document
        updateDoc(docRef, { VolumeCible: nouveauVolumeCible }) // Mettre à jour le volume cible dans Firestore
          .then(() => {
            objet.VolumeCible = nouveauVolumeCible; // Mettre à jour localement
            console.log(`Volume cible mis à jour avec succès pour ${objet.Nom} : ${nouveauVolumeCible}%`);
          })
          .catch((error) => {
            console.error("Erreur lors de la mise à jour du volume cible :", error);
          });
      } else {
        console.error("Aucun document trouvé avec l'ID :", objet.ID);
      }
    }).catch((error) => {
      console.error("Erreur lors de la récupération du document :", error);
    });
  }

  onTemperatureCibleChange(event: Event, objet: any): void {
    const target = event.target as HTMLInputElement;
    const nouvelleTemperatureCible = Number(target.value); // Convertir en nombre
    const collectionRef = collection(this.firestore, 'objet-maison');
    const q = query(collectionRef, where('ID', '==', objet.ID)); // Rechercher par champ personnalisé 'ID'

    getDocs(q).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref; // Récupérer la référence du document
        updateDoc(docRef, { TemperatureCible: nouvelleTemperatureCible }) // Mettre à jour la température cible dans Firestore
          .then(() => {
            objet.TemperatureCible = nouvelleTemperatureCible; // Mettre à jour localement
            console.log(`Température cible mise à jour avec succès pour ${objet.Nom} : ${nouvelleTemperatureCible}°C`);
          })
          .catch((error) => {
            console.error("Erreur lors de la mise à jour de la température cible :", error);
          });
      } else {
        console.error("Aucun document trouvé avec l'ID :", objet.ID);
      }
    }).catch((error) => {
      console.error("Erreur lors de la récupération du document :", error);
    });
  }

  toggleOnOff(objet: any): void {
    const collectionRef = collection(this.firestore, 'objet-maison');
    const q = query(collectionRef, where('ID', '==', objet.ID)); // Rechercher par champ personnalisé 'ID'

    getDocs(q).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref; // Récupérer la référence du document
        const nouvelEtat = objet.Etat === 'Allumé' ? 'Eteinds' : 'Allumé'; // Basculer entre ON et OFF
        updateDoc(docRef, { Etat: nouvelEtat }) // Mettre à jour l'état dans Firestore
          .then(() => {
            objet.Etat = nouvelEtat; // Mettre à jour localement
            console.log(`État mis à jour avec succès pour ${objet.Nom} : ${nouvelEtat}`);
          })
          .catch((error) => {
            console.error("Erreur lors de la mise à jour de l'état :", error);
          });
      } else {
        console.error("Aucun document trouvé avec l'ID :", objet.ID);
      }
    }).catch((error) => {
      console.error("Erreur lors de la récupération du document :", error);
    });
  }

  ngOnInit(): void {
    const objetsCollection = collection(this.firestore, 'objet-maison');
    this.objets$ = collectionData(objetsCollection) as Observable<any[]>;
    // Vérifier si l'utilisateur est un utilisateur complexe ou simple
    this.firebaseservice.getCurrentUser().subscribe((user: any) => {
      if (user.level > 1) {
        this.iscomplexe = true;
        this.issimple = false;
      } else if (user.level ==1 || user.level == 0) {
        this.iscomplexe = false;
        this.issimple = true;
      }
      else {
        this.iscomplexe = false;
        this.issimple = false;
      }
    });
  }
}
