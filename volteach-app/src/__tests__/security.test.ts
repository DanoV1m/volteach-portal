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
    ];
    safe.forEach(f => expect(sanitizeFormulaInput(f)).toBe(f));
  });

  it('strips <script>…</script> block entirely', () => {
    expect(sanitizeFormulaInput('<script>alert("xss")</script>')).toBe('');
  });

  it('strips script tag while preserving surrounding text', () => {
    expect(
      sanitizeFormulaInput('before<script>evil()</script>after')
    ).toBe('beforeafter');
  });

  it('strips multiline script blocks', () => {
    expect(
      sanitizeFormulaInput('<script>\nmalicious()\n</script>safe')
    ).toBe('safe');
  });

  it('strips onload keyword (case-insensitive)', () => {
    expect(sanitizeFormulaInput('onload=bad()')).toBe('=bad()');
    expect(sanitizeFormulaInput('ONLOAD=bad()')).toBe('=bad()');
    expect(sanitizeFormulaInput('OnLoad=bad()')).toBe('=bad()');
  });

  it('strips onerror keyword (case-insensitive)', () => {
    expect(sanitizeFormulaInput('onerror=hack')).toBe('=hack');
    expect(sanitizeFormulaInput('ONERROR=hack')).toBe('=hack');
  });

  it('strips javascript: protocol (case-insensitive)', () => {
    expect(sanitizeFormulaInput('javascript:void(0)')).toBe('void(0)');
    expect(sanitizeFormulaInput('JAVASCRIPT:void(0)')).toBe('void(0)');
  });

  it('strips < and > characters from plain HTML tags', () => {
    // <b>bold</b> → after bracket strip: bbold/b
    expect(sanitizeFormulaInput('<b>bold</b>')).toBe('bbold/b');
    // spacing around brackets is preserved
    expect(sanitizeFormulaInput('a < b > c')).toBe('a  b  c');
  });

  it('neutralises a combined XSS payload (img onerror)', () => {
    const payload = '<img src="x" onerror="alert(1)">';
    const result = sanitizeFormulaInput(payload);
    expect(result).not.toContain('onerror');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });

  it('handles multiple script tags in one string', () => {
    const input = '<script>a()</script>text<script>b()</script>';
    expect(sanitizeFormulaInput(input)).toBe('text');
  });
});
