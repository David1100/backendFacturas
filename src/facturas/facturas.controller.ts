import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { FacturasService } from './facturas.service';
import { CreateFacturaDto, FindFacturaDto, UpdateFacturaDto } from './dto';

@Controller('facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) { }

  @Post()
  async create(@Body() createFacturaDto: CreateFacturaDto) {

    try {
      const factura = await this.facturasService.create(createFacturaDto);
      return { message: 'Factura creada exitosamente', data: factura };
    } catch (error) {

      if (error.code === 'P2002') {
        throw new HttpException(
          'Ya existe un registro con ese valor único',
          HttpStatus.CONFLICT,
        );
      }

      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  findAll(@Query() query: FindFacturaDto) {
    console.log(query);
    return this.facturasService.findAll(query);
  }

  @Get('pdf/:numero')
  async downloadPdf(
    @Param('numero') numero: string,
    @Res() res: Response,
  ) {
    try {
      const pdf = await this.facturasService.generatePdfByNumero(numero);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="factura-${numero}.pdf"`);
      res.send(pdf);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al generar el PDF',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.facturasService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFacturaDto: UpdateFacturaDto,
  ) {
    return this.facturasService.update(id, updateFacturaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.facturasService.remove(id);
  }
}
