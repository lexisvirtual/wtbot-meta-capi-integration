import crypto from 'crypto';

/**
 * Realiza hash SHA-256 de uma string
 * Conforme requerido pela Meta Conversions API
 * @param value String a ser hasheada
 * @returns String hasheada em hexadecimal
 */
export function sha256Hash(value: string): string {
  if (!value) return '';
  return crypto
    .createHash('sha256')
    .update(value.trim().toLowerCase())
    .digest('hex');
}

/**
 * Normaliza e faz hash de um telefone
 * Remove caracteres especiais e aplica hash
 * @param phone Número de telefone com ou sem formatação
 * @returns Telefone hasheado
 */
export function hashPhone(phone: string): string {
  if (!phone) return '';
  // Remove tudo que não é número
  const cleaned = phone.replace(/\D/g, '');
  return sha256Hash(cleaned);
}

/**
 * Normaliza e faz hash de um email
 * Converte para lowercase, remove espaços e aplica hash
 * @param email Endereço de email
 * @returns Email hasheado
 */
export function hashEmail(email: string): string {
  if (!email) return '';
  return sha256Hash(email.toLowerCase().trim());
}

/**
 * Normaliza e faz hash de um nome
 * Remove espaços extras e aplica hash
 * @param name Nome completo
 * @returns Nome hasheado
 */
export function hashName(name: string): string {
  if (!name) return '';
  return sha256Hash(name.trim());
}

/**
 * Extrai primeiro nome de um nome completo
 * @param fullName Nome completo
 * @returns Primeiro nome
 */
export function extractFirstName(fullName: string): string {
  if (!fullName) return '';
  return fullName.trim().split(/\s+/)[0];
}

/**
 * Extrai último nome de um nome completo
 * @param fullName Nome completo
 * @returns Último nome
 */
export function extractLastName(fullName: string): string {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : '';
}
