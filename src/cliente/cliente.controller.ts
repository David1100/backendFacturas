import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { FindClientsDto } from './dto';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  async create(@Body() createClienteDto: CreateClienteDto) {
        try {
          const cliente = await this.clienteService.create(createClienteDto);
          return { message: 'Cliente creado exitosamente', data: cliente };
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
  async findAll(@Query() query: FindClientsDto) {
    return this.clienteService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clienteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clienteService.update(+id, updateClienteDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.clienteService.remove(id);
  }
}
