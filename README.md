# Metacognitive Tests Platform

This project is a Single Page Application (SPA) that provides metacognitive tests for coders to evaluate their cognitive state. It includes classic psychological tests such as Stroop, Hanoi Tower, Go No Go, and Trail Making Test.

---

## 📋 System Description

The platform allows:
- User (coder) login.
- Execution of different interactive cognitive tests:
  - **Stroop Test** → measures inhibitory control and attention.
  - **HanoiTower** → evaluates planning and executive functions.
  - **Go No Go** → measures impulse control and sustained attention.
  - **Trail Making Test** → analyzes processing speed and cognitive flexibility.
- Results stored in the browser using `localStorage`.
- Navigation between tests through an SPA router.
- Optimized for deployment on **Vercel**.

---

## 🚀 How to Run the Project

### 1. Clone the repository
```bash
git clone https://github.com/Ediison32/lifelens.git
git checkout builesUser
```

### 2. Install dependencies
Make sure you have **Node.js v18+** installed, then run:
```bash
npm install
```

### 3. Run in development mode
```bash
npm run dev
```
This will open the project at `http://localhost:5173` (Vite’s default port).

### 4. Deploy to production
The project is configured for **Vercel** with a `vercel.json` that rewrites all routes to `index.html`.  
To deploy, simply run:
```bash
vercel
```

---

## 🛠️ Technologies Used

- **Frontend**:
  - HTML5, CSS3, JavaScript (ES6+)
  - SPA with manual routing
- **Build Tools**:
  - [Vite](https://vitejs.dev/) for fast development and bundling
- **Hosting / Deployment**:
  - [Vercel](https://vercel.com/) (configured with `vercel.json`)
- **Local state management**:
  - `localStorage` to maintain session and results

---

## 📂 Project Structure

```
├── index.html          # Main entry point
├── index.js            # SPA router and main logic
├── resources/          # Styles and scripts for each test
│   ├── stroop.js / stroop.css
│   ├── tower.js / tower.css
│   ├── Gono_go.js / gonogo.css
│   ├── tmt.js / tmt.css
│   └── login.js
├── views/              # HTML templates for each view
│   ├── login.html
│   ├── stroop.html
│   ├── tower.html
│   ├── gonogo.html
│   ├── tmt.html
│   └── logout.html
├── package.json
├── package-lock.json
├── vercel.json
└── .gitignore
```

---

## 📌 Key Features

- **SPA with custom router** → No page reloads when navigating.
- **Dynamic CSS loading** → Each test loads its own CSS only when executed.
- **Session management** → User verification with `localStorage`.
- **Fully compatible with Vercel deployment**.

---



