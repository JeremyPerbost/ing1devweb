import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-supprimer-piece',
  standalone: true,
  templateUrl: './supprimer-piece.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./supprimer-piece.component.css']
})
export class SupprimerPieceComponent {
  piecesDisponibles: string[] = []; // Liste des pièces disponibles
  pieceASupprimer: string = ''; // Pièce sélectionnée pour suppression

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    // Charger les pièces disponibles depuis Firestore
    this.firebaseService.getPiecesRealtime2((pieces) => {
      this.piecesDisponibles = pieces;
    });
  }

  async supprimerPiece() {
    if (!this.pieceASupprimer) return;

    try {
      // Supprimer la pièce sélectionnée
      await this.firebaseService.supprimerPiece(this.pieceASupprimer);
      console.log(`La pièce "${this.pieceASupprimer}" a été supprimée avec succès.`);
      this.pieceASupprimer = ''; // Réinitialiser la sélection
    } catch (error) {
      console.error(`Erreur lors de la suppression de la pièce "${this.pieceASupprimer}" :`, error);
    }
  }
}

