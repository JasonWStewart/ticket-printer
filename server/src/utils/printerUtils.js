const { Printer } = require("@node-escpos/core");
const USB = require("@node-escpos/usb-adapter");

const { readyStatus } = require("./prints/readyStatus");
const { entryTicket } = require("./prints/entryTicket");
const { cancelledTicket } = require("./prints/cancelledTicket");
const { ticketSummary } = require("./prints/ticketSummary");

const openDevice = (device) => {
  return new Promise((resolve, reject) => {
    device.open((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const createDevice = () => {
  return new Promise((resolve, reject) => {
    try {
      const device = new USB();
      resolve(device);
    } catch (err) {
      reject(err);
    }
  });
};

const executePrint = async (templateFunction) => {
  const device = await createDevice();
  await openDevice(device);
  const options = { encoding: "GB18030" /* default */ };
  const printer = new Printer(device, options);

  templateFunction(printer);
};

const executePrintWithData = async (templateFunction, ticket, callback) => {
  const device = await createDevice();
  await openDevice(device);
  const options = { encoding: "GB18030" /* default */ };
  const printer = new Printer(device, options);

  templateFunction(printer, ticket);

  if (callback) {
    callback(null);
  }
};

const printReadyStatus = () => {
  executePrint(readyStatus);
};

const printCancellation = (ticket, callback) => {
  executePrintWithData(cancelledTicket, ticket, callback);
};

const printSummary = (data, callback) => {
  executePrintWithData(ticketSummary, data, callback);
};

const printEntryTicket = (ticket, callback) => {
  executePrintWithData(entryTicket, ticket, callback);
};

module.exports = {
  printEntryTicket,
  printReadyStatus,
  printCancellation,
  printSummary,
};
