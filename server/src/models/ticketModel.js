const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db = new sqlite3.Database(path.join(__dirname, "..", "..", "db", "database.db"));

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, "_");
}

const dateString = getTodayDateString();

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

  db.run(query, [ticket.ticketNumber, ticket.price, ticket.printText, timestamp, ticket.printed], function (err) {
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

const resetDatabase = () => {
  // Get today's date in the format YYYY_MM_DD
  const todayDate = dateString;

  // Generate a list of all tables in the database
  db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) {
      console.error("DB: Error fetching table names:", err);
    } else {
      // Drop all existing tables in the database
      tables.forEach((table) => {
        const tableName = table.name;
        if (tableName.startsWith("tickets_")) {
          db.run(`DROP TABLE IF EXISTS ${tableName}`, (err) => {
            if (err) {
              console.error(`DB: Error dropping table ${tableName}:`, err);
            } else {
              console.log(`DB: Table ${tableName} dropped.`);
            }
          });
        }
      });

      // Create a new table for today's date
      createTable(todayDate);
    }
  });
};

// const serialiseDatabase = (callback) => {
//   db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
//     if (err) {
//       console.error("DB: Error fetching table names:", err);
//     } else {
//       let dataArray = [];

//       tables.forEach((table) => {
//         const tableName = table.name;
//         if (tableName.startsWith("tickets_")) {
//           db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
//             if (err) {
//               console.error(err.message);
//               return;
//             }
//             dataArray.push({ tableName: tableName, rows: JSON.stringify(rows) });
//           });
//         }
//       });
//       console.log(dataArray);
//     }
//   });
// };

const serialiseDatabase = (callback) => {
  db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) {
      console.error("DB: Error fetching table names:", err);
      callback(err, null); // Call the callback with an error
    } else {
      let dataArray = [];
      let pendingQueries = tables.length; // To track the number of pending queries

      tables.forEach((table) => {
        const tableName = table.name;
        if (tableName.startsWith("tickets_")) {
          db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
            if (err) {
              console.error(err.message);
            } else {
              dataArray.push({ tableName: tableName, rows: JSON.stringify(rows) });
            }

            pendingQueries--;

            if (pendingQueries === 0) {
              // All queries have completed, call the callback with the data
              callback(null, dataArray);
            }
          });
        } else {
          pendingQueries--; // Decrement for non-relevant tables
        }
      });
    }
  });
};

module.exports = {
  createTable,
  addTicket,
  fetchTicketStatistics,
  fetchTicketById,
  fetchTicketByNumber,
  cancelTicketById,
  resetDatabase,
  serialiseDatabase,
};
