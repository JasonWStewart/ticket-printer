const ticketModel = require("../models/ticketModel");
const printerUtils = require("../utils/printerUtils");

const generateUniqueTicketNumber = async () => {
  let unique = false;
  let randomNumber;

  while (!unique) {
    randomNumber = Math.floor(Math.random() * 1000000); // Generate a random number from 0 to 999999

    // Await the result from the fetchTicketByNumber function
    const result = await new Promise((resolve, reject) => {
      ticketModel.fetchTicketByNumber(randomNumber, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    // If the ticket number doesn't already exist, set unique to true
    if (!result) {
      unique = true;
    }
  }

  return randomNumber;
};

const printQueue = async (req, res) => {
  const ticketResponses = [];
  for (let queuedTicket of req.body) {
    try {
      const newTicketNumber = await generateUniqueTicketNumber();

      const ticket = {
        ticketNumber: newTicketNumber,
        price: queuedTicket.price,
        ticketType: queuedTicket.ticketType,
        printed: 0,
      };

      // Print the ticket using the printerUtils
      await new Promise((resolve, reject) => {
        printerUtils.printEntryTicket(ticket, (err) => {
          if (err) {
            reject(err);
          } else {
            ticket.printed = 1;
            resolve();
          }
        });
      });

      // Save the ticket in the SQLite database
      let ticketResponse = await new Promise((resolve, reject) => {
        ticketModel.addTicket(ticket, (err, id, timestamp) => {
          if (err) {
            reject(err);
          } else {
            resolve(id);
          }
        });
      });
      ticketResponses.push(ticketResponse);
    } catch (err) {
      res.status(500).json({ message: "Failed to print or save the ticket(s)", error: err.message });
    }
  }
  res.status(200).json({ message: "Ticket(s) printed and saved", response: ticketResponses });
};

const printTicket = async (req, res) => {
  try {
    const newTicketNumber = await generateUniqueTicketNumber();

    const ticket = {
      ticketNumber: newTicketNumber,
      price: req.body.price,
      ticketType: req.body.ticketType,
      printed: 0,
    };

    // Print the ticket using the printerUtils
    await new Promise((resolve, reject) => {
      printerUtils.printEntryTicket(ticket, (err) => {
        if (err) {
          reject(err);
        } else {
          ticket.printed = 1;
          resolve();
        }
      });
    });

    // Save the ticket in the SQLite database
    const ticketResponse = await new Promise((resolve, reject) => {
      ticketModel.addTicket(ticket, (err, id, timestamp) => {
        if (err) {
          reject(err);
        } else {
          resolve(id);
        }
      });
    });

    res.status(200).json({ message: "Ticket printed and saved", response: ticketResponse });
  } catch (err) {
    res.status(500).json({ message: "Failed to print or save the ticket", error: err.message });
  }
};

const printSummary = (req, res) => {
  ticketModel.fetchTicketStatistics((err, stats) => {
    if (err) {
      res.status(500).json({ message: "Failed to fetch ticket statistics" });
      return;
    }
    printerUtils.printSummary(stats);
    res.status(200).json(stats);
  });
};

const getTicketStatistics = (req, res) => {
  ticketModel.fetchTicketStatistics((err, stats) => {
    if (err) {
      res.status(500).json({ message: "Failed to fetch ticket statistics" });
      return;
    }
    res.status(200).json(stats);
  });
};

const getTicketById = (req, res) => {
  const ticketId = req.params.id;

  ticketModel.fetchTicketById(ticketId, (err, ticket) => {
    if (err) {
      res.status(500).json({ message: "Failed to fetch ticket" });
      return;
    }
    res.status(200).json(ticket);
  });
};

const cancelTicketById = async (req, res) => {
  const ticketId = req.params.id;
  const targetTicket = await new Promise((resolve, reject) => {
    ticketModel.fetchTicketById(ticketId, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });

  ticketModel.cancelTicketById(ticketId, (err, affectedRows) => {
    if (err) {
      res.status(500).json({ message: "Failed to cancel" });
      return;
    }
    if (affectedRows == 0) {
      res.status(404).json({ message: "Ticket not found." });
      return;
    }

    if (targetTicket.cancelled === 0) {
      printerUtils.printCancellation(targetTicket);
    }

    res.status(204).send();
  });
};

const cancelTicketsInBulk = async (req, res) => {
  const cancelIds = req.body.cancelIds;
  let statusCode = 204;
  for (let id of cancelIds) {
    const targetTicket = await new Promise((resolve, reject) => {
      ticketModel.fetchTicketById(id, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    ticketModel.cancelTicketById(id, (err, affectedRows) => {
      if (err) {
        statusCode = 500;
        return;
      }
      if (affectedRows == 0) {
        statusCode = 404;
        return;
      }

      if (targetTicket.cancelled === 0) {
        printerUtils.printCancellation(targetTicket);
      }
    });
  }
  res.status(statusCode).send();
};

module.exports = {
  printTicket,
  printQueue,
  printSummary,
  getTicketStatistics,
  getTicketById,
  cancelTicketById,
  cancelTicketsInBulk,
};
