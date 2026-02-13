import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductosModule } from './productos/productos.module';
import { ServiciosModule } from './servicios/servicios.module';
import { FacturasModule } from './facturas/facturas.module';
import { ClienteModule } from './cliente/cliente.module';

@Module({
  imports: [PrismaModule, ProductosModule, ServiciosModule, FacturasModule, ClienteModule],
})
export class AppModule {}
