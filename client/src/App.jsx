import "./App.css";
import { printSummary, printQueue, cancelTicketsBulk, getTicketStats, resetDatabase, getSerialDatabase } from "./services/api";
import { useState, useEffect } from "react";
import QueueContext from "./contexts/QueueContext";
import Button from "./components/Button";
import MainScreen from "./components/MainScreen";
import ButtonContainer from "./components/ButtonContainer";
import TicketCart from "./components/TicketCart";
import StatsContainer from "./components/StatsContainer";
import AdminScreen from "./components/AdminScreen";

function App() {
  const [lastTickets, setLastTickets] = useState([]);
  const [adminMode, setAdminMode] = useState(false);
  const [ticketQueue, setTicketQueue] = useState([]);
  const [liveTicketCount, setLiveTicketCount] = useState([]);

  const ticketTypes = [
    { ticketType: "Adult", price: 10, color: "#ff4d6d" },
    { ticketType: "Adult (M)", price: 8, color: "#ff4d6d" },
    { ticketType: "Concession", price: 7, color: "#ee964b" },
    { ticketType: "Concession (M)", price: 6, color: "#ee964b" },
    { ticketType: "Under 16", price: 1, color: "#06d6a0" },
    { ticketType: "Free Entry", price: 0, color: "#06d6a0" },
    { ticketType: "U21/Student", price: 5, color: "#62b6cb" },
    { ticketType: "Season Ticket", price: 0, color: "#a4c3b2" },
  ];

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
    return ticketTypes.map((ticket, index) => (
      <Button key={index} clickHandler={() => addTicketToQueue(ticket)} displayText={ticket.ticketType} color={ticket.color} />
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

  const printSummaryHandler = () => {
    printSummary();
  };

  const adminOnHandler = () => {
    setAdminMode(true);
  };

  const adminOffHandler = () => {
    setAdminMode(false);
  };

  const wipeDatabaseHandler = () => {
    resetDatabase();
  };

  const serialiseHandler = async () => {
    const DBJSON = await getSerialDatabase();
    const jsonString = JSON.stringify(DBJSON);

    // Create a Blob object containing the JSON data
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a download link
    const a = document.createElement("a");
    a.href = url;
    a.download = "database.json"; // You can set the desired filename here

    // Trigger a click event on the download link to start the download
    a.click();

    // Clean up by revoking the URL object
    URL.revokeObjectURL(url);
  };

  return (
    <main>
      <QueueContext.Provider value={{ ticketQueue, setTicketQueue }}>
        <MainScreen>
          {adminMode && (
            <AdminScreen adminOffHandler={adminOffHandler} wipeDatabaseHandler={wipeDatabaseHandler} serialiseHandler={serialiseHandler} />
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
              <Button clickHandler={printSummaryHandler} displayText="Summary" color="#7777ef" />
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
