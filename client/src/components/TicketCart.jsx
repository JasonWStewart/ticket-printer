import { useContext } from "react";
import QueueContext from "../contexts/QueueContext";
import Ticket from "./Ticket";
import styles from "./TicketCart.module.css";

const TicketCart = (props) => {
  const { ticketQueue, setTicketQueue } = useContext(QueueContext);

  let totalCost = props.currentQueue.reduce((acc, ticket) => acc + ticket.price, 0);

  const deleteTicketInCartHandler = (index) => {
    setTicketQueue((previousQueue) => {
      return previousQueue.toSpliced(index, 1);
    });
  };

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
