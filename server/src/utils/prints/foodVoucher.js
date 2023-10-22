function padStringsCenter(string1, string2, maxWidth = 42) {
  const l1 = string1.length;
  const l2 = string2.length;
  const remainingSpace = maxWidth - (l1 + l2);
  return `${string1}${" ".repeat(remainingSpace)}${string2}`;
}

function foodVoucher(printer, image) {
  const dateStrings = new Date().toLocaleString().split(",");
  printer.font("a").align("ct").style("normal").encode("cp437").setCharacterCodeTable(0);
  printer.raster(image);
  printer.size(1, 1).text("────────────────────────────────────────").feed(1);
  printer.size(2, 1).text("FOOD VOUCHER").feed(1);
  printer.size(1, 1).text("──────────────────────────────────────────");
  printer.font("b").text(padStringsCenter(`${dateStrings[0]}`, `${dateStrings[1]}`, 54));
  printer.feed(2);

  printer.feed(2);
  printer.cut().close();
}

module.exports = {
  foodVoucher,
};
