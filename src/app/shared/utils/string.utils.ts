/**
 * Extrai as iniciais de um nome completo
 * @param name - Nome completo
 * @returns Iniciais em maiúsculas
 * @example
 * getInitials('João Silva') // 'JS'
 * getInitials('Maria da Silva Santos') // 'MDSS'
 */
export function getInitials(name: string = ''): string {
  if (!name || !name.trim()) {
    return '';
  }

  return name
    .trim()
    .split(' ')
    .filter(n => n.length > 0)
    .map(n => n[0])
    .join('')
    .toUpperCase();
}

/**
 * Trunca um texto com ellipsis
 * @param text - Texto a ser truncado
 * @param maxLength - Tamanho máximo
 * @returns Texto truncado
 */
export function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

/**
 * Capitaliza a primeira letra de cada palavra
 * @param text - Texto a ser capitalizado
 * @returns Texto capitalizado
 */
export function capitalize(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
