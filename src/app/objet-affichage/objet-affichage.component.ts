import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../firebase.service'; // importe ton service
import { FormsModule } from '@angular/forms';

type ObjetTypes =
  | 'Spot lumineux'
  | 'Ampoule intelligente'
  | 'Télévision'
  | 'Enceinte Bluetooth'
  | 'Réfrigérateur'
  | 'Lave-vaisselle'
  | 'Lave-linge'
  | 'Thermostat'
  | 'Climatiseur'
  | 'Chauffage intelligent'
  | 'TP-Link';

interface Attributs {
  connectivite: string;
  connexion: string;
  etat: string;
  consommation: string;
  maxluminosite?: number;
  taille?: number;
  volume?: number;
  temperature?: number;
  mode?: string;
  debit?: number;
  [key: string]: string | number | undefined;
}

@Component({
  selector: 'app-objet-affichage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './objet-affichage.component.html',
  styleUrls: ['./objet-affichage.component.css'],
})
export class ObjetAffichageComponent implements OnInit {
  @Input() objet!: { id: string; type: ObjetTypes; categorie: string; piece: string } & Attributs;

  canEdit = false;
  editMode = false;
  piecesDisponibles: string[] = []; // Liste des pièces disponibles

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    // Charger les pièces disponibles
    this.firebaseService.getPiecesRealtime2((pieces) => {
      this.piecesDisponibles = pieces;
    });

    // Vérifier si l'utilisateur peut modifier
    this.firebaseService.getCurrentUser().subscribe(user => {
      if (user?.level > 1) {
        this.canEdit = true;
      }
    });
  }

  hasAttribute(attr: keyof Attributs): boolean {
    return this.objet[attr] !== undefined && this.objet[attr] !== null;
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
  }

  saveChanges(): void {
    if (!this.objet.id) {
      console.error("ID de l'objet manquant. Impossible de sauvegarder les modifications.");
      return;
    }

    // Vérifier si la pièce existe dans Firestore
    if (!this.piecesDisponibles.includes(this.objet.piece)) {
      console.error(`La pièce "${this.objet.piece}" n'existe pas dans Firestore.`);
      return;
    }

    // Mettre à jour l'objet dans Firestore
    this.firebaseService.updateObjet(this.objet.id, this.objet).then(() => {
      console.log(`Objet avec l'ID ${this.objet.id} mis à jour avec succès.`);
      this.editMode = false; // Quitte le mode édition
    }).catch(error => {
      console.error(`Erreur lors de la mise à jour de l'objet avec l'ID ${this.objet.id} :`, error);
    });
  }

  onEtatChange() {
    if (this.objet.etat === 'Éteint') {
      this.objet.connexion = 'Déconnecté';
    }
  }

  supprimer(): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet objet ?")) {
      this.firebaseService.deleteObjet(this.objet.id).then(() => {
        console.log(`Objet avec l'ID ${this.objet.id} supprimé avec succès.`);
      }).catch(error => {
        console.error(`Erreur lors de la suppression de l'objet avec l'ID ${this.objet.id} :`, error);
      });
    }
  }
}

function generateNormalizedId(type: string, piece: string): string {
  const normalize = (value: string) =>
    value.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  return `${normalize(type)}_${normalize(piece)}`;
}