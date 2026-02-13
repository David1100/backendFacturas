import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto, UpdateProductoDto } from './dto';
import { FindProductsDto } from './dto/find-products.dto';


@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) { }

  @Post()
  async create(@Body() createProductoDto: CreateProductoDto) {
    try {
      const producto = await this.productosService.create(createProductoDto);
      return { message: 'Producto creado exitosamente', data: producto };
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
  async findAll(@Query() query: FindProductsDto) {
    return this.productosService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    try {
      const producto = await this.productosService.update(id, updateProductoDto);
      return { message: 'Producto actualizado exitosamente', data: producto };
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

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.remove(id);
  }
}
