# API Facturas - Estructura completada

## ✅ Instalación completada

Prisma ha sido instalado y configurado correctamente con SQLite.

## 📁 Estructura de carpetas

```
src/
├── prisma/
│   ├── prisma.service.ts       # Servicio que gestiona la conexión a BD
│   └── prisma.module.ts        # Módulo de Prisma
├── productos/
│   ├── dto/
│   │   ├── create-producto.dto.ts
│   │   ├── update-producto.dto.ts
│   │   └── index.ts
│   ├── productos.service.ts    # CRUD de Productos
│   ├── productos.controller.ts # Endpoints de Productos
│   └── productos.module.ts
├── servicios/
│   ├── dto/
│   │   ├── create-servicio.dto.ts
│   │   ├── update-servicio.dto.ts
│   │   └── index.ts
│   ├── servicios.service.ts    # CRUD de Servicios
│   ├── servicios.controller.ts # Endpoints de Servicios
│   └── servicios.module.ts
├── facturas/
│   ├── dto/
│   │   ├── create-factura.dto.ts
│   │   ├── update-factura.dto.ts
│   │   └── index.ts
│   ├── facturas.service.ts     # CRUD de Facturas (con detalles)
│   ├── facturas.controller.ts  # Endpoints de Facturas
│   └── facturas.module.ts
├── app.module.ts               # Módulo principal (actualizado)
├── app.controller.ts
├── app.service.ts
└── main.ts

prisma/
├── schema.prisma               # Esquema de BD con 4 modelos
└── migrations/
    └── 20260206194015_init/
        └── migration.sql
```

## 🗄️ Modelos de BD

1. **Producto** - Produtos con stock
2. **Servicio** - Servicios sin stock
3. **Factura** - Facturas maestras
4. **DetalleFactura** - Items de cada factura (relación muchos a muchos)

## 🔌 Endpoints API

### Productos
- `POST /productos` - Crear producto
- `GET /productos` - Listar todos
- `GET /productos/:id` - Obtener uno
- `PUT /productos/:id` - Actualizar
- `DELETE /productos/:id` - Eliminar

### Servicios
- `POST /servicios` - Crear servicio
- `GET /servicios` - Listar todos
- `GET /servicios/:id` - Obtener uno
- `PUT /servicios/:id` - Actualizar
- `DELETE /servicios/:id` - Eliminar

### Facturas
- `POST /facturas` - Crear factura con detalles
- `GET /facturas` - Listar todas con detalles
- `GET /facturas/:id` - Obtener con detalles
- `PUT /facturas/:id` - Actualizar con detalles
- `DELETE /facturas/:id` - Eliminar

## 🚀 Cómo ejecutar

### En desarrollo (con watch)
```bash
npm run start:dev
```

### En producción
```bash
npm run build
npm run start:prod
```

## 📋 Base de datos

- **Archivo**: `dev.db` (SQLite)
- **Ubicación**: Raíz del proyecto
- **Configuración**: `.env` (DATABASE_URL=file:./dev.db)

## 📝 Ejemplos de uso

### Crear un Producto
```json
POST /productos
{
  "nombre": "Laptop",
  "descripcion": "Laptop Dell XPS 13",
  "precio": 999.99,
  "stock": 10
}
```

### Crear un Servicio
```json
POST /servicios
{
  "nombre": "Consultoría",
  "descripcion": "Horas de consultoría",
  "precio": 75.00
}
```

### Crear una Factura con Detalles
```json
POST /facturas
{
  "numero": "FAC-001",
  "estado": "pendiente",
  "detalles": [
    {
      "productoId": 1,
      "cantidad": 2,
      "precioUnitario": 999.99,
      "subtotal": 1999.98
    },
    {
      "servicioId": 1,
      "cantidad": 5,
      "precioUnitario": 75.00,
      "subtotal": 375.00
    }
  ]
}
```

El monto total se calcula automáticamente.

## 🔄 Cambios en DB

Para agregar campos nuevos:
1. Edita `prisma/schema.prisma`
2. Ejecuta: `npx prisma migrate dev --name nombre_migracion`
3. La BD se actualiza automáticamente

## ✨ Características

- ✅ CRUDs completos para todas las entidades
- ✅ Relaciones Prisma incluidas
- ✅ DTOs de validación
- ✅ Servicios y controladores NestJS
- ✅ Base de datos SQLite lista para usar
- ✅ Migraciones de Prisma
- ✅ Módulos organizados y escalables
