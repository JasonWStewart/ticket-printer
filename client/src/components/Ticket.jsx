import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicket, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import styles from "./Ticket.module.css";

const Ticket = (props) => {
  return (
    <li className={styles.ticketContainer}>
      <span>
        <FontAwesomeIcon icon={faTicket} /> {props.displayText}
      </span>

      <span className={styles.deleteTicket} onClick={props.deleteHandler}>
        <FontAwesomeIcon icon={faTrashCan} />
      </span>
    </li>
  );
};

export default Ticket;
