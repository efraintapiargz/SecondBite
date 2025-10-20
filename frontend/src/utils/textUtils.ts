/**
 * Utilidad para normalizar texto con caracteres especiales
 * Asegura que los acentos y caracteres especiales se muestren correctamente
 */

/**
 * Normaliza un string para asegurar compatibilidad UTF-8
 * @param text - Texto a normalizar
 * @returns Texto normalizado
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  
  // Normalizar usando NFC (Canonical Decomposition, followed by Canonical Composition)
  return text.normalize('NFC');
}

/**
 * Mapeo de caracteres problemáticos
 */
const charMap: Record<string, string> = {
  'Ã¡': 'á',
  'Ã©': 'é',
  'Ã­': 'í',
  'Ã³': 'ó',
  'Ãº': 'ú',
  'Ã±': 'ñ',
  'Ã\u00C1': 'Á',
  'Ã‰': 'É',
  'Ã\u00CD': 'Í',
  'Ã"': 'Ó',
  'Ãš': 'Ú',
  'Ã\u0091': 'Ñ',
  'Â¿': '¿',
  'Â¡': '¡',
};

/**
 * Corrige caracteres mal codificados
 * @param text - Texto a corregir
 * @returns Texto corregido
 */
export function fixEncoding(text: string): string {
  if (!text) return '';
  
  let fixed = text;
  for (const [wrong, correct] of Object.entries(charMap)) {
    fixed = fixed.replace(new RegExp(wrong, 'g'), correct);
  }
  
  return normalizeText(fixed);
}

/**
 * Asegura que el texto esté en formato UTF-8 correcto
 * @param text - Texto a procesar
 * @returns Texto procesado
 */
export function ensureUTF8(text: string): string {
  if (!text) return '';
  
  try {
    // Intentar detectar y corregir problemas de codificación
    const fixed = fixEncoding(text);
    return normalizeText(fixed);
  } catch (error) {
    console.warn('Error procesando texto UTF-8:', error);
    return text;
  }
}
