import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PdfService {
  // Función para formatear precios con separador de miles
  private formatPrice(value: number): string {
    return value.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  generateFacturaPdf(factura: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 30,
        });

        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => {
          chunks.push(chunk);
        });

        doc.on('end', () => {
          resolve(Buffer.concat(chunks));
        });

        doc.on('error', reject);

        // ==================== ENCABEZADO ====================
        
        // Agregar logo
        try {
          const logoPath = path.join(process.cwd(), 'src', 'assets', 'logo.jpeg');
          if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 30, 25, { width: 80, height: 60 });
          }
        } catch (err) {
          console.log('Logo no encontrado');
        }

        doc.fontSize(18).font('Helvetica-Bold').text('STSCAMTIC S.A.S.', 120, 35);
        doc.fontSize(10).font('Helvetica').text('COTIZACIÓN', 350, 35, { align: 'right', width: 215 });
        
        // Información de la empresa
        doc.fontSize(8).font('Helvetica');
        doc.text('Calle 123 # 24 San Francisco', 120, 55);
        doc.text('Teléfono: 3181094', 120, 68);
        doc.text('Email: info@stscamtic.com', 120, 81);

        // Número de cotización y fecha
        const dateStr = new Date(factura.fecha).toLocaleDateString('es-ES');
        doc.fontSize(9).font('Helvetica-Bold');
        doc.text(`Nº DE COTIZACIÓN: ${factura.numero}`, 350, 55, { align: 'right', width: 215 });
        doc.fontSize(9).font('Helvetica');
        doc.text(`FECHA: ${dateStr}`, 350, 70, { align: 'right', width: 215 });
        doc.text(`VAL. HASTA: 15 días`, 350, 85, { align: 'right', width: 215 });

        // Línea divisoria
        doc.moveTo(30, 105).lineTo(565, 105).stroke();

        // ==================== DATOS DEL CLIENTE ====================
        let yPos = 120;
        
        doc.fontSize(10).font('Helvetica-Bold').text('DATOS DE LA EMPRESA', 30, yPos);
        yPos += 20;
        
        doc.fontSize(9).font('Helvetica');
        if (factura.cliente) {
          doc.text(`CLIENTE: ${factura.cliente.nombre}`, 30, yPos);
          yPos += 15;
          if (factura.cliente.empresa) {
            doc.text(`EMPRESA: ${factura.cliente.empresa}`, 30, yPos);
            yPos += 15;
          }
          if (factura.cliente.direccion) {
            doc.text(`DIRECCIÓN: ${factura.cliente.direccion}`, 30, yPos);
            yPos += 15;
          }
          if (factura.cliente.email) {
            doc.text(`CORREO: ${factura.cliente.email}`, 30, yPos);
            yPos += 15;
          }
          if (factura.cliente.telefono) {
            doc.text(`TELÉFONO: ${factura.cliente.telefono}`, 30, yPos);
            yPos += 15;
          }
        }

        // Línea divisoria
        doc.moveTo(30, yPos + 5).lineTo(565, yPos + 5).stroke();

        // ==================== TABLA DE DETALLES ====================
        yPos += 20;

        // Headers de la tabla
        const headerY = yPos;
        const col1X = 30;      // CANT.
        const col2X = 60;      // DESCRIPCIÓN
        const col3X = 380;     // P. UNITARIO
        const col4X = 460;     // TOTAL

        // Fondo de headers
        doc.rect(30, headerY - 5, 535, 20).fill('#2c3e50');
        
        doc.fontSize(9).font('Helvetica-Bold').fill('white');
        doc.text('CANT.', col1X, headerY, { width: 25 });
        doc.text('DESCRIPCIÓN', col2X, headerY, { width: 310 });
        doc.text('P. UNITARIO', col3X, headerY, { width: 70 });
        doc.text('TOTAL', col4X, headerY, { width: 60 });

        doc.fill('black');
        yPos += 25;

        // Detalles de la factura
        let subtotal = 0;
        factura.detalles.forEach((detalle: any, index: number) => {
          const descripcion = detalle.producto?.nombre || detalle.servicio?.nombre || 'Sin descripción';
          const cantidad = detalle.cantidad;
          const precioUnitario = detalle.precioUnitario;
          const total = detalle.subtotal;

          // Fondo alternado
          if (index % 2 === 0) {
            doc.rect(30, yPos - 5, 535, 18).fill('#f8f9fa');
            doc.fill('black');
          }

          doc.fontSize(9).font('Helvetica');
          doc.text(cantidad.toString(), col1X, yPos, { width: 25 });
          doc.text(descripcion, col2X, yPos, { width: 310 });
          doc.text(`$ ${this.formatPrice(precioUnitario)}`, col3X, yPos, { width: 70, align: 'right' });
          doc.text(`$ ${this.formatPrice(total)}`, col4X, yPos, { width: 60, align: 'right' });

          subtotal += total;
          yPos += 18;
        });

        // Línea divisoria final
        yPos += 5;
        doc.moveTo(30, yPos).lineTo(565, yPos).stroke();

        // ==================== TOTALES ====================
        yPos += 15;

        const totalLabelX = 400;
        const totalValueX = 480;

        doc.fontSize(9).font('Helvetica');
        doc.text('Subtotal:', totalLabelX, yPos);
        doc.text(`$ ${this.formatPrice(subtotal)}`, totalValueX, yPos, { align: 'right', width: 75 });

        yPos += 18;
        doc.text('IVA (19%):', totalLabelX, yPos);
        const iva = subtotal * 0.19;
        doc.text(`$ ${this.formatPrice(iva)}`, totalValueX, yPos, { align: 'right', width: 75 });

        yPos += 18;
        doc.text('Impuestos:', totalLabelX, yPos);
        doc.text('$ 0.00', totalValueX, yPos, { align: 'right', width: 75 });

        yPos += 18;
        doc.text('Gastos:', totalLabelX, yPos);
        doc.text('$ 0.00', totalValueX, yPos, { align: 'right', width: 75 });

        // Total final en negrita
        yPos += 20;
        doc.fontSize(11).font('Helvetica-Bold');
        doc.text('TOTAL B/s.:', totalLabelX - 20, yPos);
        const total = subtotal + iva;
        doc.text(`$ ${this.formatPrice(total)}`, totalValueX, yPos, { align: 'right', width: 75 });

        // ==================== TÉRMINOS Y CONDICIONES ====================
        yPos += 40;
        doc.fontSize(9).font('Helvetica-Bold').text('TÉRMINOS Y CONDICIONES', 30, yPos);
        yPos += 15;
        
        doc.fontSize(8).font('Helvetica');
        const terms = `• Esta cotización esta sujeta a los términos y condiciones que se mencionan en la construcción.
• Duración de la oferta 15 días`;
        
        doc.text(terms, 30, yPos, { width: 510, align: 'left' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
