---
applyTo: '**'
---

# VerlofroosterREACT Coding Instructions

Coding standards, domain knowledge, and preferences that AI should follow for the VerlofroosterREACT SharePoint application.

## 1. HTML and ASPX File Requirements

### Pure HTML Structure
- Use only pure HTML in .aspx files
- **NO server-side ASP.NET markup** - only static HTML and client-side JavaScript
- Reference this instruction file in a comment at the top of each .aspx file for traceability

### React CDN Integration
- React: `https://unpkg.com/react@18/umd/react.development.js`
- ReactDOM: `https://unpkg.com/react-dom@18/umd/react-dom.development.js`
- Declare `h` as global variable for `React.createElement`
- Always use the specified React 18 versions unless explicitly updated

### JavaScript Module System
- Write modules in **vanilla JavaScript** (.js files only - NO .jsx or .ts)
- Use ES6 module syntax in all JavaScript files
- Logically separate modules into different files
- Import modules in .aspx files or separate .js files included in .aspx
- Use relative paths with .js extensions in all imports

## 2. File Naming Conventions

- **JavaScript files**: camelCase (e.g., `medewerkerForm.js`, `dataService.js`)
- **CSS files**: kebab-case (e.g., `modal-formatting.css`, `beheer-centrum.css`)
- **Folders**: kebab-case (e.g., `beheer-centrum`, `form-components`)
- **ASPX files**: PascalCase (e.g., `BeheerCentrum.aspx`)

## 3. Code Quality and Accessibility

### Linting and Formatting
- Use ESLint and Prettier with shared configuration
- Enforce consistent code style and catch errors early
- Follow existing project configuration

### Accessibility Requirements
- All interactive elements must support keyboard navigation (Tab, Enter, Space)
- Use semantic HTML tags: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<button>`, `<form>`
- Implement proper ARIA labels and roles for screen readers
- Ensure focus management in modals and dynamic content
- Maintain high contrast ratios and readable text sizes

### Semantic HTML Standards
- Use meaningful HTML tags that describe content structure
- Prefer semantic elements over generic `<div>` and `<span>` where appropriate
- Structure content logically for assistive technologies

## 4. Documentation Requirements

### JSDoc Comments
- Document all exported functions and modules with JSDoc
- Include parameter types, return values, and usage examples
- Document complex components and their props

### Inline Comments
- Add brief comments for complex or non-obvious logic
- Explain business logic specific to verlofrooster domain
- Comment SharePoint integration patterns and API usage

## 5. Performance Standards

### React Optimization
- Use `React.useMemo` and `React.useCallback` to prevent unnecessary re-renders
- Memoize expensive calculations and stable references
- Avoid creating objects/functions in render methods

### Bundle Optimization
- Import only what you need to minimize bundle size
- Use tree-shaking friendly import patterns
- Monitor and optimize SharePoint API calls

## 6. Project-Specific Domain Knowledge

### SharePoint Integration
- Use `spContext` for SharePoint operations
- Handle claims-based authentication formats (`i:0#.w|domain\username`)
- Implement proper error handling and fallback mechanisms
- Cache SharePoint data appropriately

### VerlofRooster Business Logic
- **Medewerkers**: Employee management with teams, functions, and status
- **Teams**: Color-coded team organization with team leaders
- **Verlofredenen**: Leave reasons with colors and types
- **Verlof**: Leave requests with approval workflows
- **Compensatie Uren**: Compensation hours and shift exchanges

### Modal System Architecture
- Use config-driven modal layouts from `modalLayouts.js`
- Implement consistent modal behavior with `EnhancedBaseForm`
- Apply modal styling from dedicated `modalFormatting.css`
- Support different modal types: employee, standard, settings, etc.

### Form Patterns
- Use toggle switches for boolean values with existing CSS classes
- Implement autocomplete with SharePoint user search functionality
- Style read-only fields with visual indicators
- Group related fields in logical sections

### CSS Architecture
- Use CSS custom properties (variables) for consistent theming
- Organize CSS in modular files per component/feature
- Apply Apple system fonts: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`
- Use gradient headers and modern styling patterns

## 7. Data Formatting Standards

### Boolean Display
- Use toggle switches with "Actief"/"Inactief" labels
- Apply green styling for active states, gray for inactive
- Include visual status indicators with colored dots

### Tag System
- **Team tags**: Use team colors from `Teams.Kleur` SharePoint field
- **Function tags**: Use metal-tier colors (gold/silver/bronze/copper) based on role hierarchy
- **Email fields**: Make clickable with mailto links and email icons

### Color Management
- Display colors with both swatch and hex value
- Use consistent color picker components
- Apply proper contrast ratios for accessibility

## 8. Error Handling and Debugging

### SharePoint Operations
- Implement comprehensive error handling for all SharePoint API calls
- Provide user-friendly error messages
- Include fallback mechanisms for failed operations
- Log errors appropriately for debugging

### Development Debugging
- Include console logging for development (removable for production)
- Use meaningful variable names and clear function signatures
- Implement proper loading states and user feedback

## 9. Versioning and Updates

### Dependency Management
- Maintain React 18 from specified CDN URLs
- Test thoroughly before updating any dependencies
- Ensure backward compatibility with existing SharePoint lists and data

### Change Management
- Document breaking changes and migration paths
- Maintain consistent API patterns across components
- Version control configuration files and shared utilities

## Usage Notes

This instructions file automatically applies to all files in the project (`applyTo: '**'`). When working with GitHub Copilot, these standards will be automatically followed without needing to repeat them in each request.

For specific component generation, reference existing patterns in the codebase, particularly the enhanced modal system and form components that follow these established standards.