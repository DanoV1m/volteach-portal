import { Course } from '../types';

export const coursesData: Record<string, Record<string, Record<string, Course[]>>> = {
  "ruppin": {
    "1": {
      "1": [
        { "icon": "🛠️", "title": "מיומנויות וחשיבה הנדסית", "subtitle": "Engineering Skills", "topics": ["חשיבה הנדסית"] },
        { "icon": "∫", "title": "חדו'א 1", "subtitle": "Calculus 1", "topics": ["גבולות ורציפות", "נגזרות וכלל השרשרת", "אינטגרלים"] },
        { "icon": "🔢", "title": "אלגברה ליניארית", "subtitle": "Linear Algebra", "topics": ["מערכות משוואות ומרחבים וקטוריים", "מטריצות ודטרמיננטות", "ערכים ווקטורים עצמיים"] },
        { "icon": "🏗️", "title": "פיזיקה 1", "subtitle": "Physics 1", "topics": ["קינמטיקה ודינמיקה", "חוקי ניוטון ומערכות ייחוס", "שימור אנרגיה ותנע"] },
        { "icon": "💻", "title": "עקרונות התכנות ושפת C", "subtitle": "C Programming", "topics": ["C בסיסי", "לולאות ותנאים"] }
      ],
      "2": [
        { "icon": "∬", "title": "חדו'א 2", "subtitle": "Calculus 2", "topics": ["אינטגרלים מסוימים", "טורים", "פונקציות מרובות משתנים", "אינטגרלים כפולים"] },
        { "icon": "📈", "title": "משוואות דיפרנציאליות רגילות (מד'ר)", "subtitle": "ODE", "topics": ["משוואות סדר ראשון", "משוואות סדר שני"] },
        { "icon": "⚛️", "title": "פיזיקה 2", "subtitle": "Physics 2", "topics": ["חוק קולון ושדה חשמלי", "חוק גאוס", "פוטנציאל חשמלי וקיבול"] },
        { "icon": "🖥️", "title": "נושאים מתקדמים בשפת C", "subtitle": "Advanced C", "topics": ["מצביעים", "מבני נתונים בסיסיים"] },
        { "icon": "⚙️", "title": "מערכות ספרתיות ומבוא למבנה המחשב", "subtitle": "Digital Systems", "topics": ["לוגיקה בוליאנית", "מכונות מצבים"] }
      ]
    },
    "2": {
      "1": [
        { "icon": "🎲", "title": "מבוא להסתברות", "subtitle": "Probability", "topics": ["משתנים מקריים", "תוחלת ושונות", "התפלגויות מיוחדות"] },
        { "icon": "🎵", "title": "טורי פורייה והתמרות אינטגרליות", "subtitle": "Fourier Series", "topics": ["טורי פורייה", "התמרת לפלס", "התמרת פורייה"] },
        { "icon": "🌀", "title": "פונקציות מרוכבות", "subtitle": "Complex Functions", "topics": ["מספרים מרוכבים", "פונקציות אנליטיות", "משפט קושי"] },
        { "icon": "🔌", "title": "מבוא להנדסת חשמל + spice", "subtitle": "Circuit Theory", "topics": ["מעגלי זרם ישר", "משפטי רשת", "ניתוח AC ופאזורים"] },
        { "icon": "🌊", "title": "פיזיקה 3", "subtitle": "Physics 3", "topics": ["גלים", "אופטיקה", "פיזיקה מודרנית"] },
        { "icon": "🔬", "title": "מעבדה במערכות ספרתיות", "subtitle": "Digital Lab", "topics": ["ניסויי FPGA", "VHDL מעשי"] },
        { "icon": "🔬", "title": "מעבדה בפיזיקה", "subtitle": "Physics Lab", "topics": ["ניסויים במכניקה", "ניסויים בחשמל"] }
      ],
      "2": [
        { "icon": "🤖", "title": "מתמטיקה ללמידת מכונה", "subtitle": "Math for ML", "topics": ["אופטימיזציה", "אלגוריתמי גרדיאנט"] },
        { "icon": "📶", "title": "אותות, מערכות ומבוא לבקרה (Matlab)", "subtitle": "Signals & Systems", "topics": ["אותות CT", "קונבולוציה", "מבוא לבקרה"] },
        { "icon": "📉", "title": "משוואות דיפרנציאליות חלקיות (מד'ח)", "subtitle": "PDE", "topics": ["משוואת החום", "משוואת הגלים", "משוואת לפלס"] },
        { "icon": "⚡", "title": "מעבדה במעגלים חשמליים", "subtitle": "Circuits Lab", "topics": ["שימוש באוסצילוסקופ", "מדידות AC/DC"] },
        { "icon": "💡", "title": "מל'מ והתקנים אלקטרוניים", "subtitle": "Solid State", "topics": ["מוליכים למחצה", "צומת PN", "טרנזיסטורים"] },
        { "icon": "🧠", "title": "מבנה המחשב", "subtitle": "Computer Architecture", "topics": ["ISA", "Pipeline", "זכרון מטמון"] },
        { "icon": "🗂️", "title": "מבנה נתונים ואלגוריתמים", "subtitle": "Data Structures", "topics": ["רשימות מקושרות", "עצים", "גרפים"] }
      ]
    },
    "3": {
      "1": [
        { "icon": "🎲", "title": "אותות אקראיים ורעש", "subtitle": "Random Signals", "topics": ["תהליכים אקראיים", "רעש לבן"] },
        { "icon": "📡", "title": "מבוא לעיבוד ספרתי של אותות", "subtitle": "DSP", "topics": ["אותות DT", "התמרת Z", "מסננים ספרתיים"] },
        { "icon": "🌐", "title": "שדות אלקטרומגנטיים", "subtitle": "EM Fields", "topics": ["משוואות מקסוול", "גלים מישוריים", "קווי תמסורת"] },
        { "icon": "🔋", "title": "מעגלים אנלוגיים", "subtitle": "Analog Circuits", "topics": ["מגברי שרת", "מגברי טרנזיסטור"] },
        { "icon": "🔬", "title": "מעבדת אלקטרוניקה 1", "subtitle": "Electronics Lab 1", "topics": ["מדידות טרנזיסטורים"] },
        { "icon": "💻", "title": "מעבדת מיקרומעבדים", "subtitle": "Microprocessor Lab", "topics": ["תכנות בקרים", "פסיקות"] }
      ],
      "2": [
        { "icon": "📲", "title": "מבוא לתקשורת ספרתית", "subtitle": "Digital Comm", "topics": ["אפנון דיגיטלי", "גילוי שגיאות"] },
        { "icon": "〰️", "title": "גלים ומערכות מפולגות", "subtitle": "Waves", "topics": ["קרינה", "אנטנות", "קווי תמסורת"] },
        { "icon": "🎛️", "title": "מעגלים ספרתיים", "subtitle": "Digital Circuits", "topics": ["CMOS", "שערים לוגיים"] },
        { "icon": "🔬", "title": "מעבדה באלקטרוניקה 2", "subtitle": "Electronics Lab 2", "topics": ["מגברים מעשיים מתקדמים"] },
        { "icon": "🔗", "title": "פרוטוקולי תקשורת", "subtitle": "Comm Protocols", "topics": ["TCP/IP", "Ethernet", "HTTP"] }
      ]
    },
    "4": {
      "1": [
        { "icon": "🚀", "title": "פרויקט גמר שנתי", "subtitle": "Final Project", "topics": ["הגדרת פרויקט", "אפיון ועיצוב"] },
        { "icon": "📡", "title": "תקשורת אלחוטית", "subtitle": "Wireless Comm", "topics": ["אפנון אלחוטי", "ערוצי דעיכה"] },
        { "icon": "👁️", "title": "עיבוד תמונות וראייה ממוחשבת", "subtitle": "Computer Vision", "topics": ["התמרות תמונה", "זיהוי פנים"] },
        { "icon": "📻", "title": "מעבדת גלים ותקשורת", "subtitle": "Comm Lab", "topics": ["ניסויי RF", "אנטנות"] },
        { "icon": "🛠️", "title": "שפת תיאור חומרה (VHDL)", "subtitle": "Hardware Design", "topics": ["Verilog", "VHDL", "מערכות מורכבות"] },
        { "icon": "📚", "title": "קורס בחירה מתקדם 1", "subtitle": "Advanced Elective 1", "topics": ["נושא בחירה מתקדם בחשמל"] },
        { "icon": "🌍", "title": "קורס מרחיב דעת", "subtitle": "Liberal Arts Elective", "topics": ["קורס כללי"] }
      ],
      "2": [
        { "icon": "🎓", "title": "פרויקט גמר שנתי (המשך)", "subtitle": "Final Project 2", "topics": ["מימוש חומרה/תוכנה", "הגנה על פרויקט"] },
        { "icon": "🔐", "title": "מבוא לצפינה", "subtitle": "Cryptography", "topics": ["RSA", "הצפנה סימטרית"] },
        { "icon": "📊", "title": "מעבדה בתקשורת ומעבדה בעיבוד אותות ותמונות", "subtitle": "Advanced DSP & Comm Lab", "topics": ["ניסויים בעיבוד אותות"] },
        { "icon": "📶", "title": "עיבוד אותות אקראיים", "subtitle": "Random Signal Proc", "topics": ["סינון אופטימלי", "ווינר וקלמן"] },
        { "icon": "⏱️", "title": "מערכות זמן אמת", "subtitle": "Real-Time Systems", "topics": ["מערכות הפעלה בזמן אמת", "תזמון"] },
        { "icon": "📚", "title": "קורס בחירה מתקדם 2", "subtitle": "Advanced Elective 2", "topics": ["נושא בחירה מתקדם בחשמל 2"] },
        { "icon": "🌍", "title": "קורס מרחיב דעת 2", "subtitle": "Liberal Arts Elective 2", "topics": ["קורס כללי 2"] }
      ]
    }
  },
  "ruppin_spread": {
    "1": {
      "1": [
        { "icon": "🛠️", "title": "מיומנויות וחשיבה הנדסית", "subtitle": "Engineering Skills", "topics": ["חשיבה הנדסית"] },
        { "icon": "∫", "title": "חדו'א 1", "subtitle": "Calculus 1", "topics": ["גבולות ורציפות", "נגזרות וכלל השרשרת", "אינטגרלים"] },
        { "icon": "🔢", "title": "אלגברה ליניארית", "subtitle": "Linear Algebra", "topics": ["מערכות משוואות ומרחבים וקטוריים", "מטריצות ודטרמיננטות", "ערכים ווקטורים עצמיים"] },
        { "icon": "🏗️", "title": "פיזיקה 1", "subtitle": "Physics 1", "topics": ["קינמטיקה ודינמיקה", "חוקי ניוטון ומערכות ייחוס", "שימור אנרגיה ותנע", "תנועה הרמונית פשוטה", "גלים מכניים"] },
        { "icon": "💻", "title": "עקרונות התכנות ושפת C", "subtitle": "C Programming", "topics": ["Python / C בסיסי", "לולאות ותנאים"] }
      ],
      "2": [
        { "icon": "∬", "title": "חדו'א 2", "subtitle": "Calculus 2", "topics": ["אינטגרלים מסוימים", "טורים", "פונקציות מרובות משתנים", "אינטגרלים כפולים"] },
        { "icon": "📈", "title": "משוואות דיפרנציאליות רגילות (מד'ר)", "subtitle": "ODE", "topics": ["משוואות סדר ראשון", "משוואות סדר שני"] },
        { "icon": "⚛️", "title": "פיזיקה 2", "subtitle": "Physics 2", "topics": ["חוק קולון ושדה חשמלי", "חוק גאוס", "פוטנציאל חשמלי וקיבול", "שדה מגנטי וחוק אמפר"] },
        { "icon": "🖥️", "title": "מערכות ספרתיות ומבוא למבנה המחשב", "subtitle": "Digital Systems", "topics": ["VHDL בסיסי", "קודקסים ומפות קרנו", "דלגלגים ומכונות מצבים", "מוני סינכרוניים"] },
        { "icon": "⌨️", "title": "נושאים מתקדמים בשפת C", "subtitle": "Advanced C", "topics": ["מצביעים", "מבני ננתונים בסיסיים"] },
        { "icon": "🔬", "title": "מעבדה בפיזיקה", "subtitle": "Physics Lab", "topics": ["ניסויים במכניקה", "ניסויים בחשמל"] }
      ]
    },
    "2": {
      "1": [
        { "icon": "🎵", "title": "טורי פורייה והתמרות אינטגרליות", "subtitle": "Fourier Series", "topics": ["טורי פורייה", "התמרת לפלס", "התמרת פורייה"] },
        { "icon": "🌀", "title": "פונקציות מרוכבות", "subtitle": "Complex Functions", "topics": ["מספרים מרוכבים", "פונקציות אנליטיות", "משפט קושי"] },
        { "icon": "🔌", "title": "תורת המעגלים החשמליים + spice", "subtitle": "Circuit Theory", "topics": ["מעגלי זרם ישר", "משפטי רשת", "ניתוח AC ופאזורים"] },
        { "icon": "🌊", "title": "פיזיקה 3", "subtitle": "Physics 3", "topics": ["גלים", "אופטיקה", "פיזיקה מודרנית"] },
        { "icon": "🔬", "title": "מעבדה במערכות ספרתיות", "subtitle": "Digital Lab", "topics": ["ניסויי FPGA", "VHDL מעשי"] }
      ],
      "2": [
        { "icon": "📉", "title": "משוואות דיפרנציאליות חלקיות (מד'ח)", "subtitle": "PDE", "topics": ["משוואת החום", "משוואת הגלים", "משוואת לפלס"] },
        { "icon": "📶", "title": "אותות מערכות ומבוא לבקרה (Matlab)", "subtitle": "Signals & Systems", "topics": ["אותות CT", "קונבולוציה", "מבוא לבקרה"] },
        { "icon": "⚡", "title": "מעבדה במעגלים חשמליים", "subtitle": "Circuits Lab", "topics": ["שימוש באוסצילוסקופ", "מדידות AC/DC"] },
        { "icon": "☕", "title": "תכנות מונחה עצמים", "subtitle": "OOP", "topics": ["מחלקות ואובייקטים", "הורשה", "פולימורפיזם"] },
        { "icon": "🧠", "title": "מבנה המחשב", "subtitle": "Computer Architecture", "topics": ["ISA", "Pipeline", "זכרון מטמון"] }
      ]
    },
    "3": {
      "1": [
        { "icon": "🎲", "title": "מבוא להסתברות", "subtitle": "Probability", "topics": ["משתנים מקריים", "תוחלת ושונות", "התפלגויות מיוחדות"] },
        { "icon": "🌐", "title": "שדות אלקטרומגנטיים", "subtitle": "EM Fields", "topics": ["משוואות מקסוול", "גלים מישוריים", "קווי תמסורת"] },
        { "icon": "💡", "title": "מל'מ והתקנים אלקטרוניים", "subtitle": "Solid State", "topics": ["מוליכים למחצה", "צומת PN", "טרנזיסטורים"] },
        { "icon": "🗂️", "title": "מבנה נתונים ואלגוריתמים", "subtitle": "Data Structures", "topics": ["רשימות מקושרות", "עצים", "גרפים", "טבלאות גיבוב"] }
      ],
      "2": [
        { "icon": "🎲", "title": "אותות אקראיים ורעש", "subtitle": "Random Signals", "topics": ["תהליכים אקראיים", "רעש לבן"] },
        { "icon": "🤖", "title": "מתמטיקה ללמידת מכונה", "subtitle": "Math for ML", "topics": ["אופטימיזציה", "אלגוריתמי גרדיאנט"] },
        { "icon": "🔋", "title": "מעגלים אנלוגיים", "subtitle": "Analog Circuits", "topics": ["מגברי שרת", "מגברי טרנזיסטור"] },
        { "icon": "🔬", "title": "מעבדת אלקטרוניקה 1", "subtitle": "Electronics Lab 1", "topics": ["מדידות טרנזיסטורים"] }
      ]
    },
    "4": {
      "1": [
        { "icon": "📡", "title": "מבוא לעיבוד ספרתי של אותות", "subtitle": "DSP", "topics": ["אותות DT", "התמרת Z", "מסננים ספרתיים"] },
        { "icon": "〰️", "title": "גלים ומערכות מפולגות", "subtitle": "Waves", "topics": ["קרינה", "אנטנות", "קווי תמסורת"] },
        { "icon": "🎛️", "title": "מעגלים ספרתיים", "subtitle": "Digital Circuits", "topics": ["CMOS", "שערים לוגיים"] },
        { "icon": "🔗", "title": "פרוטוקולי תקשורת", "subtitle": "Comm Protocols", "topics": ["TCP/IP", "Ethernet", "HTTP"] }
      ],
      "2": [
        { "icon": "📲", "title": "מבוא לתקשורת ספרתית", "subtitle": "Digital Comm", "topics": ["אפנון דיגיטלי", "גילוי שגיאות"] },
        { "icon": "📻", "title": "מעבדת גלים ותקשורת", "subtitle": "Comm Lab", "topics": ["ניסויי RF", "אנטנות"] },
        { "icon": "💻", "title": "מעבדת מיקרומעבדים", "subtitle": "Microprocessor Lab", "topics": ["תכנות בקרים", "פסיקות"] },
        { "icon": "🛠️", "title": "שפת תיאור חומרה (HDL)", "subtitle": "Hardware Design", "topics": ["Verilog", "תכנון מערכות מורכבות"] }
      ]
    },
    "5": {
      "1": [
        { "icon": "🚀", "title": "פרויקט גמר שנתי", "subtitle": "Final Project", "topics": ["הגדרת פרויקט", "אפיון ועיצוב"] },
        { "icon": "👁️", "title": "עיבוד תמונות וראייה ממוחשבת", "subtitle": "Computer Vision", "topics": ["התמרות תמונה", "זיהוי פנים"] },
        { "icon": "📷", "title": "מעבדה בעיבוד אותות ותמונות", "subtitle": "Image Proc Lab", "topics": ["ניסויי Matlab", "מסנני תמונה"] },
        { "icon": "⏱️", "title": "מערכות זמן אמת", "subtitle": "Real-Time Systems", "topics": ["מערכות הפעלה בזמן אמת", "תזמון"] }
      ],
      "2": [
        { "icon": "🎓", "title": "פרויקט גמר שנתי (המשך)", "subtitle": "Final Project 2", "topics": ["מימוש חומרה/תוכנה", "הגנה על פרויקט"] },
        { "icon": "🌍", "title": "רשתות תקשורת מחשבים", "subtitle": "Computer Networks", "topics": ["ניתוב", "אבטחת רשתות"] },
        { "icon": "📶", "title": "מעבדה בתקשורת מתקדמת ו-SDR", "subtitle": "SDR Lab", "topics": ["תקשורת מוגדרת תוכנה", "USRP"] },
        { "icon": "🔐", "title": "מבוא לצפינה", "subtitle": "Cryptography", "topics": ["RSA", "הצפנה סימטרית"] }
      ]
    }
  },
  "bgu": {
    "1": {
      "1": [
        { "icon": "📐", "title": "חשבון דיפרנציאלי להנדסת חשמל", "subtitle": "Differential Calculus", "topics": ["חדו\"א"] },
        { "icon": "🧮", "title": "מבוא מתמטי למהנדסים", "subtitle": "Math Intro", "topics": ["מבוא למתמטיקה"] },
        { "icon": "🍏", "title": "פיזיקה 1 - הנדסת חשמל", "subtitle": "Physics 1", "topics": ["מכניקה"] },
        { "icon": "🔢", "title": "אלגברה ליניארית להנדסת חשמל 1", "subtitle": "Linear Algebra 1", "topics": ["מטריצות"] },
        { "icon": "🎲", "title": "מתמטיקה דיסקרטית", "subtitle": "Discrete Math", "topics": ["קומבינטוריקה"] }
      ],
      "2": [
        { "icon": "💻", "title": "מערכות ספרתיות להנדסת חשמל ומחשבים", "subtitle": "Digital Systems", "topics": ["מערכות ספרתיות"] },
        { "icon": "∫", "title": "חשבון אינטגרלי ומשוואות דיפרנציאליות רגילות להנדסת חשמל", "subtitle": "Integral Calculus & ODE", "topics": ["אינטגרלים", "מד\"ר"] },
        { "icon": "🔢", "title": "אלגברה ליניארית להנדסת חשמל 2", "subtitle": "Linear Algebra 2", "topics": ["מרחבים וקטוריים"] },
        { "icon": "⚡", "title": "פיזיקה 2א", "subtitle": "Physics 2A", "topics": ["חשמל ומגנטיות"] },
        { "icon": "🖥️", "title": "יסודות מדעי המחשב", "subtitle": "Computer Science Intro", "topics": ["מבוא לתכנות"] }
      ]
    },
    "2": {
      "1": [
        { "icon": "🧭", "title": "חדו\"א וקטורי להנדסת חשמל", "subtitle": "Vector Calculus", "topics": ["אנליזה וקטורית"] },
        { "icon": "〰️", "title": "אנליזת פורייה להנדסת חשמל", "subtitle": "Fourier Analysis", "topics": ["טורי פורייה"] },
        { "icon": "🧠", "title": "מבוא למחשבים להנדסת חשמל ומחשבים", "subtitle": "Computer Intro", "topics": ["מבנה המחשב"] },
        { "icon": "🌊", "title": "פיסיקה 3א", "subtitle": "Physics 3A", "topics": ["גלים ואופטיקה"] },
        { "icon": "🔌", "title": "מבוא להנדסת חשמל", "subtitle": "EE Intro", "topics": ["מבוא להנדסת חשמל"] }
      ],
      "2": [
        { "icon": "📊", "title": "מבוא למערכות ליניאריות", "subtitle": "Linear Systems", "topics": ["מערכות ליניאריות"] },
        { "icon": "💡", "title": "מבוא להתקני מוליכים למחצה", "subtitle": "Semiconductor Devices", "topics": ["מל\"מ"] },
        { "icon": "🌀", "title": "יסודות תורת הפונקציות המרוכבות", "subtitle": "Complex Functions", "topics": ["פונקציות מרוכבות"] },
        { "icon": "💻", "title": "מבוא לשיטות חישוביות", "subtitle": "Numerical Methods", "topics": ["שיטות נומריות"] },
        { "icon": "🔬", "title": "מעבדת מבוא בחשמל", "subtitle": "Basic EE Lab", "topics": ["מעבדה חשמל"] },
        { "icon": "📡", "title": "שדות אלקטרומגנטיים", "subtitle": "EM Fields", "topics": ["שדות א\"מ"] },
        { "icon": "🎲", "title": "תורת ההסתברות להנדסת חשמל", "subtitle": "Probability", "topics": ["הסתברות"] }
      ]
    },
    "3": {
      "1": [
        { "icon": "📡", "title": "מבוא לעיבוד אותם", "subtitle": "Signals & Systems", "topics": ["עיבוד אותות"] },
        { "icon": "🎲", "title": "מבוא לתהליכים אקראיים", "subtitle": "Random Processes", "topics": ["תהליכים אקראיים"] },
        { "icon": "🔋", "title": "מבוא למעגלים אלקטרוניים אנלוגיים", "subtitle": "Analog Circuits", "topics": ["מעגלים אנלוגיים"] },
        { "icon": "🔬", "title": "מעבדת מעגלים אנלוגיים", "subtitle": "Analog Lab", "topics": ["מעבדה אנלוגית"] }
      ],
      "2": [
        { "icon": "🎛️", "title": "מעגלים אלקטרוניים ספרתיים", "subtitle": "Digital Circuits", "topics": ["מעגלים ספרתיים"] }
      ]
    },
    "4": {
      "1": [
        { "icon": "🚀", "title": "פרויקט הנדסי 1", "subtitle": "Cap Project 1", "topics": ["פרויקט גמר 1"] },
        { "icon": "🔬", "title": "מעבדת בחירה מתקדמת", "subtitle": "Advanced Lab", "topics": ["מעבדה מתקדמת"] }
      ],
      "2": [
        { "icon": "🎓", "title": "פרויקט הנדסי 2", "subtitle": "Cap Project 2", "topics": ["פרויקט גמר 2"] }
      ]
    }
  },
  "technion": {
    "1": {
      "1": [
        { "icon": "🖥️", "title": "מבוא למדמ\"ח", "subtitle": "Intro to CS", "topics": ["מדעי המחשב"] },
        { "icon": "🛡️", "title": "בטיחות במעבדות חשמל", "subtitle": "Lab Safety", "topics": ["בטיחות"] },
        { "icon": "🍏", "title": "פיסיקה 1מ'", "subtitle": "Physics 1M", "topics": ["מכניקה טכניון"] },
        { "icon": "🔬", "title": "מעבדה בפיסיקה 1מ'", "subtitle": "Physics Lab 1M", "topics": ["מעבדה מכניקה"] },
        { "icon": "🔢", "title": "אלגברה 1מ'", "subtitle": "Algebra 1M", "topics": ["אלגברה טכניון"] },
        { "icon": "∫", "title": "חדו\"א 1ת'", "subtitle": "Calculus 1T", "topics": ["חדו\"א טכניון"] },
        { "icon": "🔤", "title": "אנגלית טכנית", "subtitle": "Technical English", "topics": ["אנגלית טכנית"] }
      ],
      "2": [
        { "icon": "💻", "title": "מערכות ספרתיות ומבנה המחשב", "subtitle": "Digital Systems", "topics": ["מערכות ספרתיות ומבנה המחשב"] },
        { "icon": "⚡", "title": "פיסיקה 2ממ'", "subtitle": "Physics 2MM", "topics": ["חשמל טכניון"] },
        { "icon": "∬", "title": "חדו\"א 2ת'", "subtitle": "Calculus 2T", "topics": ["חדו\"א 2 טכניון"] },
        { "icon": "📈", "title": "מד\"ר מ'", "subtitle": "ODE M", "topics": ["מד\"ר טכניון"] },
        { "icon": "🔢", "title": "אלגברה ליניארית מ'", "subtitle": "Linear Algebra M", "topics": ["אלגברה 2 טכניון"] }
      ]
    },
    "2": {
      "1": [
        { "icon": "🗂️", "title": "מבוא למבני נתונים ואלגוריתמים", "subtitle": "Algorithms & Data Structures", "topics": ["מבני נתונים"] },
        { "icon": "🔬", "title": "מעבדה בהנדסת חשמל 1א'", "subtitle": "EE Lab 1A", "topics": ["מעבדה חשמל 1"] },
        { "icon": "🔌", "title": "תורת המעגלים החשמליים", "subtitle": "Circuit Theory", "topics": ["תורת המעגלים"] },
        { "icon": "⚛️", "title": "מבוא לפיסיקה קוונטית להנדסה", "subtitle": "Quantum Physics Intro", "topics": ["קוונטים"] },
        { "icon": "📉", "title": "משוואות דיפרנציאליות חלקיות ת'",
          "subtitle": "PDE", "topics": ["מד\"ח טכניון"] },
        { "icon": "🌀", "title": "פונקציות מרוכבות א'", "subtitle": "Complex Functions A", "topics": ["מרוכבות טכניון"] },
        { "icon": "〰️", "title": "טורי פורייה והתמרות אינטגרליות", "subtitle": "Fourier Series", "topics": ["פורייה"] }
      ],
      "2": [
        { "icon": "🔋", "title": "מעגלים אלקטרוניים", "subtitle": "Electronic Circuits", "topics": ["מעגלים אלקטרוניים"] },
        { "icon": "🔬", "title": "מעבדה בהנדסת חשמל 1ב'", "subtitle": "EE Lab 1B", "topics": ["מעבדה חשמל 2"] },
        { "icon": "💡", "title": "התקני מל\"מ", "subtitle": "Solid State Devices", "topics": ["התקני מל\"מ"] },
        { "icon": "🧲", "title": "אלקטרודינמיקה פיסיקלית", "subtitle": "Physical Electrodynamics", "topics": ["אלקטרודינמיקה"] },
        { "icon": "🎲", "title": "מבוא להסתברות ח'", "subtitle": "Probability Intro", "topics": ["הסתברות טכניון"] },
        { "icon": "📶", "title": "אותות ומערכות", "subtitle": "Signals & Systems", "topics": ["אותות ומערכות טכניון"] },
        { "icon": "📡", "title": "שדות א\"מ", "subtitle": "EM Fields", "topics": ["שדות א\"מ טכניון"] }
      ]
    },
    "3": {
      "1": [
        { "icon": "🎛️", "title": "מעגלים אלקטרוניים ספרתיים", "subtitle": "Digital Circuits", "topics": ["ספרתיים טכניון"] },
        { "icon": "🚀", "title": "פרויקט א'", "subtitle": "Design Project A", "topics": ["פרויקט 1 טכניון"] },
        { "icon": "🎲", "title": "אותות אקראיים", "subtitle": "Random Signals", "topics": ["אקראיים טכניון"] },
        { "icon": "🌊", "title": "גלים ומערכות מפולגות", "subtitle": "Waves & Distributed Systems", "topics": ["גלים טכניון"] },
        { "icon": "🔬", "title": "מקצועות מעבדה מחלקתיים", "subtitle": "Departmental Labs", "topics": ["מעבדות"] }
      ],
      "2": [
        { "icon": "🎓", "title": "פרויקט ב'", "subtitle": "Design Project B", "topics": ["פרויקט 2 טכניון"] },
        { "icon": "🔬", "title": "מקצועות מעבדה מתקדמים", "subtitle": "Advanced Labs", "topics": ["מעבדות מתקדמות"] },
        { "icon": "🎯", "title": "אשכולות התמחות ומקצועות בחירה חופשית", "subtitle": "Tracks", "topics": ["התמחות"] }
      ]
    },
    "4": {
      "1": [
        { "icon": "🎓", "title": "פרויקט ב' (המשך)", "subtitle": "Project B Cont", "topics": ["פרויקט 2 המשך"] },
        { "icon": "🎯", "title": "אשכולות התמחות (המשך)", "subtitle": "Tracks Cont", "topics": ["התמחות המשך"] }
      ],
      "2": [
        { "icon": "🎓", "title": "השלמות לתואר", "subtitle": "Completion", "topics": ["השלמות"] }
      ]
    }
  },
  "hit": {
    "1": {
      "1": [
        { "icon": "∫", "title": "חדו\"א 1", "subtitle": "Calculus 1", "topics": ["חדו\"א 1 HIT"] },
        { "icon": "🔢", "title": "אלגברה ליניארית", "subtitle": "Linear Algebra", "topics": ["אלגברה HIT"] },
        { "icon": "🍏", "title": "פיסיקה 1", "subtitle": "Physics 1", "topics": ["מכניקה HIT"] },
        { "icon": "💻", "title": "מבוא למדעי המחשב ושפת C", "subtitle": "C Intro", "topics": ["תכנות HIT"] }
      ],
      "2": [
        { "icon": "∬", "title": "חדו\"א 2", "subtitle": "Calculus 2", "topics": ["חדו\"א 2 HIT"] },
        { "icon": "⚡", "title": "פיסיקה 2", "subtitle": "Physics 2", "topics": ["חשמל HIT"] },
        { "icon": "📈", "title": "משוואות דיפרנציאליות רגילות (מד\"ר)", "subtitle": "ODE", "topics": ["מד\"ר HIT"] },
        { "icon": "⌨️", "title": "תכנות מתקדם בשפת C", "subtitle": "Advanced C", "topics": ["תכנות מתקדם HIT"] },
        { "icon": "🔬", "title": "מעבדה בפיסיקה 1", "subtitle": "Lab Physics 1", "topics": ["מעבדה פיסיקה 1 HIT"] }
      ]
    },
    "2": {
      "1": [
        { "icon": "🌀", "title": "פונקציות מרוכבות", "subtitle": "Complex Functions", "topics": ["מרוכבות HIT"] },
        { "icon": "〰️", "title": "אנליזת פורייה והתמרות", "subtitle": "Fourier", "topics": ["פורייה HIT"] },
        { "icon": "🔌", "title": "מבוא להנדסת חשמל 1", "subtitle": "EE Intro 1", "topics": ["הנדסת חשמל 1 HIT"] },
        { "icon": "🖥️", "title": "מערכות ספרתיות", "subtitle": "Digital Systems", "topics": ["ספרתיות HIT"] },
        { "icon": "🔬", "title": "מעבדה בפיסיקה 2", "subtitle": "Lab Physics 2", "topics": ["מעבדה פיסיקה 2 HIT"] },
        { "icon": "🎲", "title": "מבוא להסתברות וסטטיסטיקה", "subtitle": "Probability & Stats", "topics": ["הסתברות HIT"] }
      ],
      "2": [
        { "icon": "📶", "title": "אותות ומערכות ליניאריות", "subtitle": "Signals & Systems", "topics": ["אותות ומערכות HIT"] },
        { "icon": "🔌", "title": "מבוא להנדסת חשמל 2", "subtitle": "EE Intro 2", "topics": ["הנדסת חשמל 2 HIT"] },
        { "icon": "🔬", "title": "מעבדה במערכות ספרתיות", "subtitle": "Digital Lab", "topics": ["מעבדה ספרתיות HIT"] },
        { "icon": "📡", "title": "שדות אלקטרומגנטיים", "subtitle": "EM Fields", "topics": ["שדות א\"מ HIT"] },
        { "icon": "💡", "title": "התקני מל\"מ", "subtitle": "Solid State", "topics": ["מל\"מ HIT"] },
        { "icon": "🧠", "title": "מבוא למבנה המחשב", "subtitle": "Computer Architecture", "topics": ["מבנה המחשב HIT"] }
      ]
    },
    "3": {
      "1": [
        { "icon": "📉", "title": "מבוא לעיבוד ספרתי של אותות (DSP)", "subtitle": "DSP", "topics": ["DSP HIT"] },
        { "icon": "🔋", "title": "מעגלים אלקטרוניים ליניאריות (אנלוגיים)", "subtitle": "Analog Circuits", "topics": ["מעגלים אנלוגיים HIT"] },
        { "icon": "🔬", "title": "מעבדת מבוא להנדסת חשמל", "subtitle": "Intro Lab", "topics": ["מעבדה חשמל HIT"] },
        { "icon": "🤖", "title": "הנדסת מערכות בקרה", "subtitle": "Control Systems", "topics": ["בקרה HIT"] }
      ],
      "2": [
        { "icon": "🎛️", "title": "מעגלים אלקטרוניים ספרתיים", "subtitle": "Digital Circuits", "topics": ["מעגלים ספרתיים HIT"] },
        { "icon": "🔬", "title": "מעבדת מעגלים אלקטרוניים 1", "subtitle": "Electronics Lab 1", "topics": ["מעבדה אנלוגית 1 HIT"] },
        { "icon": "🚀", "title": "פרויקט קורס ליבה", "subtitle": "Core Project", "topics": ["פרויקט ליבה HIT"] }
      ]
    },
    "4": {
      "1": [
        { "icon": "🎓", "title": "פרויקט גמר הנדסי א'", "subtitle": "Final Project A", "topics": ["פרויקט גמר 1 HIT"] },
        { "icon": "🔬", "title": "מעבדת מעגלים אלקטרוניים 2", "subtitle": "Lab Electronics 2", "topics": ["מעבדה אנלוגית 2 HIT"] },
        { "icon": "🎯", "title": "קורסי חובה מחלקתיים", "subtitle": "Required Courses", "topics": ["חובה HIT"] }
      ],
      "2": [
        { "icon": "🎓", "title": "פרויקט גמר הנדסי ב'", "subtitle": "Final Project B", "topics": ["פרויקט גמר 2 HIT"] },
        { "icon": "📝", "title": "סמינר מחלקתי", "subtitle": "Seminar", "topics": ["סמינר HIT"] },
        { "icon": "🎯", "title": "השלמות חובה לתואר", "subtitle": "Completion", "topics": ["השלמות HIT"] }
      ]
    }
  },
  "tau": {
    "1": {
      "1": [
        { "icon": "📐", "title": "חדו\"א 1א'", "subtitle": "Calculus 1A", "topics": ["גבולות ורציפות", "נגזרות", "אינטגרלים"] },
        { "icon": "🔢", "title": "אלגברה ליניארית", "subtitle": "Linear Algebra", "topics": ["מטריצות", "מרחבים וקטוריים"] },
        { "icon": "🍏", "title": "פיזיקה קלאסית 1", "subtitle": "Physics 1", "topics": ["מכניקה ניוטונית", "אנרגיה ותנע"] },
        { "icon": "🖥️", "title": "מבוא למחשב להנדסה", "subtitle": "Intro to CS", "topics": ["שפת C יסודות", "לולאות ומערכים"] }
      ],
      "2": [
        { "icon": "∬", "title": "חדו\"א 2א'", "subtitle": "Calculus 2A", "topics": ["טורים", "פונקציות מרובות משתנים"] },
        { "icon": "⚡", "title": "פיזיקה מודרנית (חשמל ומגנטיות)", "subtitle": "Physics 2", "topics": ["שדה חשמלי", "חוק אמפר", "משוואות מקסוול"] },
        { "icon": "⌨️", "title": "מערכות ספרתיות", "subtitle": "Digital Systems", "topics": ["לוגיקה בוליאנית", "מכונות מצבים"] },
        { "icon": "📈", "title": "משוואות דיפרנציאליות רגילות", "subtitle": "ODE", "topics": ["משוואות ליניאריות", "התמרת לפלס"] }
      ]
    },
    "2": {
      "1": [
        { "icon": "🧭", "title": "חדו\"א וקטורי", "subtitle": "Vector Calculus", "topics": ["אינטגרלים כפולים ומשולשים", "משפטי גרין וסטוקס"] },
        { "icon": "〰️", "title": "אנליזה הרמונית (פורייה)", "subtitle": "Harmonic Analysis", "topics": ["טורי פורייה", "התמרת פורייה"] },
        { "icon": "🔌", "title": "מבוא להנדסת חשמל", "subtitle": "EE Intro", "topics": ["רשתות זרם ישר", "פאזורים ו-AC"] },
        { "icon": "🌊", "title": "פיזיקה 3 (גלים ואופטיקה)", "subtitle": "Waves & Optics", "topics": ["משוואת הגלים", "אופטיקה גיאומטרית"] }
      ],
      "2": [
        { "icon": "📶", "title": "אותות ומערכות", "subtitle": "Signals & Systems", "topics": ["מערכות LTI", "תגובה לתדר"] },
        { "icon": "💡", "title": "התקנים אלקטרוניים", "subtitle": "Electronic Devices", "topics": ["צומת PN", "טרנזיסטור BJT", "טרנזיסטור MOSFET"] },
        { "icon": "🎲", "title": "הסתברות ותהליכים אקראיים", "subtitle": "Probability", "topics": ["משתנים מקריים", "תהליכים סטציונריים"] },
        { "icon": "🔬", "title": "מעבדת מבוא להנדסת חשמל", "subtitle": "Basic EE Lab", "topics": ["אוסצילוסקופ", "מעגלי RLC"] }
      ]
    },
    "3": {
      "1": [
        { "icon": "🔋", "title": "מעגלים אלקטרוניים אנלוגיים", "subtitle": "Analog Circuits", "topics": ["מגברים מרובי דרגות", "תגובת תדר של מגברים", "משוב שלילי"] },
        { "icon": "📡", "title": "שדות אלקטרומגנטיים", "subtitle": "EM Fields", "topics": ["משוואות מקסוול", "גלים מישוריים", "קווי תמסורת"] },
        { "icon": "🔬", "title": "מעבדה באלקטרוניקה 1", "subtitle": "Electronics Lab 1", "topics": ["מגברי שרת מעשיים", "טרנזיסטור כמפתח"] },
        { "icon": "🤖", "title": "מערכות בקרה ליניאריות", "subtitle": "Control Systems", "topics": ["דיאגרמות מלבנים", "יציבות נייקוויסט", "פיצוי PID"] }
      ],
      "2": [
        { "icon": "🎛️", "title": "מעגלים אלקטרוניים ספרתיים", "subtitle": "Digital Circuits", "topics": ["CMOS", "שערים לוגיים מהירים", "זמני השהייה"] },
        { "icon": "📲", "title": "מבוא לתקשורת ספרתית", "subtitle": "Digital Comm", "topics": ["אפנונים", "תקשורת רעש"] },
        { "icon": "🧠", "title": "מבוא לעיבוד אותות DSP", "subtitle": "DSP", "topics": ["התמרת Z", "מסנני FIR/IIR"] }
      ]
    },
    "4": {
      "1": [
        { "icon": "🚀", "title": "פרויקט הנדסי א'", "subtitle": "Engineering Project A", "topics": ["אפיון פרויקט", "תכנון ראשוני"] },
        { "icon": "🔬", "title": "מעבדה מתקדמת בחשמל", "subtitle": "Advanced Lab", "topics": ["ניסויי RF ותקשורת"] }
      ],
      "2": [
        { "icon": "🎓", "title": "פרויקט הנדסי ב'", "subtitle": "Engineering Project B", "topics": ["בדיקות אינטגרציה", "הגשת פרויקט"] }
      ]
    }
  },
  "afeka": {
    "1": {
      "1": [
        { "icon": "📐", "title": "חשבון דיפרנציאלי ואינטגרלי 1", "subtitle": "Calculus 1", "topics": ["גבולות ורציפות", "נגזרות ואינטגרלים"] },
        { "icon": "🔢", "title": "אלגברה ליניארית", "subtitle": "Linear Algebra", "topics": ["מערכות משוואות", "מטריצות"] },
        { "icon": "🍏", "title": "פיזיקה מכניקה", "subtitle": "Physics 1", "topics": ["חוקי ניוטון", "שימור תנע ואנרגיה"] },
        { "icon": "💻", "title": "מבוא למדעי המחשב בשפת C", "subtitle": "Intro to CS", "topics": ["משתנים", "לולאות", "פונקציות"] }
      ],
      "2": [
        { "icon": "∬", "title": "חשבון דיפרנציאלי ואינטגרלי 2", "subtitle": "Calculus 2", "topics": ["אינטגרלים מרובים", "טורי חזקות"] },
        { "icon": "⚡", "title": "פיזיקה חשמל ומגנטיות", "subtitle": "Physics 2", "topics": ["שדות חשמליים", "פוטנציאל", "השראה מגנטית"] },
        { "icon": "📈", "title": "משוואות דיפרנציאליות רגילות", "subtitle": "ODE", "topics": ["משוואות מסדר ראשון ושני"] },
        { "icon": "⌨️", "title": "מערכות ספרתיות", "subtitle": "Digital Systems", "topics": ["מפות קרנו", "דלגלגים ומונים"] }
      ]
    },
    "2": {
      "1": [
        { "icon": "🔌", "title": "תורת הרשתות והמעגלים החשמליים 1", "subtitle": "Circuits 1", "topics": ["משפטי רשת זרם ישר", "אנליזת צמתים ולולאות"] },
        { "icon": "〰️", "title": "טורי פורייה והתמרות אינטגרליות", "subtitle": "Fourier & Laplace", "topics": ["התמרת לפלס", "טורי פורייה"] },
        { "icon": "🌀", "title": "פונקציות מרוכבות", "subtitle": "Complex Functions", "topics": ["פונקציות אנליטיות", "אינטגרלים מרוכבים"] }
      ],
      "2": [
        { "icon": "🔌", "title": "תורת המעגלים החשמליים 2", "subtitle": "Circuits 2", "topics": ["ניתוח AC ופאזורים", "מעגלים תלת פאזיים"] },
        { "icon": "📶", "title": "אותות ומערכות", "subtitle": "Signals & Systems", "topics": ["מערכות ליניאריות קבועות בזמן"] },
        { "icon": "🎲", "title": "הסתברות וסטטיסטיקה", "subtitle": "Probability", "topics": ["משתנים מקריים רציפים ובדידים"] },
        { "icon": "🔬", "title": "מעבדה בתורת המעגלים", "subtitle": "Circuits Lab", "topics": ["מדידות בזרם ישר וחילופין"] }
      ]
    },
    "3": {
      "1": [
        { "icon": "💡", "title": "התקני מל\"מ ואלקטרוניקה 1", "subtitle": "Electronics 1", "topics": ["דיודות", "MOSFET ו-BJT בסיסיים"] },
        { "icon": "📡", "title": "תורה אלקטרומגנטית 1", "subtitle": "EM Theory 1", "topics": ["חוק גאוס לשדות", "משוואות מקסוול הסטטיות"] },
        { "icon": "🤖", "title": "מערכות בקרה", "subtitle": "Control Systems", "topics": ["פונקציות תמסורת", "שגיאה במצב מתמיד"] }
      ],
      "2": [
        { "icon": "🔋", "title": "מעגלים מיקרואלקטרוניים (אלקטרוניקה 2)", "subtitle": "Electronics 2", "topics": ["מגברי הפרש", "מגברי שרת ומסננים"] },
        { "icon": "🧠", "title": "מבנה המחשב ומיקרומעבדים", "subtitle": "Microprocessors", "topics": ["שפת אסמבלי", "מבנה המעבד"] },
        { "icon": "🔬", "title": "מעבדת אלקטרוניקה 1", "subtitle": "Electronics Lab 1", "topics": ["בנייה ומדידה של מגברים"] }
      ]
    },
    "4": {
      "1": [
        { "icon": "🚀", "title": "פרויקט גמר א'", "subtitle": "Project A", "topics": ["סקירת ספרות", "תכנון ארכיטקטורה"] }
      ],
      "2": [
        { "icon": "🎓", "title": "פרויקט גמר ב'", "subtitle": "Project B", "topics": ["בדיקות סופיות", "כתיבת ספר פרויקט"] }
      ]
    }
  },
  "biu": {
    "1": {
      "1": [
        { "icon": "📐", "title": "אינפי 1", "subtitle": "Infinitesimal Math 1", "topics": ["גבולות", "רציפות", "גזירות"] },
        { "icon": "🔢", "title": "אלגברה ליניארית 1", "subtitle": "Linear Algebra 1", "topics": ["מטריצות", "מערכות משוואות"] },
        { "icon": "🍏", "title": "פיזיקה מכניקה", "subtitle": "Physics Mechanics", "topics": ["קינמטיקה", "דינמיקה", "תנע קווי"] }
      ],
      "2": [
        { "icon": "∬", "title": "אינפי 2", "subtitle": "Infinitesimal Math 2", "topics": ["אינטגרציה", "טורים"] },
        { "icon": "⚡", "title": "פיזיקה חשמל ומגנטיות", "subtitle": "Physics Electromagnetism", "topics": ["חוק קולון", "חוק גאוס", "פוטנציאל"] },
        { "icon": "⌨️", "title": "מערכות ספרתיות", "subtitle": "Digital Systems", "topics": ["לוגיקה בוליאנית", "מכונות מצבים"] }
      ]
    },
    "2": {
      "1": [
        { "icon": "📈", "title": "משוואות דיפרנציאליות רגילות", "subtitle": "ODE", "topics": ["משוואות ליניאריות סדר ראשון ושני"] },
        { "icon": "🔌", "title": "מעגלים חשמליים", "subtitle": "Circuits", "topics": ["פאזורים", "אימפדנס", "משפטי תבנין ונורטון"] }
      ],
      "2": [
        { "icon": "📶", "title": "אותות ומערכות", "subtitle": "Signals & Systems", "topics": ["מערכות LTI", "קונבולוציה", "פורייה"] },
        { "icon": "💡", "title": "התקני מוליכים למחצה", "subtitle": "Semiconductors", "topics": ["פיזיקה של מל\"מ", "דיודות", "טרנזיסטורים"] }
      ]
    },
    "3": {
      "1": [
        { "icon": "🔋", "title": "מעגלים אנלוגיים", "subtitle": "Analog Circuits", "topics": ["מגברי שרת", "תגובת תדר"] }
      ],
      "2": [
        { "icon": "📡", "title": "שדות אלקטרומגנטיים", "subtitle": "EM Fields", "topics": ["חוקי מקסוול", "קווי תמסורת"] }
      ]
    },
    "4": {
      "1": [
        { "icon": "🚀", "title": "פרויקט גמר א'", "subtitle": "Project A", "topics": ["תכנון ארכיטקטורה"] }
      ],
      "2": [
        { "icon": "🎓", "title": "פרויקט גמר ב'", "subtitle": "Project B", "topics": ["אינטגרציה ובדיקות"] }
      ]
    }
  },
  "huji": {
    "1": {
      "1": [
        { "icon": "📐", "title": "אינפי 1", "subtitle": "Infinitesimal Math 1", "topics": ["סדרות וטורים", "רציפות וגזירות"] },
        { "icon": "🔢", "title": "אלגברה ליניארית", "subtitle": "Linear Algebra", "topics": ["מטריצות", "מרחבים וקטוריים"] },
        { "icon": "💻", "title": "מבוא למחשב להנדסת חשמל", "subtitle": "Intro to CS", "topics": ["יסודות התכנות ב-C"] }
      ],
      "2": [
        { "icon": "∬", "title": "אינפי 2", "subtitle": "Infinitesimal Math 2", "topics": ["אינטגרלים", "פונקציות מרובות משתנים"] },
        { "icon": "⚡", "title": "פיזיקה חשמל ומגנטיות", "subtitle": "Physics 2", "topics": ["חשמל סטטי", "מגנטיות", "חוקי מקסוול"] },
        { "icon": "⌨️", "title": "מערכות ספרתיות ומבנה המחשב", "subtitle": "Digital Systems", "topics": ["מבנה המחשב", "מכונות מצבים"] }
      ]
    },
    "2": {
      "1": [
        { "icon": "📈", "title": "משוואות דיפרנציאליות רגילות", "subtitle": "ODE", "topics": ["מד\"ר ליניאריות"] },
        { "icon": "🔌", "title": "תורת המעגלים", "subtitle": "Circuits", "topics": ["מעגלי DC ו-AC", "פאזורים"] }
      ],
      "2": [
        { "icon": "📶", "title": "אותות ומערכות", "subtitle": "Signals & Systems", "topics": ["התמרת פורייה", "התמרת לפלס"] },
        { "icon": "💡", "title": "מבוא להתקנים אלקטרוניים", "subtitle": "Devices", "topics": ["חומרים מוליכים למחצה", "דיודות", "טרנזיסטורים"] }
      ]
    },
    "3": {
      "1": [
        { "icon": "🔋", "title": "מעגלים מיקרואלקטרוניים אנלוגיים", "subtitle": "Analog Circuits", "topics": ["מגברי שרת ומגברים מרובי דרגות"] }
      ],
      "2": [
        { "icon": "📡", "title": "שדות אלקטרומגנטיים", "subtitle": "EM Fields", "topics": ["משוואות מקסוול", "קווי תמסורת"] }
      ]
    },
    "4": {
      "1": [
        { "icon": "🚀", "title": "פרויקט גמר 1", "subtitle": "Project 1", "topics": ["אפיון פרויקט גמר"] }
      ],
      "2": [
        { "icon": "🎓", "title": "פרויקט גמר 2", "subtitle": "Project 2", "topics": ["הגשת הפרויקט"] }
      ]
    }
  },
  "ariel": {
    "1": {
      "1": [
        { "icon": "📐", "title": "חדו\"א 1", "subtitle": "Calculus 1", "topics": ["גבולות", "נגזרות", "אינטגרלים בסיסיים"] },
        { "icon": "🔢", "title": "אלגברה ליניארית", "subtitle": "Linear Algebra", "topics": ["מטריצות ודטרמיננטות"] },
        { "icon": "🍏", "title": "פיזיקה 1 (מכניקה)", "subtitle": "Physics 1", "topics": ["דינמיקה ומכניקה ניוטונית"] }
      ],
      "2": [
        { "icon": "∬", "title": "חדו\"א 2", "subtitle": "Calculus 2", "topics": ["אינטגרציה מתקדמת", "טורים"] },
        { "icon": "⚡", "title": "פיזיקה 2 (חשמל ומגנטיות)", "subtitle": "Physics 2", "topics": ["שדות חשמליים ומגנטיים"] },
        { "icon": "🖥️", "title": "מבוא למדעי המחשב ושפת C", "subtitle": "Intro to CS", "topics": ["תכנות פרוצדורלי"] }
      ]
    },
    "2": {
      "1": [
        { "icon": "🔌", "title": "מעגלים חשמליים 1", "subtitle": "Circuits 1", "topics": ["רשתות זרם ישר", "פאזורים"] },
        { "icon": "📈", "title": "משוואות דיפרנציאליות רגילות", "subtitle": "ODE", "topics": ["פתרון מד\"ר"] }
      ],
      "2": [
        { "icon": "📶", "title": "אותות ומערכות ליניאריות", "subtitle": "Signals & Systems", "topics": ["קונבולוציה ופורייה"] },
        { "icon": "💡", "title": "התקני מל\"מ", "subtitle": "Semiconductor Devices", "topics": ["דיודות וטרנזיסטורים"] }
      ]
    },
    "3": {
      "1": [
        { "icon": "🔋", "title": "מעגלים אלקטרוניים אנלוגיים", "subtitle": "Analog Circuits", "topics": ["מגברי שרת"] }
      ],
      "2": [
        { "icon": "📡", "title": "שדות אלקטרומגנטיים", "subtitle": "EM Fields", "topics": ["משוואות מקסוול"] }
      ]
    },
    "4": {
      "1": [
        { "icon": "🚀", "title": "פרויקט הנדסי א'", "subtitle": "Project A", "topics": ["תכנון ראשוני"] }
      ],
      "2": [
        { "icon": "🎓", "title": "פרויקט הנדסי ב'", "subtitle": "Project B", "topics": ["בנייה והוכחת היתכנות"] }
      ]
    }
  },
  "shamoon": {
    "1": {
      "1": [
        { "icon": "📐", "title": "חדו\"א 1", "subtitle": "Calculus 1", "topics": ["גבולות ונגזרות"] },
        { "icon": "🔢", "title": "אלגברה ליניארית", "subtitle": "Linear Algebra", "topics": ["מטריצות ומשוואות"] },
        { "icon": "🍏", "title": "פיזיקה 1 - מכניקה", "subtitle": "Physics 1", "topics": ["חוקי ניוטון", "קינמטיקה"] }
      ],
      "2": [
        { "icon": "∬", "title": "חדו\"א 2", "subtitle": "Calculus 2", "topics": ["אינטגרלים", "טורים"] },
        { "icon": "⚡", "title": "פיזיקה 2 - חשמל ומגנטיות", "subtitle": "Physics 2", "topics": ["חשמל ומגנטיות"] },
        { "icon": "💻", "title": "שפת C ומבוא למחשבים", "subtitle": "C Programming", "topics": ["לולאות ומערכים ב-C"] }
      ]
    },
    "2": {
      "1": [
        { "icon": "🔌", "title": "רשתות חשמל ומעגלים", "subtitle": "Circuits", "topics": ["מעגלי DC ו-AC"] },
        { "icon": "📈", "title": "משוואות דיפרנציאליות רגילות", "subtitle": "ODE", "topics": ["משוואות ליניאריות"] }
      ],
      "2": [
        { "icon": "📶", "title": "אותות ומערכות", "subtitle": "Signals & Systems", "topics": ["אנליזת פורייה ולפלס"] },
        { "icon": "💡", "title": "התקני מל\"מ ואלקטרוניקה בסיסית", "subtitle": "Semiconductors", "topics": ["מל\"מ בסיסי", "דיודות"] }
      ]
    },
    "3": {
      "1": [
        { "icon": "🔋", "title": "אלקטרוניקה אנלוגית וליניארית", "subtitle": "Analog Electronics", "topics": ["מגברי הפרש ושרת"] }
      ],
      "2": [
        { "icon": "📡", "title": "שדות אלקטרומגנטיים להנדסת חשמל", "subtitle": "EM Fields", "topics": ["משוואות מקסוול"] }
      ]
    },
    "4": {
      "1": [
        { "icon": "🚀", "title": "פרויקט גמר א'", "subtitle": "Project A", "topics": ["אפיון פרויקט הנדסי"] }
      ],
      "2": [
        { "icon": "🎓", "title": "פרויקט גמר ב'", "subtitle": "Project B", "topics": ["אינטגרציה ובדיקות סופיות"] }
      ]
    }
  },
  "braude": {
    "1": {
      "1": [
        { "icon": "📐", "title": "חדו\"א 1", "subtitle": "Calculus 1", "topics": ["גבולות", "רציפות", "נגזרות ואינטגרלים"] },
        { "icon": "🔢", "title": "אלגברה ליניארית", "subtitle": "Linear Algebra", "topics": ["מרחבים וקטוריים", "מטריצות"] },
        { "icon": "🍏", "title": "פיזיקה 1 (מכניקה)", "subtitle": "Physics 1", "topics": ["דינמיקה ומכניקה קלאסית"] }
      ],
      "2": [
        { "icon": "∬", "title": "חדו\"א 2", "subtitle": "Calculus 2", "topics": ["טורי חזקות", "אינטגרלים כפולים"] },
        { "icon": "⚡", "title": "פיזיקה 2 (חשמל ומגנטיות)", "subtitle": "Physics 2", "topics": ["פוטנציאל ושדה חשמלי ומגנטי"] },
        { "icon": "⌨️", "title": "מערכות ספרתיות", "subtitle": "Digital Systems", "topics": ["לוגיקה בוליאנית ומונים"] }
      ]
    },
    "2": {
      "1": [
        { "icon": "🔌", "title": "מעגלים חשמליים 1", "subtitle": "Circuits 1", "topics": ["מעגלי זרם ישר", "פאזורים"] },
        { "icon": "📈", "title": "משוואות דיפרנציאליות רגילות", "subtitle": "ODE", "topics": ["פתרון מד\"ר"] }
      ],
      "2": [
        { "icon": "📶", "title": "אותות ומערכות ליניאריות", "subtitle": "Signals & Systems", "topics": ["מערכות LTI", "פורייה"] },
        { "icon": "💡", "title": "מבוא להתקנים אלקטרוניים", "subtitle": "Solid State Devices", "topics": ["צומת PN וטרנזיסטורים"] }
      ]
    },
    "3": {
      "1": [
        { "icon": "🔋", "title": "מעגלים אנלוגיים", "subtitle": "Analog Circuits", "topics": ["מגברי שרת ומגברים מרובי דרגות"] }
      ],
      "2": [
        { "icon": "📡", "title": "שדות אלקטרומגנטיים", "subtitle": "EM Fields", "topics": ["משוואות מקסוול"] }
      ]
    },
    "4": {
      "1": [
        { "icon": "🚀", "title": "פרויקט גמר א'", "subtitle": "Project A", "topics": ["תכנון ראשוני"] }
      ],
      "2": [
        { "icon": "🎓", "title": "פרויקט גמר ב'", "subtitle": "Project B", "topics": ["בנייה והוכחת היתכנות"] }
      ]
    }
  },
  "jce": {
    "1": {
      "1": [
        { "icon": "📐", "title": "חדו\"א 1", "subtitle": "Calculus 1", "topics": ["גבולות ונגזרות"] },
        { "icon": "🔢", "title": "אלגברה ליניארית", "subtitle": "Linear Algebra", "topics": ["מטריצות ומרחבים וקטוריים"] },
        { "icon": "🍏", "title": "פיזיקה מכניקה", "subtitle": "Physics 1", "topics": ["קינמטיקה וחוקי ניוטון"] }
      ],
      "2": [
        { "icon": "∬", "title": "חדו\"א 2", "subtitle": "Calculus 2", "topics": ["אינטגרלים", "טורים"] },
        { "icon": "⚡", "title": "פיזיקה חשמל ומגנטיות", "subtitle": "Physics 2", "topics": ["חוק קולון", "חוק גאוס", "השראה מגנטית"] },
        { "icon": "💻", "title": "מבוא למחשב בשפת C", "subtitle": "Intro to CS", "topics": ["יסודות התכנות"] }
      ]
    },
    "2": {
      "1": [
        { "icon": "🔌", "title": "מעגלים חשמליים 1", "subtitle": "Circuits 1", "topics": ["רשתות זרם ישר", "פאזורים"] },
        { "icon": "📈", "title": "משוואות דיפרנציאליות רגילות", "subtitle": "ODE", "topics": ["משוואות מסדר ראשון ושני"] }
      ],
      "2": [
        { "icon": "📶", "title": "אותות ומערכות", "subtitle": "Signals & Systems", "topics": ["אנליזת פורייה ולפלס"] },
        { "icon": "💡", "title": "התקני מל\"מ ואלקטרוניקה בסיסית", "subtitle": "Semiconductors", "topics": ["מל\"מ בסיסי", "דיודות"] }
      ]
    },
    "3": {
      "1": [
        { "icon": "🔋", "title": "מעגלים אלקטרוניים אנלוגיים", "subtitle": "Analog Circuits", "topics": ["מגברי שרת"] }
      ],
      "2": [
        { "icon": "📡", "title": "שדות אלקטרומגנטיים", "subtitle": "EM Fields", "topics": ["משוואות מקסוול"] }
      ]
    },
    "4": {
      "1": [
        { "icon": "🚀", "title": "פרויקט גמר א'", "subtitle": "Project A", "topics": ["אפיון פרויקט הנדסי"] }
      ],
      "2": [
        { "icon": "🎓", "title": "פרויקט גמר ב'", "subtitle": "Project B", "topics": ["בדיקות סופיות"] }
      ]
    }
  },
  "kinneret": {
    "1": {
      "1": [
        { "icon": "📐", "title": "חדו\"א 1", "subtitle": "Calculus 1", "topics": ["גבולות", "רציפות", "נגזרות ואינטגרלים"] },
        { "icon": "🔢", "title": "אלגברה ליניארית", "subtitle": "Linear Algebra", "topics": ["מטריצות ווקטורים"] },
        { "icon": "🍏", "title": "פיזיקה מכניקה", "subtitle": "Physics 1", "topics": ["מכניקה ניוטונית"] }
      ],
      "2": [
        { "icon": "∬", "title": "חדו\"א 2", "subtitle": "Calculus 2", "topics": ["אינטגרלים כפולים", "טורים"] },
        { "icon": "⚡", "title": "פיזיקה חשמל ומגנטיות", "subtitle": "Physics 2", "topics": ["שדות חשמליים ומגנטיים"] },
        { "icon": "💻", "title": "מבוא לתכנות בשפת C", "subtitle": "Intro to CS", "topics": ["לולאות", "מערכים", "פונקציות"] }
      ]
    },
    "2": {
      "1": [
        { "icon": "🔌", "title": "מעגלים חשמליים 1", "subtitle": "Circuits 1", "topics": ["מעגלי זרם ישר", "פאזורים"] },
        { "icon": "📈", "title": "משוואות דיפרנציאליות רגילות", "subtitle": "ODE", "topics": ["פתרון מד\"ר"] }
      ],
      "2": [
        { "icon": "📶", "title": "אותות ומערכות ליניאריות", "subtitle": "Signals & Systems", "topics": ["מערכות LTI", "פורייה"] },
        { "icon": "💡", "title": "מבוא להתקנים אלקטרוניים", "subtitle": "Devices", "topics": ["דיודות וטרנזיסטורים"] }
      ]
    },
    "3": {
      "1": [
        { "icon": "🔋", "title": "מעגלים אנלוגיים", "subtitle": "Analog Circuits", "topics": ["מגברי שרת ומגברים מרובי דרגות"] }
      ],
      "2": [
        { "icon": "📡", "title": "שדות אלקטרומגנטיים", "subtitle": "EM Fields", "topics": ["משוואות מקסוול"] }
      ]
    },
    "4": {
      "1": [
        { "icon": "🚀", "title": "פרויקט גמר א'", "subtitle": "Project A", "topics": ["תכנון ראשוני"] }
      ],
      "2": [
        { "icon": "🎓", "title": "פרויקט גמר ב'", "subtitle": "Project B", "topics": ["בנייה והוכחת היתכנות"] }
      ]
    }
  },
  "lev": {
    "1": {
      "1": [
        { "icon": "📐", "title": "חדו\"א 1", "subtitle": "Calculus 1", "topics": ["גבולות", "רציפות", "נגזרות ואינטגרלים"] },
        { "icon": "🔢", "title": "אלגברה ליניארית", "subtitle": "Linear Algebra", "topics": ["מטריצות ומרחבים"] },
        { "icon": "🍏", "title": "פיזיקה מכניקה", "subtitle": "Physics 1", "topics": ["דינמיקה ומכניקה קלאסית"] }
      ],
      "2": [
        { "icon": "∬", "title": "חדו\"א 2", "subtitle": "Calculus 2", "topics": ["טורי חזקות", "אינטגרלים כפולים"] },
        { "icon": "⚡", "title": "פיזיקה חשמל ומגנטיות", "subtitle": "Physics 2", "topics": ["פוטנציאל ושדה חשמלי ומגנטי"] },
        { "icon": "⌨️", "title": "מערכות ספרתיות", "subtitle": "Digital Systems", "topics": ["לוגיקה בוליאנית ומונים"] }
      ]
    },
    "2": {
      "1": [
        { "icon": "🔌", "title": "מעגלים חשמליים 1", "subtitle": "Circuits 1", "topics": ["מעגלי זרם ישר", "פאזורים"] },
        { "icon": "📈", "title": "משוואות דיפרנציאליות רגילות", "subtitle": "ODE", "topics": ["פתרון מד\"ר"] }
      ],
      "2": [
        { "icon": "📶", "title": "אותות ומערכות ליניאריות", "subtitle": "Signals & Systems", "topics": ["מערכות LTI", "פורייה"] },
        { "icon": "💡", "title": "מבוא להתקנים אלקטרוניים", "subtitle": "Solid State Devices", "topics": ["צומת PN וטרנזיסטורים"] }
      ]
    },
    "3": {
      "1": [
        { "icon": "🔋", "title": "מעגלים אנלוגיים", "subtitle": "Analog Circuits", "topics": ["מגברי שרת ומגברים מרובי דרגות"] }
      ],
      "2": [
        { "icon": "📡", "title": "שדות אלקטרומגנטיים", "subtitle": "EM Fields", "topics": ["משוואות מקסוול"] }
      ]
    },
    "4": {
      "1": [
        { "icon": "🚀", "title": "פרויקט גמר א'", "subtitle": "Project A", "topics": ["תכנון ראשוני"] }
      ],
      "2": [
        { "icon": "🎓", "title": "פרויקט גמר ב'", "subtitle": "Project B", "topics": ["בנייה והוכחת היתכנות"] }
      ]
    }
  }
};
