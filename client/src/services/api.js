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
    console.error("Error printing ticket:", error);
    throw error;
  }
};
