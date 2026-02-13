import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductoDto, UpdateProductoDto, FindProductsDto } from './dto';

@Injectable()
export class ProductosService {
    constructor(private prisma: PrismaService) { }

    create(createProductoDto: CreateProductoDto) {
        return this.prisma.producto.create({
            data: createProductoDto,
        });
    }

    async findAll(findProductsDto: FindProductsDto) {

        const page = Number(findProductsDto.page) || 1;
        const perPage = Number(findProductsDto.per_page) || 10;
        const search = findProductsDto.search || "";
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
            this.prisma.producto.findMany({
                where,
                skip,
                take,
                orderBy: {
                    id: "desc",
                },
            }),

            this.prisma.producto.count({ where }),
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
        return this.prisma.producto.findUnique({
            where: { id },
        });
    }

    update(id: number, updateProductoDto: UpdateProductoDto) {
        return this.prisma.producto.update({
            where: { id },
            data: updateProductoDto,
        });
    }

    remove(id: number) {
        return this.prisma.producto.delete({
            where: { id },
        });
    }
}
