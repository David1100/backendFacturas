export class CreateDetalleFacturaDto {
  productoId?: number;
  servicioId?: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export class CreateFacturaDto {
  numero: string;
  estado?: string;
  clienteId: number;
  detalles: CreateDetalleFacturaDto[];
}
