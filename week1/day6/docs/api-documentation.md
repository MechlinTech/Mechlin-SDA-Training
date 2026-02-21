# API Documentation

## Base URL

http://localhost:4000

---

## Endpoints

### GET /users

Returns total users and change percentage.

Response:

{
  "total": 1234,
  "change": 5
}

---

### GET /revenue

Response:

{
  "total": 45678,
  "change": 8
}

---

### GET /orders

Response:

{
  "total": 567,
  "change": -2
}

---

## Error Handling

- Retries up to 3 times
- Exponential backoff
- Displays error UI on failure

---

## Real-Time Strategy

Data auto-refreshes every 5 seconds using polling.