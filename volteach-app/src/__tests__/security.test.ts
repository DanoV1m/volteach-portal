import { describe, it, expect } from 'vitest';
import { sanitizeFormulaInput } from '../utils/security';

describe('sanitizeFormulaInput', () => {
  it('returns empty string for empty input', () => {
    expect(sanitizeFormulaInput('')).toBe('');
  });

  it('passes safe LaTeX strings through unchanged', () => {
    const safe = [
      '$$V = IR$$',
      '$$E = mc^2$$',
      '$$\\omega_0 = \\frac{1}{\\sqrt{LC}}$$',
      'F = ma',
      '$V_{th} = V_{oc}$',
      '$$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$',
    ];
    safe.forEach(f => expect(sanitizeFormulaInput(f)).toBe(f));
  });

  it('trims surrounding whitespace', () => {
    expect(sanitizeFormulaInput('  $V = IR$  ')).toBe('$V = IR$');
  });

  it('blocks \\def macro definition', () => {
    expect(sanitizeFormulaInput('\\def\\evil{bad}')).toBe('');
  });

  it('blocks \\newcommand macro definition', () => {
    expect(sanitizeFormulaInput('\\newcommand{\\x}{\\x\\x}')).toBe('');
  });

  it('blocks \\renewcommand', () => {
    expect(sanitizeFormulaInput('\\renewcommand{\\frac}{hacked}')).toBe('');
  });

  it('blocks \\let alias', () => {
    expect(sanitizeFormulaInput('\\let\\cmd=\\other')).toBe('');
  });

  it('blocks \\global modifier', () => {
    expect(sanitizeFormulaInput('\\global\\def\\x{bad}')).toBe('');
  });

  it('blocks \\edef, \\gdef, \\xdef primitives', () => {
    expect(sanitizeFormulaInput('\\edef\\x{val}')).toBe('');
    expect(sanitizeFormulaInput('\\gdef\\x{val}')).toBe('');
    expect(sanitizeFormulaInput('\\xdef\\x{val}')).toBe('');
  });

  it('blocks input over 500 characters', () => {
    expect(sanitizeFormulaInput('x'.repeat(501))).toBe('');
  });

  it('allows input exactly at the 500-character limit', () => {
    expect(sanitizeFormulaInput('x'.repeat(500))).toBe('x'.repeat(500));
  });
});
