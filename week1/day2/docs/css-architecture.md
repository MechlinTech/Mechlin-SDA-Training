# CSS Architecture

## 1. Methodology

The dashboard uses a simple and organized CSS structure.
Styles are divided into global styles, layout styles, component styles,
responsive styles, and animations.

This makes the CSS easier to understand, maintain, and modify.

## 2. CSS Custom Properties

CSS custom properties are defined inside the `:root` selector.

They are used for:

- Primary color
- Secondary color
- Background color
- Text color
- Border color
- Spacing
- Border radius
- Transitions

Using custom properties makes it easier to change common values throughout
the dashboard.

## 3. Component-Based Structure

The dashboard is divided into reusable UI components:

- Header
- Navigation
- Sidebar
- Dashboard cards
- Footer

Each component has its own styling rules, making the design easier to maintain.

## 4. Responsive Design

The dashboard uses CSS Flexbox and CSS Grid for layout.

A media query is used at 768px to make the dashboard responsive.

On smaller screens:

- Navigation becomes vertically arranged.
- Sidebar takes the full width.
- Dashboard cards are displayed in a single column.
- Content padding is reduced.

## 5. Performance Optimization

The CSS uses simple layouts and lightweight animations.

The design avoids unnecessary dependencies and uses CSS transitions and
keyframe animations for visual effects.