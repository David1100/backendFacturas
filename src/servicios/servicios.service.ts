import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServicioDto, FindServiciosDto, UpdateServicioDto } from './dto';

@Injectable()
export class ServiciosService {
  constructor(private prisma: PrismaService) { }

  create(createServicioDto: CreateServicioDto) {
    return this.prisma.servicio.create({
      data: createServicioDto,
    });
  }

  async findAll(findServiciosDto: FindServiciosDto) {

    const page = Number(findServiciosDto.page) || 1;
    const perPage = Number(findServiciosDto.per_page) || 10;
    const search = findServiciosDto.search || "";
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

    const [data, total] = await Promise.all([

      this.prisma.servicio.findMany({
        where,
        skip,
        take,
        orderBy: {
          id: "desc",
        },
      }),

      this.prisma.servicio.count({ where }),
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
    return this.prisma.servicio.findUnique({
      where: { id },
    });
  }

  update(id: number, updateServicioDto: UpdateServicioDto) {
    return this.prisma.servicio.update({
      where: { id },
      data: updateServicioDto,
    });
  }

  remove(id: number) {
    return this.prisma.servicio.delete({
      where: { id },
    });
  }
}
