import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const printTicket = async (ticketData) => {
  try {
    const response = await api.post("tickets/print", ticketData, {
      headers: {
        "x-api-key": "secret",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error printing ticket:", error);
    throw error;
  }
};

export const printSummary = async () => {
  try {
    const response = await api.post(
      "tickets/print/stats",
      {},
      {
        headers: {
          "x-api-key": "secret",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error printing:", error);
    throw error;
  }
};

export const printQueue = async (ticketQueue) => {
  try {
    const response = await api.post("tickets/queue/print", ticketQueue, {
      headers: {
        "x-api-key": "secret",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error printing tickets:", error);
    throw error;
  }
};

export const cancelTicket = async (ticketId) => {
  try {
    const response = await api.delete(`tickets/${ticketId}`, {
      headers: {
        "x-api-key": "secret",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error cancelling ticket:", error);
    throw error;
  }
};

export const getTicketStats = async () => {
  try {
    const response = await api.get(`tickets/stats`, {
      headers: {
        "x-api-key": "secret",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error cancelling ticket:", error);
    throw error;
  }
};

export const cancelTicketsBulk = async (ticketIdArray) => {
  try {
    const response = await api.delete(`tickets`, {
      headers: {
        "x-api-key": "secret",
        "Content-Type": "application/json",
      },
      data: {
        cancelIds: ticketIdArray,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error cancelling tickets:", error);
    throw error;
  }
};
