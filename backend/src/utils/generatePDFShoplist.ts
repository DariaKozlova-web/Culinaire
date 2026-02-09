import type { Response } from 'express';
import PDFDocument from 'pdfkit';

interface Ingredient {
  title: string;
  quantity: string;
  unit: string;
}

interface RecipeData {
  items: Ingredient[];
}

export function generatePDFShoplist(recipeData: RecipeData, res: Response): void {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  // Browser-Header setzen
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=Shoplist.pdf');

  doc.pipe(res);

  // Styling & Header
  doc
    .fillColor('#1e40af')
    .fontSize(24)
    .font('Helvetica-Bold')
    .text('Meine Shoplist', { align: 'center' });

  doc.moveDown(1);
  doc.strokeColor('#e5e7eb').moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(2);

  // Zutaten-Liste
  recipeData.items.forEach((item, index) => {
    // Falls die Seite voll ist
    if (doc.y > 740) doc.addPage();

    const currentY = doc.y;

    // 1. Kleine Checkbox zeichnen
    doc.rect(50, currentY, 12, 12).strokeColor('#9ca3af').stroke();

    // 2. Menge und Einheit (z.B. "155 g")
    const amountText = `${item.quantity} ${item.unit}`;
    doc
      .fillColor('#4b5563')
      .font('Helvetica-Bold')
      .fontSize(11)
      .text(amountText, 75, currentY, { width: 80 });

    // 3. Name der Zutat (z.B. "Wheat flour (type 405)")
    doc
      .fillColor('#1f2937')
      .font('Helvetica')
      .fontSize(12)
      .text(item.title, 160, currentY, { width: 380 });

    doc.moveDown(1.2);

    // Dezente Trennlinie
    doc.strokeColor('#f3f4f6').moveTo(50, doc.y).lineTo(545, doc.y).stroke();

    doc.moveDown(0.8);
  });

  // Footer
  doc
    .fontSize(10)
    .fillColor('#9ca3af')
    .text(`Erstellt am ${new Date().toLocaleDateString('de-DE')}`, 50, 780, { align: 'center' });

  doc.end();
}
