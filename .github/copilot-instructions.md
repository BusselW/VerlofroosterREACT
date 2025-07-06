1. Throughout the project, ensure that the HTML in .aspx files is setup as follows:
- It's a pure HTML file.
- Do not use any server-side ASP.NET markup; only static HTML and client-side JavaScript.
- We're fetching the REACT libraries from a CDN. Use React and ReactDOM from https://unpkg.com/react@18/umd/react.development.js and https://unpkg.com/react-dom@18/umd/react-dom.development.js.
- We are declaring "h" as the global variable for react
- We are writing modules in vanilla Javascript (.js, not .jsx or .ts)
- All JavaScript must use ES6 module syntax and be in .js files (no .jsx or .ts).
- The modules are logically separated into different files.
- The modules are imported in either the .aspx file or in a seperate .js file that is included in the .aspx file. All imports in .aspx files should use relative paths and include the .js extension.
- Follow consistent naming conventions for files and folders (e.g., camelCase for JS files, kebab-case for CSS).
- Reference this instruction file in a comment at the top of each .aspx file for traceability.

2. Code Quality and Accessibility:
- Use a linter (such as ESLint) and a code formatter (such as Prettier) with a shared configuration to enforce code style and catch errors early.
- All interactive elements (buttons, links, form fields, etc.) must be accessible via keyboard navigation (e.g., using Tab, Enter, and Space keys). 
- Use semantic HTML tags (such as <header>, <nav>, <main>, <section>, <article>, <footer>, <button>, <form>, etc.) where appropriate. Semantic tags describe the meaning and structure of content, making it easier for browsers, assistive technologies, and developers to understand and navigate the page.

3. Documentation:
- Use JSDoc comments for all exported functions and modules.
- Add brief inline comments for complex or non-obvious logic.

4. Performance:
- Avoid unnecessary re-renders in React by using memoization (e.g., React.useMemo, React.useCallback) where appropriate.
- Be mindful of bundle size and only import what you need.

5. Versioning:
- Always use the specified React and ReactDOM versions in the CDN URLs above, unless the instruction file is updated.
- When updating dependencies, test thoroughly in your environment before committing changes.