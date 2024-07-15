function padStringsCenter(string1, string2, maxWidth = 42) {
  const l1 = string1.length;
  const l2 = string2.length;
  const remainingSpace = maxWidth - (l1 + l2);
  return `${string1}${" ".repeat(remainingSpace)}${string2}`;
}

function ticketSummary(printer, data) {
  const dateStrings = new Date().toLocaleString().split(",");
  // const totalGate = data.reduce((sum, cat) => sum + cat.amount_sold, 0);
  // const totalSales = data.reduce((sum, cat) => sum + cat.total_cost, 0);

  const totalGate = data.reduce((sum, cat) => {
    if (cat.ticket_type !== "programme") {
      return sum + cat.amount_sold;
    }
    return sum;
  }, 0);

  const totalSales = data.reduce((sum, cat) => {
    if (cat.ticket_type !== "programme") {
      return sum + cat.total_cost;
    }
    return sum;
  }, 0);

  const programmeData = data.find((cat) => cat.ticket_type === "programme");
  const programmesSold = programmeData ? programmeData.amount_sold : 0;
  const programmeSales = programmeData ? programmeData.total_cost : 0;

  printer.font("a").align("ct").style("normal").encode("cp437").setCharacterCodeTable(0).size(1, 1);
  printer.text("Summary of issued tickets");
  printer.text("─────────────────────────────────────────");
  printer.text(padStringsCenter(dateStrings[0], dateStrings[1]));
  printer.text("─────────────────────────────────────────").feed(1);
  data.forEach((category) => {
    if (category.ticket_type !== "programme") {
      printer.text(padStringsCenter(`${category.ticket_type.toUpperCase()}`, `${category.amount_sold} ticket(s)`));
      printer.text(padStringsCenter("  Ticket sales", `£${category.total_cost.toFixed(2)}`)).feed(1);
    }
  });
  printer.text("─────────────────────────────────────────");
  printer
    .size(2, 1)
    .text(padStringsCenter("Total Gate", `${totalGate}`, 18))
    .feed(1);

  printer.text(padStringsCenter("Gate Sales", `£${totalSales}`, 18));

  printer.size(1, 1).text("─────────────────────────────────────────");

  printer
    .size(2, 1)
    .text(padStringsCenter("Programmes", `${programmesSold}`, 18))
    .feed(1);

  printer.text(padStringsCenter("Prog Sale", `£${programmeSales.toFixed(2)}`, 18));

  printer.size(1, 1).text("─────────────────────────────────────────");
  printer.feed(1);
  printer
    .size(2, 1)
    .text(padStringsCenter("All Sale", `£${(totalSales + programmeSales).toFixed(2)}`, 18))
    .feed(1);

  printer.feed(5);
  printer.cut().close();
}

module.exports = {
  ticketSummary,
};
