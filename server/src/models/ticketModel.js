const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db = new sqlite3.Database(path.join(__dirname, "..", "..", "db", "database.db"));

const dateString = new Date().toISOString().slice(0, 10).replace(/-/g, "_");

const createTable = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS tickets_${dateString} (
    id INTEGER PRIMARY KEY,
    ticket_number INTEGER,
    price REAL,
    ticket_type TEXT,
    timestamp TEXT,
    printed INTEGER,
    cancelled INTEGER
  )`,
    (err) => {
      if (err) {
        console.error("DB: Error creating tickets table:", err);
      } else {
        console.log(`DB: table_${dateString} created or already exists.`);
      }
    }
  );
};

const addTicket = (ticket, callback) => {
  const timestamp = new Date().toISOString();
  const query = `
    INSERT INTO tickets_${dateString} (ticket_number, price, ticket_type, timestamp, printed, cancelled)
    VALUES (?, ?, ?, ?, ?, 0)
  `;

  db.run(query, [ticket.ticketNumber, ticket.price, ticket.ticketType, timestamp, ticket.printed], function (err) {
    callback(err, { ...ticket, id: this.lastID, timestamp });
  });
};

const fetchTicketByNumber = (ticketNumber, callback) => {
  const query = `SELECT * FROM tickets_${dateString} WHERE ticket_number = ?`;

  db.get(query, [ticketNumber], (err, row) => {
    callback(err, row);
  });
};

const fetchTicketStatistics = (callback) => {
  const query = `
    SELECT ticket_type, COUNT(*) AS amount_sold, SUM(price) AS total_cost
    FROM tickets_${dateString}
    WHERE cancelled = 0
    GROUP BY ticket_type;
  `;

  db.all(query, (err, rows) => {
    callback(err, rows);
  });
};

const fetchTicketById = (ticketId, callback) => {
  const query = `SELECT * FROM tickets_${dateString} WHERE id = ?`;

  db.get(query, [ticketId], (err, row) => {
    callback(err, row);
  });
};

const cancelTicketById = (ticketId, callback) => {
  const updateQuery = `UPDATE tickets_${dateString} SET cancelled = 1 WHERE id = ?`;

  db.run(updateQuery, [ticketId], function (err) {
    callback(err, this.changes); // this.changes is the number of rows affected by the UPDATE query
  });
};

module.exports = {
  createTable,
  addTicket,
  fetchTicketStatistics,
  fetchTicketById,
  fetchTicketByNumber,
  cancelTicketById,
};
