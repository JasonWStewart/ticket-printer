import "./App.css";
import { printSummary, printQueue, cancelTicketsBulk, getTicketStats } from "./services/api";
import { useState, useEffect } from "react";
import Button from "./components/Button";
import MainScreen from "./components/MainScreen";
import ButtonContainer from "./components/ButtonContainer";
import TicketCart from "./components/TicketCart";
import StatsContainer from "./components/StatsContainer";

function App() {
  const [lastTickets, setLastTickets] = useState([]);
  const [ticketQueue, setTicketQueue] = useState([]);
  const [liveTicketCount, setLiveTicketCount] = useState([]);

  useEffect(() => {
    async function fetchTicketStats() {
      setLiveTicketCount(await getTicketStats());
    }
    fetchTicketStats();
    console.log("Updating ticket stats");
  }, [lastTickets]);

  const addAdultHandler = () => {
    setTicketQueue((previousQueue) => {
      return [...previousQueue, { ticketType: "adult", price: 9 }];
    });
  };
  const addConcessionHandler = () => {
    setTicketQueue((previousQueue) => {
      return [...previousQueue, { ticketType: "concession", price: 6 }];
    });
  };
  const addYouthHandler = () => {
    setTicketQueue((previousQueue) => {
      return [...previousQueue, { ticketType: "youth", price: 1 }];
    });
  };
  const addCompHandler = () => {
    setTicketQueue((previousQueue) => {
      return [...previousQueue, { ticketType: "comp", price: 0 }];
    });
  };

  const printQueueHandler = async () => {
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
            <Button clickHandler={addAdultHandler} displayText="Adult" color="#ef476f" />
            <Button clickHandler={addConcessionHandler} displayText="Concession" color="#ffc300" />
            <Button clickHandler={addYouthHandler} displayText="Youth" color="#06d6a0" />
            <Button clickHandler={addCompHandler} displayText="Free Entry" color="#118ab2" />
          </ButtonContainer>
          <ButtonContainer>
            <Button clickHandler={printQueueHandler} displayText="Print" color="#50A528" wide={true} />
          </ButtonContainer>
        </div>
        <div className="rightSideSplit">
          <TicketCart currentQueue={ticketQueue}></TicketCart>

          <ButtonContainer>
            <Button clickHandler={printSummaryHandler} displayText="Summary" color="#7777ef" />
            <Button clickHandler={cancelHandler} displayText="Revoke" color="#ef7777" />
          </ButtonContainer>
        </div>
        <StatsContainer ticketCount={liveTicketCount}></StatsContainer>
      </MainScreen>
    </main>
  );
}

export default App;
