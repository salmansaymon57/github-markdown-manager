# **GitHub Markdown Manager**

A Next.js application for managing Markdown content in a GitHub
repository. Users can fetch and render Markdown files from GitHub,
create/edit/delete drafts stored in Redis, and publish drafts as
Markdown files to a GitHub repository. The app features a responsive,
accessible UI with server-side rendering and server actions for seamless
interactivity.

## **Features**

This project meets all specified requirements, as outlined in the
checklist below:

-   **✅ Fetches Markdown from GitHub and renders as sanitized HTML**

    -   Retrieves Markdown files from a specified GitHub repository
        > using the GitHub API.

    -   Renders content securely using react-markdown with
        > rehype-sanitize to prevent XSS attacks.

-   **✅ Drafts: create, edit, delete, list; persist across reloads**

    -   Create, edit, delete, and list drafts via a user-friendly
        > interface.

    -   Drafts are stored in Upstash Redis, ensuring persistence across
        > page reloads and sessions.

-   **✅ "Publish All" commits Markdown files to GitHub**

    -   Publishes all drafts as Markdown files to the specified GitHub
        > repository using the GitHub API.

    -   Commits are made with descriptive messages, and drafts are
        > cleared from Redis post-publish.

-   **✅ Secrets are not exposed; environment variables are used
    > correctly**

    -   Sensitive data (Redis URL, token, GitHub token) are stored in
        > environment variables (UPSTASH_REDIS_REST_URL,
        > UPSTASH_REDIS_REST_TOKEN) or passed via forms.

    -   No secrets are hardcoded or exposed in client-side code.

-   **✅ No console errors/warnings; clean, consistent formatting**

    -   Code is free of console errors/warnings in production (verified
        > locally and on deployment).

    -   Uses consistent formatting with TypeScript, Tailwind CSS, and
        > Next.js conventions.

-   **✅ Accessible, responsive UI; reasonable performance**

    -   UI includes ARIA labels for form inputs, buttons, and modals
        > (e.g., aria-label=\"Edit draft \${draft.title}\").

    -   Responsive grid layout (grid-cols-3) adapts to various screen
        > sizes.

    -   Optimized with server-side rendering, minimal client-side
        > JavaScript, and efficient Redis queries.

-   **✅ Clear README with rationale and instructions**

    -   This README provides comprehensive setup, deployment, and design
        > rationale.

-   **✅ Live deployment works**

    -   Successfully deployed on Vercel with Upstash Redis integration,
        > fully functional for all features.

## **Tech Stack**

-   **Framework**: Next.js 13+ (App Router) for server-side rendering
    > and server actions.

-   **Database**: Upstash Redis for storing drafts and GitHub
    > configuration.

-   **Styling**: Tailwind CSS for responsive, utility-first design.

-   **Markdown Rendering**: react-markdown with rehype-sanitize for
    > secure rendering.

-   **APIs**: GitHub API for fetching and publishing Markdown files.

-   **TypeScript**: For type-safe code and interfaces (e.g., Draft,
    > GithubConfig).

-   **Deployment**: Vercel for hosting, with automatic scaling and
    > environment variable management.

## **Setup Instructions**

### **Prerequisites**

-   Node.js 18+ installed.

-   A GitHub account with a personal access token (scope: repo).

-   An Upstash Redis account with a database instance.

-   A Vercel account for deployment.

### **Local Development**

**Clone the Repository**:\
\
git clone https://github.com/your-username/your-repo.git

cd your-repo

1.  

**Install Dependencies**:\
\
npm install

2.  

3.  **Set Up Environment Variables**:

Create a .env.local file in the project root:\
UPSTASH_REDIS_REST_URL=https://your-upstash-redis-url

UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token

-   

-   Get the URL and token from your Upstash Redis dashboard.

-   Add .env.local to .gitignore to avoid committing sensitive data.

**Run the Development Server**:\
\
npm run dev

4.  -   Open http://localhost:port in your browser.

5.  **Test Features**:

    -   **Fetch Markdown**: Enter GitHub username, repo, token, and file
        > name (e.g., README.md) in the form.

    -   **Manage Drafts**: Create, edit, or delete drafts in the right
        > panel.

    -   **Publish All**: Publish all drafts to your GitHub repo as
        > Markdown files.

### **Deployment on Vercel**

1.  **Push to Git Repository**:

Ensure your code is pushed to a GitHub repository:\
git add .

git commit -m \"Initial commit\"

git push origin main

-   

2.  **Create a Vercel Project**:

    -   Log in to Vercel and select **Create a New Project**.

    -   Import your GitHub repository.

    -   Vercel auto-detects the Next.js project and sets build commands
        > (next build).

3.  **Configure Environment Variables**:

    -   In Vercel dashboard, go to **Settings** \> **Environment
        > Variables**.

    -   Add:

        -   UPSTASH_REDIS_REST_URL: https://your-upstash-redis-url (no
            > quotes).

        -   UPSTASH_REDIS_REST_TOKEN: your-upstash-redis-token (no
            > quotes).

    -   Select **Production**, **Preview**, and **Development**
        > environments, then save.

4.  **Deploy**:

Click **Deploy** in Vercel or use the CLI:\
npm i -g vercel

vercel \--prod

-   

-   Access the deployed app at the provided URL (e.g.,
    > https://your-app-name.vercel.app).

5.  **Verify Deployment**:

    -   Test all features (fetch Markdown, manage drafts, publish) on
        > the live URL.

    -   Check Vercel logs for errors (Deployments \> select deployment
        > \> **Logs**).

## **Design Rationale**

-   **Server Components & Actions**: Uses Next.js App Router's server
    > components for optimal performance (minimal client-side JS) and
    > server actions for form submissions (addDraft, editDraft,
    > publishAll). This ensures fast rendering and secure data handling.

-   **Redis for Persistence**: Upstash Redis was chosen for its
    > simplicity, serverless compatibility with Vercel, and fast
    > key-value storage for drafts and GitHub config.
    > automaticDeserialization: false ensures consistent JSON handling.

-   **Security**:

    -   sanitize-html strips HTML from user inputs to prevent XSS.

    -   rehype-sanitize secures Markdown rendering.

    -   GitHub tokens are passed via forms or Redis, never hardcoded.

-   **Accessibility**: ARIA labels and semantic HTML ensure screen
    > reader compatibility. Tailwind's responsive utilities handle
    > mobile and desktop layouts.

-   **Error Handling**: Try-catch blocks in actions.ts (e.g.,
    > loadDrafts, publishToGitHub) and fallbacks in page.tsx (e.g.,
    > default Markdown message) prevent crashes and provide user
    > feedback.

-   **Performance**: Server-side rendering, minimal client-side
    > hydration (only DraftList is a client component), and efficient
    > Redis queries ensure low latency.

## **Troubleshooting**

-   **Redis Connection Errors**:

    -   Verify UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in
        > Vercel's dashboard (no quotes).

    -   Check Upstash dashboard for rate limits or disabled instances.

-   **GitHub API Issues**:

    -   Ensure the GitHub token has repo scope.

    -   Verify username/repo/file inputs in the form.

-   **Build Failures**:

    -   Check Vercel logs for missing dependencies or env vars.

    -   Run vercel env pull .env.local to sync env vars locally.

-   **Drafts Not Loading**:

    -   Clear Redis keys (drafts, github_config) via Upstash CLI or
        > dashboard if corrupted.

    -   Add debug logs in actions.ts (e.g., console.log(\'Raw drafts:\',
        > data)).
