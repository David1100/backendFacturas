export class UpdateDetalleFacturaDto {
  productoId?: number;
  servicioId?: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export class UpdateFacturaDto {
  numero?: string;
  estado?: string;
  detalles?: UpdateDetalleFacturaDto[];
}
