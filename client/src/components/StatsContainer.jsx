import React from "react";
import styles from "./StatsContainer.module.css";

const StatsContainer = (props) => {
  let ticketArray = props.ticketCount;
  console.log(ticketArray);

  // Filter out tickets with ticket_type 'programme'
  let filteredTicketArray = ticketArray.filter((ticket) => ticket.ticket_type !== "programme");

  // Calculate the total amount sold excluding 'programme' tickets
  let totalSold = filteredTicketArray.reduce((acc, ticket) => acc + ticket.amount_sold, 0);

  return (
    <div className={styles.statsContainer}>
      <div>
        <p className={styles.statsTitle}>Tickets Sold</p>
        {ticketArray.map((type) => {
          return (
            <p key={type.ticket_type} className={styles.statEntry}>
              {`${type.ticket_type}`}
              <span>{`${type.amount_sold}`}</span>
            </p>
          );
        })}
      </div>
      <p className={styles.totalText}>
        Total<span>{`${totalSold} ticket(s)`}</span>
      </p>
    </div>
  );
};

export default StatsContainer;
