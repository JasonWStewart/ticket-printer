# Ticket Printer Application Overview

## Project Structure

The Ticket Printer application is divided into two main parts: the **server** and the **client**. The server handles backend operations such as ticket printing, database management, and API endpoints, while the client provides a user interface for interacting with the system.

### Server

#### Overview

The server is built using **Node.js** and **Express.js**. It provides RESTful APIs for ticket management, printing, and database operations. The server also interacts with a SQLite database to store ticket information.

#### Key Components

1. **`app.js`**

   - Entry point of the server.
   - Sets up middleware like `body-parser`, `cors`, and `morgan` for logging.
   - Initializes the database table using `ticketModel.createTable()`.
   - Defines API routes using `ticketRoutes`.
   - Starts the server on the configured port.

2. **Routes (`routes/ticketRoutes.js`)**

   - Defines API endpoints for ticket operations such as printing, statistics retrieval, and database management.
   - Routes are linked to corresponding controller functions in `ticketController.js`.

3. **Controllers (`controllers/ticketController.js`)**

   - Contains the business logic for handling API requests.
   - Functions include:
     - `printTicket`: Prints a single ticket and saves it to the database.
     - `printQueue`: Prints multiple tickets from a queue.
     - `printSummary`: Generates and prints ticket sales statistics.
     - `cancelTicketById`: Cancels a specific ticket.
     - `resetDatabase`: Resets the database by dropping and recreating tables.
     - `serialiseDatabase`: Serializes the database into a JSON format.

4. **Models (`models/ticketModel.js`)**

   - Handles database operations using SQLite.
   - Functions include:
     - `addTicket`: Adds a new ticket to the database.
     - `fetchTicketById`: Retrieves a ticket by its ID.
     - `fetchTicketStatistics`: Retrieves ticket sales statistics.
     - `cancelTicketById`: Marks a ticket as canceled in the database.
     - `resetDatabase`: Drops all tables and recreates the current day's table.

5. **Utilities (`utils/`)**

   - **`printerUtils.js`**: Provides functions to interact with the printer using the `@node-escpos` library. Includes methods for printing tickets, summaries, and food vouchers.
   - **`prints/`**: Contains specific templates for different types of prints (e.g., `entryTicket.js`, `foodVoucher.js`).

6. **Middleware (`middleware/apiKeyAuth.js`)**

   - Authenticates API requests using an API key.

7. **Configuration (`config.js`)**
   - Stores configuration settings such as API port, prefix, and printerless mode.

### Client

#### Overview

The client is a **React** application built with **Vite**. It provides a graphical interface for users to manage tickets, view statistics, and perform administrative tasks.

#### Key Components

1. **`App.jsx`**

   - The main component that orchestrates the application.
   - Manages state for ticket sets, queues, and admin mode.
   - Defines handlers for printing, canceling, and database operations.

2. **Components (`components/`)**

   - **`MainScreen.jsx`**: The main layout container for the application.
   - **`Button.jsx`**: A reusable button component with customizable styles and actions.
   - **`ProductButton.jsx`**: Specialized button for ticket types, displaying price and color.
   - **`TicketCart.jsx`**: Displays the current ticket queue and allows ticket removal.
   - **`StatsContainer.jsx`**: Displays ticket sales statistics.
   - **`AdminScreen.jsx`**: Provides administrative controls like database reset and ticket set switching.

3. **Contexts (`contexts/QueueContext.jsx`)**

   - Provides a context for managing the ticket queue across components.

4. **Services (`services/api.js`)**

   - Contains functions for making API calls to the server.
   - Includes methods like `printTicket`, `printQueue`, `getTicketStats`, and `resetDatabase`.

5. **Configuration (`config.json`)**

   - Defines default and alternate ticket sets with properties like price, color, and type.

6. **Styling**
   - CSS modules are used for component-specific styles (e.g., `Button.module.css`, `TicketCart.module.css`).

### Database

- The database is a SQLite file located in `server/db/database.db`.
- Tables are dynamically created based on the current date (e.g., `tickets_2025_05_08`).
- Stores ticket information such as ticket number, price, type, and status (printed/canceled).

### Printing

- Printing is handled using the `@node-escpos` library.
- Templates in `utils/prints/` define the layout and content for different print types.
- The `printerUtils.js` file provides functions to execute these templates with the printer.

### Detailed Ticket Printing Process

The actual printing of a ticket involves several steps, primarily handled by the server-side utilities and the printer library. Below is a detailed explanation of how a ticket is printed:

#### 1. Ticket Data Preparation

- When the `printTicket` function in **printerUtils.js** is called, it receives the ticket data as input.
- The ticket data includes details such as:
  - Ticket type (e.g., entry, food voucher).
  - Price.
  - Unique ticket number.
  - Additional metadata (e.g., date, time).

#### 2. Template Selection

- Based on the ticket type, the appropriate template is selected from the `utils/prints/` directory.
- For example:
  - Entry tickets use the `entryTicket.js` template.
  - Food vouchers use the `foodVoucher.js` template.
  - Summaries use the `ticketSummary.js` template.
- Each template defines the layout and content of the ticket, including text, images, and formatting.

#### 3. Printer Initialization

- The `@node-escpos` library is used to interact with the printer.
- The printer is initialized with the following steps:
  - A connection is established using the printer's interface (e.g., USB, network).
  - The printer's capabilities (e.g., text alignment, image printing) are configured.

#### 4. Ticket Rendering

- The selected template is executed to render the ticket content.
- This involves:
  - Formatting text (e.g., bold, alignment, font size).
  - Adding images (e.g., logos, headers) using the `escpos.Image` class.
  - Including dynamic data such as ticket numbers and prices.

#### 5. Sending Data to the Printer

- The rendered ticket content is sent to the printer using the `printer.print()` method.
- The `printer.cut()` method is called to cut the ticket after printing.
- If multiple tickets are being printed, the process is repeated for each ticket in the queue.

#### 6. Error Handling

- The `printTicket` function includes error handling to manage issues such as:
  - Printer disconnection.
  - Paper jams or low paper.
  - Invalid ticket data.
- Errors are logged, and a response is sent back to the client to notify the user.

#### 7. Post-Printing Actions

- After successful printing, the ticket's status is updated in the database to "printed".
- A confirmation is sent to the client, allowing the UI to update accordingly.

### Example Code Snippet (Simplified)

```javascript
const escpos = require("escpos");
const path = require("path");

function printTicket(ticketData) {
  const device = new escpos.USB();
  const printer = new escpos.Printer(device);

  device.open((error) => {
    if (error) {
      console.error("Printer connection error:", error);
      return;
    }

    // Load ticket template
    const ticketTemplate = require(`./prints/${ticketData.type}Ticket`);
    const content = ticketTemplate(ticketData);

    // Print ticket
    printer
      .align("ct")
      .text(content.text)
      .image(path.join(__dirname, "images", "header.png"), (err) => {
        if (err) console.error("Image print error:", err);
        printer.cut().close();
      });
  });
}
```

This process ensures that tickets are printed accurately and efficiently, with robust error handling to manage potential issues.

## Workflow

1. **Ticket Management**

   - Users select tickets via the client interface.
   - Tickets are added to a queue and printed in bulk or individually.
   - Printed tickets are saved in the database.

2. **Statistics and Summaries**

   - Sales statistics are fetched from the database and displayed in the client.
   - Summaries can be printed directly from the client.

3. **Administrative Tasks**
   - Admins can reset the database, switch ticket sets, or serialize the database.
   - These actions are accessible via the admin menu in the client.

## Ticket Generation and Printing Workflow

The process of generating and printing tickets in the Ticket Printer application involves several steps, spanning both the client and server components. Below is a detailed breakdown of the workflow:

### 1. User Interaction (Client Side)

#### Ticket Selection

- Users interact with the **MainScreen** component in the client interface.
- Ticket types are displayed as buttons using the **ProductButton** component.
- Each button represents a ticket type, showing its price and color.
- When a user clicks a button, the ticket is added to the queue managed by the **QueueContext**.

#### Ticket Queue Management

- The **TicketCart** component displays the current queue of tickets.
- Users can remove tickets from the queue if needed.
- The queue is stored in the application's state, shared across components via the **QueueContext**.

#### Printing Tickets

- Users initiate the printing process by clicking a "Print" button in the **MainScreen**.
- The **App.jsx** component handles the print action by calling the `printQueue` function from the **api.js** service.

### 2. API Request (Client to Server)

#### Print Queue API

- The `printQueue` function in **api.js** sends a POST request to the server's `/printQueue` endpoint.
- The request payload includes the list of tickets in the queue, with details such as type, price, and quantity.

### 3. Server Processing

#### Route Handling

- The `/printQueue` endpoint is defined in **ticketRoutes.js**.
- The request is forwarded to the `printQueue` function in **ticketController.js**.

#### Business Logic

- The `printQueue` function processes the ticket data:
  - Iterates through the list of tickets in the queue.
  - Calls the `addTicket` function in **ticketModel.js** to save each ticket to the database.
  - Calls the `printTicket` function in **printerUtils.js** to send each ticket to the printer.

#### Database Operations

- The **ticketModel.js** file handles database interactions:
  - The `addTicket` function inserts a new record into the database table for the current date (e.g., `tickets_2025_05_08`).
  - Each record includes details such as ticket number, type, price, and status (printed).

#### Printing Operations

- The **printerUtils.js** file interacts with the printer using the `@node-escpos` library:
  - The `printTicket` function formats the ticket data using templates from the `utils/prints/` directory (e.g., `entryTicket.js`).
  - The formatted ticket is sent to the printer for physical printing.

### 4. Post-Printing Actions

#### Client Updates

- Once the server confirms successful printing, the client updates the UI:
  - The ticket queue is cleared.
  - A success message is displayed to the user.

#### Error Handling

- If an error occurs during printing or database operations, the server sends an error response to the client.
- The client displays an error message, and the user can retry the operation.

### Summary

The ticket generation and printing workflow is a seamless process that integrates user interaction, API communication, server-side processing, and database management. The use of reusable components, centralized state management, and modular server architecture ensures a robust and efficient system.

## API Endpoints

- The server exposes RESTful APIs for all operations, documented in the `README.md` file.
- Authentication is enforced using an API key.

## Development and Deployment

- **Development**: Use `npm run watch` for the server and `npm run dev` for the client.
- **Production**: Build the client using `npm run build` and serve it alongside the server.

## Future Improvements

- Add user authentication for enhanced security.
- Implement real-time updates using WebSockets.
- Enhance error handling and logging.
- Optimize database queries for large datasets.
