import "./App.css";
import { printTicket, cancelTicket } from "./services/api";
import { useState } from "react";

function App() {
  const [lastTicket, setLastTicket] = useState(0);

  const printAdultHandler = async () => {
    let { response } = await printTicket({ ticketType: "adult", price: 9 });
    setLastTicket(response.id);
  };
  const printConcessionHandler = async () => {
    let { response } = await printTicket({ ticketType: "concession", price: 6 });
    setLastTicket(response.id);
  };
  const printYouthHandler = async () => {
    let { response } = await printTicket({ ticketType: "youth", price: 1 });
    setLastTicket(response.id);
  };
  const printCompHandler = async () => {
    let { response } = await printTicket({ ticketType: "comp", price: 0 });
    setLastTicket(response.id);
  };

  const cancelHandler = () => {
    cancelTicket(lastTicket);
  };

  return (
    <main>
      <h2>Print Tickets</h2>
      <div className="container">
        <div id="adult" onClick={printAdultHandler}>
          adult
        </div>
        <div id="concession" onClick={printConcessionHandler}>
          conces.
        </div>
        <div id="youth" onClick={printYouthHandler}>
          youth
        </div>
        <div id="comp" onClick={printCompHandler}>
          comp
        </div>
      </div>
      <button onClick={cancelHandler}>Cancel last ticket</button>
    </main>
  );
}

export default App;
