# **Markdown Post Manager**

# This project is a **Next.js application** designed to create, manage, and publish **Markdown files** to a user-specified **GitHub repository**. It serves as a **front-end development exercise** utilizing **TypeScript**, **Tailwind CSS**, and **server-side rendering (SSR)** with the **Next.js App Router**. The application allows users to draft posts, edit or delete them, and publish them as Markdown files to a dynamically selected GitHub repository based on user-provided credentials.

## **Project Setup**

### **Prerequisites**

# - [**Node.js**](https://nodejs.org/): Version 18.x or later is recommended.

- [**Git**](https://git-scm.com/): For version control and cloning the repository.

- **GitHub Account**: To host the target repository and generate a personal access token for authentication.

### **Installation**

1. **Clone the Repository:**

   ```bash
   git clone <your-repository-url>
   cd <repository-name>
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

   **Key dependencies include:**
   - **next**: For the Next.js framework.
   - **react** and **react-dom**: For building the user interface.
   - **sanitize-html**: To sanitize user inputs and prevent XSS attacks in `utils.ts` and `actions.ts`.
   - **rehype-sanitize**: To sanitize Markdown content in conjunction with `react-markdown` in other files.
   - **next-async-request-api**: For enhanced async request handling in Next.js.

3. **Run the Development Server:**

   ```bash
   npm run dev
   ```


==============

## **Project Structure**

# - **app/**: Contains Next.js App Router pages (e.g., page.tsx for the main page).

- **components/**: Houses reusable components (e.g., PostForm.tsx, DraftList.tsx, EditModal.tsx, AnimatedGradientBackground.js).

- **actions.ts**: Stores server-side actions for managing drafts and GitHub publishing, including input sanitization with sanitize-html.

- **utils.ts**: Contains utility functions like input sanitization with sanitize-html and GitHub publishing logic._Reasoning_: This structure separates concerns—pages for routing, components for UI, actions for server logic, and utils for reusable functions—enhancing maintainability and scalability.

## **Usage**

### **1. View Markdown Content**

# - The homepage displays Markdown content fetched from a user-specified .md file in a GitHub repository.

- Enter your GitHub username, repository name, personal access token, and the desired .md file name (e.g., README.md or docs/example.md) in the form.

- Click "Fetch Markdown" to load and display the content.

### **2. Create a New Post**

# - Enter a title and body in the form on the right side of the page.

- Click "Add Draft" to save the draft to the server-side list.

### **3. Manage Drafts**

# - View the list of drafts below the form.

- Click "Edit" to modify a draft inline, then "Save" to update it.

- Click "Delete" to remove a draft.

### **4. Publish Drafts**

# - Click "Publish All" to commit all drafts as Markdown files to the specified GitHub repository.

- Drafts are cleared from the list after successful publishing.

### **5. Error Handling**

# - Errors (e.g., invalid credentials, file not found, failed publish) are indicated in the Markdown content with fallback messages (e.g., # Error Fetching Markdown).

- Detailed errors are logged to the console for debugging.

## **Additional Tools and Libraries**

# - **Tailwind CSS**: Used for styling to ensure a responsive and clean UI with minimal custom CSS. _Reasoning_: Tailwind provides rapid development and consistency across components, enhanced by an animated gradient background for visual appeal.

- **sanitize-html**: A package for sanitizing HTML and preventing Cross-Site Scripting (XSS) attacks, used in utils.ts and actions.ts to secure user inputs. _Reasoning_: Essential for safely processing user-submitted data before publishing. Installed via[ npm](https://www.npmjs.com/package/sanitize-html).

- **rehype-sanitize**: A package for sanitizing Markdown content, integrated with react-markdown in files like page.tsx to ensure safe rendering. _Reasoning_: Critical for securely displaying fetched or generated Markdown, preventing XSS in the UI. Installed via[ npm](https://www.npmjs.com/package/rehype-sanitize).

- **next-async-request-api**: Enhances async request handling in Next.js, improving performance and reliability for GitHub API calls. _Reasoning_: Provides a robust foundation for server-side async operations, aligning with the SSR approach.

- **Next.js App Router**: Employs server-side rendering and Server Actions for a fully server-side experience. _Reasoning_: Avoids client-side JavaScript where possible, leveraging SSR for SEO, performance, and simplicity, with revalidatePath for UI updates.

## **Reasoning Behind Design Choices**

# - **Server-Side Rendering**: Chosen to minimize client-side state management, using Server Actions and revalidatePath to update the UI dynamically. This aligns with your preference for server-side logic.

- **Dynamic GitHub Integration**: The project supports any public GitHub repository and .md file, specified via UI inputs (username, repository, token, file name), reflecting a flexible, real-world content management use case.

- **Security**: Input sanitization with sanitize-html and Markdown sanitization with rehype-sanitize protect against malicious code, critical for user-submitted and fetched data.

- **Accessibility**: ARIA labels and roles (e.g., role="list", aria-label) ensure the application is usable with screen readers.

- **Simplicity**: Drafts are stored in a server-side JSON file (data/drafts.json) instead of an in-memory array, providing persistence without a database, suitable for this exercise.

- **Visual Appeal**: The AnimatedGradientBackground component adds a modern aesthetic, enhancing user experience.

## **Future Improvements**

# - **Error Feedback**: Add a dedicated UI element (e.g., toast notifications) to display fetch or publish errors instead of embedding them in Markdown.

- **Token Security**: Implement server-side storage or a secure prompt for the personal access token to avoid query parameter exposure.

- **Loading States**: Include spinners or indicators during fetch and publish operations.

- **File Validation**: Add client-side validation for .md file names (e.g., ensuring .md extension).

- **Responsive Design**: Enhance mobile compatibility with adjusted card sizes in DraftList.tsx.

# ***

### **Analysis and Updates**

# 1. **Package Usage**:

   - Clarified that sanitize-html is used in utils.ts and actions.ts for input sanitization, while rehype-sanitize is used with react-markdown in files like page.tsx for Markdown rendering security. Both are now documented accordingly.

2. **Dynamic File Fetching**:

   - Updated the "Usage" section to emphasize the ability to fetch any .md file based on the file input, aligning with the changes in page.tsx.

3. **Project Structure**:

   - Included all relevant components and noted the use of data/drafts.json for persistence.

4. **Reasoning and Design Choices**:

   - Reflected the dual use of sanitize-html and rehype-sanitize for security.

   - Highlighted the AnimatedGradientBackground as a design choice for visual appeal.

5. **Future Improvements**:

   - Retained suggestions based on the current codebase, including error feedback, token security, and responsive design enhancements.
