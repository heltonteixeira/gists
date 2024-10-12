# Project Specs - Minimalist Prompt Management Web Application

## Overview

This web application is a streamlined tool for managing text-based prompts, adhering to Swiss web design principles. It caters to writers, content creators, and anyone needing quick access to reusable text snippets or templates.

## Key Features

### 1. Prompt Creation and Storage

- Add new prompts with titles and content
- Persistent storage of prompts for future access

### 2. Prompt Organization

- View all saved prompts in an organized, responsive grid layout
- Quick access to prompt content with dynamic card heights

### 3. Detailed Prompt View

- Examine full prompt content in a focused modal interface
- Improved modal design with easy-to-access action menu

### 4. Editing Capabilities

- Modify existing prompts seamlessly through the modal interface

### 5. Prompt Actions

- Copy prompt content for immediate use
- Create variations of existing prompts (Fork functionality)
- Remove unwanted prompts
- Access all actions through a convenient dropdown menu

### 6. Enhanced Readability

- Syntax highlighting for markdown content within prompts (in modal view)
- Simplified card view with full content display

### 7. Responsive Design

- Optimized for various devices and screen sizes
- Adaptive layout for desktop, tablet, and mobile views

### 8. User Experience

- Clean, minimalist interface adhering to Swiss design principles
- Intuitive navigation and prompt management
- Improved modal interaction with fixed close button and action menu

### 9. Toast Notification System

- Provide user feedback through non-intrusive, temporary notifications
- Different types of notifications (info, success, warning, error) with appropriate styling

## Target Users

This tool is ideal for individuals who frequently use text templates or snippets and value an efficient, well-organized system for managing their content. Its simplicity and focus on core functionality make it suitable for both casual users and professionals seeking a straightforward prompt management solution.

## Design Philosophy

The application embraces Swiss design principles, emphasizing:

- Clarity and simplicity in user interface
- Functionality-driven design
- Aesthetic appeal through minimalism

By combining these elements, the tool offers a refined user experience that prioritizes efficient prompt management without unnecessary complexity.

## Layout Specifications for Minimalist Prompt Management App (Swiss Web Style)

The following specifications define the current layout and design of the application:

### Overall

- Asymmetrical layouts: Asymmetrical grid layouts for visual interest, while maintaining balance.
- Geometric shapes: Subtle geometric shapes as design elements, particularly for background accents.
- Strong visual hierarchy: Font size, weight, and color contrast establish a clear hierarchy of information.
- Micro-interactions: Subtle animations on hover for interactive elements (e.g., buttons, prompt cards).

### Header

- Right-aligned navigation: Minimal navigation menu (e.g., "About," "Contact") on the right side of the header.

### Main Content Area

- Asymmetrical grid: Flexible column widths for the prompt form and prompts list.
- Visual separation: Subtle background color changes and shadows delineate sections.

### Prompt Form

- Card-style container: The prompt form is enclosed within a subtle card with a light background and rounded corners.
- Input field styling: Minimal borders for input fields, focusing on clarity and usability.

### Prompts List

- Dynamic grid layout: Prompt cards arranged in a responsive grid layout, allowing for multiple columns on larger screens.
- Card hover effects: Subtle hover effects on prompt cards (background color change, shadow) to indicate interactivity.
- Dynamic card heights: Cards expand based on content length, ensuring consistent layout.

### Modal Design

- Fixed close button: Positioned at the top-left corner of the modal for easy access.
- Action menu: Dropdown menu accessible from a menu button, containing all prompt actions.
- Full content display: Properly formatted content with syntax highlighting for markdown.

### Typography

- Font pairings: Combination of sans-serif fonts for headings and body text, creating subtle contrast and visual interest.
- Uppercase for headings: Section headings use uppercase lettering for emphasis and visual impact.

### Color Palette

- Primary neutral palette with accent color: Mainly neutral colors with a secondary accent color (e.g., #ff6b6b) for specific elements like buttons.
- Sparing use of color: Focus on creating subtle contrast and visual interest without overwhelming the design.

### Responsiveness

- Adaptive grid: The grid system adapts seamlessly to different screen sizes, maintaining a balanced and visually appealing layout.
- Content prioritization: On smaller screens, essential content (prompt title, content) is prioritized, with action menus condensed into dropdowns.

### Code Block Handling

- Card view: Full content display without special formatting for code blocks.
- Modal view: All content displayed as markdown with syntax highlighting using Prism.js.

### Toast Notifications

- Position: Fixed position at the bottom right corner of the screen.
- Design: Minimalist design with color-coding for different notification types.
- Animation: Subtle entrance and exit animations for a smooth user experience.

These specifications incorporate elements of Swiss web design, enhancing the minimalist aesthetic and user experience of the prompt management app. The design prioritizes clarity, readability, and usability throughout the interface.

## Recent Updates and Improvements

1. Accessibility Enhancements:
   - Added ARIA attributes for improved screen reader support
   - Implemented better keyboard navigation
   - Improved focus styles for better visibility

2. Performance Optimization:
   - Refactored JavaScript code for better efficiency
   - Optimized CSS styles and removed unused rules

3. User Experience Improvements:
   - Implemented a toast notification system for user feedback
   - Added keyboard event handling for closing modals and canceling edits

4. Responsive Design Enhancements:
   - Improved media queries for better adaptability across devices
   - Added high contrast mode styles for better accessibility

5. Code Quality:
   - Improved error handling in JavaScript
   - Enhanced code readability and maintainability
   - Ensured consistent naming conventions across files

6. Menu Interaction Improvements:
   - Updated the menu button to lose focus when the menu is closed
   - Implemented the ability to close the menu by clicking outside of it
   - Ensured that hover and focus effects are removed from the menu button when the menu is closed

7. Vue Component Integration:
   - Created a new Vue component `PromptCard.js` for displaying prompt cards
   - Integrated the PromptCard component into the main application
   - Updated the script.js and index.html files to use the new component

8. Toast Notification System:
   - Developed a new Vue component `ToastNotification.js` for displaying toast notifications
   - Integrated the toast notification system into the main application
   - Updated user interactions to provide feedback through toast notifications
   - Styled toast notifications to align with the app's design principles

9. PromptCard Component Update:
   - Resolved issues with PromptCard component rendering
   - Updated PromptCard.js to ensure proper integration with the main application
   - Improved debugging and logging for better troubleshooting

10. Vue.js and Vite Integration:
    - Converted the application to use Vue's Single-File Components (SFCs) for better organization and maintainability
    - Implemented a proper build process using Vite
    - Separated concerns by moving logic into appropriate component methods and computed properties
    - Ensured proper use of props and emits for component communication
    - Implemented Vue best practices and coding standards throughout the application

11. PromptViewModal Update:
    - Removed marked library dependency
    - Updated markdown rendering to display raw markdown content
    - Integrated Prism.js for syntax highlighting of markdown content
    - Ensured proper escaping of user-generated content to prevent XSS attacks
    - Simplified the component by removing unused functions and streamlining the content display process

12. New Prompt Modal Validation:
    - Added validation to the new prompt modal to display a toast when a form with no filled fields is submitted

13. Main Page Layout Update:
    - Updated the main page to display prompt cards in a grid
    - Moved the "Add New Prompt" button to the top of the page for better visibility and accessibility

14. Action Menu Improvement:
    - Fixed the action menu to close when clicking outside of it, improving user experience and preventing unintended actions

15. Edit Prompt Modal Behavior:
    - Updated the edit prompt modal behavior so that when an edit is saved, only the edit modal is closed, and the view returns to the modal that opened it

16. Date Formatting:
    - Implemented a new date formatting utility to display dates in a more user-friendly format (e.g., "2 minutes ago", "2 days ago", or "Dec 25, 2024" for dates older than a week)

These updates have further improved the overall functionality, accessibility, and user experience of the application while maintaining its minimalist design philosophy and adherence to Swiss design principles.

## Next Tasks

1. Implement an import function that uses the `json_sample.json` format. For this basic import, it will use only the id, name, content, created_at, and updated_at fields.

2. Implement an export function that allows users to save their prompts in the same JSON format as the import function.

3. Add a button or menu item to trigger the import and export functions.

4. Implement error handling for the import function to deal with invalid JSON or missing required fields.

5. Add a confirmation dialog before importing to warn users that existing prompts may be overwritten or duplicated.

6. Update the UI to reflect the new import/export functionality, ensuring it fits with the existing design principles.

7. Implement a way to handle duplicate IDs during import (e.g., generate new IDs for imported prompts or update existing prompts).

8. Add a progress indicator for import/export operations, especially for large datasets.

9. Implement data validation for imported prompts to ensure they meet the application's data structure requirements.

10. Update this projectInfo.md file with the changes made, any new decisions or considerations that arose during the development process, and the next steps for the project.

After completing these tasks, the focus will shift to further improving the user interface and user experience of the application, as well as considering additional features that could enhance the prompt management capabilities.
