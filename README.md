# VOLTEACH ⚡ - Electrical Engineering Student Portal

VOLTEACH is a modern, responsive, and feature-rich learning portal designed specifically for Electrical and Electronics Engineering students in Israel. It consolidates academic syllabi, engineering tools, calculators, customizable formula sheets, exam simulators, and educational materials into a single premium workspace.

👉 **Live Demo:** [https://volteach-portal.web.app](https://volteach-portal.web.app)

---

## 🚀 Key Features

* 📅 **Dynamic Syllabus Integration**: Tailored course schedules and curriculums for multiple Israeli academic institutions (Technion, Ben-Gurion University, Ruppin, HIT, Tel Aviv University, Afeka, Bar-Ilan, Ariel, SCE, Azrieli, Kinneret, and Lev Academic Center).
* 🎚️ **Ruppin Track Selector**: Dynamic toggle between the Regular 4-Year Day Track and the Extended 5-Year Spread Track.
* 🔌 **Collapsible Engineering Calculators**:
  * **Ohm's Law**: Solve for Voltage, Current, Resistance, and Power.
  * **Parallel Resistors (Req)**: Calculates equivalent resistance of parallel resistors.
  * **Voltage Divider**: Instantly calculates output voltages ($V_{out}$).
  * **RC Time Constant**: Find $\tau$ and cutoff frequency $f_c$.
  * **dB Converter & Unit Prefixes**: Seamless engineering unit conversions.
  * **Frequency ↔ Period**: Convert frequencies and cycle times.
  * **Base Converter**: Convert between decimal, binary, hex, and octal.
* 📖 **Customizable Formula Sheets**: Save, manage, edit, and print formula collections or export them directly to PDF. Includes a dynamic local/cloud sync (using Firebase Firestore).
* 📐 **Trigonometric Identities Sheet**: Trigonometric identities built-in for quick math assistance.
* ⏱️ **Exam Simulator & Marathon Flashcards**: Interactive flashcards powered by local enrichment data for study reinforcement.
* 📁 **Google Drive Integration**: Directly embedded study folders from Google Drive featuring past exams and lecture slides.
* 🔒 **Secure Authentication**: Supports Email/Password sign-ins, Google fast login, and GitHub developer login.

---

## 🛠️ Technology Stack

* **Frontend**: React, Vite, TypeScript, Tailwind CSS
* **Styling**: Modern Vanilla CSS, Glassmorphism, Custom Webkit Scrollbars, Dynamic Hover States
* **Icons & Math**: Lucide React, KaTeX (LaTeX math rendering)
* **Backend & Database**: Firebase Authentication, Cloud Firestore (database synchronization)
* **Hosting**: Firebase Hosting

---

## ⚙️ Running Locally

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm**

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/volteach-portal.git
   cd volteach-portal
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   *Fill in your Firebase credentials in `.env` if you want backend syncing enabled.*
4. Start the local development server:
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:3000` to view the app!

---

## 🧑‍💻 Creator

Developed with passion by an aspiring **Electrical Engineer** at the beginning of their professional journey. VOLTEACH was created to simplify the engineering academic workload and support peer student success.

---

## 📄 License
This project is licensed under the MIT License.
