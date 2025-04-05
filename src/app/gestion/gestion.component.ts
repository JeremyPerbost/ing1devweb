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
  objets$: Observable<any[]> = new Observable(); // Initialisation avec une valeur par défaut
  constructor(private firestore: Firestore, private firebaseservice: FirebaseService, private router: Router) { }
  iscomplexe: boolean = false;
  issimple: boolean = false;
  users: any[] = [];
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
