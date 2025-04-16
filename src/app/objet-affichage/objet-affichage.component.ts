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

    // Convertir la date au format ISO si elle a été modifiée
    if (this.editMode && this.objet['dateMiseAJour']) {
      this.objet['dateMiseAJour'] = new Date(this.objet['dateMiseAJour']).toISOString();
    }

    // Mettre à jour l'objet dans Firestore
    this.firebaseService.updateObjet(this.objet.id, this.objet).then(() => {
      console.log(`Objet avec l'ID ${this.objet.id} mis à jour avec succès.`);
      this.editMode = false; // Quitte le mode édition
    }).catch(error => {
      console.error(`Erreur lors de la mise à jour de l'objet avec l'ID ${this.objet.id} :`, error);
    });
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

  // Récupérer les clés des attributs de l'objet
  getAttributKeys(): string[] {
    return Object.keys(this.objet).filter(
      key => key !== 'id' && key !== 'type' && key !== 'categorie' && key !== 'etat' && key !== 'connexion' && key !== 'dateMiseAJour'
    );
  }

  // Déterminer si un attribut est éditable
  isEditable(key: string): boolean {
    const nonEditableKeys = ['piece', 'connectivite']; // Exemple : certains champs ne sont pas éditables
    return !nonEditableKeys.includes(key);
  }

  // Définir le type d'entrée pour chaque attribut
  getInputType(key: string): string {
    const numberKeys = ['consommation', 'maxluminosite', 'taille', 'volume', 'temperature', 'debit', 'resolution'];
    return numberKeys.includes(key) ? 'number' : 'text';
  }

  // Définir les valeurs minimales pour certains attributs
  getMinValue(key: string): number | null {
    const minValues: { [key: string]: number } = {
      consommation: 1,
      maxluminosite: 0,
      taille: 1,
      volume: 0,
      temperature: -10,
      debit: 1,
      resolution: 240,
    };
    return minValues[key] || null;
  }

  // Définir les valeurs maximales pour certains attributs
  getMaxValue(key: string): number | null {
    const maxValues: { [key: string]: number } = {
      consommation: 5000,
      maxluminosite: 100,
      taille: 100,
      volume: 2000,
      temperature: 50,
      debit: 1000,
      resolution: 4320,
    };
    return maxValues[key] || null;
  }

  // Gérer le changement de connexion
  onConnexionChange(): void {
    if (this.objet.connexion === 'Déconnecté') {
      this.objet.etat = '?';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return date.toLocaleString('fr-FR', options);
  }

  // Convertir une date ISO en format compatible avec datetime-local
  convertToDatetimeLocal(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois entre 1 et 12
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Convertir une date du champ datetime-local en format ISO
  convertToISO(datetimeLocal: string): string {
    return new Date(datetimeLocal).toISOString();
  }
}

function generateNormalizedId(type: string, piece: string): string {
  const normalize = (value: string) =>
    value.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  return `${normalize(type)}_${normalize(piece)}`;
}