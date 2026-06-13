/**
 * Security utilities to prevent XSS and injection attacks.
 */
export function sanitizeFormulaInput(input: string): string {
  // Remove dangerous HTML tags and script injections
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/onload|onerror|javascript:/gi, '')
    .replace(/[<>]/g, ''); // Strip all remaining tags for formula safety
}
