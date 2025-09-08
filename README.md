# GitHub Markdown Manager

A **Next.js** application that enables streamlined management of Markdown files in a GitHub repository. It provides:

- Live fetching and secure rendering of Markdown from GitHub.
- Draft creation, editing, and deletion, with persistence via Upstash Redis.
- A one-click **Publish All** feature to commit drafts as Markdown files back to GitHub.
- A responsive, accessible UI built with TypeScript, Tailwind CSS, and Next.js App Router.

---

## ✨ Features

- **Fetch GitHub Markdown**: Retrieve and display Markdown from a specified GitHub repo using the GitHub API, rendered securely with `react-markdown` and `rehype-sanitize` to prevent XSS attacks.  

- **Persistent Drafts**: Create, edit, delete, and list drafts via an intuitive interface. Drafts are stored in Upstash Redis for persistence across reloads and sessions.  

- **Publish All**: Publish all drafts to GitHub as Markdown files with descriptive commit messages. Once published, drafts are cleared from Redis.  

- **Secure & Configurable**: Environment variables (e.g., `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, GitHub tokens) securely handle sensitive data without client-side exposure.  

- **Accessible, Responsive UI**: Designed with ARIA labels and Tailwind-powered grid layouts for accessibility and mobile-friendliness.  

- **Product-grade Performance**: Utilizes Next.js server components, server actions, and minimal hydration for fast page loads and efficient Redis usage.  

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)  
- **Styling**: Tailwind CSS  
- **Markdown Rendering**: `react-markdown` + `rehype-sanitize` + `sanitize-html`  
- **Database**: Upstash Redis  
- **Version Control**: GitHub API integration  
- **Language**: TypeScript  
- **Hosting/Deployment**: Vercel  

---

## 📦 Packages Used

- **@tailwindcss/postcss** – Tailwind CSS integration with PostCSS for utility-first styling.  
- **@upstash/redis** – Provides Redis database connectivity for storing and retrieving drafts.  
- **axios** – Handles HTTP requests to the GitHub API.  
- **next** – React framework used for server-side rendering, routing, and API routes.  
- **postcss** – A CSS processing tool that powers Tailwind and modern CSS workflows.  
- **react** – Core UI library for building interactive components.  
- **react-dom** – React’s DOM rendering library.  
- **react-markdown** – Parses and renders Markdown content as React components.  
- **rehype-sanitize** – Sanitizes Markdown output to prevent unsafe HTML or scripts.  
- **sanitize-html** – Ensures Markdown rendered from GitHub is safely converted into clean HTML.  
- **tailwindcss** – Utility-first CSS framework for styling and responsive design.  

---

## 🚀 Quick Start

### Prerequisites

- Node.js **18+**
- A **GitHub personal access token** with `repo` scope
- An **Upstash Redis** instance
- A **Vercel** account (for deployment)

### Local Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/salmansaymon57/github-markdown-manager.git
   cd github-markdown-manager



2. Install dependencies:
   ```bash
   npm install

3. Configure environment variables in .env.local :
   ```bash
   UPSTASH_REDIS_REST_URL=your-upstash-url
   UPSTASH_REDIS_REST_TOKEN=your-upstash-token


4. Start the development server:
   ```bash
   npm run dev

5. Use the interface to:

Fetch Markdown (enter GitHub details + filename)

Manage drafts (create, edit, delete)

Publish All drafts to your  GitHub repo

## Deployment on Vercel
1. Push your changes to GitHub:
   ```bash
    git add .
    git commit -m "Initial commit"
    git push

2. In Vercel, create a new project and import the repository.

3. Add the following environment variables in Vercel’s dashboard (for each environment: **Production**, **Preview**, **Development**):
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

4. Deploy the project. After deployment, test features:
   - Fetching Markdown  
   - Draft management  
   - Publishing to GitHub  

---

## 🧩 Design Rationale

- **Server-Driven UI**: Heavy lifting via Next.js server components and actions ensures great performance and security.  
- **Redis as a durable store**: Upstash Redis offers seamless serverless behavior with JSON-managed draft storage.  
- **Security-first**: Sanitizing rendered Markdown and keeping tokens out of client-side code safeguards the app.  
- **Accessibility & responsiveness**: ARIA labels and utility-first styling make the app user-friendly across devices.  
- **Robust error handling**: Try-catch logic and fallback UI components ensure stability, even when errors occur.  

---

## 🛠 Troubleshooting

| Issue                         | Possible Fixes |
|-------------------------------|----------------|
| **Redis Connection Errors**   | Verify `_URL` and `_TOKEN` env vars; check Upstash dashboard for rate limits. |
| **GitHub API Failures**       | Confirm your token has proper `repo` scope. Verify input values for username/repo/file name. |
| **Build/Deployment Failures** | Review Vercel logs and ensure all env vars are configured. Use `vercel env pull .env.local` to sync locally. |
| **Drafts Not Appearing**      | Clear corrupted Redis keys and check logs (e.g., `console.log` in `actions.ts`). |







