// Blocks LaTeX macro-definition commands that pollute KaTeX's namespace or
// trigger recursive expansion. KaTeX's trust:false already blocks URL-based
// vectors (\href, \url), so we only need to guard macro primitives here.
const LATEX_MACRO_RE = /\\(newcommand|renewcommand|providecommand|def|edef|gdef|xdef|let|futurelet|global)\b/;
const MAX_LEN = 500;

export function sanitizeFormulaInput(input: string): string {
  const s = input.trim();
  if (s.length > MAX_LEN || LATEX_MACRO_RE.test(s)) return '';
  return s;
}
