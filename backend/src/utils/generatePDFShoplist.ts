import path from 'path';
import axios from 'axios';
import { z } from 'zod/v4';
import PDFDocument from 'pdfkit';
import SVGtoPDF from 'svg-to-pdfkit';
import type { Response } from 'express';
import type { recipeInputSchema } from '#schemas/recipes.schema';

type RecipeDTO = z.infer<typeof recipeInputSchema>;

export async function generatePDFShoplist(recipe: RecipeDTO, res: Response): Promise<void> {
  const doc = new PDFDocument({ margin: 25, size: 'A4', bufferPages: true });
  const fontsDir = path.join(process.cwd(), 'assets', 'fonts');

  doc.registerFont('Lato', path.join(fontsDir, 'Lato-Regular.ttf'));
  doc.registerFont('Philosopher', path.join(fontsDir, 'Philosopher-Bold.ttf'));

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=Shoplist_${recipe.url}.pdf`);
  doc.pipe(res);

  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#faf7f2');

  const startY = 25;
  try {
    const svgUrl = `${process.env.CLIENT_BASE_URL}/logo-light.svg`;
    const svgResponse = await axios.get(svgUrl);
    SVGtoPDF(doc, svgResponse.data as string, 40, startY, { width: 35 });

    doc
      .fillColor('#4a4a4a')
      .fontSize(10)
      .font('Philosopher')
      .text('CULINAIRE\n– elevated home cooking', 100, startY + 20, { lineGap: 2 });
  } catch (error) {
    console.error('Header logo error', error);
  }

  doc.strokeColor('#6b7a4f').lineWidth(0.5).moveTo(40, 90).lineTo(555, 90).stroke();

  const contentY = 110;
  const leftColX = 40;

  const imgW = 150;
  const imgH = 150;

  const rightColX = 555 - imgW;
  const leftColWidth = rightColX - leftColX - 15;

  doc
    .fillColor('#2b2a27')
    .font('Philosopher')
    .fontSize(20)
    .text(recipe.title, leftColX, contentY, { width: leftColWidth });

  if (recipe.description) {
    doc.moveDown(0.5);
    doc.fillColor('#4a4a4a').font('Lato').fontSize(10).text(recipe.description, leftColX, doc.y, {
      width: leftColWidth,
      lineGap: 2
    });
  }

  doc.moveDown(1);
  doc.font('Lato').fontSize(10).fillColor('#4a4a4a');
  doc.text(`Cuisine: ${recipe.cuisine}`, leftColX, doc.y);
  doc.moveDown(0.2);
  doc.text(`Total time: ${recipe.totalTime}`, leftColX, doc.y);
  doc.moveDown(0.2);
  doc.text(`Serves: ${recipe.service}`, leftColX, doc.y);
  doc.moveDown(0.2);
  doc.text(`Level: ${recipe.level}`, leftColX, doc.y);

  try {
    const imageUrl = recipe.image;

    if (imageUrl) {
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data as ArrayBuffer);

      doc.image(imageBuffer, rightColX, contentY, {
        fit: [imgW, imgH],
        align: 'right'
      });
    } else {
      throw new Error('No image exists');
    }
  } catch (error) {
    console.error('Recipe image error', error);
    doc.save().fillColor('#4a4a4a').rect(rightColX, contentY, imgW, imgH).fill().restore();
  }

  const shoplistHeaderY = Math.max(doc.y + 10, contentY + imgH + 10, 210);
  doc.y = shoplistHeaderY;

  doc.fillColor('#2b2a27').font('Philosopher').fontSize(16).text('My Shoplist', leftColX);
  doc.moveDown(0.5);
  doc
    .strokeColor('#6b7a4f')
    .lineWidth(0.5)
    .moveTo(40, doc.y)
    .lineTo(140, doc.y)
    .lineTo(555, doc.y)
    .stroke();
  doc.moveDown(1);

  const totalIngredients = recipe.ingredients.length;

  recipe.ingredients.forEach((item, index) => {
    const isLastAFew = index >= totalIngredients - 2;
    const footerReservedSpace = 120;

    const limit = isLastAFew ? 770 - footerReservedSpace : 770;

    if (doc.y > limit) {
      doc.addPage();
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#faf7f2');
      doc.y = 40;
    }

    const currentY = doc.y;

    doc
      .rect(40, currentY + 1, 10, 10)
      .strokeColor('#4a4a4a')
      .lineWidth(0.5)
      .stroke();
    doc
      .fillColor('#4a4a4a')
      .font('Lato')
      .fontSize(10)
      .text(`${item.quantity} ${item.unit}`, 60, currentY, { width: 70 });
    doc
      .fillColor('#4a4a4a')
      .font('Lato')
      .fontSize(10)
      .text(item.title, 140, currentY, { width: 380 });
    doc.moveDown(0.8);
    doc.strokeColor('#e5e5e5').lineWidth(0.25).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.5);
  });

  doc.moveDown(1);
  doc.fillColor('#2b2a27').font('Philosopher').fontSize(14).text('Have fun cooking!', leftColX);

  const range = doc.bufferedPageRange();

  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);

    const bottomMargin = 40;
    const footerY = doc.page.height - bottomMargin;
    const lineY = footerY - 16;

    doc.strokeColor('#6b7a4f').lineWidth(0.5).moveTo(40, lineY).lineTo(555, lineY).stroke();

    doc
      .fontSize(8)
      .fillColor('#4a4a4a')
      .font('Lato')
      .text(`Created on ${new Date().toISOString().split('T')[0]} by CULINAIRE`, 40, footerY - 10, {
        align: 'left',
        width: 400
      });

    doc.fontSize(8).text(`Page ${i + 1} of ${range.count}`, 40, footerY - 10, {
      align: 'right',
      width: 515
    });
  }

  doc.end();
}
