# Theme Documentation

## Overview

This document describes the new dark theme layout implemented for the POS system. The theme provides a modern, professional appearance with improved contrast and visual hierarchy.

## Color Palette

### Primary Colors
- **Background**: `#0f172a` (Dark slate)
- **Card Background**: `#1e293b` (Slate 800)
- **Border**: `#334155` (Slate 700)
- **Text**: `#e2e8f0` (Slate 200)
- **Secondary Text**: `#94a3b8` (Slate 400)

### Accent Colors
- **Primary**: Indigo (`#6366f1`, `#818cf8`, `#a5b4fc`)
- **Success**: Emerald (`#10b981`)
- **Warning**: Amber (`#f59e0b`)
- **Danger**: Red (`#ef4444`)

## Layout Changes

### Sidebar
- Changed from light gray to gradient dark background (`from-gray-800 to-gray-900`)
- Added subtle shadow for depth
- Updated active link styling with indigo background and white text
- Improved hover states with smoother transitions
- Added user profile section at the bottom

### Top Navigation
- Darkened from white to `#1e293b` (Slate 800)
- Updated border color to match theme
- Improved button styling with dark variants
- Enhanced dropdown menu with dark background

### Main Content
- Changed background to gradient (`from-gray-800 to-gray-900`)
- Maintained container constraints for content

## Typography

### Headings
- **H1**: 2.5rem, bold
- **H2**: 2rem, semi-bold
- **H3**: 1.5rem, semi-bold

### Body Text
- **Primary**: `#e2e8f0` (Slate 200)
- **Secondary**: `#94a3b8` (Slate 400)

## Components

### Buttons
- Rounded corners (0.5rem)
- Improved hover states with color transitions
- Enhanced focus states with indigo outline

### Cards
- Dark background (`#1e293b`)
- Subtle border (`#334155`)
- Enhanced shadow (`0 10px 15px -3px rgba(0, 0, 0, 0.3)`)
- Improved hover states

### Tables
- Dark headers with slate background
- Subtle row borders
- Hover states for rows

## Tailwind Configuration

Extended the default Tailwind theme with custom colors and styles:

```javascript
theme: {
  extend: {
    colors: {
      'dark-bg': '#0f172a',
      'dark-card': '#1e293b',
      'dark-border': '#334155',
      'dark-text': '#e2e8f0',
      'dark-text-secondary': '#94a3b8',
    },
    boxShadow: {
      'card': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
      'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
    },
    borderRadius: {
      'xl': '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
    }
  },
}
```

## CSS Customizations

Added custom CSS rules for enhanced styling:

- Improved button styles with better hover and focus states
- Enhanced input, textarea, and select styling
- Custom card styles with shadows and borders
- Table styling with dark theme support
- Badge components with various color variants

## Testing

To test the new theme:

1. Navigate to `/theme-test` in the application
2. Verify all components render correctly with the new dark theme
3. Check color contrast and readability
4. Test responsive behavior on different screen sizes

## Benefits

1. **Professional Appearance**: The dark theme provides a more sophisticated look suitable for business applications
2. **Reduced Eye Strain**: Dark backgrounds are easier on the eyes during long work sessions
3. **Improved Contrast**: Better visual hierarchy with carefully chosen color combinations
4. **Modern Design**: Updated styling aligns with current design trends
5. **Consistent Experience**: Unified theme across all application components

## Customization

To customize the theme further:

1. Modify colors in `tailwind.config.js`
2. Update CSS variables in `src/index.css`
3. Adjust component styling in respective component files
4. Test changes across different pages and components