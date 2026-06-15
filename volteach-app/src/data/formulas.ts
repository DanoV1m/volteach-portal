export interface FormulaSheet {
  category: string;
  list: { name: string; eq: string }[];
}

export const formulasSheets: Record<string, FormulaSheet> = {
  circuits: {
    category: '🔌 מעגלים חשמליים',
    list: [
      { name: 'תבנין', eq: 'V_{th}=V_{oc}' },
      { name: 'נורטון', eq: 'I_N=I_{sc}' },
      { name: 'אימפדנס קבל', eq: 'Z_c=\\frac{1}{j\\omega C}' },
      { name: 'אימפדנס סליל', eq: 'Z_l=j\\omega L' },
      { name: 'מחלק מתח', eq: 'V_x=V\\frac{R_x}{\\sum R}' },
      { name: 'הספק ריאקטיבי', eq: 'Q=VI\\sin(\\phi)' },
      { name: 'גורם הספק', eq: 'PF=\\cos(\\phi)' },
    ],
  },
  electronics: {
    category: '💡 אלקטרוניקה',
    list: [
      { name: 'דיודה', eq: 'I_d=I_s \\cdot e^{\\frac{V}{nV_T}}' },
      { name: 'BJT (זרם)', eq: 'I_c=\\beta \\cdot I_b' },
      { name: 'MOSFET Sat', eq: 'I_d=\\frac{1}{2}\\mu_n C_{ox} \\frac{W}{L} (V_{gs}-V_t)^2' },
      { name: 'OpAmp מהפך', eq: 'A_v=-\\frac{R_f}{R_{in}}' },
      { name: 'OpAmp עוקב', eq: 'A_v=1+\\frac{R_f}{R_1}' },
      { name: 'CMRR', eq: 'CMRR=\\frac{A_d}{A_{cm}}' },
    ],
  },
  signals: {
    category: '📶 אותות ומערכות',
    list: [
      { name: 'פורייה CT', eq: 'X(j\\omega)=\\int x(t)e^{-j\\omega t}dt' },
      { name: 'לפלס', eq: 'X(s)=\\int x(t)e^{-st}dt' },
      { name: 'Z-Transform', eq: 'X(z)=\\sum x[n]z^{-n}' },
      { name: 'קונבולוציה', eq: 'y=x*h' },
      { name: 'Nyquist', eq: 'f_s \\ge 2f_{max}' },
      { name: 'DFT', eq: 'X[k]=\\sum x[n]e^{-j\\frac{2\\pi}{N}kn}' },
    ],
  },
  comms: {
    category: '📡 תקשורת',
    list: [
      { name: 'קיבולת שאנון', eq: 'C=B\\log_2(1+SNR)' },
      { name: 'AM', eq: 's(t)=A_c[1+m(t)]\\cos(\\omega_c t)' },
      { name: 'FM Deviation', eq: '\\Delta f=k_f \\cdot A_m' },
      { name: 'Friis', eq: 'P_r=P_t G_t G_r \\left(\\frac{\\lambda}{4\\pi d}\\right)^2' },
      { name: 'SNR', eq: 'SNR=\\frac{P_s}{P_n}' },
    ],
  },
  control: {
    category: '🎛️ בקרה',
    list: [
      { name: 'PID', eq: 'u=K_p e+K_i\\int e+K_d \\dot{e}' },
      { name: 'זמן עלייה', eq: 't_r \\approx \\frac{1.8}{\\omega_n}' },
      { name: 'Overshoot', eq: 'OS=e^{-\\frac{\\pi\\zeta}{\\sqrt{1-\\zeta^2}}}' },
      { name: 'יציבות ראוס', eq: '\\text{יציב} \\iff \\text{עמודה} > 0' },
      { name: 'שגיאה מצב', eq: 'e_{ss}=\\frac{1}{1+K_p}' },
    ],
  },
  trig: {
    category: '📐 זהויות טריגונומטריות',
    list: [
      { name: 'זהות פיתגורס', eq: '\\sin^2(x)+\\cos^2(x)=1' },
      { name: 'זווית כפולה סינוס', eq: '\\sin(2x)=2\\sin(x)\\cos(x)' },
      { name: 'זווית כפולה קוסינוס', eq: '\\cos(2x)=\\cos^2(x)-\\sin^2(x)' },
      { name: 'טנגנס', eq: '\\tan(x)=\\frac{\\sin(x)}{\\cos(x)}' },
      { name: 'סכום זוויות סינוס', eq: '\\sin(a \\pm b)=\\sin(a)\\cos(b) \\pm \\cos(a)\\sin(b)' },
      { name: 'סכום זוויות קוסינוס', eq: '\\cos(a \\pm b)=\\cos(a)\\cos(b) \\mp \\sin(a)\\sin(b)' },
    ],
  },
};
