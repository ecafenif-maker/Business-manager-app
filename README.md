# Business Manager App

A full-stack React application for small business management, deployed on Netlify with Serverless Functions and MongoDB.

## Project Structure

```
/
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD Pipeline
├── netlify/
│   └── functions/          # Backend Serverless Functions
│       ├── api.js          # Express app entry point
│       ├── config/         # DB connection
│       ├── controllers/    # Request handlers
│       ├── middleware/     # Auth middleware
│       ├── models/         # Mongoose models (User, Sale, Stock, etc.)
│       └── routes/         # API routes
├── public/                 # Static assets
├── src/                    # Frontend React App
│   ├── assets/
│   ├── components/         # Reusable UI components
│   ├── context/            # Global State (Auth, Data)
│   ├── layouts/            # Dashboard layout
│   ├── pages/              # App pages (Dashboard, Stock, Sales, etc.)
│   ├── App.jsx
│   └── main.jsx
├── .env                    # Environment variables
├── index.html              # Vite entry
├── netlify.toml            # Netlify configuration
├── package.json
└── vite.config.js
```

## Setup Instructions

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file with:
    ```
    MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/dbname
    JWT_SECRET=your_jwt_secret_key
    ```

3.  **Run Locally**:
    ```bash
    npm run dev
    ```
    This will start both the Vite frontend and Netlify functions (via Netlify CLI if installed, or proxy).

## Deployment

Push to the `main` branch to trigger deployment via GitHub Actions (or connect Netlify to the repo for auto-builds).
