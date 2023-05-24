function padStringsCenter(string1, string2, maxWidth = 42) {
  const l1 = string1.length;
  const l2 = string2.length;
  const remainingSpace = maxWidth - (l1 + l2);
  return `${string1}${" ".repeat(remainingSpace)}${string2}`;
}

function readyStatus(printer) {
  const dateStrings = new Date().toLocaleString().split(",");

  printer.font("a").align("ct").style("normal").size(1, 1);
  printer.text("Ticket Printer v0.0.1");
  printer.text("------------------------------------------");
  printer.text(padStringsCenter(dateStrings[0], dateStrings[1]));
  printer.text("------------------------------------------");
  printer.feed(1);
  printer.size(2, 1).text("READY :)");
  printer.feed(5);
  printer.cut().close();
}

module.exports = {
  readyStatus,
};
