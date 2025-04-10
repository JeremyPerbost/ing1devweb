import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Chart, registerables } from 'chart.js'; // Importer les éléments nécessaires
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Importer le plugin datalabels
import html2canvas from 'html2canvas'; // Importer html2canvas

// Enregistrer les éléments nécessaires pour Chart.js
Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-generer-pdf',
  imports: [CommonModule],
  templateUrl: './generer-pdf.component.html',
  styleUrls: ['./generer-pdf.component.css', '../../assets/styles.css']
})
export class GenererPdfComponent {
  constructor(private firestore: Firestore) {}

  async generatePdf() {
    try {
      // Récupérer les données de la collection "objet-maison"
      const collectionRef = collection(this.firestore, 'objet-maison');
      const querySnapshot = await getDocs(collectionRef);

      // Extraire les données des objets
      const objets: any[] = [];
      querySnapshot.forEach((doc) => {
        objets.push(doc.data());
      });

      // Récupérer les données de la collection "pieces"
      const piecesCollectionRef = collection(this.firestore, 'pieces');
      const piecesSnapshot = await getDocs(piecesCollectionRef);
      const pieces: any[] = [];
      piecesSnapshot.forEach((doc) => {
        pieces.push(doc.data());
      });

      // Créer un PDF avec jsPDF
      const pdf = new jsPDF();

      // Ajouter le titre
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Consommation électrique mensuelle de Domovia', 10, 10);

      // Ajouter un espace après le titre
      pdf.setFontSize(12);
      let y = 25; // Position verticale initiale

      // Ajouter chaque objet avec ses champs
      objets.forEach((objet, index) => {
        pdf.text(`${index + 1}.`, 10, y);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Nom: ${objet.Nom}`, 15, y);
        y += 8;
        pdf.text(`Type: ${objet.Type}`, 15, y);
        y += 8;
        pdf.text(`Piece attribuée: ${objet.PieceID}`, 15, y);
        y += 8;
        pdf.text(`Consommation électrique: ${objet.Electricite} Watts`, 15, y);
        y += 15; // Espace entre les objets

        // Ajouter une nouvelle page si nécessaire
        if (y > 250) {
          pdf.addPage();
          y = 20;
        }
      });

      // Créer un graphique en camembert pour la consommation électrique par objet
      const labels = objets.map((objet) => objet.Nom);
      const data = objets.map((objet) => objet.Electricite);

      // Créer un canvas et l'ajouter temporairement au DOM
      const canvas = document.createElement('canvas');
      canvas.width = 400;  // Largeur du canvas
      canvas.height = 400; // Hauteur du canvas (doit être égale pour obtenir un cercle parfait)
      document.body.appendChild(canvas); // Ajouter le canvas au DOM

      const ctx = canvas.getContext('2d');

      if (ctx) {
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              label: 'Consommation électrique (Watts)',
              data: data,
              backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#FFC300'],
            }]
          },
          options: {
            responsive: true,
            plugins: {
              datalabels: {
                display: true,
                color: '#fff',  // Couleur des labels
                font: {
                  size: 45,  // Augmenter la taille des labels
                  weight: 'bold'
                },
                formatter: (value: number) => `${value} Watts`, // Formater les labels avec la consommation
              },
              legend: {
                display: true,
                labels: {
                  font: {
                    size: 30, // Taille de la police de la légende
                    weight: 'bold'
                  },
                  padding: 20 // Espacement autour des labels de la légende
                }
              },
            }
          }
        });

        // Attendre que le graphique soit rendu
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Utiliser html2canvas pour capturer le graphique sous forme d'image
        html2canvas(canvas).then((imageCanvas) => {
          const imgData = imageCanvas.toDataURL('image/png');

          // Ajouter l'image du graphique au PDF
          pdf.addPage();
          pdf.setFontSize(16);
          pdf.text('Diagramme de consommation électrique par objet :', 10, 10);
          pdf.addImage(imgData, 'PNG', 10, 20, 180, 120); // Ajuster la taille de l'image

          // Supprimer le canvas du DOM
          document.body.removeChild(canvas);
        }).catch((error) => {
          console.error('Erreur lors de la capture du graphique :', error);
          alert('Une erreur est survenue lors de la capture du graphique.');
          document.body.removeChild(canvas); // Supprimer le canvas même en cas d'erreur
        });
      }

      // Créer un graphique en camembert pour la consommation électrique par pièce
      const pieceLabels = pieces.map(piece => piece.nom);
      const pieceData: number[] = [];
      const pieceColors = pieces.map(piece => piece.couleur);

      // Calculer la consommation par pièce en fonction de la couleur et de la consommation des objets
      pieces.forEach(piece => {
        const consommationPiece = objets.filter(objet => objet.PieceID === piece.nom)
                                        .reduce((sum, objet) => sum + objet.Electricite, 0);
        pieceData.push(consommationPiece);
      });

      // Créer un canvas pour le graphique par pièce
      const canvasPiece = document.createElement('canvas');
      canvasPiece.width = 400;
      canvasPiece.height = 400;
      document.body.appendChild(canvasPiece);

      const ctxPiece = canvasPiece.getContext('2d');

      if (ctxPiece) {
        new Chart(ctxPiece, {
          type: 'pie',
          data: {
            labels: pieceLabels,
            datasets: [{
              label: 'Consommation électrique par pièce',
              data: pieceData,
              backgroundColor: pieceColors, // Utiliser la couleur de chaque pièce
            }]
          },
          options: {
            responsive: true,
            plugins: {
              datalabels: {
                display: true,
                color: '#fff',
                font: {
                  size: 45,
                  weight: 'bold'
                },
                formatter: (value: number) => `${value} Watts`,
              },
              legend: {
                display: true,
                labels: {
                  font: {
                    size: 30,
                    weight: 'bold'
                  },
                  padding: 20
                }
              }
            }
          }
        });

        // Attendre que le graphique soit rendu
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Utiliser html2canvas pour capturer ce graphique sous forme d'image
        html2canvas(canvasPiece).then((imageCanvasPiece) => {
          const imgDataPiece = imageCanvasPiece.toDataURL('image/png');

          // Ajouter l'image du graphique au PDF
          pdf.addPage();
          pdf.setFontSize(16);
          pdf.text('Diagramme de consommation électrique par pièce :', 10, 10);
          pdf.addImage(imgDataPiece, 'PNG', 10, 20, 180, 120); // Ajuster la taille de l'image

          // Sauvegarder le PDF avec tous les graphiques
          pdf.save('consommation-electrique.pdf');

          // Supprimer le canvas du DOM
          document.body.removeChild(canvasPiece);
        }).catch((error) => {
          console.error('Erreur lors de la capture du graphique :', error);
          alert('Une erreur est survenue lors de la capture du graphique.');
          document.body.removeChild(canvasPiece); // Supprimer le canvas même en cas d'erreur
        });
      }

    } catch (error) {
      console.error('Erreur lors de la génération du PDF :', error);
      alert('Une erreur est survenue lors de la génération du PDF.');
    }
  }
}
