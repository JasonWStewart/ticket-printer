import "./App.css";
import config from "../config.json";
import {
  printSummary,
  printQueue,
  cancelTicketsBulk,
  getTicketStats,
  resetDatabase,
  getSerialDatabase,
  printFoodVoucher,
} from "./services/api";
import { useState, useEffect } from "react";
import QueueContext from "./contexts/QueueContext";
import Button from "./components/Button";
import MainScreen from "./components/MainScreen";
import ButtonContainer from "./components/ButtonContainer";
import TicketCart from "./components/TicketCart";
import StatsContainer from "./components/StatsContainer";
import AdminScreen from "./components/AdminScreen";
import ProductButton from "./components/ProductButton";

function App() {
  const [ticketSet, setTicketSet] = useState(config.defaultItems);
  const [lastTickets, setLastTickets] = useState([]);
  const [adminMode, setAdminMode] = useState(false);
  const [ticketQueue, setTicketQueue] = useState([]);
  const [liveTicketCount, setLiveTicketCount] = useState([]);

  useEffect(() => {
    async function fetchTicketStats() {
      setLiveTicketCount(await getTicketStats());
    }
    fetchTicketStats();
  }, [lastTickets, adminMode]);

  // Function to add a ticket to the queue
  const addTicketToQueue = (ticket) => {
    setTicketQueue((previousQueue) => {
      return [...previousQueue, ticket];
    });
  };

  const generateTicketButtons = () => {
    return ticketSet.map((ticket, index) => (
      <ProductButton
        key={index}
        clickHandler={() => addTicketToQueue(ticket)}
        displayText={ticket.displayText}
        color={ticket.buttonColor}
        price={ticket.price}
      />
    ));
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

  const adminOnHandler = () => {
    setAdminMode(true);
  };

  const adminOffHandler = () => {
    setAdminMode(false);
  };

  const wipeDatabaseHandler = () => {
    resetDatabase();
    setAdminMode(false);
  };

  const changeTicketSetHandler = () => {
    if (ticketSet === config.defaultItems) {
      setTicketSet(config.alternateItems);
    } else {
      setTicketSet(config.defaultItems);
    }
    setAdminMode(false);
  };

  const serialiseHandler = async () => {
    const DBJSON = await getSerialDatabase();
    const jsonString = JSON.stringify(DBJSON);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "database.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main>
      <QueueContext.Provider value={{ ticketQueue, setTicketQueue }}>
        <MainScreen>
          {adminMode && (
            <AdminScreen
              adminOffHandler={adminOffHandler}
              wipeDatabaseHandler={wipeDatabaseHandler}
              serialiseHandler={serialiseHandler}
              changeTicketSetHandler={changeTicketSetHandler}
              foodHandler={() => {
                printFoodVoucher();
              }}
            />
          )}
          <div className="leftSideSplit">
            <ButtonContainer>{generateTicketButtons()}</ButtonContainer>
            <ButtonContainer>
              <Button clickHandler={printQueueHandler} displayText="Print" color="#50A528" wide={true} />
            </ButtonContainer>
          </div>
          <div className="rightSideSplit">
            <TicketCart currentQueue={ticketQueue}></TicketCart>

            <ButtonContainer>
              <Button
                clickHandler={() => {
                  printSummary();
                }}
                displayText="Summary"
                color="#7777ef"
              />
              <Button clickHandler={cancelHandler} displayText="Revoke last sale" color="#ef7777" />
            </ButtonContainer>
          </div>
          <div className="statSplit">
            <StatsContainer ticketCount={liveTicketCount}></StatsContainer>
            <Button clickHandler={adminOnHandler} displayText="ADMIN MENU" color="#333333" wide={true} />
          </div>
        </MainScreen>
      </QueueContext.Provider>
    </main>
  );
}

export default App;
