import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';
import { FirebaseService } from '../firebase.service';
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
  constructor(private firebase: FirebaseService) {}

  // Générer une couleur aléatoire
  private generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  async generatePdf() {
    try {
      // Récupérer les données des collections via les nouvelles fonctions
      const objets = await this.firebase.getObjetsWithDetails();
      const pieces = await this.firebase.getPiecesWithDetails();
      console.log('Objets récupérés :', objets); // Vérifiez les objets
      console.log('Pièces récupérées :', pieces); // Vérifiez les pièces
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
        pdf.text(`Nom: ${objet.id}`, 15, y);
        y += 8;
        pdf.text(`Consommation électrique: ${objet.consommation} Watts`, 15, y);
        y += 8;
        pdf.text(`Pièce attribuée: ${objet.piece}`, 15, y);
        y += 15; // Espace entre les objets

        // Ajouter une nouvelle page si nécessaire
        if (y > 250) {
          pdf.addPage();
          y = 20;
        }
      });
      // Créer un graphique en camembert pour la consommation par objet
      const objectLabels = objets.map(objet => objet.id);
      const objectData = objets.map(objet => objet.consommation);
      const objectColors = objets.map(() => this.generateRandomColor());
      const objectCanvas = document.createElement('canvas');
      objectCanvas.width = 400;
      objectCanvas.height = 400;
      document.body.appendChild(objectCanvas);

      const objectCtx = objectCanvas.getContext('2d');
      if (objectCtx) {
        new Chart(objectCtx, {
          type: 'pie',
          data: {
            labels: objectLabels,
            datasets: [{
              label: 'Consommation par objet',
              data: objectData,
              backgroundColor: objectColors,
            }]
          },
          options: {
            responsive: true,
            plugins: {
              datalabels: {
                display: true,
                color: '#fff',
                font: {
                  size: 14,
                  weight: 'bold'
                },
                formatter: (value: number) => `${value} Watts`,
              },
              legend: {
                display: true,
                labels: {
                  font: {
                    size: 14,
                    weight: 'bold'
                  },
                  padding: 20
                }
              }
            }
          }
        });

        // Attendre que le graphique soit rendu
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Capturer le graphique sous forme d'image
        const objectImage = await html2canvas(objectCanvas);
        const objectImgData = objectImage.toDataURL('image/png');
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.text('Diagramme de consommation par objet :', 10, 10);
        pdf.addImage(objectImgData, 'PNG', 10, 20, 180, 120);
        document.body.removeChild(objectCanvas);
      }

      // Créer un graphique en camembert pour la consommation par pièce
      const pieceLabels = pieces.map(piece => piece.nom);
      const pieceData = pieces.map(piece => {
        return objets
          .filter(objet => objet.piece === piece.nom)
          .reduce((sum, objet) => sum + objet.consommation, 0);
      });
      const pieceColors = pieces.map(() => this.generateRandomColor());

      const pieceCanvas = document.createElement('canvas');
      pieceCanvas.width = 400;
      pieceCanvas.height = 400;
      document.body.appendChild(pieceCanvas);

      const pieceCtx = pieceCanvas.getContext('2d');
      if (pieceCtx) {
        new Chart(pieceCtx, {
          type: 'pie',
          data: {
            labels: pieceLabels,
            datasets: [{
              label: 'Consommation par pièce',
              data: pieceData,
              backgroundColor: pieceColors,
            }]
          },
          options: {
            responsive: true,
            plugins: {
              datalabels: {
                display: true,
                color: '#fff',
                font: {
                  size: 14,
                  weight: 'bold'
                },
                formatter: (value: number) => `${value} Watts`,
              },
              legend: {
                display: true,
                labels: {
                  font: {
                    size: 14,
                    weight: 'bold'
                  },
                  padding: 20
                }
              }
            }
          }
        });

        // Attendre que le graphique soit rendu
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Capturer le graphique sous forme d'image
        const pieceImage = await html2canvas(pieceCanvas);
        const pieceImgData = pieceImage.toDataURL('image/png');
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.text('Diagramme de consommation par pièce :', 10, 10);
        pdf.addImage(pieceImgData, 'PNG', 10, 20, 180, 120);
        document.body.removeChild(pieceCanvas);
      }

      // Sauvegarder le PDF
      pdf.save('consommation-electrique.pdf');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF :', error);
      alert('Une erreur est survenue lors de la génération du PDF.');
    }
  }
}