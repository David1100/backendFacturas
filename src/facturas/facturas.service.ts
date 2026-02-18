import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PdfService } from '../pdf/pdf.service';
import { CreateFacturaDto, FindFacturaDto, UpdateFacturaDto } from './dto';

@Injectable()
export class FacturasService {
  constructor(
    private prisma: PrismaService,
    private pdfService: PdfService,
  ) { }

  async create(createFacturaDto: CreateFacturaDto) {
    const { numero, detalles, clienteId } = createFacturaDto;


    const monto = detalles.reduce((sum, detalle) => sum + detalle.subtotal, 0);


    return this.prisma.factura.create({
      data: {
        numero,
        monto,
        clienteId,
        detalles: {
          create: detalles,
        },
      },
      include: {
        detalles: true
      },
    });
  }

  async findAll(findFacturaDto: FindFacturaDto) {

    const page = Number(findFacturaDto.page) || 1;
    const perPage = Number(findFacturaDto.per_page) || 10;
    const search = findFacturaDto.search || "";
    const searchState = findFacturaDto.searchState || "";
    const skip = (page - 1) * perPage;
    const take = perPage;

    // 🔍 Filtros dinámicos
    const where = {
      ...(search && {
        numero: {
          contains: search,
        },
        
      }),
      ...(searchState && {
        estado: searchState,
      }),
    };

    // 📦 Query paralela (datos + total)
    const [data, total] = await Promise.all([
      this.prisma.factura.findMany({
        include: {
          detalles: true,
          cliente: true,
        },
        where,
        skip,
        take,
        orderBy: {
          id: "desc",
        },
      }),

      this.prisma.factura.count({ where }),
    ]);

    const totalPages = Math.ceil(total / perPage);

    return {
      data,
      meta: {
        page,
        per_page: perPage,
        total,
        total_pages: totalPages,
      },
    };
  }

  findOne(id: number) {
    return this.prisma.factura.findUnique({
      where: { id },
      include: {
        detalles: true,
        cliente: true,
      },
    });
  }

  async update(id: number, updateFacturaDto: UpdateFacturaDto) {
    const { numero, estado, detalles } = updateFacturaDto;

    // Si hay detalles, eliminar los antiguos y crear los nuevos
    if (detalles) {
      await this.prisma.detalleFactura.deleteMany({
        where: { facturaId: id },
      });
    }

    // Calcular nuevo monto si hay detalles
    let monto: number | undefined;
    if (detalles) {
      monto = detalles.reduce((sum, detalle) => sum + (detalle.subtotal || 0), 0);
    }

    return this.prisma.factura.update({
      where: { id },
      data: {
        numero,
        estado,
        ...(monto !== undefined && { monto }),
        ...(detalles && {
          detalles: {
            create: detalles,
          },
        }),
      },
      include: {
        detalles: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.factura.delete({
      where: { id },
      include: {
        detalles: true,
      },
    });
  }

  async generatePdf(id: number): Promise<Buffer> {
    const factura = await this.findOne(id);
    if (!factura) {
      throw new Error('Factura no encontrada');
    }
    return this.pdfService.generateFacturaPdf(factura);
  }

  async generatePdfByNumero(numero: string): Promise<Buffer> {
    const factura = await this.prisma.factura.findUnique({
      where: { numero },
      include: {
        cliente: true,
        detalles: {
          include: {
            producto: {
              select: { nombre: true, iva: true }
            },
            servicio: {
              select: { nombre: true, iva: true }
            }
          }
        }
      }
    });


    if (!factura) {
      throw new Error('Factura no encontrada');
    }
    return this.pdfService.generateFacturaPdf(factura);
  }
}
