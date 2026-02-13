import { Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindClientsDto } from './dto/find-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(private prisma: PrismaService) { }


  create(createClienteDto: CreateClienteDto) {
    return this.prisma.cliente.create({
      data: createClienteDto,
    });
  }

  async findAll(findClientsDto: FindClientsDto) {
    const page = Number(findClientsDto.page) || 1;
    const perPage = Number(findClientsDto.per_page) || 10;
    const search = findClientsDto.search || "";
    const skip = (page - 1) * perPage;
    const take = perPage;

    // 🔍 Filtros dinámicos
    const where = {
      ...(search && {
        nombre: {
          contains: search,
        },
      }),
    };

    // 📦 Query paralela (datos + total)
    const [data, total] = await Promise.all([
      this.prisma.cliente.findMany({
        where,
        skip,
        take,
        orderBy: {
          id: "desc",
        },
      }),

      this.prisma.cliente.count({ where }),
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
    return `This action returns a #${id} cliente`;
  }

  update(id: number, updateClienteDto: UpdateClienteDto) {
    return `This action updates a #${id} cliente`;
  }

  remove(id: number) {
    return this.prisma.cliente.delete({
      where: { id },
    });
  }
}
