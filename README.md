# TimeTable Pro

**TimeTable Pro** is a modern, responsive web application designed for school administrators to dynamically manage and plan class schedules, assign teachers, and monitor teacher utilization. It incorporates a premium glassmorphism user interface with robust offline-first functionality.

## Core Features
1. **Interactive Schedule Editor:** View all classes or click into a specific class for a weekly view. Assign teachers and subjects interactively.
2. **Dynamic Teacher Utilization Dashboard:** Tracks assigned periods vs maximum allowed periods and categorizes teacher workloads.
3. **Data Management:** State fully persists in browser Local Storage. Import/Export JSON state to backup or share timetables.
4. **Premium UI/UX System:** Dynamic Light/Dark Mode, subject-specific color coding, animated transitions, responsive grid reflows.

## Tech Stack
* **Framework:** React + Vite
* **State Management:** Zustand (with Local Storage Persistence)
* **Styling:** Vanilla CSS (CSS Variables, Glassmorphism)
* **Icons:** `lucide-react`

---

## Deployment on a Windows Machine

To deploy **TimeTable Pro** correctly on a Windows server or local machine, follow these steps:

### Prerequisites:
1. **Node.js**: Download and install the latest LTS version of [Node.js](https://nodejs.org/) for Windows. This will also install `npm` (Node Package Manager).
   - Once installed, open `Command Prompt` or `PowerShell` and run `node -v` and `npm -v` to verify the installation was successful.
2. **Git** (optional but recommended): Install [Git for Windows](https://git-scm.com/download/win) to clone the repository.

### Step-by-Step Deployment:

1. **Clone or Download the Repository:**
   Open PowerShell or Command Prompt and clone the repository:
   ```cmd
   git clone <repository-url>
   cd Timetable
   ```
   *(Or simply extract the project ZIP file and navigate into the extracted folder.)*

2. **Install Dependencies:**
   Run the following command to download and install all necessary Node.js modules:
   ```cmd
   npm install
   ```

3. **Build the Application:**
   Compile the React+Vite application into static HTML, CSS, and JS files optimized for production:
   ```cmd
   npm run build
   ```
   This will create a `dist` (or `build`) folder containing the production-ready assets.

4. **Serve the Application:**
   There are multiple ways to serve the static files on Windows:

   **Method A: Using `serve` (Simplest method for local/dev servers)**
   Install the Node.js `serve` package globally:
   ```cmd
   npm install -g serve
   ```
   Then start the server pointing to the output directory:
   ```cmd
   serve -s dist
   ```
   The application will be accessible at `http://localhost:3000` (or another port outputted in the console).

   **Method B: Using IIS (Internet Information Services for Production Windows Servers)**
   - Open **IIS Manager**.
   - Right-click **Sites** -> **Add Website**.
   - Site name: `TimeTablePro`
   - Physical path: Browse and select the `dist` folder generated during the build step.
   - Port: `80` (or your preferred web port).
   - *Note on Routing*: Since this is a Client-Side Rendered (CSR) app, you will need to add a `web.config` file with URL Rewrite rules inside the `dist` directory so that IIS redirects all sub-paths back to `index.html`.

### Run Locally (Development Mode)
To run the app locally for development with hot-reloading:
```cmd
npm run dev
```
Open the provided local URL (usually `http://localhost:5173`) in your browser.
