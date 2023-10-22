function padStringsCenter(string1, string2, maxWidth = 42) {
  const l1 = string1.length;
  const l2 = string2.length;
  const remainingSpace = maxWidth - (l1 + l2);
  return `${string1}${" ".repeat(remainingSpace)}${string2}`;
}

function foodVoucher(printer, ticket) {
  const dateStrings = new Date().toLocaleString().split(",");
  console.log(ticket);
  printer
    .font("a")
    .align("ct")
    .style("normal")
    .encode("cp437")
    .setCharacterCodeTable(0)
    .size(1, 1)
    .text("────────────────────────────────────────");

  printer.size(2, 1).text("Hanworth Villa FC");
  printer.size(1, 1).text("────────────────────────────────────────").feed(1);
  printer.size(2, 1).text("ADMIT ONE").feed(1);
  if (ticket.price < 1) {
    printer.text(ticket.printText.toUpperCase()).feed(1);
  } else {
    printer.text(padStringsCenter(`£${ticket.price}`, ticket.printText.toUpperCase(), 18)).feed(1);
  }

  printer.size(1, 1).text("──────────────────────────────────────────");
  printer.font("b").text(padStringsCenter(`${dateStrings[0]} ${dateStrings[1]}`, `${ticket.ticketNumber.toString().padStart(6, "0")}`, 56));
  printer.feed(2);
  printer.cut().close();
}

module.exports = {
  foodVoucher,
};
