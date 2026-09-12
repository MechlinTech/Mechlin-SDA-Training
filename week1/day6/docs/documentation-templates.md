# Documentation Templates

This document provides reusable templates for documenting React components and API endpoints.

---

# 1. Component Documentation Template

```markdown
# Component Name

## Overview

Brief description of the component's purpose and functionality.

---

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| prop1 | string | Yes | - | Description of prop1 |
| prop2 | number | No | 0 | Description of prop2 |

---

## Usage

```jsx
import { ComponentName } from './ComponentName';

function App() {
  return (
    <ComponentName
      prop1="value"
      prop2={123}
    />
  );
}
```

---

## Examples

### Basic Usage

```jsx
<ComponentName prop1="basic" />
```

### Advanced Usage

```jsx
<ComponentName
  prop1="advanced"
  prop2={456}
  customProp="value"
/>
```

---

## Styling

The component uses CSS classes for styling:

- `.component-name` — Main container
- `.component-name__element` — Child elements
- `.component-name--modifier` — Modifier classes

---

## Accessibility

The component should provide:

- Keyboard navigation support
- Screen reader compatibility
- Appropriate ARIA attributes
- Proper focus management

---

## Testing

```javascript
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

test('renders component', () => {
  render(<ComponentName prop1="test" />);

  expect(screen.getByText('test')).toBeInTheDocument();
});
```

---

## Status

- Development Status: In Development
- Documentation Status: Complete
- Testing Status: Pending / Complete
```

---

# 2. API Endpoint Documentation Template

```markdown
# Endpoint Name

## Overview

Brief description of the endpoint's purpose.

---

## Endpoint

```http
GET /api/endpoint
```

---

## Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| param1 | string | Yes | Description of param1 |
| param2 | number | No | Description of param2 |

---

## Authentication

Describe whether authentication is required.

```http
Authorization: Bearer <jwt_token>
```

---

## Request Example

```bash
curl -X GET "https://api.example.com/endpoint?param1=value&param2=123" \
  -H "Authorization: Bearer token"
```

---

## Response

### Success Response

```json
{
  "success": true,
  "data": {
    "field1": "value1",
    "field2": "value2"
  }
}
```

---

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

---

## Status Codes

| Status Code | Meaning |
|---|---|
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Notes

Add additional information, limitations, or implementation notes here.
```

---

# 3. API Endpoint Example

The following example demonstrates how the API endpoint template can be used.

```markdown
# Get Revenue

## Overview

Retrieves revenue data for a specified date range.

---

## Endpoint

```http
GET /revenue
```

---

## Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| startDate | string | Yes | Start date in ISO format |
| endDate | string | Yes | End date in ISO format |
| granularity | string | No | daily, weekly, or monthly |

---

## Authentication

```http
Authorization: Bearer <jwt_token>
```

---

## Request Example

```bash
curl -X GET "https://api.dashboard.com/v1/revenue?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer <jwt_token>"
```

---

## Success Response

```json
{
  "success": true,
  "data": {
    "total": 45678.90,
    "change": 12.5,
    "trend": "up"
  }
}
```

---

## Status Codes

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error
```

---

# 4. Documentation Checklist

## Component Documentation

- [ ] Component overview is provided.
- [ ] Props are documented.
- [ ] Usage example is included.
- [ ] Basic usage is explained.
- [ ] Advanced usage is explained.
- [ ] Styling information is provided.
- [ ] Accessibility requirements are documented.
- [ ] Testing example is included.
- [ ] Component status is mentioned.

## API Documentation

- [ ] Endpoint name is provided.
- [ ] Endpoint URL is documented.
- [ ] HTTP method is specified.
- [ ] Parameters are documented.
- [ ] Authentication requirements are specified.
- [ ] Request example is included.
- [ ] Success response is documented.
- [ ] Error response is documented.
- [ ] HTTP status codes are listed.
- [ ] Additional notes are included where necessary.

---

# 5. Documentation Guidelines

When using these templates:

1. Use clear and concise language.
2. Keep headings consistent.
3. Use Markdown formatting consistently.
4. Use syntax highlighting for code examples.
5. Provide realistic examples.
6. Keep documentation synchronized with code changes.
7. Include accessibility requirements for UI components.
8. Document all required API parameters.
9. Include both successful and error responses.
10. Review documentation before publishing.

---

# Conclusion

These templates provide a standardized structure for documenting application components and API endpoints.

Using reusable templates improves consistency, readability, maintainability, and collaboration across the development team.