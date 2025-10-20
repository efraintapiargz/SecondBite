/**
 * Formatea una fecha en formato español (DD/MM/YYYY)
 * @param date - Fecha a formatear (Date, string o timestamp)
 * @returns Fecha formateada como DD/MM/YYYY
 */
export function formatDate(date: Date | string | number): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Formatea un precio en pesos mexicanos
 * @param amount - Monto a formatear
 * @returns Precio formateado como $X,XXX.XX MXN
 */
export function formatPrice(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return numAmount.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Formatea un precio simple sin símbolo de moneda
 * @param amount - Monto a formatear
 * @returns Precio formateado como X,XXX.XX
 */
export function formatPriceSimple(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return numAmount.toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
