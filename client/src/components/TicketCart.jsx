import React from "react";
import Ticket from "./Ticket";
import styles from "./TicketCart.module.css";

const deleteTicketInCartHandler = (index) => {
  setTicketQueue((previousQueue) => {
    return previousQueue.toSpliced(index, 1);
  });
};

const TicketCart = (props) => {
  console.log(props.currentQueue);
  let totalCost = props.currentQueue.reduce((acc, ticket) => acc + ticket.price, 0);
  return (
    <ul className={styles.ticketCart}>
      {props.currentQueue.map((ticket, index) => (
        <Ticket
          ticketType={ticket.ticketType}
          key={Math.random()}
          deleteHandler={() => {
            deleteTicketInCartHandler(index);
          }}
        />
      ))}
      <div className={styles.totalBox}>
        Total: <span>{`£${totalCost.toFixed(2)}`}</span>
      </div>
    </ul>
  );
};

export default TicketCart;
