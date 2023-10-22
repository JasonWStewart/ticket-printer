const { Printer, Image } = require("@node-escpos/core");
const USB = require("@node-escpos/usb-adapter");
const path = require("path");

const { readyStatus } = require("./prints/readyStatus");
const { entryTicket } = require("./prints/entryTicket");
const { cancelledTicket } = require("./prints/cancelledTicket");
const { ticketSummary } = require("./prints/ticketSummary");
const { foodVoucher } = require("./prints/foodVoucher");

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

const executePrintWithImage = async (templateFunction, imagePath = "https://cdn-icons-png.flaticon.com/256/1857/1857870.png") => {
  const device = await createDevice();
  await openDevice(device);
  const options = { encoding: "GB18030" /* default */ };
  const printer = new Printer(device, options);
  const image = await Image.load(imagePath);

  templateFunction(printer, image);
};

const executePrintWithData = async (templateFunction, ticket, callback) => {
  const device = await createDevice();
  await openDevice(device);
  const options = { encoding: "GB18030" /* default */ };
  const printer = new Printer(device, options);
  const headerImage = await Image.load(path.join(__dirname, "..", "utils", "images", "header.png"));
  templateFunction(printer, ticket, headerImage);

  if (callback) {
    callback(null);
  }
};

const printReadyStatus = () => {
  executePrint(readyStatus);
};

const printFoodVoucher = (imagePath) => {
  executePrintWithImage(foodVoucher, imagePath);
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
  printFoodVoucher,
};
