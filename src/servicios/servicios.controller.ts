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
import { ServiciosService } from './servicios.service';
import { CreateServicioDto, FindServiciosDto, UpdateServicioDto } from './dto';

@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) { }

  @Post()
  async create(@Body() createServicioDto: CreateServicioDto) {

    try {
      const producto = await this.serviciosService.create(createServicioDto);
      return { message: 'Servicio creado exitosamente', data: producto };
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
  async findAll(@Query() query: FindServiciosDto) {
    return this.serviciosService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviciosService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServicioDto: UpdateServicioDto,
  ) {
    try {
      const servicio = await this.serviciosService.update(id, updateServicioDto);
      return { message: 'Servicio actualizado exitosamente', data: servicio };
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
    return this.serviciosService.remove(id);
  }
}
