import "./App.css";
import { printSummary, printQueue, cancelTicketsBulk } from "./services/api";
import { useState } from "react";
import Button from "./components/Button";
import MainScreen from "./components/MainScreen";
import ButtonContainer from "./components/ButtonContainer";

function App() {
  const [lastTickets, setLastTickets] = useState([]);
  const [ticketQueue, setTicketQueue] = useState([]);

  const printAdultHandler = () => {
    setTicketQueue((previousQueue) => {
      return [...previousQueue, { ticketType: "adult", price: 9 }];
    });
  };
  const printConcessionHandler = () => {
    setTicketQueue((previousQueue) => {
      return [...previousQueue, { ticketType: "concession", price: 6 }];
    });
  };
  const printYouthHandler = () => {
    setTicketQueue((previousQueue) => {
      return [...previousQueue, { ticketType: "youth", price: 1 }];
    });
  };
  const printCompHandler = () => {
    setTicketQueue((previousQueue) => {
      return [...previousQueue, { ticketType: "comp", price: 0 }];
    });
  };

  const printQueueHandler = async () => {
    console.log(ticketQueue);

    let { response } = await printQueue(ticketQueue);
    let ticketIdArray = [];
    response.forEach((ticket) => {
      ticketIdArray.push(ticket.id);
    });
    setLastTickets(ticketIdArray);
    setTicketQueue([]);
  };

  const cancelHandler = () => {
    cancelTicketsBulk(lastTickets);
    setLastTickets([]);
  };

  const printSummaryHandler = () => {
    printSummary();
  };

  return (
    <main>
      <MainScreen>
        <div className="leftSideSplit">
          <ButtonContainer>
            <Button clickHandler={printAdultHandler} displayText="Adult" color="#ef476f" />
            <Button clickHandler={printConcessionHandler} displayText="Concession" color="#ffc300" />
            <Button clickHandler={printYouthHandler} displayText="Youth" color="#06d6a0" />
            <Button clickHandler={printCompHandler} displayText="Free Entry" color="#118ab2" />
          </ButtonContainer>
          <ButtonContainer>
            <Button clickHandler={printQueueHandler} displayText="Print" color="#45ff62" />
          </ButtonContainer>
        </div>
        <div className="rightSideSplit">
          <ul>
            {ticketQueue.map((ticket) => (
              <li key={Math.random()}>{ticket.ticketType}</li>
            ))}
          </ul>
          <ButtonContainer>
            <Button clickHandler={printSummaryHandler} displayText="Summary" color="#7777ef" />
            <Button clickHandler={cancelHandler} displayText="Cancel" color="#ef7777" />
          </ButtonContainer>
        </div>
      </MainScreen>
    </main>
  );
}

export default App;
