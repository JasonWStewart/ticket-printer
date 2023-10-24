## API Documentation

### Print Individual Ticket

- **Route:** `POST /tickets/print`
- **Purpose:** Print an individual ticket.
- **Request Data:**
  - Content-Type: `application/json`
  - Body: JSON object with the following properties:
    - `price` (number): The price of the ticket.
    - `printText` (string): Text to be printed on the ticket.
- **Response:**
  - Status 200 OK: Ticket printed and saved successfully. Response includes the ID of the saved ticket.
  - Status 500 Internal Server Error: Failure to print or save the ticket. The response includes an error message.

### Print Tickets from Queue

- **Route:** `POST /tickets/print/queue`
- **Purpose:** Print tickets from a queue.
- **Request Data:**
  - Content-Type: `application/json`
  - Body: JSON array of ticket objects with the following properties for each ticket:
    - `price` (number): The price of the ticket.
    - `printText` (string): Text to be printed on the ticket.
- **Response:**
  - Status 200 OK: Tickets printed and saved successfully. Response includes an array of ticket IDs.
  - Status 500 Internal Server Error: Failure to print or save tickets. The response includes an error message.

### Generate and Print Ticket Sales Statistics

- **Route:** `POST /tickets/print/stats`
- **Purpose:** Generate and print ticket sales statistics.
- **Request Data:** None.
- **Response:**
  - Status 200 OK: Ticket sales statistics generated and, if not in printerless mode, printed. Response includes the statistics data.
  - Status 500 Internal Server Error: Failure to generate or print statistics. The response includes an error message.

### Print Food Voucher

- **Route:** `POST /tickets/print/food-voucher`
- **Purpose:** Print a food voucher.
- **Request Data:** None.
- **Response:**
  - Status 200 OK: Food voucher printed successfully.
  - Status 500 Internal Server Error: Failure to print the food voucher. The response includes an error message.

### Retrieve Ticket Sales Statistics

- **Route:** `GET /tickets/stats`
- **Purpose:** Retrieve ticket sales statistics.
- **Request Data:** None.
- **Response:**
  - Status 200 OK: Ticket sales statistics retrieved successfully.
  - Status 500 Internal Server Error: Failure to retrieve statistics. The response includes an error message.

### Retrieve Ticket Details by ID

- **Route:** `GET /tickets/:id`
- **Purpose:** Retrieve ticket details by ID.
- **Request Data:**
  - URL Parameter: `id` (ticket ID).
- **Response:**
  - Status 200 OK: Ticket details retrieved successfully.
  - Status 500 Internal Server Error: Failure to retrieve ticket details. The response includes an error message.

### Cancel Single Ticket by ID

- **Route:** `DELETE /tickets/:id`
- **Purpose:** Cancel a single ticket by ID.
- **Request Data:**
  - URL Parameter: `id` (ticket ID).
- **Response:**
  - Status 204 No Content: Ticket canceled successfully.
  - Status 404 Not Found: Ticket not found (if the ticket doesn't exist).
  - Status 500 Internal Server Error: Failure to cancel the ticket. The response includes an error message.

### Cancel Multiple Tickets in Bulk

- **Route:** `DELETE /tickets`
- **Purpose:** Cancel multiple tickets in bulk.
- **Request Data:**
  - Content-Type: `application/json`
  - Body: JSON object with an array of `cancelIds` (ticket IDs) to cancel.
- **Response:**
  - Status 204 No Content: Tickets canceled successfully.
  - Status 404 Not Found: Some tickets not found (if any specified ticket doesn't exist).
  - Status 500 Internal Server Error: Failure to cancel tickets. The response includes an error message.

### Reset the Database

- **Route:** `DELETE /database`
- **Purpose:** Reset the database.
- **Request Data:** None.
- **Response:**
  - Status 200 OK: Database reset and re-initialized successfully.
  - Status 500 Internal Server Error: Failure to reset the database. The response includes an error message.

### Serialize the Database

- **Route:** `GET /database`
- **Purpose:** Serialize the database.
- **Request Data:** None.
- **Response:**
  - Status 200 OK: Database serialized successfully. Response includes the serialized data.
  - Status 500 Internal Server Error: Failure to serialize the database. The response includes an error message.
