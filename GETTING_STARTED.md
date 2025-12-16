# Getting Started Guide

Welcome to your Business Manager App! This guide will walk you through every step to get your application running, from installation to deployment.

## 1. Dependency Installation

### What is `npm install`?
Think of `npm install` as hiring the construction crew for your building. Your project relies on many external tools (libraries) like React, Database connectors, and styling tools. These are listed in a file called `package.json`.
Running `npm install` reads that list and downloads all those tools into a folder called `node_modules` so your app can use them.

### How to Run It
1. Open your terminal (Command Prompt, PowerShell, or VS Code Terminal).
2. Make sure you are inside the project folder (`c:\Users\Gideon Elele\New folder (2)`).
3. Type the following command and hit Enter:
   ```bash
   npm install
   ```

### Troubleshooting Common Errors
- **"command not found"**: You might not have Node.js installed. Download it from [nodejs.org](https://nodejs.org/).
- **Network errors**: Check your internet connection. Sometimes corporate firewalls block downloads.
- **EACCES or Permission errors** (mostly Mac/Linux but sometimes Windows): Try running the terminal as Administrator.

---

## 2. Environment Configuration

### What is a `.env` file?
A `.env` (Environment) file is like a secure safe. It stores secret keys and passwords that your app needs but you **NEVER** want to share publicly (like on GitHub). The app reads these secrets seamlessly.

### Setting it Up
We have created a file named `.env` for you. You need to open it and replace the placeholder text with your real keys.

**File Content (`.env`):**
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### How to get a MongoDB Connection String
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database) and sign up/login.
2. Create a new **Cluster** (the free tier is fine).
3. Click **Connect** on your cluster.
4. Choose **Drivers** as your connection method.
5. You will see a string like: `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`.
6. Replace `<username>` and `<password>` with your actual database user credentials (not your login password).
7. Paste this entire string into your `.env` file after `MONGODB_URI=`.

### How to Generate a Secure JWT Secret
This acts as a digital signature for user logins. It should be long and random.
- **Easy method**: Smash your keyboard randomly (e.g., `h8923h98fh2398hf9823h89fh`).
- **Pro method**: Open your terminal and run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Copy the output.

---

## 3. Running the App Locally

### What does `npm run dev` do?
This command starts a "local server". It's like opening a restaurant just for yourself to taste test. It compiles your code and serves it so you can see it in your browser. It also watches for changes, so if you edit a file, the browser updates instantly!

### Why `localhost:5173`?
`localhost` means "this computer". `5173` is just a specific door (port) the app opens.
- **Frontend**: Runs on `http://localhost:5173` (Vite default).
- **Backend (API)**: Runs alongside it (proxied) so your frontend can talk to the backend seamlessly.

### How to Confirm It Works
1. Run `npm run dev` in your terminal.
2. Look for the "Local: http://localhost:5173" message.
3. Ctrl+Click that link or type it in your browser.
4. You should see the login page.
5. Try to "Sign Up" with a fake user. If it works, your Database connection is good!

---

## 4. GitHub Setup

### Pushing to GitHub
1. Create a `New Repository` on GitHub.com.
2. In your project terminal, run these commands one by one:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <YOUR_GITHUB_REPO_URL>
   git push -u origin main
   ```

### The Deployment Workflow (`.github/workflows/deploy.yml`)
This file is a set of instructions for a robot (GitHub Actions). It says:
"Whenever code is pushed to the `main` branch, wake up, install the code, build the website, and send it to Netlify."
This automation is called CI/CD (Continuous Integration/Continuous Deployment).

---

## 5. Netlify Deployment

### Connecting to Netlify
1. Log in to [Netlify](https://www.netlify.com/).
2. Click **"Add new site"** -> **"Import an existing project"**.
3. Choose **GitHub**.
4. Select your repository (`business-manager`).

### Environment Variables in Netlify
Since `.env` files are not uploaded to GitHub (for security), you must give Netlify these secrets manually.
1. Go to **Site Settings** > **Environment variables**.
2. Click **"Add a variable"**.
3. Add `MONGODB_URI` and paste your connection string.
4. Add `JWT_SECRET` and paste your secret.

### Automatic Deployment
Because we added the GitHub Action file, or if you simply linked the repo in Netlify, Netlify watches your code.
- **On Push**: Every time you `git push origin main`, Netlify picks up the changes.
- **Build**: It runs `npm run build`.
- **Deploy**: It replaces the live site with the new version automatically.

---

## 6. Final Validation Checklist

- [ ] **Dependency Check**: `node_modules` folder exists.
- [ ] **Local Run**: `npm run dev` starts without red errors.
- [ ] **DB Connection**: You can Register and Login locally.
- [ ] **GitHub**: Your code is visible on GitHub.com.
- [ ] **Netlify Config**: Environment variables are set in Netlify dashboard.
- [ ] **Live Site**: The Netlify URL loads your app and you can login there too.

Congratulations! You have a professional software development workflow.
