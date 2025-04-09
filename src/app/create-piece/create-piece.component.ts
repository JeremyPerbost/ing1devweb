import { Component } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, deleteDoc, doc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Piece {
  id?: string;
  nom: string;
  couleur: string;
}

@Component({
  selector: 'app-create-piece',
  templateUrl: './create-piece.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./create-piece.component.css']
})
export class CreatePieceComponent {
  nom: string = '';
  couleur: string = '#ffffff';
  pieces$: Observable<Piece[]>;
  errorMessage: string = ''; // Message d'erreur

  constructor(private firestore: Firestore) {
    const piecesCollection = collection(this.firestore, 'pieces');
    this.pieces$ = collectionData(piecesCollection, { idField: 'id' }) as Observable<Piece[]>;
  }

  async ajouterPiece() {
    this.errorMessage = ''; // Réinitialiser le message d'erreur

    // Vérifier si le nom est vide
    if (this.nom.trim() === '') {
      this.errorMessage = 'Le nom de la pièce est requis.';
      return;
    }

    // Vérifier si le nom dépasse 15 caractères
    if (this.nom.length > 15) {
      this.errorMessage = 'Le nom de la pièce ne doit pas dépasser 15 caractères.';
      return;
    }

    try {
      const piecesCollection = collection(this.firestore, 'pieces');
      const q = query(piecesCollection, where('nom', '==', this.nom));
      const querySnapshot = await getDocs(q);

      // Vérifier si une pièce avec le même nom existe déjà
      if (!querySnapshot.empty) {
        this.errorMessage = 'Une pièce avec ce nom existe déjà.';
        return;
      }

      // Ajouter la pièce dans Firestore
      await addDoc(piecesCollection, { nom: this.nom, couleur: this.couleur });
      this.nom = '';
      this.couleur = '#ffffff';
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la pièce :', error);
      this.errorMessage = 'Une erreur est survenue lors de la création de la pièce.';
    }
  }

  async supprimerPiece(id: string) {
    try {
      const pieceDoc = doc(this.firestore, `pieces/${id}`);
      await deleteDoc(pieceDoc);
    } catch (error) {
      console.error('Erreur lors de la suppression de la pièce :', error);
    }
  }
}
