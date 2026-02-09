import type { Response } from 'express';
import PDFDocument from 'pdfkit';
import type { recipeInputSchema } from '#schemas/recipes.schema';
import { z } from 'zod/v4';

type RecipeDTO = z.infer<typeof recipeInputSchema>;

export function generatePDFShoplist(recipe: RecipeDTO, res: Response): void {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=Shoplist_${recipe.url}.pdf`);
  doc.pipe(res);

  doc
    .fillColor('#1e40af')
    .fontSize(24)
    .font('Helvetica-Bold')
    .text('My Shoplist', { align: 'center' });

  doc.moveDown(1);
  doc.strokeColor('#e5e7eb').moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(2);

  recipe.ingredients.forEach((item, index) => {
    if (doc.y > 740) doc.addPage();

    const currentY = doc.y;

    doc.rect(50, currentY, 12, 12).strokeColor('#9ca3af').stroke();

    const amountText = `${item.quantity} ${item.unit}`;
    doc
      .fillColor('#4b5563')
      .font('Helvetica-Bold')
      .fontSize(11)
      .text(amountText, 75, currentY, { width: 80 });

    doc
      .fillColor('#1f2937')
      .font('Helvetica')
      .fontSize(12)
      .text(item.title, 160, currentY, { width: 380 });

    doc.moveDown(1.2);

    doc.strokeColor('#f3f4f6').moveTo(50, doc.y).lineTo(545, doc.y).stroke();

    doc.moveDown(0.8);
  });

  doc
    .fontSize(10)
    .fillColor('#9ca3af')
    .text(`Erstellt am ${new Date().toLocaleDateString('de-DE')}`, 50, 780, { align: 'center' });

  doc.end();
}
