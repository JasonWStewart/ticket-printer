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

  useEffect(() => {
    async function fetchTicketStats() {
      setLiveTicketCount(await getTicketStats());
    }
    fetchTicketStats();
  }, [lastTickets, adminMode]);

  const addAdultHandler = () => {
    setTicketQueue((previousQueue) => {
      return [...previousQueue, { ticketType: "adult", price: 10 }];
    });
  };
  const addConcessionHandler = () => {
    setTicketQueue((previousQueue) => {
      return [...previousQueue, { ticketType: "concession", price: 7 }];
    });
  };
  const addStudentHandler = () => {
    setTicketQueue((previousQueue) => {
      return [...previousQueue, { ticketType: "u21/student", price: 5 }];
    });
  };
  const addYouthHandler = () => {
    setTicketQueue((previousQueue) => {
      return [...previousQueue, { ticketType: "under 16", price: 1 }];
    });
  };
  const addCompHandler = () => {
    setTicketQueue((previousQueue) => {
      return [...previousQueue, { ticketType: "free entry", price: 0 }];
    });
  };
  const addMemberAdultHandler = () => {
    setTicketQueue((previousQueue) => {
      return [...previousQueue, { ticketType: "Adult (M)", price: 8 }];
    });
  };
  const addMemberConcessionHandler = () => {
    setTicketQueue((previousQueue) => {
      return [...previousQueue, { ticketType: "Concession (M)", price: 6 }];
    });
  };
  const addSeasonTicketHandler = () => {
    setTicketQueue((previousQueue) => {
      return [...previousQueue, { ticketType: "season ticket", price: 0 }];
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
            <ButtonContainer>
              <Button clickHandler={addAdultHandler} displayText="Adult" color="#ff4d6d" />
              <Button clickHandler={addMemberAdultHandler} displayText="Adult (Member)" color="#ff4d6d" />

              <Button clickHandler={addConcessionHandler} displayText="Concession" color="#ee964b" />
              <Button clickHandler={addMemberConcessionHandler} displayText="Concession (Member)" color="#ee964b" />

              <Button clickHandler={addStudentHandler} displayText="Student/U21" color="#62b6cb" />
              <Button clickHandler={addYouthHandler} displayText="Under 16" color="#06d6a0" />

              <Button clickHandler={addSeasonTicketHandler} displayText="Season Ticket" color="#a4c3b2" />
              <Button clickHandler={addCompHandler} displayText="Free Entry" color="#a4c3b2" />
            </ButtonContainer>
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
