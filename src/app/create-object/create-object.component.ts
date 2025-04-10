import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc, query, where, getDocs } from '@angular/fire/firestore'; // Import nécessaire pour les requêtes Firestore

@Component({
  selector: 'app-create-object',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-object.component.html',
  styleUrls: ['./create-object.component.css', '../../assets/styles.css']
})
export class CreateObjectComponent {
  type: string = '';  // Pour stocker le type d'objet
  nom: string = '';   // Pour stocker le nom de l'objet
  id: string = '';   // Pour stocker l'ID de l'objet
  constructor(private firestore: Firestore) {}

  // Fonction pour récupérer la valeur du type d'objet sélectionné
  type_objet($event: Event): void {
    const target = $event.target as HTMLSelectElement;  // Utiliser HTMLSelectElement
    if (target) {
      this.type = target.value;
      console.log('Option sélectionnée :', this.type);
    }
  }

  // Fonction pour créer l'objet
  async createObjet(): Promise<void> {
    // Vérifier si le nom de l'objet est rempli
    if (!this.nom.trim()) {
      alert('Veuillez remplir le nom de l\'objet.');
      return;
    }
    // Vérifier si un type d'objet est sélectionné
    if (!this.type) {
      alert('Veuillez sélectionner un type d\'objet.');
      return;
    }
    try {
      // Récupérer tous les objets existants du même type
      const collectionRef = collection(this.firestore, 'objet-maison');
      const q = query(collectionRef, where('Type', '==', this.type));
      const querySnapshot = await getDocs(q);
      // Trouver le plus grand numéro existant pour ce type
      let maxNumber = 0;
      querySnapshot.forEach((doc) => {
        const id = doc.data()['ID'] as string;
        const match = id.match(new RegExp(`${this.type}(\\d+)$`)); 
        if (match) {
          const number = parseInt(match[1], 10);
          maxNumber = Math.max(maxNumber, number); 
        }
      });

      // Générer l'ID basé sur le plus grand numéro + 1
      this.id = `${this.type}${maxNumber + 1}`;

      // Ajouter l'objet à la collection "objet-maison" dans Firestore
      //Etat : Allumé ou Eteint
      //Connexion : connecter ou déconnecter
      
      let additionalFields = {};
      switch (this.type.toLowerCase()) {
        case 'lampe':
          additionalFields = { 
            Luminosite: 100,
            Connectivite: "Wi-Fi",
            Couleur: "#FF0000"
          }; 

          break;
        case 'thermostat':
          additionalFields = { 
            Temperature: 20,
            Connectivite: "Wi-Fi",
            Batterie: 100,
            TemperatureActuelle: 20,
            TemperatureCible: 20,
          }; 
          break;
        case 'assistant':
          additionalFields = { 
            Volume: 50,
            VolumeCible: 50,
            Connectivite: "Wi-Fi",
            Batterie: 100,
            Microphone: true
          }; 
          break;
        case 'camera':
          additionalFields = {
            Resolution: '1080p',
            Connectivite: "Filaire", 
            Batterie: 100,  
          };
          break;
        default:
          console.warn('Type inconnu, aucun champ supplémentaire ajouté.');
      }

      await addDoc(collectionRef, { 
        Nom: this.nom, 
        Type: this.type, 
        Etat: "Allumé", 
        Connexion: "déconnecter",  
        ID: this.id,
        Date: new Date(), // Ajouter la date actuelle
        Electricite: 11, // electricité en Watts
        ...additionalFields // Ajouter les champs spécifiques au type
      });
      console.log("Objet ajouté avec succès :", this.nom, "de type", this.type, "avec ID", this.id);

      // Réinitialiser les champs
      this.nom = '';
      this.type = '';
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'objet :', error);
      alert('Une erreur est survenue lors de la création de l\'objet.');
    }
  }
}
