# Contributing to VOLTEACH ⚡ / תרומה לפרויקט

We love contributions! This document details how you can help improve VOLTEACH.

אנחנו מברכים על כל תרומה לפרויקט! מסמך זה מפרט כיצד תוכלו לעזור ולשפר את VOLTEACH.

---

## 🗺️ Table of Contents / תוכן עניינים
1. [Hebrew Guide / מדריך בעברית](#-מדריך-בעברית)
2. [English Guide / English Guide](#-english-guide)

---

## 🇮🇱 מדריך בעברית

### כיצד ניתן לתרום?
* **דיווח על באגים**: מצאתם באג? פתחו Issue בגיטהאב עם תיאור הבאג, שלבים לשחזור וצילומי מסך במידת הצורך.
* **הצעת פיצ'רים חדשים**: יש לכם רעיון למחשבון הנדסי חדש, דף נוסחאות נוסף או מוסד אקדמי שתרצו להוסיף? ספרו לנו על כך ב-Issues!
* **שיפור הקוד**: תרצו לתקן באג או לממש פיצ'ר בעצמכם? עקבו אחר שלבי העבודה בהמשך.

### שלבי עבודה לפיתוח מקומי
1. בצעו **Fork** לפרויקט לתוך החשבון האישי שלכם.
2. שכפלו את הפרויקט למחשב שלכם:
   ```bash
   git clone https://github.com/YOUR-USERNAME/volteach-portal.git
   cd volteach-portal/volteach-app
   ```
3. התקינו את התלויות:
   ```bash
   npm install
   ```
4. צרו ענף (Branch) חדש לשינוי שלכם:
   ```bash
   git checkout -b feature/amazing-new-calculator
   ```
5. בצעו את השינויים והריצו את שרת הפיתוח המקומי כדי לוודא תקינות:
   ```bash
   npm run dev
   ```
6. ודאו שהפרויקט עובר קומפילציה ובנייה בהצלחה:
   ```bash
   npm run build
   ```
7. בצעו Commit לשינויים ודחפו אותם ל-GitHub שלכם.
8. פתחו **Pull Request** לענף `main` של הפרויקט המקורי.

---

## 🇱🇷 English Guide

### How Can I Contribute?
* **Reporting Bugs**: Found a bug? Open a GitHub Issue describing the bug, steps to reproduce, and screenshots if applicable.
* **Suggesting Features**: Got an idea for a new engineering calculator, formula sheet, or academic institution? Let us know by opening an issue!
* **Code Contribution**: Want to fix a bug or build a feature? Follow the development steps below.

### Local Development Steps
1. **Fork** the repository to your own personal GitHub account.
2. Clone the repository locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/volteach-portal.git
   cd volteach-portal/volteach-app
   ```
3. Install the project dependencies:
   ```bash
   npm install
   ```
4. Create a new branch for your changes:
   ```bash
   git checkout -b feature/amazing-new-calculator
   ```
5. Implement your feature and run the local development server to test:
   ```bash
   npm run dev
   ```
6. Ensure that the project compiles and builds successfully before committing:
   ```bash
   npm run build
   ```
7. Commit your changes and push the branch to your GitHub fork.
8. Submit a **Pull Request** to the `main` branch of the original repository.
