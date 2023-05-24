const express = require("express");
const ticketController = require("../controllers/ticketController");

const router = express.Router();

// Route to print a ticket
router.post("/tickets/print", ticketController.printTicket);
router.post("/tickets/print/stats", ticketController.printSummary);
// Route to get ticket sales statistics
router.get("/tickets/statistics", ticketController.getTicketStatistics);

// Route to get ticket details by ID
router.get("/tickets/:id", ticketController.getTicketById);

router.delete("/tickets/:id", ticketController.cancelTicketById);

module.exports = router;
