const express = require("express");
const ticketController = require("../controllers/ticketController");

const router = express.Router();

// Route to print a ticket
router.post("/tickets/print", ticketController.printTicket);
router.post("/tickets/print/queue", ticketController.printQueue);
router.post("/tickets/print/stats", ticketController.printSummary);
router.post("/tickets/print/food-voucher", ticketController.printFoodVoucher);

// Route to get ticket sales statistics
router.get("/tickets/stats", ticketController.getTicketStatistics);

// Route to get ticket details by ID
router.get("/tickets/:id", ticketController.getTicketById);

router.get("/database", ticketController.serialiseDatabase);

router.delete("/tickets/:id", ticketController.cancelTicketById);
router.delete("/tickets", ticketController.cancelTicketsInBulk);
router.delete("/database", ticketController.resetDatabase);

module.exports = router;
