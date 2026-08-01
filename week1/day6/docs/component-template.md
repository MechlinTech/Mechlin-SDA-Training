# React Component Documentation Template

# Component Name

## Overview

Briefly describe the purpose of the component and where it is used within the application.

Example:

> MetricsCard displays a single dashboard KPI such as total users, revenue, or orders.

---

# Location

```text
src/components/ComponentName/
```

---

# Responsibilities

* Render UI
* Receive props
* Display data
* Trigger callbacks (if applicable)

---

# Props

| Prop   | Type            | Required | Default | Description                      |
| ------ | --------------- | -------- | ------- | -------------------------------- |
| title  | string          | Yes      | -       | Title displayed on the component |
| value  | string | number | Yes      | -       | Value shown to the user          |
| icon   | ReactNode       | No       | -       | Optional icon                    |
| growth | number          | No       | 0       | Growth percentage                |

---

# Usage

```jsx
<ComponentName
    title="Total Users"
    value={1250}
    growth={12.5}
/>
```

---

# State

Document any local state used by the component.

Example:

* loading
* selectedItem
* expanded

If no local state exists, write:

This component is stateless.

---

# Dependencies

Example:

* React
* Context API
* Chart.js
* DataContext

---

# Styling

Location

```text
src/components/ComponentName/ComponentName.css
```

Naming Convention

* component-name
* component-name__header
* component-name__body
* component-name--active

---

# Error Handling

Describe how the component behaves when:

* Invalid props
* Missing data
* API errors
* Empty states

---

# Accessibility

Checklist

* Semantic HTML
* Keyboard Navigation
* ARIA Labels
* Color Contrast
* Screen Reader Friendly

---

# Future Improvements

Document ideas for future enhancement.

Example

* Skeleton loading
* Animations
* Dark Mode
* Memoization

---

# Notes

Any additional implementation details or design decisions.
